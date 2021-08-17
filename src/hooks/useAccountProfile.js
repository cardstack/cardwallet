import GraphemeSplitter from 'grapheme-splitter';
import { get, toUpper } from 'lodash';
import { removeFirstEmojiFromString } from '../helpers/emojiHandler';
import networkTypes from '../helpers/networkTypes';
import useAccountSettings from './useAccountSettings';
import useWallets from './useWallets';
import { getAddressPreview } from '@cardstack/utils';

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

  const { label, color, index, image } = selectedAccount;

  const accountName = removeFirstEmojiFromString(
    network === networkTypes.mainnet
      ? label || accountENS || getAddressPreview(accountAddress)
      : label === accountENS
      ? getAddressPreview(accountAddress)
      : label || getAddressPreview(accountAddress)
  ).join('');

  const labelOrAccountName =
    accountName === label ? toUpper(accountName) : label;
  const accountSymbol = new GraphemeSplitter().splitGraphemes(
    network === networkTypes.mainnet
      ? labelOrAccountName || toUpper(accountENS) || `${index + 1}`
      : label === accountENS
      ? toUpper(accountName)
      : toUpper(label) || toUpper(accountName)
  )[0];
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
