import Web3 from 'web3';
import { ERC20ABI } from '@cardstack/cardpay-sdk';
import { web3ProviderSdk } from '@rainbow-me/handlers/web3';

export interface IssuePrepaidCardDecodedData {
  amount: string;
  to: string;
  issuingTokenAmounts: string[];
  owner: string;
  spendAmounts: string[];
  token: {
    symbol: string;
    decimals: number;
  };
}

export const decodeIssuePrepaidCardData = async (
  message: any
): Promise<IssuePrepaidCardDecodedData> => {
  const web3 = new Web3(web3ProviderSdk as any);
  const data = message.data.slice(10);

  const result = web3.eth.abi.decodeParameters(
    [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
      { type: 'bytes', name: 'data' },
    ],
    data
  ) as {
    amount: string;
    data: string;
    to: string;
  };

  const result2 = web3.eth.abi.decodeParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'uint256[]', name: 'issuingTokenAmounts' },
      { type: 'uint256[]', name: 'spendAmounts' },
      { type: 'string', name: 'customizationDID' },
    ],
    result.data
  ) as {
    owner: string;
    issuingTokenAmounts: string[];
    spendAmounts: string[];
    customizationDID: string;
  };

  const tokenContract = new web3.eth.Contract(ERC20ABI as any, message.to);

  const [symbol, decimals] = await Promise.all([
    tokenContract.methods.symbol().call(),
    tokenContract.methods.decimals().call(),
  ]);

  return {
    amount: result.amount,
    to: result.to,
    issuingTokenAmounts: result2.issuingTokenAmounts,
    owner: result2.owner,
    spendAmounts: result2.spendAmounts,
    token: {
      symbol,
      decimals,
    },
  };
};
