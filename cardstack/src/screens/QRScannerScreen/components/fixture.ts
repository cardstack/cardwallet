import { HeaderHeight } from '@rainbow-me/components/header';
import deviceUtils from '@rainbow-me/utils/deviceUtils';

export const strings = {
  requestViaText: 'Or request via flow:',
  requestAmountBtn: 'Request Amount',
  scanLabel: 'Scan',
  requestLabel: 'Request',
};

export const SWITCH_SELECTOR_TOP =
  HeaderHeight + (deviceUtils.isSmallPhone ? 0 : 20);
export const SWITCH_SELECTOR_HEIGHT = 38;
export const CROSS_HAIR_TOP =
  SWITCH_SELECTOR_TOP +
  SWITCH_SELECTOR_HEIGHT +
  (deviceUtils.isSmallPhone ? 40 : 60);

export enum ScannerScreenMode {
  SCAN,
  REQUEST,
}

export const SWITCH_OPTIONS = [
  { label: strings.scanLabel, value: ScannerScreenMode.SCAN },
  { label: strings.requestLabel, value: ScannerScreenMode.REQUEST },
];
