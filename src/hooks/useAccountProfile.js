import { toUpper } from 'lodash';
import useAccountSettings from './useAccountSettings';
import useWallets from './useWallets';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
} from '@cardstack/utils';

export default function useAccountProfile() {
  const { selectedWallet } = useWallets();

  const { accountAddress } = useAccountSettings();

  if (!selectedWallet) {
    return {};
  }

  if (!accountAddress) {
    return {};
  }

  if (!selectedWallet?.addresses?.length) {
    return {};
  }

  const selectedAccount = selectedWallet.addresses.find(
    account => account.address === accountAddress
  );

  if (!selectedAccount) {
    return {};
  }

  const { label, color, image } = selectedAccount;

  const accountAddressPreview = getAddressPreview(accountAddress);

  const accountName = label || accountAddressPreview;

  return {
    accountAddress,
    accountName,
    accountColor: color,
    accountImage: image,
    accountSymbol: getSymbolCharacterFromAddress(toUpper(accountName)),
  };
}
