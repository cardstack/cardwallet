import { Contract } from '@ethersproject/contracts';
import { captureException } from '@sentry/react-native';
import { concat, isEmpty, without } from 'lodash';
import { getEtherWeb3Provider } from '../handlers/web3';
import AssetTypes from '../helpers/assetTypes';
import { erc721ABI } from '../references';

/* eslint-disable-next-line import/no-cycle */
import { dataUpdateAssets } from './data';
import {
  getCollectibles,
  saveCollectibles,
} from '@rainbow-me/handlers/localstorage/accountLocal';
import {
  apiFetchCollectiblesForOwner,
  OPENSEA_LIMIT_PER_PAGE,
  OPENSEA_LIMIT_TOTAL,
} from '@rainbow-me/handlers/opensea-api';
import NetworkTypes from '@rainbow-me/networkTypes';
import { assetsWithoutNFTsByFamily, getFamilies } from '@rainbow-me/parsers';

// -- Constants ------------------------------------------------------------- //
const COLLECTIBLES_LOAD_REQUEST = 'collectibles/COLLECTIBLES_LOAD_REQUEST';
const COLLECTIBLES_LOAD_SUCCESS = 'collectibles/COLLECTIBLES_LOAD_SUCCESS';
const COLLECTIBLES_LOAD_FAILURE = 'collectibles/COLLECTIBLES_LOAD_FAILURE';

const COLLECTIBLES_FETCH_REQUEST = 'collectibles/COLLECTIBLES_FETCH_REQUEST';
const COLLECTIBLES_FETCH_SUCCESS = 'collectibles/COLLECTIBLES_FETCH_SUCCESS';
const COLLECTIBLES_FETCH_FAILURE = 'collectibles/COLLECTIBLES_FETCH_FAILURE';

const COLLECTIBLES_CLEAR_STATE = 'collectibles/COLLECTIBLES_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
let scheduledFetchHandle = null;

export const collectiblesLoadState = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  dispatch({ type: COLLECTIBLES_LOAD_REQUEST });
  try {
    const cachedCollectibles = await getCollectibles(accountAddress, network);
    dispatch({
      payload: cachedCollectibles,
      type: COLLECTIBLES_LOAD_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: COLLECTIBLES_LOAD_FAILURE });
  }
};

export const collectiblesResetState = () => dispatch => {
  scheduledFetchHandle && clearTimeout(scheduledFetchHandle);
  dispatch({ type: COLLECTIBLES_CLEAR_STATE });
};

export const collectiblesRefreshState = () => async (dispatch, getState) => {
  const { network } = getState().settings;

  switch (network) {
    case NetworkTypes.mainnet:
    case NetworkTypes.rinkeby:
      // OpenSea API only supports Ethereum mainnet and rinkeby
      dispatch(fetchNFTsViaOpenSea());
      break;
    case NetworkTypes.xdai:
    case NetworkTypes.sokol:
      // This is where we will delegate to logic to find NFTs via RPC node APIs
      dispatch(fetchNFTsViaRpcNode());
      break;
    default:
      console.log(
        `Skipping fetching collectibles because we have no mechanism to do so on ${network}`
      );
  }
};

const fetchNFTsViaOpenSea = () => (dispatch, getState) => {
  dispatch({ type: COLLECTIBLES_FETCH_REQUEST });
  const { accountAddress, network } = getState().settings;
  const { assets } = getState().data;
  const { collectibles: existingNFTs } = getState().collectibles;
  const shouldUpdateInBatches = isEmpty(existingNFTs);

  let shouldStopFetching = false;
  let page = 0;
  let nfts = [];

  const fetchPage = async () => {
    try {
      const newPageResults = await apiFetchCollectiblesForOwner(
        network,
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
        const existingFamilies = getFamilies(existingNFTs);
        const newFamilies = getFamilies(nfts);
        const incomingFamilies = without(newFamilies, ...existingFamilies);
        if (incomingFamilies.length) {
          const assetsWithoutNFTs = assetsWithoutNFTsByFamily(
            assets,
            incomingFamilies
          );
          dispatch(dataUpdateAssets(assetsWithoutNFTs));
        }
        saveCollectibles(nfts, accountAddress, network);
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

const fetchNFTsViaRpcNode = () => async (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  //   grab assets data from redux state
  var { assets } = getState().data;
  //   find the assets that are NFTs
  let collectibles = assets.filter(asset => asset.token_id);

  dispatch({ type: COLLECTIBLES_FETCH_REQUEST });
  // TODO: enhance them with metadata from the tokenURI so that they have a similar shape to what parseCollectiblesFromOpenSeaResponse creates
  // TODO: cache tokenURIJSON
  console.log('collectibles before mapping', JSON.stringify(collectibles));
  try {
    console.log('fetchNFTsViaRpcNode: getEtherWeb3Provider');
    const web3Provider = await getEtherWeb3Provider();
    console.log('fetchNFTsViaRpcNode: starting mapping', collectibles.length);
    collectibles = await Promise.all(
      collectibles.map(async c => {
        console.log('fetchNFTsViaRpcNode: map item', c.address, c.token_id);
        try {
          console.log('fetchNFTsViaRpcNode: creating contract for', c.address);
          let nftContract = new Contract(c.address, erc721ABI, web3Provider);
          console.log('fetchNFTsViaRpcNode: getting tokenURI');
          let tokenURI = await nftContract.tokenURI(c.token_id);
          console.log('fetchNFTsViaRpcNode: fetching', tokenURI);
          let tokenURIRequest = await fetch(tokenURI);
          console.log('fetchNFTsViaRpcNode: parsing', tokenURI);
          let tokenURIJSON = await tokenURIRequest.json();

          console.log('fetchNFTsViaRpcNode tokenURIJSON', tokenURIJSON);
          let augmentedCollectible = {
            id: c.token_id,
            address: c.address,
            symbol: c.symbol,
            name: tokenURIJSON.name || c.name,
            description: tokenURIJSON.description,
            external_link: tokenURIJSON.external_url,
            image_preview_url: tokenURIJSON.image_url,
            image_url: tokenURIJSON.image_url,
            asset_contract: {
              address: c.address,
              symbol: c.symbol,
              name: c.name,
            },
            type: AssetTypes.nft,
          };
          console.log('augmentedCollectible', augmentedCollectible);
          return augmentedCollectible;
        } catch (error) {
          console.log('Error augmenting collectible', error);
          return c;
        }
      })
    );
    console.log('saving collectibles', JSON.stringify(collectibles));
    // save the collectibles to local storage
    saveCollectibles(collectibles, accountAddress, network);
    // save the collectibles to redux state
    dispatch({
      payload: collectibles,
      type: COLLECTIBLES_FETCH_SUCCESS,
    });
  } catch (error) {
    dispatch({
      payload: collectibles,
      type: COLLECTIBLES_FETCH_FAILURE,
    });
    console.error('Error fetching collectibles', error);
  }
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_COLLECTIBLES_STATE = {
  fetchingCollectibles: false,
  loadingCollectibles: false,
  collectibles: [],
};

export default (state = INITIAL_COLLECTIBLES_STATE, action) => {
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
