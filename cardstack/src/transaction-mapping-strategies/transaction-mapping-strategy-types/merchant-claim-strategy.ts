import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
  fromWei,
  subtract,
  getAddress,
} from '@cardstack/cardpay-sdk';
import Web3 from 'web3';
import { BaseStrategy } from '../base-strategy';
import { MerchantClaimType, TransactionTypes } from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';
import { getWeb3ProviderSdk } from '@rainbow-me/handlers/web3';

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

    const web3 = new Web3(await getWeb3ProviderSdk());
    const transactions = merchantClaimTransaction.transaction?.tokenTransfers;
    const address = await getAddress('relay', web3);

    // find the GAS item by address
    const gasData = transactions?.find(item =>
      item?.toTokenHolder?.id?.includes(address)
    );

    const txnData = transactions?.find(
      item => !item?.toTokenHolder?.id?.includes(address)
    );

    const grossRawAmount = txnData?.amount || '0';
    const gasRawAmount = gasData?.amount || '0';

    const gasFormatted = fromWei(gasRawAmount);

    const grossFormattedValue = convertRawAmountToBalance(grossRawAmount, {
      decimals: 18,
      symbol: merchantClaimTransaction.token.symbol || undefined,
    });

    const gasFormattedValue = convertRawAmountToBalance(gasRawAmount, {
      decimals: 18,
      symbol: merchantClaimTransaction.token.symbol || undefined,
    });

    const gasUSD = convertAmountToNativeDisplay(
      gasFormatted,
      this.nativeCurrency
    );

    const netFormattedValue = convertRawAmountToBalance(
      subtract(gasRawAmount, grossRawAmount),
      {
        decimals: 18,
        symbol: merchantClaimTransaction.token.symbol || undefined,
      }
    );

    const nativeBalance = await getNativeBalance({
      symbol: merchantClaimTransaction.token.symbol,
      balance: merchantClaimTransaction.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      address: merchantClaimTransaction.id,
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
      transaction: {
        grossClaimed: grossFormattedValue.display,
        gasFee: gasFormattedValue.display,
        gasUsdFee: gasUSD,
        netClaimed: netFormattedValue.display,
      },
    };
  }
}
