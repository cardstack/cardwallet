import { get, toUpper } from 'lodash';
import networkTypes from '../helpers/networkTypes';
import useAccountSettings from './useAccountSettings';
import useWallets from './useWallets';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
} from '@cardstack/utils';

export default function useAccountProfile() {
  const wallets = useWallets();
  const { selectedWallet, walletNames } = wallets;

  const { network } = useAccountSettings();
  const settings = useAccountSettings();
  const { accountAddress } = settings;

  if (!selectedWallet) {
    return {};
  }

  if (!accountAddress) {
    return {};
  }

  if (!selectedWallet?.addresses?.length) {
    return {};
  }

  const accountENS = get(walletNames, `${accountAddress}`);

  const selectedAccount = selectedWallet.addresses.find(
    account => account.address === accountAddress
  );

  if (!selectedAccount) {
    return {};
  }

  const { label, color, address, image } = selectedAccount;

  const accountAddressPreview =
    label === accountENS
      ? getAddressPreview(accountAddress)
      : label || getAddressPreview(accountAddress);
  const accountName =
    network === networkTypes.mainnet
      ? label || accountENS || getAddressPreview(accountAddress)
      : accountAddressPreview;

  const accountSymbol = getSymbolCharacterFromAddress(
    network === networkTypes.mainnet
      ? label || toUpper(accountENS) || address
      : toUpper(accountName)
  );
  const accountColor = color;
  const accountImage = image;

  return {
    accountAddress,
    accountColor,
    accountENS,
    accountImage,
    accountName,
    accountSymbol,
  };
}
