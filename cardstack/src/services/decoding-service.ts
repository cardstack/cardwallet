import { ERC20ABI, getAddressByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { TransactionConfirmationType } from '@cardstack/types';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

export interface Level1DecodedData {
  amount: string;
  data: string;
  to: string;
}

interface TokenData {
  symbol: string;
  decimals: number;
}

export interface IssuePrepaidCardDecodedData {
  amount: string;
  to: string;
  issuingTokenAmounts: string[];
  owner: string;
  spendAmounts: string[];
  customizationDID: string;
  token: TokenData;
}

const decode = <T>(params: object[], data: string): T => {
  const web3 = new Web3(web3ProviderSdk as any);
  const result = web3.eth.abi.decodeParameters(params, data) as T;

  return result;
};

export const decodeLevel1Data = (messageData: string): Level1DecodedData => {
  const data = messageData.slice(10);

  const decodedData = decode<Level1DecodedData>(
    [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
      { type: 'bytes', name: 'data' },
    ],
    data
  );

  return decodedData;
};

const getTokenData = async (tokenAddress: string): Promise<TokenData> => {
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

const decodeIssuePrepaidCardData = async (
  level1Data: Level1DecodedData,
  tokenAddress: string
): Promise<IssuePrepaidCardDecodedData> => {
  const decodedPrepaidCardData = decode<IssuePrepaidCardDecodedData>(
    [
      { type: 'address', name: 'owner' },
      { type: 'uint256[]', name: 'issuingTokenAmounts' },
      { type: 'uint256[]', name: 'spendAmounts' },
      { type: 'string', name: 'customizationDID' },
    ],
    level1Data.data
  );

  const tokenData = await getTokenData(tokenAddress);

  return {
    amount: level1Data.amount,
    to: level1Data.to,
    issuingTokenAmounts: decodedPrepaidCardData.issuingTokenAmounts,
    owner: decodedPrepaidCardData.owner,
    spendAmounts: decodedPrepaidCardData.spendAmounts,
    customizationDID: decodedPrepaidCardData.customizationDID,
    token: tokenData,
  };
};

export type DecodedData = IssuePrepaidCardDecodedData | null;

export const decodeData = async (
  message: {
    to: string;
    data: string;
  },
  network: string
): Promise<{
  type: TransactionConfirmationType;
  decodedData: DecodedData;
}> => {
  const level1Data = decodeLevel1Data(message.data);
  const prepaidCardManager = getAddressByNetwork('prepaidCardManager', network);

  if (level1Data.to === prepaidCardManager) {
    const decodedData = await decodeIssuePrepaidCardData(
      level1Data,
      message.to
    );

    return {
      decodedData,
      type: TransactionConfirmationType.ISSUE_PREPAID_CARD,
    };
  }

  return {
    type: TransactionConfirmationType.DEFAULT,
    decodedData: null,
  };
};
