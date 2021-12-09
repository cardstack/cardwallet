import { ERC20ABI } from '@cardstack/cardpay-sdk';
import { ActionDispatcherDecodedData } from './../types/transaction-confirmation-types';
import {
  Level1DecodedData,
  TokenData,
  TransactionConfirmationData,
} from '@cardstack/types';
import { getSafeData } from '@cardstack/services';
import Web3Instance from '@cardstack/models/web3-instance';

interface BaseStrategyParams {
  message: {
    to?: string;
    data?: string;
  };
  verifyingContract?: string;
  primaryType: string | number;
  network: string;
  nativeCurrency: string;
}

export abstract class BaseStrategy {
  protected abstract isApplicable(): boolean;
  abstract decodeRequest():
    | Promise<TransactionConfirmationData>
    | TransactionConfirmationData;

  message: {
    to?: string;
    data?: string;
  };
  verifyingContract?: string;
  primaryType: string | number;
  network: string;
  nativeCurrency: string;

  constructor({
    message,
    verifyingContract,
    primaryType,
    network,
    nativeCurrency,
  }: BaseStrategyParams) {
    this.message = message;
    this.verifyingContract = verifyingContract;
    this.primaryType = primaryType;
    this.network = network;
    this.nativeCurrency = nativeCurrency;
  }

  getTokenData = async (tokenAddress: string): Promise<TokenData> => {
    const web3 = await Web3Instance.get();
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
    return getSafeData(address);
  };

  shouldDecodeRequest() {
    return this.isApplicable();
  }
}

interface BaseStrategyWithLevel1DataParams extends BaseStrategyParams {
  level1Data: Level1DecodedData | null;
}

export abstract class BaseStrategyWithLevel1Data extends BaseStrategy {
  private _level1Data: Level1DecodedData | null;

  constructor(props: BaseStrategyWithLevel1DataParams) {
    super(props);

    this._level1Data = props.level1Data;
  }

  get level1Data() {
    if (!this._level1Data) {
      throw new Error('Level 1 data should exist.');
    }

    return this._level1Data;
  }

  shouldDecodeRequest() {
    if (!this._level1Data) {
      return false;
    }

    return super.shouldDecodeRequest();
  }
}

interface BaseStrategyWithActionDispatcherDataParams
  extends BaseStrategyWithLevel1DataParams {
  actionDispatcherData: ActionDispatcherDecodedData | null;
}

export abstract class BaseStrategyWithActionDispatcherData extends BaseStrategyWithLevel1Data {
  private _actionDispatcherData: ActionDispatcherDecodedData | null;

  constructor(props: BaseStrategyWithActionDispatcherDataParams) {
    super(props);

    this._actionDispatcherData = props.actionDispatcherData;
  }

  get actionDispatcherData() {
    if (!this._actionDispatcherData) {
      throw new Error('Action dispatcher data should exist.');
    }

    return this._actionDispatcherData;
  }

  shouldDecodeRequest() {
    if (!this._actionDispatcherData) {
      return false;
    }

    return super.shouldDecodeRequest();
  }
}
