import { NativeCurrency } from '@cardstack/cardpay-sdk';

import { PrepaidCardTransferStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/prepaid-card-transfer-strategy';
import {
  PREPAID_CARD_TRANSFER_MOCK,
  PREPAID_CARD_PURCHASED_MOCK,
  PREPAID_CARD_PAYMENT_MOCK,
} from '@cardstack/utils/__mocks__/merchant-strategies';

jest.mock('../../../utils', () => ({ deviceUtils: { isIOS14: false } }));

jest.mock('@cardstack/utils', () => ({
  convertSpendForBalanceDisplay: jest.fn().mockReturnValue({
    nativeBalanceDisplay: '$1.00 USD',
  }),
  fetchCardCustomizationFromDID: jest.fn().mockReturnValue({
    background: '#C3FC33',
    issuerName: 'Test Card',
    patternColor: 'white',
    patternUrl:
      'https://app.cardstack.com/images/prepaid-card-customizations/pattern-1.svg',
    textColor: 'black',
  }),
}));

const result = {
  address: '0xcC91634e10345125E0234EF88cf422381D9E7483',
  cardCustomization: {
    background: '#C3FC33',
    issuerName: 'Test Card',
    patternColor: 'white',
    patternUrl:
      'https://app.cardstack.com/images/prepaid-card-customizations/pattern-1.svg',
    textColor: 'black',
  },
  nativeBalanceDisplay: '$1.00 USD',
  statusText: 'Transferred',
  timestamp: '1634832515',
  transactionHash:
    '0x96390cbf6fcd88e2e54bed81a88fe41d5dce29e14b36537a730dfefd300d1e1a',
  type: 'prepaidCardTransfer',
};

const receivedResult = {
  address: '0xcC91634e10345125E0234EF88cf422381D9E7483',
  cardCustomization: {
    background: '#C3FC33',
    issuerName: 'Test Card',
    patternColor: 'white',
    patternUrl:
      'https://app.cardstack.com/images/prepaid-card-customizations/pattern-1.svg',
    textColor: 'black',
  },
  nativeBalanceDisplay: '$1.00 USD',
  statusText: 'Received',
  timestamp: '1634832515',
  transactionHash:
    '0x96390cbf6fcd88e2e54bed81a88fe41d5dce29e14b36537a730dfefd300d1e1a',
  type: 'prepaidCardTransfer',
};

const purchasedResult = {
  address: '0xEdEeb0Ec367CF65Be7efA8340be05170028679aA',
  cardCustomization: {
    background: '#C3FC33',
    issuerName: 'Test Card',
    patternColor: 'white',
    patternUrl:
      'https://app.cardstack.com/images/prepaid-card-customizations/pattern-1.svg',
    textColor: 'black',
  },
  nativeBalanceDisplay: '$1.00 USD',
  statusText: 'Purchased',
  timestamp: '1634604805',
  transactionHash:
    '0x96390cbf6fcd88e2e54bed81a88fe41d5dce29e14b36537a730dfefd300d1e1a',
  type: 'prepaidCardTransfer',
};

describe('PrepaidCardTransferStrategy', () => {
  const contructorParams = {
    accountAddress: '0x64Fbf34FaC77696112F1Abaa69D28211214d76c7',
    depotAddress: '0xF48c7B663DFCa76E1954bC44f7Fc006e2e04b09C',
    merchantSafeAddresses: [
      '0x51217e4769DFD61a42f8A509d4DCcC5683BFCB21',
      '0xb891ad9b23826e61F010D5cd90d6a24Ea55010Bd',
      '0x1D2BCdFb26319d1F5919aa66b105AE972946b9fE',
      '0x6A4946bF21df59C58d4129802e0a37Ac649e6ae7',
      '0x8de5D051565dF590A92f00a57B6d24609a17BC01',
      '0x372582b0290cab3fcEb009A0F3869D50a00276D2',
      '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5',
      '0xcba12315cc838375F0e1E9a9f5b2aFE0196B07B6',
    ],
    nativeCurrency: NativeCurrency.USD,
    prepaidCardAddresses: ['0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371'],
    transaction: PREPAID_CARD_TRANSFER_MOCK,
  };

  it('returns the proper object', async () => {
    const PrepaidCardTransfer = new PrepaidCardTransferStrategy(
      contructorParams as any
    );

    const value = await PrepaidCardTransfer.mapTransaction();
    expect(value).toEqual(result);
  });

  it('returns the null object for other transaction', async () => {
    const PrepaidCardTransferOtherTransaction = new PrepaidCardTransferStrategy(
      {
        ...contructorParams,
        transaction: PREPAID_CARD_PAYMENT_MOCK as any,
      }
    );

    const value = await PrepaidCardTransferOtherTransaction.mapTransaction();
    expect(value).toEqual(null);
  });

  it('returns the purchased object', async () => {
    const PrepaidCardTransfer = new PrepaidCardTransferStrategy({
      ...contructorParams,
      transaction: PREPAID_CARD_PURCHASED_MOCK as any,
    });

    const value = await PrepaidCardTransfer.mapTransaction();
    expect(value).toEqual(purchasedResult);
  });

  it('returns the transfer received object', async () => {
    const PrepaidCardTransfer = new PrepaidCardTransferStrategy({
      ...contructorParams,
      accountAddress: PREPAID_CARD_TRANSFER_MOCK.prepaidCardTransfers[0].to.id,
      transaction: PREPAID_CARD_TRANSFER_MOCK as any,
    });

    const value = await PrepaidCardTransfer.mapTransaction();

    expect(value).toEqual(receivedResult);
  });

  it('returns true with proper constructors', () => {
    const PrepaidCardTransfer = new PrepaidCardTransferStrategy(
      contructorParams as any
    );

    expect(PrepaidCardTransfer.handlesTransaction()).toBeTruthy();
  });

  it('returns false with empty prepaidCardPayments', () => {
    const newParams = {
      ...contructorParams,
      transaction: { prepaidCardTransfers: [] },
    };

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new PrepaidCardTransferStrategy(newParams).handlesTransaction()
    ).toBeFalsy();
  });
});
