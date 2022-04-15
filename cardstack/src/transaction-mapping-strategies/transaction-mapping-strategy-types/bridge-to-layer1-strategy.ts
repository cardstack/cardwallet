import {
  convertRawAmountToNativeDisplay,
  convertRawAmountToBalance,
} from '@cardstack/cardpay-sdk';

import { fetchHistoricalPrice } from '@cardstack/services';
import {
  DepotBridgedLayer1TransactionType,
  TransactionTypes,
} from '@cardstack/types';

import { BaseStrategy } from '../base-strategy';

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

    const symbol = bridgeToLayer1Event.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      bridgeToLayer1Event.timestamp,
      this.nativeCurrency
    );

    return {
      balance: convertRawAmountToBalance(bridgeToLayer1Event.amount, {
        decimals: 18,
        symbol,
      }),
      native: convertRawAmountToNativeDisplay(
        bridgeToLayer1Event.amount,
        18,
        price,
        this.nativeCurrency
      ),
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
