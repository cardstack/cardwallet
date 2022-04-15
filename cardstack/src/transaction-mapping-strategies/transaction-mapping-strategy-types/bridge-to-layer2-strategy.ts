import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';

import { fetchHistoricalPrice } from '@cardstack/services';
import {
  DepotBridgedLayer2TransactionType,
  TransactionTypes,
} from '@cardstack/types';

import { BaseStrategy } from '../base-strategy';

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

    const symbol = bridgeToLayer2Event.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      bridgeToLayer2Event.timestamp,
      this.nativeCurrency
    );

    return {
      balance: convertRawAmountToBalance(bridgeToLayer2Event.amount, {
        decimals: 18,
        symbol,
      }),
      native: convertRawAmountToNativeDisplay(
        bridgeToLayer2Event.amount,
        18,
        price,
        this.nativeCurrency
      ),
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
