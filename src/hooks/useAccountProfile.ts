import { toUpper } from 'lodash';
import { useMemo } from 'react';
import useWallets from './useWallets';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
} from '@cardstack/utils';

export default function useAccountProfile() {
  const { selectedAccount, accountAddress } = useWallets();

  const { label, color, avatar } = selectedAccount;

  const accountName = useMemo(
    () => label || getAddressPreview(accountAddress),
    [accountAddress, label]
  );

  const accountSymbol = useMemo(
    () => getSymbolCharacterFromAddress(toUpper(accountName)),
    [accountName]
  );

  return {
    accountAddress,
    accountName,
    accountSymbol,
    accountColor: color,
    accountImage: avatar,
  };
}
