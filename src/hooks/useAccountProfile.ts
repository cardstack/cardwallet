import { toUpper } from 'lodash';
import { useMemo } from 'react';
import useWallets from './useWallets';
import { avatarColor } from '@cardstack/theme';
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

  const avatarKeyColor = useMemo(() => selectedAccount?.color || 0, [
    selectedAccount,
  ]);

  return {
    accountAddress,
    accountName,
    accountSymbol,
    avatarKeyColor,
    accountColor: avatarColor[avatarKeyColor],
    accountImage: selectedAccount?.avatar,
  };
}
