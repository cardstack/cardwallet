import { captureException, captureMessage } from '@sentry/react-native';
import { toChecksumAddress } from 'ethereumjs-util';
import { get, isEmpty, keys } from 'lodash';
import { saveKeychainIntegrityState } from '../handlers/localstorage/globalSettings';
import { getWalletNames } from '../handlers/localstorage/walletNames';
import WalletBackupTypes from '../helpers/walletBackupTypes';
import WalletTypes from '../helpers/walletTypes';
import { hasKey } from '../model/keychain';
import {
  generateAccount,
  getAllWallets,
  getSelectedWallet,
  loadAddress,
  saveAddress,
  saveAllWallets,
  setSelectedWallet,
} from '../model/wallet';
import { logger } from '../utils';
import { addressKey } from '../utils/keychainConstants';
import { settingsUpdateAccountAddress } from './settings';
import { backupUserDataIntoCloud } from '@cardstack/models/rn-cloud';
import { getPrivateKey, getSeedPhrase } from '@cardstack/models/secure-storage';

// -- Constants --------------------------------------- //
const WALLETS_ADDED_ACCOUNT = 'wallets/WALLETS_ADDED_ACCOUNT';
const WALLETS_LOAD = 'wallets/ALL_WALLETS_LOAD';
const WALLETS_UPDATE = 'wallets/ALL_WALLETS_UPDATE';
const WALLETS_UPDATE_NAMES = 'wallets/WALLETS_UPDATE_NAMES';
const WALLETS_SET_SELECTED = 'wallets/SET_SELECTED';

// -- Actions ---------------------------------------- //
export const walletsLoadState = () => async (dispatch, getState) => {
  try {
    const { accountAddress } = getState().settings;
    let addressFromKeychain = accountAddress;
    const wallets = await getAllWallets();
    if (isEmpty(wallets)) return;
    const selected = await getSelectedWallet();
    // Prevent irrecoverable state (no selected wallet)
    let selectedWallet = get(selected, 'wallet', undefined);
    // Check if the selected wallet is among all the wallets
    if (selectedWallet && !wallets[selectedWallet.id]) {
      // If not then we should clear it and default to the first one
      const firstWalletKey = Object.keys(wallets)[0];
      selectedWallet = wallets[firstWalletKey];
      await setSelectedWallet(selectedWallet);
    }

    if (!selectedWallet) {
      const address = await loadAddress();
      keys(wallets).some(key => {
        const someWallet = wallets[key];
        const found = someWallet.addresses.some(account => {
          return (
            toChecksumAddress(account.address) === toChecksumAddress(address)
          );
        });
        if (found) {
          selectedWallet = someWallet;
          logger.sentry('Found selected wallet based on loadAddress result');
        }
        return found;
      });
    }

    // Recover from broken state (account address not in selected wallet)
    if (!addressFromKeychain) {
      addressFromKeychain = await loadAddress();
      await dispatch(settingsUpdateAccountAddress(addressFromKeychain));
      logger.sentry(
        'addressFromKeychain wasnt set on settings so it is being loaded from loadAddress'
      );
    }

    const selectedAddress = selectedWallet.addresses.find(
      account => account.address === addressFromKeychain
    );

    if (!selectedAddress) {
      const account = selectedWallet.addresses[0];
      await dispatch(settingsUpdateAccountAddress(account.address));
      await saveAddress(account.address);
      logger.sentry(
        'Selected the first address because there was not selected one'
      );
    }

    // Migrate backup generic info if set to manual type to specific manuallyBackedUp flag.
    if (
      selectedWallet.backedUp &&
      selectedWallet.backupType === WalletBackupTypes.manual
    ) {
      await dispatch(setWalletManualBackup(selectedWallet.id));
    }

    const walletNames = await getWalletNames();

    dispatch({
      payload: {
        selected: selectedWallet,
        walletNames,
        wallets,
      },
      type: WALLETS_LOAD,
    });

    return { wallets, selectedWallet };
  } catch (error) {
    logger.sentry('Exception during walletsLoadState');
    captureException(error);
  }
};

export const walletsUpdate = wallets => async dispatch => {
  await saveAllWallets(wallets);
  dispatch({
    payload: wallets,
    type: WALLETS_UPDATE,
  });
};

export const walletsSetSelected = wallet => async dispatch => {
  await setSelectedWallet(wallet);
  dispatch({
    payload: wallet,
    type: WALLETS_SET_SELECTED,
  });
};

export const setWalletManualBackup = walletId => async (dispatch, getState) => {
  const { wallets } = getState().wallets;
  const newWallets = { ...wallets };
  newWallets[walletId] = {
    ...newWallets[walletId],
    manuallyBackedUp: true,
  };

  await dispatch(walletsUpdate(newWallets));
};

export const setWalletCloudBackup = (walletId, backupFile = '') => async (
  dispatch,
  getState
) => {
  const { wallets, selected } = getState().wallets;
  const newWallets = { ...wallets };
  newWallets[walletId] = {
    ...newWallets[walletId],
    backedUp: true,
    backupDate: Date.now(),
    backupFile,
    backupType: WalletBackupTypes.cloud,
  };

  await dispatch(walletsUpdate(newWallets));
  if (selected.id === walletId) {
    await dispatch(walletsSetSelected(newWallets[walletId]));
  }

  try {
    await backupUserDataIntoCloud({ wallets: newWallets });
  } catch (e) {
    logger.sentry('SAVING WALLET USERDATA FAILED');
    captureException(e);
    throw e;
  }
};

export const addressSetSelected = address => () => saveAddress(address);

export const createAccountForWallet = (id, color, name) => async (
  dispatch,
  getState
) => {
  const { wallets } = getState().wallets;
  const newWallets = { ...wallets };
  let index = 0;
  newWallets[id].addresses.forEach(
    account => (index = Math.max(index, account.index))
  );
  const newIndex = index + 1;
  const account = await generateAccount(id, newIndex);
  newWallets[id].addresses.push({
    address: account.address,
    avatar: null,
    color,
    index: newIndex,
    label: name,
  });

  // Save all the wallets
  saveAllWallets(newWallets);
  // Set the address selected (KEYCHAIN)
  await saveAddress(account.address);

  await dispatch(settingsUpdateAccountAddress(account.address));
  // Set the wallet selected (KEYCHAIN)
  await setSelectedWallet(newWallets[id]);

  dispatch({
    payload: { selected: newWallets[id], wallets: newWallets },
    type: WALLETS_ADDED_ACCOUNT,
  });

  return newWallets;
};

export const checkKeychainIntegrity = () => async (dispatch, getState) => {
  try {
    let healthyKeychain = true;
    logger.sentry('[KeychainIntegrityCheck]: starting checks');

    // check rainbowAddressKey
    const hasAddress = await hasKey(addressKey);
    if (!hasAddress) {
      healthyKeychain = false;
      logger.sentry(
        `[KeychainIntegrityCheck]: address is missing: ${hasAddress}`
      );
    } else {
      logger.sentry('[KeychainIntegrityCheck]: address is ok');
    }

    const { wallets, selected } = getState().wallets;
    if (!wallets) {
      logger.sentry(
        '[KeychainIntegrityCheck]: wallets are missing from redux',
        wallets
      );
    }

    if (!selected) {
      logger.sentry(
        '[KeychainIntegrityCheck]: selectedwallet is missing from redux',
        selected
      );
    }

    const nonReadOnlyWalletKeys = keys(wallets).filter(
      walletId => wallets[walletId].type !== WalletTypes.readOnly
    );

    for (const walletId of nonReadOnlyWalletKeys) {
      let healthyWallet = true;

      const wallet = wallets[walletId];

      logger.sentry(`[KeychainIntegrityCheck]: checking wallet ${walletId}`);
      logger.sentry(`[KeychainIntegrityCheck]: Wallet data`, wallet);

      const seedPhrase = await getSeedPhrase(walletId);

      if (!seedPhrase) {
        healthyWallet = false;
        logger.sentry('[KeychainIntegrityCheck]: seed phrase is missing');
      } else {
        logger.sentry('[KeychainIntegrityCheck]: seed phrase is present');
      }

      for (const account of wallet.addresses) {
        const pKey = await getPrivateKey(account.address);

        if (!pKey) {
          healthyWallet = false;
          logger.sentry(
            `[KeychainIntegrityCheck]: pkey is missing for address: ${account.address}`
          );
        } else {
          logger.sentry(
            `[KeychainIntegrityCheck]: pkey is present for address: ${account.address}`
          );
        }
      }

      if (!healthyWallet) {
        logger.sentry(
          '[KeychainIntegrityCheck]: declaring wallet unhealthy...'
        );
        healthyKeychain = false;
        wallet.damaged = true;
        await dispatch(walletsUpdate(wallets));

        // Update selected wallet if needed
        if (wallet.id === selected.id) {
          logger.sentry(
            '[KeychainIntegrityCheck]: declaring selected wallet unhealthy...'
          );
          await dispatch(walletsSetSelected(wallets[wallet.id]));
        }
        logger.sentry('[KeychainIntegrityCheck]: done updating wallets');
      }
    }

    if (!healthyKeychain) {
      captureMessage('Keychain Integrity is not OK');
    }

    logger.sentry('[KeychainIntegrityCheck]: check completed');
    await saveKeychainIntegrityState('done');
  } catch (e) {
    logger.sentry('[KeychainIntegrityCheck]: error thrown', e);
    captureMessage('Error running keychain integrity checks');
  }
};

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  selected: undefined,
  walletNames: {},
  wallets: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WALLETS_SET_SELECTED:
      return { ...state, selected: action.payload };
    case WALLETS_UPDATE:
      return { ...state, wallets: action.payload };
    case WALLETS_UPDATE_NAMES:
      return { ...state, walletNames: action.payload };
    case WALLETS_LOAD:
      return {
        ...state,
        selected: action.payload.selected,
        walletNames: action.payload.walletNames,
        wallets: action.payload.wallets,
      };
    case WALLETS_ADDED_ACCOUNT:
      return {
        ...state,
        selected: action.payload.selected,
        wallets: action.payload.wallets,
      };
    default:
      return state;
  }
};
