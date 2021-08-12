import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from './base-strategy';
import {
  DepotBridgedLayer2TransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';

export class BridgeToLayer2EventStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { bridgeToLayer2Events } = this.transaction;

    if (bridgeToLayer2Events?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<DepotBridgedLayer2TransactionType | null> {
    const bridgeToLayer2Events = this.transaction.bridgeToLayer2Events?.[0];

    if (!bridgeToLayer2Events) {
      return null;
    }

    const nativeBalance = await getNativeBalance({
      symbol: bridgeToLayer2Events.token.symbol,
      balance: bridgeToLayer2Events.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      balance: convertRawAmountToBalance(bridgeToLayer2Events.amount, {
        decimals: 18,
        symbol: bridgeToLayer2Events.token.symbol || undefined,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      transactionHash: this.transaction.id,
      to: bridgeToLayer2Events.depot.id,
      token: {
        address: bridgeToLayer2Events.token.id,
        symbol: bridgeToLayer2Events.token.symbol,
        name: bridgeToLayer2Events.token.name,
      },
      timestamp: bridgeToLayer2Events.timestamp,
      type: TransactionTypes.DEPOT_BRIDGED_LAYER_2,
    };
  }
}
