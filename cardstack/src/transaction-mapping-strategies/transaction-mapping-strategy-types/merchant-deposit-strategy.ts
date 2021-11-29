import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import { MerchantDepositType, TransactionTypes } from '@cardstack/types';
import { fetchHistoricalPrice } from '@cardstack/services';

export class MerchantDepositStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { merchantDeposit } = this.transaction;

    if (merchantDeposit) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantDepositType | null> {
    const merchantDeposit = this.transaction.merchantDeposit;

    if (!merchantDeposit) {
      return null;
    }

    const symbol = merchantDeposit.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      merchantDeposit.timestamp,
      this.nativeCurrency
    );

    return {
      address: merchantDeposit.merchantSafe?.id || '',
      createdAt: merchantDeposit.timestamp,
      balance: convertRawAmountToBalance(merchantDeposit.amount, {
        decimals: 18,
        symbol,
      }),
      type: TransactionTypes.MERCHANT_DEPOSIT,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      native: convertRawAmountToNativeDisplay(
        merchantDeposit.amount,
        18,
        price,
        this.nativeCurrency
      ),
      transactionHash: this.transaction.id,
      infoDid: merchantDeposit.merchantSafe?.infoDid || undefined,
      from: merchantDeposit.from,
      token: merchantDeposit.token,
    };
  }
}
