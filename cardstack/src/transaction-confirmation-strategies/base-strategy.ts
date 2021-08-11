import Web3 from 'web3';
import { ERC20ABI } from '@cardstack/cardpay-sdk';
import Safes from '@cardstack/cardpay-sdk/sdk/safes/base';
import { DecodingStrategy } from './base-strategy';
import {
  Level1DecodedData,
  TokenData,
  TransactionConfirmationData,
} from '@cardstack/types';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

interface ConstructorType {
  message: {
    to: string;
    data: string;
  };
  verifyingContract: string;
  primaryType: string;
  network: string;
  nativeCurrency: string;
}

export interface DecodingStrategy {
  isHandler: () => boolean;
  decodeData: () =>
    | Promise<TransactionConfirmationData>
    | TransactionConfirmationData;
}

export class BaseStrategy {
  public message: {
    to: string;
    data: string;
  };
  public verifyingContract: string;
  public primaryType: string;
  public network: string;
  public nativeCurrency: string;
  public level1Data: Level1DecodedData | null;

  constructor({
    message,
    verifyingContract,
    primaryType,
    network,
    nativeCurrency,
  }: ConstructorType) {
    this.message = message;
    this.verifyingContract = verifyingContract;
    this.primaryType = primaryType;
    this.network = network;
    this.nativeCurrency = nativeCurrency;

    const data = message.data.slice(10);

    const decodedData = this.decode<Level1DecodedData>(
      [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'amount' },
        { type: 'bytes', name: 'data' },
      ],
      data
    );

    this.level1Data = decodedData;
  }

  decode = <T>(params: object[], data: string): T | null => {
    const web3 = new Web3(web3ProviderSdk as any);

    try {
      const result = web3.eth.abi.decodeParameters(params, data) as T;

      return result;
    } catch (error) {
      return null;
    }
  };

  getTokenData = async (tokenAddress: string): Promise<TokenData> => {
    const web3 = new Web3(web3ProviderSdk as any);
    const tokenContract = new web3.eth.Contract(ERC20ABI as any, tokenAddress);

    const [symbol, decimals] = await Promise.all([
      tokenContract.methods.symbol().call(),
      tokenContract.methods.decimals().call(),
    ]);

    return {
      symbol,
      decimals,
    };
  };

  getSafeData = async (address: string) => {
    const web3 = new Web3(web3ProviderSdk as any);
    const safes = new Safes(web3);

    return safes.viewSafe(address);
  };
}
