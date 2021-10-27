import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  getAddress,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import { MerchantClaimType, TransactionTypes } from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';
import { getMerchantClaimTransactionDetails } from '@cardstack/utils/merchant-utils';
import Web3Instance from '@cardstack/models/web3-instance';

export class MerchantClaimStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { merchantClaims } = this.transaction;

    if (merchantClaims?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<MerchantClaimType | null> {
    const merchantClaimTransaction = this.transaction.merchantClaims?.[0];

    if (!merchantClaimTransaction) {
      return null;
    }

    const web3 = await Web3Instance.get();
    const address = await getAddress('relay', web3);

    const nativeBalance = await getNativeBalance({
      symbol: merchantClaimTransaction.token.symbol,
      balance: merchantClaimTransaction.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      address: merchantClaimTransaction.merchantSafe.id,
      balance: convertRawAmountToBalance(merchantClaimTransaction.amount, {
        decimals: 18,
        symbol: merchantClaimTransaction.token.symbol || undefined,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      createdAt: merchantClaimTransaction.timestamp,
      transactionHash: this.transaction.id,
      hideSafeHeader: Boolean(this.merchantSafeAddress),
      token: {
        address: merchantClaimTransaction.token.id,
        symbol: merchantClaimTransaction?.token.symbol,
        name: merchantClaimTransaction?.token.name,
      },
      type: TransactionTypes.MERCHANT_CLAIM,
      transaction: await getMerchantClaimTransactionDetails(
        merchantClaimTransaction,
        this.nativeCurrency,
        this.currencyConversionRates,
        address
      ),
      infoDid: merchantClaimTransaction.merchantSafe.infoDid || undefined,
    };
  }
}
