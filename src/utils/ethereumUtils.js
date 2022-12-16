import {
  fromWei,
  getConstantByNetwork,
  greaterThan,
  isZero,
  subtract,
} from '@cardstack/cardpay-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureException } from '@sentry/react-native';

import { mnemonicToSeed } from 'bip39';
import {
  addHexPrefix,
  isValidAddress,
  toChecksumAddress,
} from 'ethereumjs-util';
import { hdkey } from 'ethereumjs-wallet';
import { Wallet } from 'ethers';
import {
  find,
  get,
  isEmpty,
  isString,
  matchesProperty,
  replace,
  toLower,
} from 'lodash';
import { Linking, NativeModules } from 'react-native';
import { ETHERSCAN_API_KEY } from 'react-native-dotenv';
import URL from 'url-parse';

import { NetworkType } from '@cardstack/types';
import { isNativeToken, normalizeTxHash } from '@cardstack/utils';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import { DEFAULT_HD_PATH, WalletLibraryType } from '@rainbow-me/model/wallet';
import store from '@rainbow-me/redux/store';

import logger from 'logger';

const { RNBip39 } = NativeModules;

const getBalanceAmount = async (selectedGasPrice, selected) => {
  const network = store.getState().settings.network;
  let amount = get(selected, 'balance.amount', 0);
  if (isNativeToken(selected?.symbol, network)) {
    if (!isEmpty(selectedGasPrice)) {
      const txFeeRaw = get(selectedGasPrice, 'value.amount');
      const txFeeAmount = fromWei(txFeeRaw);
      const remaining = subtract(amount, txFeeAmount);
      amount = greaterThan(remaining, 0) ? remaining : '0';
    }
  }
  return amount;
};

const getHash = txn => txn.hash.split('-').shift();

const getAsset = (assets, address) =>
  find(assets, matchesProperty('address', toLower(address)));

const getNativeTokenAsset = assets => {
  const { network } = store.getState().settings;
  const nativeTokenAddress = getConstantByNetwork(
    'nativeTokenAddress',
    network
  );
  return getAsset(assets, nativeTokenAddress);
};

export const checkWalletEthZero = assets => {
  const ethAsset = find(assets, asset => asset.address === 'eth');
  let amount = get(ethAsset, 'balance.amount', 0);
  return isZero(amount);
};

/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */
const removeHexPrefix = hex => replace(toLower(hex), '0x', '');

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
const padLeft = (n, width, z = '0') => {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc get ethereum contract call data string
 * @param  {String} func
 * @param  {Array}  arrVals
 * @return {String}
 */
const getDataString = (func, arrVals) => {
  let val = '';
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64);
  const data = func + val;
  return data;
};

/**
 * @desc get etherscan host from network string
 * @param  {String} network
 */
function getEtherscanHostForNetwork() {
  const { network } = store.getState().settings;
  const base_host = 'etherscan.io';
  if (network === NetworkType.mainnet) {
    return base_host;
  } else {
    return `${network}.${base_host}`;
  }
}

/**
 * @desc Checks if a string is a valid ethereum address
 * @param  {String} str
 * @return {Boolean}
 */
const isEthAddress = str => {
  const withHexPrefix = addHexPrefix(str);
  return isValidAddress(withHexPrefix);
};

const fetchTxWithAlwaysCache = async address => {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&tag=oldest&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`;
  const cachedTxTime = await AsyncStorage.getItem(`first-tx-${address}`);
  if (cachedTxTime) {
    return cachedTxTime;
  }
  const response = await fetch(url);
  const parsedResponse = await response.json();
  const txTime = parsedResponse.result[0].timeStamp;
  AsyncStorage.setItem(`first-tx-${address}`, txTime);
  return txTime;
};

export const daysFromTheFirstTx = address => {
  return new Promise(async resolve => {
    try {
      if (address === 'eth') {
        resolve(1000);
        return;
      }
      const txTime = await fetchTxWithAlwaysCache(address);
      const daysFrom = Math.floor((Date.now() / 1000 - txTime) / 60 / 60 / 24);
      resolve(daysFrom);
    } catch (e) {
      resolve(1000);
    }
  });
};
/**
 * @desc Checks if a an address has previous transactions
 * @param  {String} address
 * @return {Promise<Boolean>}
 */
const hasPreviousTransactions = address => {
  return new Promise(async resolve => {
    try {
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&tag=latest&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`;
      const response = await fetch(url);
      const parsedResponse = await response.json();
      // Timeout needed to avoid the 5 requests / second rate limit of etherscan API
      setTimeout(() => {
        if (parsedResponse.status !== '0' && parsedResponse.result.length > 0) {
          resolve(true);
        }
        resolve(false);
      }, 260);
    } catch (e) {
      resolve(false);
    }
  });
};

const checkIfUrlIsAScam = async url => {
  try {
    const request = await fetch('https://api.cryptoscamdb.org/v1/scams');
    const { result } = await request.json();
    const { hostname } = new URL(url);
    const found = result.find(s => toLower(s.name) === toLower(hostname));
    if (found) {
      return true;
    }
    return false;
  } catch (e) {
    logger.sentry('Error fetching cryptoscamdb.org list');
    captureException(e);
  }
};

const deriveAccountFromMnemonic = async (mnemonic, index = 0) => {
  let seed;
  if (ios) {
    seed = await mnemonicToSeed(mnemonic);
  } else {
    const res = await RNBip39.mnemonicToSeed({ mnemonic, passphrase: null });
    seed = new Buffer(res, 'base64');
  }
  const hdWallet = hdkey.fromMasterSeed(seed);
  const root = hdWallet.derivePath(DEFAULT_HD_PATH);
  const child = root.deriveChild(index);
  const wallet = child.getWallet();
  return {
    address: toChecksumAddress(wallet.getAddress().toString('hex')),
    isHDWallet: true,
    root,
    type: WalletTypes.mnemonic,
    wallet,
    walletType: WalletLibraryType.bip39,
  };
};

const deriveAccountFromPrivateKey = privateKey => {
  const ethersWallet = new Wallet(addHexPrefix(privateKey));
  return {
    address: ethersWallet.address,
    isHDWallet: false,
    root: null,
    type: WalletTypes.privateKey,
    wallet: ethersWallet,
    walletType: WalletLibraryType.ethers,
  };
};

const deriveAccountFromWalletInput = input => {
  // We only allow mnemonic derived account for now.
  return deriveAccountFromMnemonic(input);
};

function openTokenEtherscanURL(address) {
  if (!isString(address)) return;
  const etherscanHost = getEtherscanHostForNetwork();
  Linking.openURL(`https://${etherscanHost}/token/${address}`);
}

function openTransactionEtherscanURL(hash) {
  if (!isString(hash)) return;
  const etherscanHost = getEtherscanHostForNetwork();
  const normalizedHash = normalizeTxHash(hash);
  Linking.openURL(`https://${etherscanHost}/tx/${normalizedHash}`);
}

export default {
  checkIfUrlIsAScam,
  deriveAccountFromMnemonic,
  deriveAccountFromPrivateKey,
  deriveAccountFromWalletInput,
  getAsset,
  getBalanceAmount,
  getDataString,
  getHash,
  getNativeTokenAsset,
  hasPreviousTransactions,
  isEthAddress,
  openTokenEtherscanURL,
  openTransactionEtherscanURL,
  padLeft,
  removeHexPrefix,
};
