import assert from 'assert';
import { Contract } from '@ethersproject/contracts';
import { captureException } from '@sentry/react-native';
import { concat, isEmpty, without } from 'lodash';
import { AnyAction } from 'redux';
import { getEtherWeb3Provider } from '../../../src/handlers/web3';
import AssetTypes from '../../../src/helpers/assetTypes';
import { dataUpdateAssets } from '../../../src/redux/data';
import { erc721ABI } from '@rainbow-me/references';

import {
  assetsWithoutNFTsByFamily,
  getNFTFamilies,
} from '@cardstack/parsers/collectibles';
import {
  getCollectibles as getCollectiblesFromStorage,
  saveCollectibles as saveCollectiblesToStorage,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import {
  apiFetchCollectiblesForOwner,
  OPENSEA_LIMIT_PER_PAGE,
  OPENSEA_LIMIT_TOTAL,
} from '@cardstack/services/opensea-api';
import NetworkTypes from '@rainbow-me/networkTypes';
import { AppDispatch, AppGetState } from '@rainbow-me/redux/store';
import { AssetType, CollectibleType } from '@cardstack/types';

// -- Constants ------------------------------------------------------------- //
const COLLECTIBLES_LOAD_REQUEST = 'collectibles/COLLECTIBLES_LOAD_REQUEST';
const COLLECTIBLES_LOAD_SUCCESS = 'collectibles/COLLECTIBLES_LOAD_SUCCESS';
const COLLECTIBLES_LOAD_FAILURE = 'collectibles/COLLECTIBLES_LOAD_FAILURE';

const COLLECTIBLES_FETCH_REQUEST = 'collectibles/COLLECTIBLES_FETCH_REQUEST';
const COLLECTIBLES_FETCH_SUCCESS = 'collectibles/COLLECTIBLES_FETCH_SUCCESS';
const COLLECTIBLES_FETCH_FAILURE = 'collectibles/COLLECTIBLES_FETCH_FAILURE';

const COLLECTIBLES_CLEAR_STATE = 'collectibles/COLLECTIBLES_CLEAR_STATE';

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
    case NetworkTypes.mainnet:
      // OpenSea API only supports Ethereum mainnet
      return dispatch(fetchNFTsViaOpenSea());
    case NetworkTypes.xdai:
    case NetworkTypes.sokol:
      return dispatch(fetchNFTsViaRpcNode());
    default:
      console.log(
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
  const { assets } = getState().data;
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

        const existingFamilies = getNFTFamilies(existingNFTs);
        const newFamilies = getNFTFamilies(nfts);
        const incomingFamilies = without(newFamilies, ...existingFamilies);

        if (incomingFamilies.length) {
          const assetsWithoutNFTs = assetsWithoutNFTsByFamily(
            assets,
            incomingFamilies
          );

          dispatch(dataUpdateAssets(assetsWithoutNFTs));
        }

        saveCollectiblesToStorage(nfts, accountAddress, network);
      } else {
        scheduledFetchHandle = setTimeout(fetchPage, 200);
      }
    } catch (error) {
      dispatch({ type: COLLECTIBLES_FETCH_FAILURE });
      captureException(error);
    }
  };

  fetchPage();
};

const fetchNFTsViaRpcNode = () => async (
  dispatch: AppDispatch,
  getState: AppGetState
) => {
  const { accountAddress, nativeCurrency, network } = getState().settings;
  const assets: AssetType[] = getState().data.assets;

  // find the assets that are NFTs. TODO: consider checking contract interfaces for a more reliable filter.
  const assetsWithTokenIds = assets.filter(asset => asset.token_id);

  const existingNFTs: CollectibleType[] = (getState().collectibles as any)
    .collectibles;

  dispatch({ type: COLLECTIBLES_FETCH_REQUEST });

  // TODO: enhance them with metadata from the tokenURI so that they have a similar shape to what parseCollectiblesFromOpenSeaResponse creates
  try {
    const web3Provider = await getEtherWeb3Provider();

    const collectibles = await Promise.all(
      assetsWithTokenIds.map(async asset => {
        assert(asset.address);
        assert(asset.token_id);

        const existingNFT = existingNFTs.find(
          nft =>
            nft.asset_contract.address === asset.address &&
            nft.id === asset.token_id
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

          const tokenURI = await nftContract.tokenURI(asset.token_id);
          const tokenURIRequest = await fetch(tokenURI);
          const tokenURIJSON = await tokenURIRequest.json();

          const augmentedCollectible: CollectibleType = {
            id: asset.token_id,
            name: tokenURIJSON.name || asset.name,
            description: tokenURIJSON.description,
            external_link: tokenURIJSON.external_url,
            image_preview_url: tokenURIJSON.image_url,
            image_url: tokenURIJSON.image_url,
            image_original_url: tokenURIJSON.image_url,
            image_thumbnail_url: tokenURIJSON.image_url,
            animation_url: null,
            permalink: tokenURIJSON.home_url || tokenURIJSON.external_url,
            traits: [],
            background: null,
            familyImage: null,
            isSendable: false,
            asset_contract: {
              address: asset.address,
              description: tokenURIJSON.description,
              external_link: tokenURIJSON.external_url,
              image_url: tokenURIJSON.image_url,
              name: asset.name,
              nft_version: null,
              schema_name: null,
              symbol: asset.symbol,
              total_supply: null,
            },
            nativeCurrency,
            networkName: network,
            lastPrice: null,
            type: AssetTypes.nft,
            uniqueId: `${asset.address}_${asset.token_id}`,
          };

          return augmentedCollectible;
        } catch (error) {
          console.log('Error augmenting collectible', error);

          return asset;
        }
      })
    );

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
