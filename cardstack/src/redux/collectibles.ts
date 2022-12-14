import assert from 'assert';

import { captureException } from '@sentry/react-native';
import { Contract } from 'ethers';
import { concat, isEmpty } from 'lodash';
import { AnyAction } from 'redux';

import { IPFS_HTTP_URL } from '@cardstack/constants';
import { Asset } from '@cardstack/services/eoa-assets/eoa-assets-types';
import {
  apiFetchCollectiblesForOwner,
  OPENSEA_LIMIT_PER_PAGE,
  OPENSEA_LIMIT_TOTAL,
} from '@cardstack/services/opensea-api';
import { AssetTypes, CollectibleType, NetworkType } from '@cardstack/types';

import {
  getAssets,
  getCollectibles as getCollectiblesFromStorage,
  saveCollectibles as saveCollectiblesToStorage,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import { assetsVersion } from '@rainbow-me/handlers/localstorage/common';
import { AppDispatch, AppGetState } from '@rainbow-me/redux/store';
import { erc721ABI } from '@rainbow-me/references';
import logger from 'logger';

import { getEtherWeb3Provider } from '../../../src/handlers/web3';

// -- Constants ------------------------------------------------------------- //
const COLLECTIBLES_LOAD_REQUEST = 'collectibles/COLLECTIBLES_LOAD_REQUEST';
const COLLECTIBLES_LOAD_SUCCESS = 'collectibles/COLLECTIBLES_LOAD_SUCCESS';
const COLLECTIBLES_LOAD_FAILURE = 'collectibles/COLLECTIBLES_LOAD_FAILURE';

const COLLECTIBLES_FETCH_REQUEST = 'collectibles/COLLECTIBLES_FETCH_REQUEST';
const COLLECTIBLES_FETCH_SUCCESS = 'collectibles/COLLECTIBLES_FETCH_SUCCESS';
const COLLECTIBLES_FETCH_FAILURE = 'collectibles/COLLECTIBLES_FETCH_FAILURE';

const COLLECTIBLES_CLEAR_STATE = 'collectibles/COLLECTIBLES_CLEAR_STATE';

// ERC-165 identifier for interfaces 721 and 1155, stated in their specification.
const nftSchemas = {
  erc721: {
    name: 'ERC721',
    identifier: 0x80ac58cd,
  },
  erc1155: {
    name: 'ERC1155',
    identifier: 0xd9b67a26,
  },
};

// -- Actions --------------------------------------------------------------- //
let scheduledFetchHandle: ReturnType<typeof setTimeout> | undefined;

export const collectiblesLoadState = () => async (
  dispatch: AppDispatch,
  getState: AppGetState
) => {
  const { accountAddress, network } = getState().settings;
  dispatch({ type: COLLECTIBLES_LOAD_REQUEST });

  try {
    const cachedCollectibles = await getCollectiblesFromStorage(
      accountAddress,
      network
    );

    dispatch({
      payload: cachedCollectibles,
      type: COLLECTIBLES_LOAD_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: COLLECTIBLES_LOAD_FAILURE });
  }
};

export const collectiblesResetState = () => (dispatch: AppDispatch) => {
  scheduledFetchHandle && clearTimeout(scheduledFetchHandle);
  dispatch({ type: COLLECTIBLES_CLEAR_STATE });
};

export const collectiblesRefreshState = () => async (
  dispatch: AppDispatch,
  getState: AppGetState
) => {
  const { network } = getState().settings;

  switch (network) {
    case NetworkType.mainnet:
    case NetworkType.polygon:
    case NetworkType.goerli:
      // OpenSea API only supports some networks
      return dispatch(fetchNFTsViaOpenSea());
    case NetworkType.gnosis:
    case NetworkType.sokol:
      return dispatch(fetchNFTsViaRpcNode());
    default:
      logger.log(
        `Skipping fetching collectibles because we have no mechanism to do so on ${network}`
      );
  }
};

const fetchNFTsViaOpenSea = () => (
  dispatch: AppDispatch,
  getState: AppGetState
) => {
  dispatch({ type: COLLECTIBLES_FETCH_REQUEST });
  const { accountAddress, nativeCurrency, network } = getState().settings;
  const { collectibles: existingNFTs } = getState().collectibles;
  const shouldUpdateInBatches = isEmpty(existingNFTs);

  let shouldStopFetching = false;
  let page = 0;
  let nfts: CollectibleType[] = [];

  const fetchPage = async () => {
    try {
      const newPageResults = await apiFetchCollectiblesForOwner(
        network,
        nativeCurrency,
        accountAddress,
        page
      );

      // check that the account address to fetch for has not changed
      const { accountAddress: currentAccountAddress } = getState().settings;
      if (currentAccountAddress !== accountAddress) return;

      nfts = concat(nfts, newPageResults);
      shouldStopFetching =
        newPageResults.length < OPENSEA_LIMIT_PER_PAGE ||
        nfts.length >= OPENSEA_LIMIT_TOTAL;

      page += 1;

      if (shouldUpdateInBatches) {
        dispatch({
          payload: nfts,
          type: COLLECTIBLES_FETCH_SUCCESS,
        });
      }

      if (shouldStopFetching) {
        if (!shouldUpdateInBatches) {
          dispatch({
            payload: nfts,
            type: COLLECTIBLES_FETCH_SUCCESS,
          });
        }

        saveCollectiblesToStorage(nfts, accountAddress, network);
      } else {
        scheduledFetchHandle = setTimeout(fetchPage, 200);
      }
    } catch (error) {
      dispatch({ type: COLLECTIBLES_FETCH_FAILURE });

      logger.sentry('COLLECTIBLES_FETCH_FAILURE');
      captureException(error);
    }
  };

  fetchPage();
};

const fetchNFTsViaRpcNode = () => async (
  dispatch: AppDispatch,
  getState: AppGetState
) => {
  dispatch({ type: COLLECTIBLES_FETCH_REQUEST });

  const { accountAddress, nativeCurrency, network } = getState().settings;

  const { assets } = (await getAssets(
    accountAddress,
    network,
    assetsVersion
  )) as { assets: Asset[] };

  // Find the assets that are NFTs.
  const assetsWithTokenIds = assets.filter(asset => asset.tokenID);

  const existingNFTs: CollectibleType[] = (getState().collectibles as any)
    .collectibles;

  // enhance them with metadata from the tokenURI so that they have a similar shape to what parseCollectiblesFromOpenSeaResponse creates
  try {
    const web3Provider = await getEtherWeb3Provider();

    const collectibles = (
      await Promise.all(
        assetsWithTokenIds.map(async asset => {
          assert(asset.address);
          assert(asset.tokenID);

          const existingNFT = existingNFTs.find(
            nft =>
              nft.asset_contract.address === asset.address &&
              nft.id === asset.tokenID &&
              // We were not considering NFTs to be sendable before so all
              // previously saved tokens need to be updated.
              nft.isInterfaceValidated
          );

          if (existingNFT) {
            return existingNFT;
          }

          try {
            const nftContract = new Contract(
              asset.address,
              erc721ABI,
              web3Provider
            );

            let schema_name = null;

            if (
              await nftContract.supportsInterface?.(
                nftSchemas.erc1155.identifier
              )
            ) {
              schema_name = nftSchemas.erc1155.name;
            } else if (
              await nftContract.supportsInterface?.(
                nftSchemas.erc721.identifier
              )
            ) {
              schema_name = nftSchemas.erc721.name;
            }

            const tokenURI = await nftContract.tokenURI(asset.tokenID);
            const tokenURIJSON = await fetchJsonFromTokenUri(tokenURI);

            const imageURL = tokenURIJSON.image_url || tokenURIJSON.image;

            logger.log(
              `Reloaded NFT ${asset.name} [${asset.tokenID}]`,
              `with interface: ${schema_name}`
            );

            const collectible: CollectibleType = {
              id: asset.tokenID,
              name: tokenURIJSON.name || asset.name,
              description: tokenURIJSON.description,
              external_link: tokenURIJSON.external_url,
              image_preview_url: imageURL,
              image_url: imageURL,
              image_original_url: imageURL,
              image_thumbnail_url: imageURL,
              animation_url: null,
              permalink: tokenURIJSON.home_url || tokenURIJSON.external_url,
              traits: [],
              background: null,
              familyImage: null,
              isSendable: !!schema_name,
              isInterfaceValidated: true,
              asset_contract: {
                address: asset.address,
                description: tokenURIJSON.description,
                external_link: tokenURIJSON.external_url,
                image_url: imageURL,
                name: asset.name,
                nft_version: null,
                schema_name,
                symbol: asset.symbol,
                total_supply: null,
              },
              nativeCurrency,
              networkName: network,
              lastPrice: null,
              type: AssetTypes.nft,
            };

            return collectible;
          } catch (error) {
            logger.sentry('Error creating collectible', error);

            return null;
          }
        })
      )
    ).filter(Boolean);

    saveCollectiblesToStorage(collectibles, accountAddress, network);
    // save the collectibles to redux state
    dispatch({
      payload: collectibles,
      type: COLLECTIBLES_FETCH_SUCCESS,
    });
  } catch (error) {
    dispatch({
      payload: assetsWithTokenIds,
      type: COLLECTIBLES_FETCH_FAILURE,
    });

    console.error('Error fetching collectibles', error);
  }
};

const fetchJsonFromTokenUri = async (tokenURI: string) => {
  let httpFetchableUri = tokenURI;

  // Use a public IPFS HTTP gateway if necessary. In the future, we should consider using ipfs-js to connect directly to IPFS.
  if (httpFetchableUri.startsWith('ipfs://ipfs/')) {
    httpFetchableUri = `${IPFS_HTTP_URL}/${tokenURI.slice(7)}`;
  } else if (httpFetchableUri.startsWith('ipfs://')) {
    httpFetchableUri = `${IPFS_HTTP_URL}/ipfs/${tokenURI.slice(7)}`;
  }

  const tokenURIRequest = await fetch(httpFetchableUri);
  const tokenURIJSON = await tokenURIRequest.json();
  return tokenURIJSON;
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_COLLECTIBLES_STATE = {
  fetchingCollectibles: false,
  loadingCollectibles: false,
  collectibles: [] as CollectibleType[],
};

export default (state = INITIAL_COLLECTIBLES_STATE, action: AnyAction) => {
  switch (action.type) {
    case COLLECTIBLES_LOAD_REQUEST:
      return {
        ...state,
        loadingCollectibles: true,
      };
    case COLLECTIBLES_LOAD_SUCCESS:
      return {
        ...state,
        loadingCollectibles: false,
        collectibles: action.payload,
      };
    case COLLECTIBLES_LOAD_FAILURE:
      return {
        ...state,
        loadingCollectibles: false,
      };
    case COLLECTIBLES_FETCH_REQUEST:
      return {
        ...state,
        fetchingCollectibles: true,
      };
    case COLLECTIBLES_FETCH_SUCCESS:
      return {
        ...state,
        fetchingCollectibles: false,
        collectibles: action.payload,
      };
    case COLLECTIBLES_FETCH_FAILURE:
      return {
        ...state,
        fetchingCollectibles: false,
      };
    case COLLECTIBLES_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_COLLECTIBLES_STATE,
      };
    default:
      return state;
  }
};
