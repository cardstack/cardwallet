import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  DepotBridgedLayer2TransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getNativeBalanceFromOracle } from '@cardstack/services';

export class BridgeToLayer2EventStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { bridgeToLayer2Events } = this.transaction;

    if (bridgeToLayer2Events?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<DepotBridgedLayer2TransactionType | null> {
    const bridgeToLayer2Event = this.transaction.bridgeToLayer2Events?.[0];

    if (!bridgeToLayer2Event) {
      return null;
    }

    const nativeBalance = await getNativeBalanceFromOracle({
      symbol: bridgeToLayer2Event.token.symbol,
      balance: bridgeToLayer2Event.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      balance: convertRawAmountToBalance(bridgeToLayer2Event.amount, {
        decimals: 18,
        symbol: bridgeToLayer2Event.token.symbol || undefined,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      transactionHash: this.transaction.id,
      to: bridgeToLayer2Event.depot.id,
      token: {
        address: bridgeToLayer2Event.token.id,
        symbol: bridgeToLayer2Event.token.symbol,
        name: bridgeToLayer2Event.token.name,
      },
      timestamp: bridgeToLayer2Event.timestamp,
      type: TransactionTypes.DEPOT_BRIDGED_LAYER_2,
    };
  }
}
