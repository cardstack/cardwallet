import { toUpper } from 'lodash';
import { useMemo } from 'react';
import useWallets from './useWallets';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
} from '@cardstack/utils';

export default function useAccountProfile() {
  const { selectedAccount, accountAddress } = useWallets();

  const accountName = useMemo(
    () => selectedAccount?.label || getAddressPreview(accountAddress),
    [accountAddress, selectedAccount]
  );

  const accountSymbol = useMemo(
    () => getSymbolCharacterFromAddress(toUpper(accountName)),
    [accountName]
  );

  return {
    accountAddress,
    accountName,
    accountSymbol,
    accountColor: selectedAccount?.color,
    accountImage: selectedAccount?.avatar,
  };
}
