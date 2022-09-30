import { captureException } from '@sentry/react-native';
import { generateMnemonic } from 'bip39';
import { signTypedData_v4, signTypedDataLegacy } from 'eth-sig-util';
import { isValidAddress, toBuffer, toChecksumAddress } from 'ethereumjs-util';
import {
  hdkey as EthereumHDKey,
  default as LibWallet,
} from 'ethereumjs-wallet';

import { ethers } from 'ethers';
import lang from 'i18n-js';
import { find, findKey, forEach, get, isEmpty } from 'lodash';
import { Alert } from 'react-native';
import { ACCESSIBLE, AuthenticationPrompt } from 'react-native-keychain';
import AesEncryptor from '../handlers/aesEncryption';
import {
  DEPRECATED_authenticateWithPIN,
  DEPRECATED_getExistingPIN,
} from '../handlers/authentication';
import {
  addHexPrefix,
  getEtherWeb3Provider,
  isHexStringIgnorePrefix,
} from '../handlers/web3';
import showWalletErrorAlert from '../helpers/support';
import { isValidSeed } from '../helpers/validators';
import { EthereumWalletType } from '../helpers/walletTypes';
import { getRandomColor } from '../styles/colors';
import { ethereumUtils } from '../utils';
import {
  addressKey,
  allWalletsKey,
  pinKey,
  privateKeyKey,
  seedPhraseKey,
  selectedWalletKey,
} from '../utils/keychainConstants';
import * as keychain from './keychain';
import { getEthersWalletWithSeed } from '@cardstack/models/ethers-wallet';
import { backupUserDataIntoCloud } from '@cardstack/models/rn-cloud';

import {
  getPin,
  getPrivateKey,
  getSeedPhrase,
  savePrivateKey,
  saveSeedPhrase,
  updateSecureStorePin,
  wipeSecureStorage,
} from '@cardstack/models/secure-storage';
import { skipProfileCreation } from '@cardstack/redux/persistedFlagsSlice';
import { restartApp } from '@cardstack/utils';
import { Device } from '@cardstack/utils/device';

import {
  deleteKeychainIntegrityState,
  deletePinAuthAttemptsData,
} from '@rainbow-me/handlers/localstorage/globalSettings';
import store from '@rainbow-me/redux/store';
import logger from 'logger';

const encryptor = new AesEncryptor();

type EthereumAddress = string;
type EthereumPrivateKey = string;
type EthereumMnemonic = string;
type EthereumSeed = string;
type EthereumWalletSeed =
  | EthereumAddress
  | EthereumPrivateKey
  | EthereumMnemonic
  | EthereumSeed;

interface TransactionRequestParam {
  transaction: ethers.providers.TransactionRequest;
  existingWallet?: ethers.Wallet;
}

interface MessageTypeProperty {
  name: string;
  type: string;
}
interface TypedDataTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export interface TypedData {
  types: TypedDataTypes;
  primaryType: keyof TypedDataTypes;
  domain: {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
  };
  message: {
    to?: string;
    data?: string;
  };
}

export interface EthereumWalletFromSeed {
  isHDWallet: boolean;
  wallet: LibWallet;
  type: EthereumWalletType;
  walletType: WalletLibraryType;
  root: EthereumHDKey;
  address: EthereumAddress;
}

export interface Account {
  index: number;
  label: string;
  address: EthereumAddress;
  avatar: null | string;
  color: number;
}

export interface RainbowWallet {
  addresses: Account[];
  color: number;
  id: string;
  imported: boolean;
  name: string;
  primary: boolean;
  type: EthereumWalletType;
  backedUp: boolean;
  backupFile?: string;
  backupDate?: string;
  backupType?: string;
  damaged?: boolean;
}

export interface AllRainbowWallets {
  [key: string]: RainbowWallet;
}

interface AllRainbowWalletsData {
  wallets: AllRainbowWallets;
  version: string;
}

interface RainbowSelectedWalletData {
  wallet: RainbowWallet;
}

interface SeedPhraseData {
  seedphrase: EthereumPrivateKey;
  version: string;
}

export enum WalletLibraryType {
  ethers = 'ethers',
  bip39 = 'bip39',
}

const selectedWalletVersion = 1.0;
export const allWalletsVersion = 1.0;

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

const authenticationPrompt = 'Please authenticate';

export const publicAccessControlOptions = {
  accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
};

export const loadWallet = async (): Promise<null | ethers.Wallet> => {
  const privateKey = await loadPrivateKey();

  if (privateKey) {
    const web3Provider = await getEtherWeb3Provider();
    return new ethers.Wallet(privateKey, web3Provider);
  }
  if (Device.isIOS) {
    showWalletErrorAlert();
  }
  return null;
};

export const sendTransaction = async ({
  transaction,
  existingWallet,
}: TransactionRequestParam) => {
  try {
    logger.sentry('about to send transaction', transaction);
    const wallet = existingWallet || (await loadWallet());
    if (!wallet) return null;
    try {
      const result = await wallet.sendTransaction(transaction);
      logger.log('tx result', result);
      return result;
    } catch (error) {
      logger.log('Failed to SEND transaction', error);
      Alert.alert(lang.t('wallet.transaction.alert.failed_transaction'));
      logger.sentry('Failed to SEND transaction, alerted user');
      captureException(error);
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    logger.sentry(
      'Failed to SEND transaction due to authentication, alerted user'
    );
    captureException(error);
    return null;
  }
};

export const signTransaction = async ({
  transaction,
}: TransactionRequestParam): Promise<null | string> => {
  try {
    logger.sentry('about to sign transaction', transaction);
    const wallet = await loadWallet();
    if (!wallet) return null;
    try {
      return wallet.signTransaction(transaction);
    } catch (error) {
      Alert.alert(lang.t('wallet.transaction.alert.failed_transaction'));
      logger.sentry('Failed to SIGN transaction, alerted user');
      captureException(error);
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    logger.sentry(
      'Failed to SIGN transaction due to authentication, alerted user'
    );
    captureException(error);
    return null;
  }
};

export const signMessage = async (
  message: ethers.utils.BytesLike | ethers.utils.Hexable | number
): Promise<null | string> => {
  try {
    logger.sentry('about to sign message', message);
    const wallet = await loadWallet();
    try {
      if (!wallet) return null;
      const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
      const sigParams = await signingKey.signDigest(
        ethers.utils.arrayify(message)
      );
      return ethers.utils.joinSignature(sigParams);
    } catch (error) {
      Alert.alert(lang.t('wallet.transaction.alert.failed_sign_message'));
      logger.sentry('Failed to SIGN message, alerted user');
      captureException(error);
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    logger.sentry('Failed to SIGN message due to authentication, alerted user');
    captureException(error);
    return null;
  }
};

export const signPersonalMessage = async (
  message: string | Uint8Array
): Promise<null | string> => {
  try {
    logger.sentry('about to sign personal message', message);
    const wallet = await loadWallet();
    try {
      if (!wallet) return null;
      return wallet.signMessage(
        typeof message === 'string' && ethers.utils.isHexString(message)
          ? ethers.utils.arrayify(message)
          : message
      );
    } catch (error) {
      Alert.alert(lang.t('wallet.transaction.alert.failed_sign_message'));
      logger.sentry('Failed to SIGN personal message, alerted user');
      captureException(error);
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    logger.sentry(
      'Failed to SIGN personal message due to authentication, alerted user'
    );
    captureException(error);
    return null;
  }
};

export const signTypedDataMessage = async (
  message: string | TypedData
): Promise<null | string> => {
  try {
    logger.sentry('about to sign typed data  message', message);
    const wallet = await loadWallet();
    if (!wallet) return null;
    try {
      const pkeyBuffer = toBuffer(addHexPrefix(wallet.privateKey));
      let parsedData = message;
      if (typeof message === 'string') {
        parsedData = JSON.parse(message);
      }

      // There are 3 types of messages
      // v1 => basic data types
      // v3 =>  has type / domain / primaryType
      // v4 => same as v3 but also supports which supports arrays and recursive structs.
      // Because v4 is backwards compatible with v3, we're supporting only v4

      let version = 'v1';
      if (
        typeof parsedData === 'object' &&
        (parsedData.types || parsedData.primaryType || parsedData.domain)
      ) {
        version = 'v4';
      }

      switch (version) {
        case 'v4':
          return signTypedData_v4(pkeyBuffer, {
            data: parsedData,
          });
        default:
          return signTypedDataLegacy(pkeyBuffer, { data: parsedData });
      }
    } catch (error) {
      Alert.alert(lang.t('wallet.transaction.alert.failed_sign_message'));
      logger.sentry('Failed to SIGN typed data message, alerted user');
      captureException(error);
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    logger.sentry(
      'Failed to SIGN typed data message due to authentication, alerted user'
    );
    captureException(error);
    return null;
  }
};

export const loadAddress = (): Promise<null | EthereumAddress> =>
  keychain.loadString(addressKey) as Promise<string | null>;

export const loadPrivateKey = async (accAddress?: string) => {
  try {
    const address = accAddress || (await loadAddress());
    if (!address) {
      return null;
    }
    const privateKey = await getPrivateKey(address);

    return privateKey;
  } catch (error) {
    logger.sentry('Error in loadPrivateKey');
    captureException(error);
    return null;
  }
};

export const saveAddress = async (
  address: EthereumAddress,
  accessControlOptions = publicAccessControlOptions
): Promise<void> => {
  return keychain.saveString(addressKey, address, accessControlOptions);
};

export const identifyWalletType = (
  walletSeed: EthereumWalletSeed
): EthereumWalletType => {
  if (
    isHexStringIgnorePrefix(walletSeed) &&
    addHexPrefix(walletSeed).length === 66
  ) {
    return EthereumWalletType.privateKey;
  }

  // 12 or 24 words seed phrase
  if (ethers.utils.isValidMnemonic(walletSeed)) {
    return EthereumWalletType.mnemonic;
  }

  // Public address (0x)
  if (isValidAddress(walletSeed)) {
    return EthereumWalletType.readOnly;
  }

  // seed
  return EthereumWalletType.seed;
};

export const getWalletByAddress = ({
  skip = false,
  walletAddress,
  allWallets,
}: {
  walletAddress: string;
  skip?: boolean;
  allWallets?: AllRainbowWallets;
}) => {
  if (skip || isEmpty(allWallets)) return;

  const wallet = find(
    allWallets,
    (someWallet: RainbowWallet) =>
      !!find(
        someWallet.addresses,
        account =>
          toChecksumAddress(account.address) ===
          toChecksumAddress(walletAddress)
      )
  );

  return wallet;
};

const addAccountsWithTxHistory = async (
  root: EthereumHDKey,
  allWallets: AllRainbowWallets,
  addresses: Account[]
) => {
  logger.sentry('[createWallet] - isHDWallet && isImported');
  let index = 1;
  let lookup = true;
  // Starting on index 1, we are gonna hit etherscan API and check the tx history
  // for each account. If there's history we add it to the wallet.
  //(We stop once we find the first one with no history)
  while (lookup) {
    const child = root.deriveChild(index);
    const walletObj = child.getWallet();
    const nextWallet = new ethers.Wallet(
      addHexPrefix(walletObj.getPrivateKey().toString('hex'))
    );
    let hasTxHistory = false;
    try {
      hasTxHistory = await ethereumUtils.hasPreviousTransactions(
        nextWallet.address
      );
    } catch (error) {
      logger.sentry('[createWallet] - Error getting txn history');
      captureException(error);
    }

    let discoveredAccount: Account | undefined;
    let discoveredWalletId: RainbowWallet['id'] | undefined;
    forEach(allWallets, someWallet => {
      const existingAccount = find(
        someWallet.addresses,
        account =>
          toChecksumAddress(account.address) ===
          toChecksumAddress(nextWallet.address)
      );
      if (existingAccount) {
        discoveredAccount = existingAccount as Account;
        discoveredWalletId = someWallet.id;
        return true;
      }
      return false;
    });

    // Remove any discovered wallets if they already exist
    // and copy over label and color if account was visible
    let color = getRandomColor();
    let label = '';

    if (discoveredAccount && discoveredWalletId) {
      color = discoveredAccount.color;
      label = discoveredAccount.label ?? '';

      delete allWallets?.[discoveredWalletId];
    }

    if (hasTxHistory) {
      await savePrivateKey(nextWallet.privateKey, nextWallet.address);

      logger.sentry(
        `[createWallet] - saved private key for next wallet ${index}`
      );
      // Adds account into wallet
      addresses.push({
        address: nextWallet.address,
        avatar: null,
        color,
        index,
        label,
      });
      index++;
    } else {
      lookup = false;
    }
  }
};

export interface CreateImportParams {
  seed?: string;
  color?: number;
  name?: string;
  checkedWallet?: EthereumWalletFromSeed;
  pin?: string;
  backedUpWallet?: RainbowWallet;
}

export const createOrImportWallet = async ({
  seed,
  color,
  name,
  pin,
  checkedWallet,
  backedUpWallet,
}: CreateImportParams = {}) => {
  const isImported = !!seed;
  const isBackedUp = !!backedUpWallet;

  logger.sentry('[createWallet], isImported?', isImported);
  if (!seed) {
    logger.sentry('Generating a new seed phrase');
  }

  if (!pin) {
    logger.sentry('No pin, exiting wallet creation');
    return;
  }

  const walletSeed = seed || generateMnemonic();

  const addresses: Account[] = [];

  try {
    // Wallet can be checked while importing,
    // if it's already checked use that info, otherwise ran the check here
    const {
      type,
      root,
      wallet: walletResult,
      address: walletAddress,
      walletType,
    } =
      checkedWallet ||
      (await ethereumUtils.deriveAccountFromWalletInput(walletSeed));
    logger.sentry('[createWallet] - getWallet from seed');

    if (!walletResult) return null;

    // Get all wallets
    logger.sentry('[createWallet] - getAllWallets');
    const allWallets = (await getAllWallets()) || {};

    const existingWallet = getWalletByAddress({
      allWallets,
      skip: !isImported,
      walletAddress,
    });

    if (existingWallet) {
      Alert.alert('Oops!', 'Looks like you already imported this account!');
      logger.sentry('[createWallet] - already imported this wallet');
      return null;
    }

    const walletId = `wallet_${Date.now()}`;
    logger.sentry('[createWallet] - wallet ID', { walletId });

    // No need to check if its's HD wallet, bc only HD is allowed
    const privateKey = addHexPrefix(
      (walletResult as LibWallet).getPrivateKey().toString('hex')
    );

    const saveSeed = saveSeedPhrase(walletSeed, walletId, pin);
    const savePkey = savePrivateKey(privateKey, walletAddress);

    await Promise.all([saveSeed, savePkey]);

    // Adds an account
    addresses.push({
      address: walletAddress,
      avatar: null,
      color: color ?? getRandomColor(),
      index: 0,
      label: name || '',
    });

    // For HDWallet we check to add derived accounts
    if (root && isImported) {
      await addAccountsWithTxHistory(root, allWallets, addresses);
    }

    // if imported and we have only one account, we name the wallet too.
    let walletName = DEFAULT_WALLET_NAME;
    if (isImported && name) {
      if (addresses.length > 1) {
        walletName = name;
      }
    }

    let primary = false;
    // If it's not imported or it's the first one with a seed phrase
    // it's the primary wallet
    if (
      !isImported ||
      (!findKey(allWallets, ['type', EthereumWalletType.mnemonic]) &&
        type === EthereumWalletType.mnemonic)
    ) {
      primary = true;
      // Or there's no other primary wallet and this one has a seed phrase
    } else {
      const primaryWallet = findKey(allWallets, ['primary', true]);
      if (!primaryWallet && type === EthereumWalletType.mnemonic) {
        primary = true;
      }
    }

    logger.sentry('[createWallet], isBackedUp?', isBackedUp);

    allWallets[walletId] = {
      ...backedUpWallet,
      addresses,
      backedUp: isBackedUp,
      color: color || 0,
      id: walletId,
      imported: isImported,
      damaged: false,
      name: walletName,
      primary,
      type,
    };

    await setSelectedWallet(allWallets[walletId]);
    logger.sentry('[createWallet] - setSelectedWallet');

    await saveAllWallets(allWallets);
    logger.sentry('[createWallet] - saveAllWallets');

    await saveAddress(walletAddress);
    logger.sentry('[createWallet] - saveAddress');

    // updates the wallet_id on the UserData.json cloud backup file
    // because importing via seedphrase creates a new wallet_id
    if (isBackedUp) {
      try {
        await backupUserDataIntoCloud({ wallets: allWallets });
      } catch (e) {
        logger.sentry('[createWallet] backupUserDataIntoCloud failed');
        captureException(e);
      }
    }

    if (walletResult && walletAddress) {
      // bip39 are derived from mnemioc
      const createdWallet =
        walletType === WalletLibraryType.bip39
          ? new ethers.Wallet(privateKey)
          : null;

      return createdWallet;
    }

    return null;
  } catch (error) {
    logger.sentry('Error in createWallet', error);
    captureException(error);
    return null;
  }
};

// use only inside wallet model
const DEPRECATED_getSeedPhrase = async (
  id: RainbowWallet['id'],
  promptMessage?: string | AuthenticationPrompt
): Promise<null | SeedPhraseData> => {
  try {
    const key = `${id}_${seedPhraseKey}`;
    const seedPhraseData = (await keychain.loadObject(key, {
      authenticationPrompt: promptMessage || authenticationPrompt,
    })) as SeedPhraseData | -2;

    if (seedPhraseData === -2) {
      Alert.alert(
        'Error',
        'Your current authentication method (Face Recognition) is not secure enough, please go to "Settings > Biometrics & Security" and enable an alternative biometric method like Fingerprint or Iris'
      );
      return null;
    }

    return seedPhraseData || null;
  } catch (error) {
    logger.sentry('Error in DEPRECATED_getSeedPhrase');
    captureException(error);
    return null;
  }
};

export const setSelectedWallet = async (
  wallet: RainbowWallet
): Promise<void> => {
  const val = {
    version: selectedWalletVersion,
    wallet,
  };

  return keychain.saveObject(
    selectedWalletKey,
    val,
    publicAccessControlOptions
  );
};

export const getSelectedWallet = async (): Promise<null | RainbowSelectedWalletData> => {
  try {
    const selectedWalletData = await keychain.loadObject(selectedWalletKey);
    if (selectedWalletData) {
      return selectedWalletData as RainbowSelectedWalletData;
    }
    return null;
  } catch (error) {
    logger.sentry('Error in getSelectedWallet');
    captureException(error);
    return null;
  }
};

export const saveAllWallets = async (wallets: AllRainbowWallets) => {
  const val = {
    version: allWalletsVersion,
    wallets,
  };

  await keychain.saveObject(allWalletsKey, val, publicAccessControlOptions);
};

export const getAllWallets = async (): Promise<
  AllRainbowWallets | undefined
> => {
  try {
    const allWallets = (await keychain.loadObject(
      allWalletsKey
    )) as AllRainbowWalletsData;

    return allWallets?.wallets;
  } catch (error) {
    logger.sentry('Error in getAllWallets');
    captureException(error);
    return;
  }
};

export const generateAccount = async (
  id: RainbowWallet['id'],
  index: number
): Promise<null | ethers.Wallet> => {
  try {
    const seedphrase = await loadSeedPhrase(id);

    const {
      wallet: ethereumJSWallet,
    } = await ethereumUtils.deriveAccountFromMnemonic(seedphrase, index);
    if (!ethereumJSWallet) return null;

    const walletAddress = addHexPrefix(
      toChecksumAddress(ethereumJSWallet.getAddress().toString('hex'))
    );

    const walletPkey = addHexPrefix(
      ethereumJSWallet.getPrivateKey().toString('hex')
    );

    const newAccount = new ethers.Wallet(walletPkey);
    await savePrivateKey(walletPkey, walletAddress);

    return newAccount;
  } catch (error) {
    logger.sentry('Error generating account for keychain', id);
    captureException(error);
    return null;
  }
};

export const loadSeedPhrase = async (
  id: RainbowWallet['id'],
  promptMessage?: string | AuthenticationPrompt,
  forceOldSeed: boolean = false
): Promise<null | EthereumWalletSeed> => {
  try {
    const newPin = !!(await getPin());

    if (newPin && !forceOldSeed) {
      const seed = await getSeedPhrase(id);
      return seed;
    }

    const seedData = await DEPRECATED_getSeedPhrase(id, promptMessage);

    const seedPhrase = get(seedData, 'seedphrase', null);
    const noPIN = !(await DEPRECATED_getExistingPIN());

    if (seedPhrase && isValidSeed(seedPhrase) && noPIN) {
      logger.sentry('Got seed succesfully');
      return seedPhrase;
    }

    if (Device.isAndroid && seedPhrase) {
      try {
        const userPIN = await DEPRECATED_authenticateWithPIN(promptMessage);
        if (userPIN) {
          if (isValidSeed(seedPhrase)) {
            logger.sentry('Got seed succesfully on PIN input');
            return seedPhrase;
          }

          const decryptedSeed = await encryptor.decrypt(userPIN, seedPhrase);
          logger.sentry('Got decrypted seed succesfully');
          return decryptedSeed;
        }
      } catch (error) {
        logger.sentry('Error in loadSeedPhrase while asking PIN.');
        captureException(error);
        return null;
      }
    }
    logger.sentry('No seed returned');
    return null;
  } catch (error) {
    logger.sentry('Error in loadSeedPhrase.', error);
    captureException(error);
    return null;
  }
};

export const migrateSecretsWithNewPin = async (
  selectedWallet: RainbowWallet,
  pin: string
) => {
  const keysToRemove = [pinKey, `${selectedWallet.id}_${seedPhraseKey}`];

  const migrateExistingAccountsPrivateKeys = (seedPhrase: string) =>
    selectedWallet.addresses.map(async account => {
      const derivedAccount = await getEthersWalletWithSeed({
        seedPhrase,
        walletId: selectedWallet.id,
        accountIndex: account.index,
      });

      const privateKey = derivedAccount?.privateKey;

      if (privateKey) {
        await savePrivateKey(privateKey, account.address);

        keysToRemove.push(`${account.address}_${privateKeyKey}`);
      }
    });

  try {
    const forceOldSeed = true;

    const seedPhrase = await loadSeedPhrase(
      selectedWallet.id,
      'Authenticate to migrate secrets',
      forceOldSeed
    );

    if (seedPhrase && isValidSeed(seedPhrase)) {
      logger.sentry('[Migration]: Start');
      await saveSeedPhrase(seedPhrase, selectedWallet.id, pin);
      logger.sentry('[Migration]: Seed success');

      await Promise.all(migrateExistingAccountsPrivateKeys(seedPhrase));
      logger.sentry('[Migration]: PrivateKey success');

      await keysToRemove.map(keychain.remove);
      logger.sentry('[Migration]: Cleanup success');

      await deleteKeychainIntegrityState();
      logger.sentry('[Migration]: Reseting keychain integrity');
    }
  } catch (e) {
    logger.sentry('Error migrating secrets', e);
    captureException(e);
  }
};

export const updateWalletWithNewPIN = async (newPin: string) => {
  try {
    const allWallets = await getAllWallets();

    if (allWallets) {
      await updateSecureStorePin(allWallets, newPin);

      logger.log('Pin updated.');
    }
  } catch (e) {
    logger.sentry('Error updating PIN', e);
    captureException(e);
  }
};

export const resetWallet = async () => {
  try {
    const allWallets = await getAllWallets();

    // clearing secure storage and keychain
    if (allWallets) {
      await wipeSecureStorage(allWallets);
      await keychain.wipeKeychain();

      // resets Keychain Integrity Check
      deleteKeychainIntegrityState();

      await deletePinAuthAttemptsData();

      // clear profile creation skip
      store.dispatch(skipProfileCreation(false));

      logger.log('Wallet reset done!');

      restartApp();
    }
  } catch (error) {
    logger.sentry('Error resetting the wallet', error);
  }
};
