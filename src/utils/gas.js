import {
  get,
  indexOf,
  isFunction,
  map,
  property,
  sortBy,
  upperFirst,
} from 'lodash';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const CUSTOM = 'custom';
const FAST = 'fast';
const NORMAL = 'normal';
const SLOW = 'slow';

const GasSpeedOrder = [SLOW, NORMAL, FAST, CUSTOM];

const showTransactionSpeedOptions = (
  gasPrices,
  txFees,
  updateGasOption,
  onSuccess,
  hideCustom = false
) => {
  const options = [
    ...formatGasSpeedItems(gasPrices, txFees, hideCustom),
    { label: 'Cancel' },
  ];
  const cancelButtonIndex = options.length - 1;

  showActionSheetWithOptions(
    {
      cancelButtonIndex,
      options: options.map(property('label')),
    },
    buttonIndex => {
      if (buttonIndex !== undefined && buttonIndex !== cancelButtonIndex) {
        const selectedGasPriceItem = options[buttonIndex];
        updateGasOption(selectedGasPriceItem.speed);

        if (isFunction(onSuccess)) {
          onSuccess();
        }
      }
    }
  );
};

const formatGasSpeedItems = (gasPrices, txFees, hideCustom = false) => {
  let allSpeeds = GasSpeedOrder;
  if (hideCustom) {
    allSpeeds = allSpeeds.filter(speed => speed !== CUSTOM);
  }
  const gasItems = map(allSpeeds, speed => {
    const cost = get(txFees, `[${speed}].txFee.native.value.display`);
    const gwei = get(gasPrices, `[${speed}].value.display`);
    const time = get(gasPrices, `[${speed}].estimatedTime.display`);
    const timeLabel = time > 0 ? `   ~${time}` : '';

    return {
      gweiValue: gwei,
      label: `${upperFirst(speed)}: ${cost}${timeLabel}`,
      speed,
    };
  });
  return sortBy(gasItems, ({ speed }) => indexOf(GasSpeedOrder, speed));
};

export default {
  CUSTOM,
  FAST,
  GasSpeedOrder,
  NORMAL,
  showTransactionSpeedOptions,
  SLOW,
};
