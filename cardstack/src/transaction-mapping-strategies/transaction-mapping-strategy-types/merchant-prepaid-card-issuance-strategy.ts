import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  MerchantPrepaidCardIssuanceType,
  TransactionTypes,
} from '@cardstack/types';
import { fetchHistoricalPrice } from '@cardstack/services';

export class MerchantPrepaidCardIssuancetrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { prepaidCardIssuance } = this.transaction;

    if (prepaidCardIssuance) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantPrepaidCardIssuanceType | null> {
    const prepaidCardIssuance = this.transaction.prepaidCardIssuance;

    if (!prepaidCardIssuance) {
      return null;
    }

    const symbol = prepaidCardIssuance.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      prepaidCardIssuance.timestamp,
      this.nativeCurrency
    );

    return {
      address: prepaidCardIssuance.merchantSafe?.id || '',
      createdAt: prepaidCardIssuance.timestamp,
      balance: convertRawAmountToBalance(prepaidCardIssuance.amount, {
        decimals: 18,
        symbol,
      }),
      type: TransactionTypes.MERCHANT_PREPAIDCARD_ISSUANCE,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      native: convertRawAmountToNativeDisplay(
        prepaidCardIssuance.amount,
        18,
        price,
        this.nativeCurrency
      ),
      transactionHash: this.transaction.id,
      infoDid: prepaidCardIssuance.merchantSafe?.infoDid || undefined,
      token: prepaidCardIssuance.token,
    };
  }
}
