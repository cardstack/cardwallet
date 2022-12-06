import { fromWei, greaterThanOrEqualTo } from '@cardstack/cardpay-sdk';
import { get, isEmpty } from 'lodash';
import { getEstimatedTimeForGasPrice } from '@rainbow-me/handlers/gasPrices';
import { defaultGasPriceFormat, parseTxFees } from '@rainbow-me/parsers';
import { ethUnits } from '@rainbow-me/references';

import { ethereumUtils, gasUtils } from '@rainbow-me/utils';

const { CUSTOM, NORMAL } = gasUtils;

// -- Constants ------------------------------------------------------------- //
const GAS_UPDATE_DEFAULT_GAS_LIMIT = 'gas/GAS_UPDATE_DEFAULT_GAS_LIMIT';
const GAS_PRICES_DEFAULT = 'gas/GAS_PRICES_DEFAULT';
const GAS_PRICES_SUCCESS = 'gas/GAS_PRICES_SUCCESS';
const GAS_PRICES_FAILURE = 'gas/GAS_PRICES_FAILURE';

const GAS_UPDATE_TX_FEE = 'gas/GAS_UPDATE_TX_FEE';
const GAS_UPDATE_GAS_PRICE_OPTION = 'gas/GAS_UPDATE_GAS_PRICE_OPTION';

// -- Actions --------------------------------------------------------------- //

export const saveGasPrices = fetchedGasPrices => async dispatch => {
  dispatch({
    payload: {
      gasPrices: fetchedGasPrices,
    },
    type: GAS_PRICES_SUCCESS,
  });
};

export const gasUpdateGasPriceOption = newGasPriceOption => (
  dispatch,
  getState
) => {
  const { gasPrices, txFees } = getState().gas;
  if (isEmpty(gasPrices)) return;
  const { assets } = getState().data;
  const { network } = getState().settings;

  const results = getSelectedGasPrice(
    assets,
    gasPrices,
    txFees,
    newGasPriceOption,
    network
  );

  dispatch({
    payload: {
      ...results,
      selectedGasPriceOption: newGasPriceOption,
    },
    type: GAS_UPDATE_GAS_PRICE_OPTION,
  });
};

export const gasUpdateCustomValues = price => async (dispatch, getState) => {
  const { gasPrices, gasLimit } = getState().gas;

  const estimateInMinutes = await getEstimatedTimeForGasPrice(price);
  const newGasPrices = { ...gasPrices };
  newGasPrices[CUSTOM] = defaultGasPriceFormat(
    CUSTOM,
    estimateInMinutes,
    price,
    true
  );

  await dispatch({
    payload: {
      gasPrices: newGasPrices,
    },
    type: GAS_PRICES_SUCCESS,
  });

  dispatch(gasUpdateTxFee(gasLimit));
};

export const gasUpdateDefaultGasLimit = (
  defaultGasLimit = ethUnits.basic_tx
) => dispatch => {
  dispatch({
    payload: defaultGasLimit,
    type: GAS_UPDATE_DEFAULT_GAS_LIMIT,
  });
  dispatch(gasUpdateTxFee(defaultGasLimit));
};

export const gasUpdateTxFee = (gasLimit, overrideGasOption) => (
  dispatch,
  getState
) => {
  const { defaultGasLimit, gasPrices, selectedGasPriceOption } = getState().gas;

  const _gasLimit = gasLimit || defaultGasLimit;
  const _selectedGasPriceOption = overrideGasOption || selectedGasPriceOption;
  if (isEmpty(gasPrices)) return;

  const { assets } = getState().data;
  const { nativeCurrency, network } = getState().settings;

  const ethPriceUnit = ethereumUtils.getEthPriceUnit();

  const txFees = parseTxFees(
    gasPrices,
    ethPriceUnit,
    _gasLimit,
    nativeCurrency,
    network
  );

  const results = getSelectedGasPrice(
    assets,
    gasPrices,
    txFees,
    _selectedGasPriceOption
  );
  dispatch({
    payload: {
      ...results,
      gasLimit,
      txFees,
    },
    type: GAS_UPDATE_TX_FEE,
  });
};

const getSelectedGasPrice = (
  assets,
  gasPrices,
  txFees,
  selectedGasPriceOption
) => {
  let txFee = txFees[selectedGasPriceOption];
  // If no custom price is set we default to FAST
  if (
    selectedGasPriceOption === gasUtils.CUSTOM &&
    get(txFee, 'txFee.value.amount') === 'NaN'
  ) {
    txFee = txFees[gasUtils.FAST];
  }
  const nativeTokenAsset = ethereumUtils.getNativeTokenAsset(assets);
  const balanceAmount = get(nativeTokenAsset, 'balance.amount', 0);
  const txFeeAmount = fromWei(get(txFee, 'txFee.value.amount', 0));
  const isSufficientGas = greaterThanOrEqualTo(balanceAmount, txFeeAmount);
  return {
    isSufficientGas,
    selectedGasPrice: {
      ...txFee,
      ...gasPrices[selectedGasPriceOption],
    },
  };
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  defaultGasLimit: ethUnits.basic_tx,
  gasLimit: null,
  gasPrices: {},
  isSufficientGas: undefined,
  selectedGasPrice: {},
  selectedGasPriceOption: NORMAL,
  txFees: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GAS_UPDATE_DEFAULT_GAS_LIMIT:
      return {
        ...state,
        defaultGasLimit: action.payload,
      };
    case GAS_PRICES_DEFAULT:
      return {
        ...state,
        gasPrices: action.payload.gasPrices,
        selectedGasPrice: action.payload.selectedGasPrice,
        txFees: action.payload.txFees,
      };
    case GAS_PRICES_SUCCESS:
      return {
        ...state,
        gasPrices: action.payload.gasPrices,
      };
    case GAS_PRICES_FAILURE:
      return {
        ...state,
        gasPrices: action.payload,
      };
    case GAS_UPDATE_TX_FEE:
      return {
        ...state,
        gasLimit: action.payload.gasLimit,
        isSufficientGas: action.payload.isSufficientGas,
        selectedGasPrice: action.payload.selectedGasPrice,
        txFees: action.payload.txFees,
      };
    case GAS_UPDATE_GAS_PRICE_OPTION:
      return {
        ...state,
        isSufficientGas: action.payload.isSufficientGas,
        selectedGasPrice: action.payload.selectedGasPrice,
        selectedGasPriceOption: action.payload.selectedGasPriceOption,
      };
    default:
      return state;
  }
};
