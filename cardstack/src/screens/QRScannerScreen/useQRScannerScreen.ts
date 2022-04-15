import { useCallback, useMemo, useState } from 'react';
import { useIsEmulator } from 'react-native-device-info';

import { SwitchSelectorOption } from '@cardstack/components';
import { layoutEasingAnimation } from '@cardstack/utils';

import { strings } from './strings';

enum PageMode {
  SCAN,
  REQUEST,
}

const pages = [
  { label: strings.scanLabel, value: PageMode.SCAN },
  { label: strings.requestLabel, value: PageMode.REQUEST },
];

export const useQRScannerScreen = () => {
  const [currentPage, setCurrentPage] = useState<PageMode>(PageMode.SCAN);

  const { result: isEmulator } = useIsEmulator();

  const isScanSelected = useMemo(() => currentPage === PageMode.SCAN, [
    currentPage,
  ]);

  const togglePage = useCallback((option: SwitchSelectorOption) => {
    layoutEasingAnimation();
    setCurrentPage(option.value);
  }, []);

  return {
    togglePage,
    isScanSelected,
    isEmulator,
    pages,
  };
};
