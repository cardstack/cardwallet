import { ERC20ABI, getAddressByNetwork } from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import {
  ActionDispatcherDecodedData,
  RegisterMerchantDecodedData,
} from './../types/decoded-data-types';
import {
  DecodedData,
  IssuePrepaidCardDecodedData,
  Level1DecodedData,
  TokenData,
  TransactionConfirmationType,
} from '@cardstack/types';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

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
    type: 'issuePrepaidCard',
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
  actionDispatcherData: ActionDispatcherDecodedData
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
    type: 'registerMerchant',
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

const isTransferPrepaidCard = (
  actionDispatcherData: ActionDispatcherDecodedData
) => {
  return actionDispatcherData.actionName === 'transfer';
};

const isClaimRevenue = (level1Data: Level1DecodedData, network: string) => {
  const revenuePool = getAddressByNetwork('revenuePool', network);

  return level1Data.to === revenuePool;
};

interface DecodeDataReturn {
  type: TransactionConfirmationType;
  decodedData: DecodedData;
}

export const decodeData = async (
  message: {
    to: string;
    data: string;
  },
  network: string
): Promise<DecodeDataReturn> => {
  const level1Data = decodeLevel1Data(message.data);

  if (isIssuePrepaidCard(level1Data, network)) {
    const decodedData = await decodeIssuePrepaidCardData(
      level1Data,
      message.to
    );

    return {
      decodedData,
      type: TransactionConfirmationType.ISSUE_PREPAID_CARD,
    };
  } else if (isActionDispatcher(level1Data, network)) {
    const actionDispatcherDecodedData = decodeActionDispatcherData(level1Data);

    if (isRegisterMerchant(actionDispatcherDecodedData)) {
      const decodedData = decodeRegisterMerchantData(
        actionDispatcherDecodedData
      );

      return {
        decodedData,
        type: TransactionConfirmationType.REGISTER_MERCHANT,
      };
    } else if (isPayMerchant(actionDispatcherDecodedData)) {
      return {
        decodedData: null, // TODO
        type: TransactionConfirmationType.REGISTER_MERCHANT,
      };
    } else if (isSplitPrepaidCard(actionDispatcherDecodedData)) {
      return {
        decodedData: null, // TODO
        type: TransactionConfirmationType.SPLIT_PREPAID_CARD,
      };
    } else if (isTransferPrepaidCard(actionDispatcherDecodedData)) {
      return {
        decodedData: null, // TODO
        type: TransactionConfirmationType.TRANSFER_PREPAID_CARD,
      };
    }
  } else if (isClaimRevenue(level1Data, network)) {
    return {
      decodedData: null,
      type: TransactionConfirmationType.CLAIM_REVENUE,
    };
  }

  return {
    type: TransactionConfirmationType.DEFAULT,
    decodedData: null,
  };
};
