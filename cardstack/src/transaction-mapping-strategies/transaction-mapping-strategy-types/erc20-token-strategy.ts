import {
  convertRawAmountToBalance,
  convertRawAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';

import { TokenTransferFragment } from '@cardstack/graphql';
import { fetchHistoricalPrice } from '@cardstack/services';
import {
  ERC20TransactionType,
  TransactionTypes,
  TransactionStatus,
} from '@cardstack/types';

import { BaseStrategy } from '../base-strategy';

export class ERC20TokenStrategy extends BaseStrategy {
  handlesTransaction(): boolean {
    const { tokenTransfers } = this.transaction;

    if (tokenTransfers?.length) {
      return true;
    }

    return false;
  }

  async mapTransaction(): Promise<ERC20TransactionType | null> {
    const tokenTransfers = this.transaction.tokenTransfers;

    if (!tokenTransfers || !tokenTransfers.length) {
      return null;
    }

    const userTransaction = tokenTransfers.find(
      transfer =>
        transfer &&
        (transfer.to === this.accountAddress ||
          transfer.from === this.accountAddress ||
          transfer.to === this.depotAddress ||
          transfer.from === this.depotAddress)
    );

    if (!userTransaction) {
      return null;
    }

    const { status, title } = this.getStatusAndTitle(
      userTransaction,
      this.isDepotTransaction ? this.depotAddress : this.accountAddress
    );

    const symbol = userTransaction.token.symbol || '';

    const price = await fetchHistoricalPrice(
      symbol,
      userTransaction.timestamp,
      this.nativeCurrency
    );

    return {
      from: userTransaction.from || 'Unknown',
      to: userTransaction.to || 'Unknown',
      balance: convertRawAmountToBalance(userTransaction.amount, {
        decimals: 18,
        symbol,
      }),
      native: convertRawAmountToNativeDisplay(
        userTransaction.amount,
        18,
        price,
        this.nativeCurrency
      ),
      minedAt: userTransaction.timestamp,
      hash: this.transaction.id,
      symbol,
      status,
      title,
      type: TransactionTypes.ERC_20,
    };
  }

  getStatusAndTitle(
    transfer: TokenTransferFragment,
    toAddress: string
  ): {
    status: TransactionStatus;
    title: string;
  } {
    if (transfer.to === toAddress) {
      return {
        status: TransactionStatus.received,
        title: 'Received',
      };
    }

    return {
      status: TransactionStatus.sent,
      title: 'Sent',
    };
  }
}
