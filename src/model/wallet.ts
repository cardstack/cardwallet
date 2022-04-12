import { TransactionRequest } from '@ethersproject/abstract-provider';
import {
  arrayify,
  BytesLike,
  Hexable,
  joinSignature,
} from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Transaction } from '@ethersproject/transactions';
import { Wallet } from '@ethersproject/wallet';
import { captureException } from '@sentry/react-native';
import { generateMnemonic } from 'bip39';
import { signTypedData_v4, signTypedDataLegacy } from 'eth-sig-util';
import { isValidAddress, toBuffer, toChecksumAddress } from 'ethereumjs-util';
import {
  hdkey as EthereumHDKey,
  default as LibWallet,
} from 'ethereumjs-wallet';
import lang from 'i18n-js';
import { find, findKey, forEach, get, isEmpty } from 'lodash';
import { Alert } from 'react-native';
import {
  ACCESSIBLE,
  AuthenticationPrompt,
  getSupportedBiometryType,
} from 'react-native-keychain';
import AesEncryptor from '../handlers/aesEncryption';
import {
  authenticateWithPIN,
  getExistingPIN,
} from '../handlers/authentication';
import {
  addHexPrefix,
  getEtherWeb3Provider,
  isHexString,
  isHexStringIgnorePrefix,
  isValidMnemonic,
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
import { Device } from '@cardstack/utils/device';

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
  transaction: TransactionRequest;
  existingWallet?: Wallet;
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

interface RainbowAccount {
  index: number;
  label: string;
  address: EthereumAddress;
  avatar: null | string;
  color: number;
  visible: boolean;
}

export interface RainbowWallet {
  addresses: RainbowAccount[];
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

interface PrivateKeyData {
  privateKey: EthereumPrivateKey;
  version: string;
}
interface SeedPhraseData {
  seedphrase: EthereumPrivateKey;
  version: string;
}

export enum WalletLibraryType {
  ethers = 'ethers',
  bip39 = 'bip39',
}

const privateKeyVersion = 1.0;
const seedPhraseVersion = 1.0;
const selectedWalletVersion = 1.0;
export const allWalletsVersion = 1.0;

export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = 'My Wallet';

const authenticationPrompt = lang.t('wallet.authenticate.please');
export const publicAccessControlOptions = {
  accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
};

export const loadWallet = async (): Promise<null | Wallet> => {
  const privateKey = await loadPrivateKey();
  if (privateKey === -1 || privateKey === -2) {
    return null;
  }
  if (privateKey) {
    const web3Provider = await getEtherWeb3Provider();
    return new Wallet(privateKey, web3Provider);
  }
  if (Device.isIOS) {
    showWalletErrorAlert();
  }
  return null;
};

export const sendTransaction = async ({
  transaction,
  existingWallet,
}: TransactionRequestParam): Promise<null | Transaction> => {
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
  message: BytesLike | Hexable | number
): Promise<null | string> => {
  try {
    logger.sentry('about to sign message', message);
    const wallet = await loadWallet();
    try {
      if (!wallet) return null;
      const signingKey = new SigningKey(wallet.privateKey);
      const sigParams = await signingKey.signDigest(arrayify(message));
      return joinSignature(sigParams);
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
        typeof message === 'string' && isHexString(message)
          ? arrayify(message)
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

const loadPrivateKey = async (): Promise<
  null | EthereumPrivateKey | -1 | -2
> => {
  try {
    const address = await loadAddress();
    if (!address) {
      return null;
    }

    const privateKeyData = await getPrivateKey(address);
    if (privateKeyData === -1) {
      return privateKeyData;
    }
    const privateKey = get(privateKeyData, 'privateKey', null);

    const noPIN = !(await getExistingPIN());

    if (privateKey && isValidSeed(privateKey) && noPIN) {
      logger.sentry('Got key succesfully');
      return privateKey;
    }

    if (Device.isAndroid && privateKey) {
      const hasBiometricsEnabled = await getSupportedBiometryType();
      // Fallback to custom PIN
      if (!hasBiometricsEnabled) {
        try {
          const userPIN = await authenticateWithPIN();
          if (userPIN) {
            if (isValidSeed(privateKey)) {
              logger.sentry('Got key succesfully with PIN');
              return privateKey;
            }

            const decryptedPrivateKey = await encryptor.decrypt(
              userPIN,
              privateKey
            );
            logger.sentry('Got decrypted key successfully');
            return decryptedPrivateKey;
          }
        } catch (e) {
          return null;
        }
      }
    }
    logger.sentry('No key returned');
    return null;
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
  if (isValidMnemonic(walletSeed)) {
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
            toChecksumAddress(walletAddress) && account.visible
      )
  );

  return wallet;
};

interface SaveSeedAndPrivateKeyParams {
  walletSeed: string;
  privateKey: string;
  walletAddress: string;
  id: string;
}

const saveSeedAndPrivateKey = ({
  walletSeed,
  privateKey,
  walletAddress,
  id,
}: SaveSeedAndPrivateKeyParams) => {
  const saveSeed = saveSeedPhrase(walletSeed, id);
  const savePkey = savePrivateKey(walletAddress, privateKey);

  return Promise.all([saveSeed, savePkey]);
};

const addAccountsWithTxHistory = async (
  root: EthereumHDKey,
  allWallets: AllRainbowWallets,
  userPIN: string,
  addresses: RainbowAccount[]
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
    const nextWallet = new Wallet(
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

    let discoveredAccount: RainbowAccount | undefined;
    let discoveredWalletId: RainbowWallet['id'] | undefined;
    forEach(allWallets, someWallet => {
      const existingAccount = find(
        someWallet.addresses,
        account =>
          toChecksumAddress(account.address) ===
          toChecksumAddress(nextWallet.address)
      );
      if (existingAccount) {
        discoveredAccount = existingAccount as RainbowAccount;
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
      if (discoveredAccount.visible) {
        color = discoveredAccount.color;
        label = discoveredAccount.label ?? '';
      }
      delete allWallets?.[discoveredWalletId];
    }

    if (hasTxHistory) {
      // Save private key
      if (userPIN) {
        // Encrypt with the PIN
        const encryptedPkey = await encryptor.encrypt(
          userPIN,
          nextWallet.privateKey
        );
        if (encryptedPkey) {
          await savePrivateKey(nextWallet.address, encryptedPkey);
        } else {
          logger.sentry('Error encrypting privateKey to save it');
          return null;
        }
      } else {
        await savePrivateKey(nextWallet.address, nextWallet.privateKey);
      }
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
        visible: true,
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
}

export const createOrImportWallet = async ({
  seed,
  color,
  name,
  checkedWallet,
}: CreateImportParams = {}) => {
  const isImported = !!seed;
  logger.sentry('Creating wallet, isImported?', isImported);
  if (!seed) {
    logger.sentry('Generating a new seed phrase');
  }
  const walletSeed = seed || generateMnemonic();

  const addresses: RainbowAccount[] = [];

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

    const id = `wallet_${Date.now()}`;
    logger.sentry('[createWallet] - wallet ID', { id });

    // Android users without biometrics need to secure their keys with a PIN.
    let userPIN = null;
    if (Device.isAndroid) {
      const hasBiometricsEnabled = await getSupportedBiometryType();
      // Fallback to custom PIN
      if (!hasBiometricsEnabled) {
        try {
          userPIN = await getExistingPIN();
          if (!userPIN) {
            userPIN = await authenticateWithPIN();
          }
        } catch (e) {
          return null;
        }
      }
    }

    // No need to check if its's HD wallet, bc only HD is allowed
    const privateKey = addHexPrefix(
      (walletResult as LibWallet).getPrivateKey().toString('hex')
    );

    const seedAndPrivateKeyParams = {
      walletSeed,
      privateKey,
      walletAddress,
      id,
    };

    if (userPIN) {
      const [encryptedSeed, encryptedPkey] = await Promise.all([
        encryptor.encrypt(userPIN, walletSeed),
        encryptor.encrypt(userPIN, privateKey),
      ]);

      if (encryptedSeed && encryptedPkey) {
        seedAndPrivateKeyParams.walletSeed = encryptedSeed;
        seedAndPrivateKeyParams.privateKey = encryptedPkey;
      } else {
        logger.sentry('Error encrypting seed and privateKey to save it');
        return null;
      }
    }
    logger.sentry('[createWallet] - saved seed and private key');

    await saveSeedAndPrivateKey(seedAndPrivateKeyParams);

    // Adds an account
    addresses.push({
      address: walletAddress,
      avatar: null,
      color: color ?? getRandomColor(),
      index: 0,
      label: name || '',
      visible: true,
    });

    // For HDWallet we check to add derived accounts
    if (root && isImported) {
      await addAccountsWithTxHistory(root, allWallets, userPIN, addresses);
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

    allWallets[id] = {
      addresses,
      backedUp: false,
      color: color || 0,
      id,
      imported: isImported,
      name: walletName,
      primary,
      type,
    };

    await setSelectedWallet(allWallets[id]);
    logger.sentry('[createWallet] - setSelectedWallet');

    await saveAllWallets(allWallets);
    logger.sentry('[createWallet] - saveAllWallets');

    if (walletResult && walletAddress) {
      // bip39 are derived from mnemioc
      const createdWallet =
        walletType === WalletLibraryType.bip39 ? new Wallet(privateKey) : null;

      return createdWallet;
    }
    return null;
  } catch (error) {
    logger.sentry('Error in createWallet', error);
    captureException(error);
    return null;
  }
};

export const savePrivateKey = async (
  address: EthereumAddress,
  privateKey: null | EthereumPrivateKey
) => {
  const privateAccessControlOptions = await keychain.getPrivateAccessControlOptions();

  const key = `${address}_${privateKeyKey}`;
  const val = {
    address,
    privateKey,
    version: privateKeyVersion,
  };

  await keychain.saveObject(key, val, privateAccessControlOptions);
};

export const getPrivateKey = async (
  address: EthereumAddress
): Promise<null | PrivateKeyData | -1> => {
  try {
    const key = `${address}_${privateKeyKey}`;
    const pkey = (await keychain.loadObject(key, {
      authenticationPrompt,
    })) as PrivateKeyData | -2;

    if (pkey === -2) {
      Alert.alert(
        'Error',
        'Your current authentication method (Face Recognition) is not secure enough, please go to "Settings > Biometrics & Security" and enable an alternative biometric method like Fingerprint or Iris.'
      );
      return null;
    }

    return pkey || null;
  } catch (error) {
    logger.sentry('Error in getPrivateKey');
    captureException(error);
    return null;
  }
};

export const saveSeedPhrase = async (
  seedphrase: EthereumWalletSeed,
  keychain_id: RainbowWallet['id']
): Promise<void> => {
  const privateAccessControlOptions = await keychain.getPrivateAccessControlOptions();
  const key = `${keychain_id}_${seedPhraseKey}`;
  const val = {
    id: keychain_id,
    seedphrase,
    version: seedPhraseVersion,
  };

  return keychain.saveObject(key, val, privateAccessControlOptions);
};

// use only inside wallet model
const getSeedPhrase = async (
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
    logger.sentry('Error in getSeedPhrase');
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
): Promise<null | Wallet> => {
  try {
    let userPIN = null;
    if (Device.isAndroid) {
      const hasBiometricsEnabled = await getSupportedBiometryType();
      // Fallback to custom PIN
      if (!hasBiometricsEnabled) {
        try {
          userPIN = await authenticateWithPIN();
        } catch (e) {
          return null;
        }
      }
    }

    const seedData = await getSeedPhrase(id);
    let seedphrase = seedData?.seedphrase;

    if (userPIN) {
      try {
        const decryptedSeedPhrase = await encryptor.decrypt(
          userPIN,
          seedphrase
        );
        if (decryptedSeedPhrase) {
          seedphrase = decryptedSeedPhrase;
        } else {
          throw new Error(`Can't access seed phrase to create new accounts`);
        }
      } catch (e) {
        return null;
      }
    }

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

    const newAccount = new Wallet(walletPkey);
    // Android users without biometrics need to secure their keys with a PIN
    if (userPIN) {
      try {
        const encryptedPkey = await encryptor.encrypt(userPIN, walletPkey);
        if (encryptedPkey) {
          await savePrivateKey(walletAddress, encryptedPkey);
        } else {
          logger.sentry('Error encrypting pkey to save it');
          return null;
        }
      } catch (e) {
        return null;
      }
    } else {
      await savePrivateKey(walletAddress, walletPkey);
    }

    return newAccount;
  } catch (error) {
    logger.sentry('Error generating account for keychain', id);
    captureException(error);
    return null;
  }
};

export const cleanUpWalletKeys = async (): Promise<boolean> => {
  const keys = [addressKey, allWalletsKey, pinKey, selectedWalletKey];

  try {
    await Promise.all(
      keys.map(key => {
        try {
          keychain.remove(key);
        } catch (e) {
          // key might not exists
          logger.log('failure to delete key', key);
        }
        return true;
      })
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const loadSeedPhrase = async (
  id: RainbowWallet['id'],
  promptMessage?: string | AuthenticationPrompt
): Promise<null | EthereumWalletSeed> => {
  try {
    const seedData = await getSeedPhrase(id, promptMessage);

    const seedPhrase = get(seedData, 'seedphrase', null);
    const noPIN = !(await getExistingPIN());

    if (seedPhrase && isValidSeed(seedPhrase) && noPIN) {
      logger.sentry('Got seed succesfully');
      return seedPhrase;
    }

    if (Device.isAndroid && seedPhrase) {
      try {
        const userPIN = await authenticateWithPIN(promptMessage);
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
    logger.sentry('Error in loadSeedPhrase.');
    captureException(error);
    return null;
  }
};
