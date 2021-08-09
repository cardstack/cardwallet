import { Wallet } from '@ethersproject/wallet';
import { generateMnemonic } from 'bip39';
import { default as LibWallet } from 'ethereumjs-wallet';
import { RAINBOW_MASTER_KEY } from 'react-native-dotenv';
import { loadString, saveString } from '../model/keychain';
import { loadWallet, publicAccessControlOptions } from '../model/wallet';
import {
  signingWalletAddress,
  signingWallet as signingWalletKeychain,
} from '../utils/keychainConstants';
import { EthereumAddress } from '@rainbow-me/entities';
import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import { addHexPrefix } from '@rainbow-me/handlers/web3';
import { ethereumUtils, logger } from '@rainbow-me/utils';

const encryptor = new AesEncryptor();

export async function getPublicKeyOfTheSigningWallet(): Promise<EthereumAddress> {
  const alreadyExistingWallet = await loadString(signingWalletAddress);
  if (typeof alreadyExistingWallet === 'string') {
    logger.log('Signing wallet already existing');
    return alreadyExistingWallet;
  }

  const walletSeed = generateMnemonic();
  const { wallet, address } = await ethereumUtils.deriveAccountFromWalletInput(
    walletSeed
  );

  const privateKey = addHexPrefix(
    (wallet as LibWallet).getPrivateKey().toString('hex')
  );

  const encryptedPrivateKey = (await encryptor.encrypt(
    RAINBOW_MASTER_KEY,
    privateKey
  )) as string;

  await saveString(
    signingWalletKeychain,
    encryptedPrivateKey,
    publicAccessControlOptions
  );

  await saveString(signingWalletAddress, address, publicAccessControlOptions);
  return address;
}

export async function createSignature(
  address: EthereumAddress,
  privateKey: string | null = null
) {
  logger.log('Creating a signature');
  const publicKeyForTheSigningWallet = await getPublicKeyOfTheSigningWallet();

  const mainWallet = privateKey
    ? new Wallet(privateKey)
    : await loadWallet(address, false);
  if (mainWallet) {
    const signatureForSigningWallet = await mainWallet.signMessage(
      publicKeyForTheSigningWallet
    );

    const encryptedSignature = (await encryptor.encrypt(
      RAINBOW_MASTER_KEY,
      signatureForSigningWallet
    )) as string;

    await saveString(
      `signature_${address}`,
      encryptedSignature,
      publicAccessControlOptions
    );
    logger.log('Saved a new signature for signing wallet.');

    return signatureForSigningWallet;
  }
  return undefined;
}
