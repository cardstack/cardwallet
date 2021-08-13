import {
  convertAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';
import { BaseStrategy } from '../base-strategy';
import {
  DepotBridgedLayer1TransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getNativeBalance } from '@cardstack/services';

export class BridgeToLayer1EventStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { bridgeToLayer1Events } = this.transaction;

    if (bridgeToLayer1Events?.[0]) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<DepotBridgedLayer1TransactionType | null> {
    const bridgeToLayer1Events = this.transaction.bridgeToLayer1Events?.[0];

    if (!bridgeToLayer1Events) {
      return null;
    }

    const nativeBalance = await getNativeBalance({
      symbol: bridgeToLayer1Events.token.symbol,
      balance: bridgeToLayer1Events.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      balance: convertRawAmountToBalance(bridgeToLayer1Events.amount, {
        decimals: 18,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        symbol: bridgeToLayer1Events.token.symbol,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      transactionHash: this.transaction.id,
      to: bridgeToLayer1Events.account.id,
      token: {
        address: bridgeToLayer1Events.token.id,
        symbol: bridgeToLayer1Events.token.symbol,
        name: bridgeToLayer1Events.token.name,
      },
      timestamp: bridgeToLayer1Events.timestamp,
      type: TransactionTypes.DEPOT_BRIDGED_LAYER_1,
    };
  }
}
