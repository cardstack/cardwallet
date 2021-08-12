import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { BaseStrategyWithLevel1Data } from './base-strategy';
import {
  TransactionConfirmationType,
  WithdrawalDecodedData,
} from '@cardstack/types';
import { fetchHistoricalPrice } from '@cardstack/services';

export class WithdrawalStrategy extends BaseStrategyWithLevel1Data {
  isApplicable(): boolean {
    const homeBridgeContract = getAddressByNetwork('homeBridge', this.network);

    return this.level1Data.to === homeBridgeContract;
  }

  public async decodeRequest(): Promise<WithdrawalDecodedData> {
    const tokenAddress = this.message.to;

    const [safeData, tokenData] = await Promise.all([
      this.getSafeData(this.verifyingContract),
      this.getTokenData(tokenAddress),
    ]);

    const balance =
      safeData?.tokens.find(token => token.tokenAddress === tokenAddress)
        ?.balance || '0';

    const currentTimestamp = Date.now();

    const price = await fetchHistoricalPrice(
      tokenData.symbol,
      currentTimestamp,
      this.nativeCurrency
    );

    return {
      amount: this.level1Data.amount,
      layer1Recipient: this.level1Data.data,
      address: safeData?.address || '',
      addressType: safeData?.type || 'depot',
      tokenBalance: balance,
      price,
      token: tokenData,
      type: TransactionConfirmationType.WITHDRAWAL,
    };
  }
}
