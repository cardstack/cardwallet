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
    const bridgeToLayer1Event = this.transaction.bridgeToLayer1Events?.[0];

    if (!bridgeToLayer1Event) {
      return null;
    }

    const nativeBalance = await getNativeBalance({
      symbol: bridgeToLayer1Event.token.symbol,
      balance: bridgeToLayer1Event.amount,
      nativeCurrency: this.nativeCurrency,
      currencyConversionRates: this.currencyConversionRates,
    });

    return {
      balance: convertRawAmountToBalance(bridgeToLayer1Event.amount, {
        decimals: 18,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        symbol: bridgeToLayer1Event.token.symbol,
      }),
      native: {
        amount: nativeBalance.toString(),
        display: convertAmountToNativeDisplay(
          nativeBalance,
          this.nativeCurrency
        ),
      },
      transactionHash: this.transaction.id,
      to: bridgeToLayer1Event.account.id,
      token: {
        address: bridgeToLayer1Event.token.id,
        symbol: bridgeToLayer1Event.token.symbol,
        name: bridgeToLayer1Event.token.name,
      },
      timestamp: bridgeToLayer1Event.timestamp,
      type: TransactionTypes.DEPOT_BRIDGED_LAYER_1,
    };
  }
}
