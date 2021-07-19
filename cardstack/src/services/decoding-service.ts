import { ERC20ABI, getAddressByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { fetchHistoricalPrice } from './historical-pricing-service';
import {
  ActionDispatcherDecodedData,
  ClaimRevenueDecodedData,
  PayMerchantDecodedData,
  RegisterMerchantDecodedData,
  SplitPrepaidCardDecodedData,
  IssuePrepaidCardDecodedData,
  Level1DecodedData,
  TokenData,
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';

import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

const TRANSFER_PREFIX = '0xe318b52b';

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
  const decodedPrepaidCardData = decode<{
    owner: string;
    issuingTokenAmounts: string[];
    spendAmounts: string[];
    customizationDID: string;
  }>(
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
    ...level1Data,
    ...decodedPrepaidCardData,
    token: tokenData,
    type: TransactionConfirmationType.ISSUE_PREPAID_CARD,
  };
};

const decodeActionDispatcherData = (
  level1Data: Level1DecodedData
): ActionDispatcherDecodedData => {
  const decodedActionDispatcherData = decode<ActionDispatcherDecodedData>(
    [
      { type: 'uint256', name: 'spendAmount' },
      { type: 'uint256', name: 'requestedRate' },
      { type: 'string', name: 'actionName' },
      { type: 'bytes', name: 'actionData' },
    ],
    level1Data.data
  );

  return decodedActionDispatcherData;
};

const decodeRegisterMerchantData = (
  actionDispatcherData: ActionDispatcherDecodedData,
  verifyingContract: string
): RegisterMerchantDecodedData => {
  const { infoDID } = decode<{ infoDID: string }>(
    [
      {
        type: 'string',
        name: 'infoDID',
      },
    ],
    actionDispatcherData.actionData
  );

  return {
    spendAmount: actionDispatcherData.spendAmount,
    infoDID,
    prepaidCard: verifyingContract,
    type: TransactionConfirmationType.REGISTER_MERCHANT,
  };
};

const decodePayMerchantData = (
  actionDispatcherData: ActionDispatcherDecodedData,
  verifyingContract: string
): PayMerchantDecodedData => {
  const { merchantSafe } = decode<{ merchantSafe: string }>(
    [
      {
        type: 'address',
        name: 'merchantSafe',
      },
    ],
    actionDispatcherData.actionData
  );

  return {
    spendAmount: actionDispatcherData.spendAmount,
    merchantSafe,
    prepaidCard: verifyingContract,
    type: TransactionConfirmationType.PAY_MERCHANT,
  };
};

const decodeSplitPrepaidCardData = async (
  actionDispatcherData: ActionDispatcherDecodedData,
  verifyingContract: string,
  tokenAddress: string
): Promise<SplitPrepaidCardDecodedData> => {
  const { issuingTokenAmounts, spendAmounts, customizationDID } = decode<{
    issuingTokenAmounts: string[];
    spendAmounts: string[];
    customizationDID: string;
  }>(
    [
      { type: 'uint256[]', name: 'issuingTokenAmounts' },
      { type: 'uint256[]', name: 'spendAmounts' },
      { type: 'string', name: 'customizationDID' },
    ],
    actionDispatcherData.actionData
  );

  const tokenData = await getTokenData(tokenAddress);

  return {
    customizationDID,
    issuingTokenAmounts,
    spendAmounts,
    prepaidCard: verifyingContract,
    token: tokenData,
    type: TransactionConfirmationType.SPLIT_PREPAID_CARD,
  };
};

const decodeTransferPrepaidCard1Data = (
  messageData: string,
  verifyingContract: string
): TransferPrepaidCard1DecodedData => {
  const data = messageData.slice(10);

  const { newOwner, oldOwner } = decode<{
    newOwner: string;
    oldOwner: string;
    prepaidCard: string;
  }>(
    [
      { type: 'address', name: 'prepaidCard' },
      { type: 'address', name: 'oldOwner' },
      { type: 'address', name: 'newOwner' },
    ],
    data
  );

  return {
    newOwner,
    oldOwner,
    prepaidCard: verifyingContract,
    type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_1,
  };
};

const decodeTransferPrepaidCard2Data = (
  actionDispatcherData: ActionDispatcherDecodedData,
  verifyingContract: string
): TransferPrepaidCard2DecodedData => {
  const { newOwner } = decode<{
    newOwner: string;
    signature: string;
  }>(
    [
      { type: 'address', name: 'newOwner' },
      { type: 'bytes', name: 'signature' },
    ],
    actionDispatcherData.actionData
  );

  return {
    newOwner,
    prepaidCard: verifyingContract,
    type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_2,
  };
};

const decodeClaimRevenueData = async (
  messageData: string,
  verifyingContract: string,
  nativeCurrency: string
): Promise<ClaimRevenueDecodedData> => {
  const data = messageData.slice(10);

  const { amount, tokenAddress } = decode<{
    tokenAddress: string;
    amount: string;
  }>(
    [
      { type: 'address', name: 'tokenAddress' },
      { type: 'uint256', name: 'amount' },
    ],
    data
  );

  const tokenData = await getTokenData(tokenAddress);
  const currentTimestamp = Date.now();

  const price = await fetchHistoricalPrice(
    tokenData.symbol,
    currentTimestamp,
    nativeCurrency
  );

  return {
    amount,
    tokenAddress,
    merchantSafe: verifyingContract,
    price,
    token: tokenData,
    type: TransactionConfirmationType.CLAIM_REVENUE,
  };
};

const isIssuePrepaidCard = (level1Data: Level1DecodedData, network: string) => {
  const prepaidCardManager = getAddressByNetwork('prepaidCardManager', network);

  return level1Data.to === prepaidCardManager;
};

const isActionDispatcher = (level1Data: Level1DecodedData, network: string) => {
  const actionDispatcher = getAddressByNetwork('actionDispatcher', network);

  return level1Data.to === actionDispatcher;
};

const isRegisterMerchant = (
  actionDispatcherData: ActionDispatcherDecodedData
) => {
  return actionDispatcherData.actionName === 'registerMerchant';
};

const isPayMerchant = (actionDispatcherData: ActionDispatcherDecodedData) => {
  return actionDispatcherData.actionName === 'payMerchant';
};

const isSplitPrepaidCard = (
  actionDispatcherData: ActionDispatcherDecodedData
) => {
  return actionDispatcherData.actionName === 'split';
};

const isTransferPrepaidCard2 = (
  actionDispatcherData: ActionDispatcherDecodedData
) => {
  return actionDispatcherData.actionName === 'transfer';
};

const isClaimRevenue = (toAddress: string, network: string) => {
  const revenuePool = getAddressByNetwork('revenuePool', network);

  return toAddress === revenuePool;
};

const isTransferPrepaidCard1 = (messageData: string) =>
  messageData.slice(0, 10) === TRANSFER_PREFIX;

export const decodeData = async (
  message: {
    to: string;
    data: string;
  },
  verifyingContract: string,
  network: string,
  nativeCurrency: string
): Promise<TransactionConfirmationData> => {
  if (isClaimRevenue(message.to, network)) {
    return decodeClaimRevenueData(
      message.data,
      verifyingContract,
      nativeCurrency
    );
  } else if (isTransferPrepaidCard1(message.data)) {
    return decodeTransferPrepaidCard1Data(message.data, verifyingContract);
  } else {
    const level1Data = decodeLevel1Data(message.data);

    if (isIssuePrepaidCard(level1Data, network)) {
      return decodeIssuePrepaidCardData(level1Data, message.to);
    } else if (isActionDispatcher(level1Data, network)) {
      const actionDispatcherDecodedData = decodeActionDispatcherData(
        level1Data
      );

      if (isRegisterMerchant(actionDispatcherDecodedData)) {
        return decodeRegisterMerchantData(
          actionDispatcherDecodedData,
          verifyingContract
        );
      } else if (isPayMerchant(actionDispatcherDecodedData)) {
        return decodePayMerchantData(
          actionDispatcherDecodedData,
          verifyingContract
        );
      } else if (isSplitPrepaidCard(actionDispatcherDecodedData)) {
        return decodeSplitPrepaidCardData(
          actionDispatcherDecodedData,
          verifyingContract,
          message.to
        );
      } else if (isTransferPrepaidCard2(actionDispatcherDecodedData)) {
        return decodeTransferPrepaidCard2Data(
          actionDispatcherDecodedData,
          verifyingContract
        );
      }
    }
  }

  return {
    type: TransactionConfirmationType.GENERIC,
  };
};
