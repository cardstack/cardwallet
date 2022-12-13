import { uniqBy } from 'lodash';
import { addressAssetsReceived } from './data';
import store from './store';
import { UPDATE_BALANCE_AND_PRICE_FREQUENCY } from '@cardstack/constants';

import { getAccountAssets } from '@cardstack/services/eoa-assets/eoa-assets-services';
import logger from 'logger';

// -- Constants --------------------------------------- //
const FALLBACK_EXPLORER_CLEAR_STATE = 'explorer/FALLBACK_EXPLORER_CLEAR_STATE';
const FALLBACK_EXPLORER_SET_ASSETS = 'explorer/FALLBACK_EXPLORER_SET_ASSETS';
const FALLBACK_EXPLORER_SET_BALANCE_HANDLER =
  'explorer/FALLBACK_EXPLORER_SET_BALANCE_HANDLER';
const FALLBACK_EXPLORER_SET_HANDLERS =
  'explorer/FALLBACK_EXPLORER_SET_HANDLERS';

export const fetchAssetsBalancesAndPrices = async () => {
  logger.log('😬 FallbackExplorer fetchAssetsBalancesAndPrices');

  const { accountAddress, nativeCurrency, network } = store.getState().settings;

  const { assets } = store.getState().fallbackExplorer;

  if (!assets || !assets.length) {
    const fallbackExplorerBalancesHandle = setTimeout(
      fallbackExplorerInit,
      UPDATE_BALANCE_AND_PRICE_FREQUENCY
    );

    store.dispatch({
      payload: {
        fallbackExplorerBalancesHandle,
      },
      type: FALLBACK_EXPLORER_SET_BALANCE_HANDLER,
    });
    return;
  }

  try {
    store.dispatch(
      addressAssetsReceived({
        meta: {
          address: accountAddress,
          currency: nativeCurrency,
          status: 'ok',
          network,
        },
        payload: {
          assets,
        },
      })
    );
    logger.log('😬 FallbackExplorer updating success');
  } catch (e) {
    logger.log('😬 FallbackExplorer updating assets error', e);
  }
};

export const fallbackExplorerInit = () => async (dispatch, getState) => {
  const baseParams = getState().settings;
  const { assets } = getState().fallbackExplorer;

  try {
    const newAssets = await getAccountAssets(baseParams);

    await dispatch({
      payload: {
        assets: uniqBy(
          [...assets, ...newAssets],
          token => [token.address, token.tokenID].filter(Boolean).join('-') // This will be removed soon as it's duplicated with discover tokens
        ),
      },
      type: FALLBACK_EXPLORER_SET_ASSETS,
    });
  } catch (e) {
    logger.sentry('getAccountAssets failed', e);
  }

  return fetchAssetsBalancesAndPrices();
};

export const fallbackExplorerClearState = () => (dispatch, getState) => {
  const {
    fallbackExplorerBalancesHandle,
    fallbackExplorerAssetsHandle,
  } = getState().fallbackExplorer;

  fallbackExplorerBalancesHandle &&
    clearTimeout(fallbackExplorerBalancesHandle);
  fallbackExplorerAssetsHandle && clearTimeout(fallbackExplorerAssetsHandle);
  dispatch({ type: FALLBACK_EXPLORER_CLEAR_STATE });
};

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  fallbackExplorerAssetsHandle: null,
  fallbackExplorerBalancesHandle: null,
  assets: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FALLBACK_EXPLORER_SET_ASSETS:
      // eslint-disable-next-line no-case-declarations
      const { assets } = action.payload;

      return {
        ...state,
        assets: assets || state.assets,
      };
    case FALLBACK_EXPLORER_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    case FALLBACK_EXPLORER_SET_HANDLERS:
      return {
        ...state,
        fallbackExplorerAssetsHandle:
          action.payload.fallbackExplorerAssetsHandle,
        fallbackExplorerBalancesHandle:
          action.payload.fallbackExplorerBalancesHandle,
      };
    case FALLBACK_EXPLORER_SET_BALANCE_HANDLER:
      return {
        ...state,
        fallbackExplorerBalancesHandle:
          action.payload.fallbackExplorerBalancesHandle,
      };
    default:
      return state;
  }
};
