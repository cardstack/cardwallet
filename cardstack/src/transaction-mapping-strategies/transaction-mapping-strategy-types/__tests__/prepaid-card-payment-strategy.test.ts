import { PrepaidCardPaymentStrategy } from '@cardstack/transaction-mapping-strategies/transaction-mapping-strategy-types/prepaid-card-payment-strategy';
import { PREPAID_CARD_PAYMENT_MOCK } from '@cardstack/utils/__mocks__/merchant-strategies';

jest.mock('../../../utils', () => ({ deviceUtils: { isIOS14: false } }));

jest.mock('@cardstack/utils', () => ({
  fetchMerchantInfoFromDID: jest.fn().mockReturnValue({
    color: '#0e058a',
    did: 'did:cardstack:1mwFFZYzNyaeQwTCANBEMU167d6c9aa51321ea21',
    name: 'NFTs For All!',
    ownerAddress: '0xf3274Df212D2D8ff1eA3B2ADe81277cdbEA67A6D',
    slug: 'nfty',
    textColor: '#ffffff',
  }),
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
  address: '0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371',
  cardCustomization: {
    background: '#C3FC33',
    issuerName: 'Test Card',
    patternColor: 'white',
    patternUrl:
      'https://app.cardstack.com/images/prepaid-card-customizations/pattern-1.svg',
    textColor: 'black',
  },
  merchantInfo: {
    color: '#0e058a',
    did: 'did:cardstack:1mwFFZYzNyaeQwTCANBEMU167d6c9aa51321ea21',
    name: 'NFTs For All!',
    ownerAddress: '0xf3274Df212D2D8ff1eA3B2ADe81277cdbEA67A6D',
    slug: 'nfty',
    textColor: '#ffffff',
  },
  merchantSafeAddress: '0x9Ed84407e5ed5B7c0323E5653A06F4528357e3B5',
  nativeBalanceDisplay: '$1.00 USD',
  spendAmount: '100',
  timestamp: '1629411270',
  transactionHash:
    '0x7e3d3ad2b3cc284a96339b0f0e0a2eabce1fc7a8438858b358aa2cbd55cef333',
  type: 'prepaidCardPayment',
};

describe('PrepaidCardPaymentStrategy', () => {
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
    nativeCurrency: 'USD',
    prepaidCardAddresses: ['0x35Ae15dCEB6930756A59EfcC2169d2b834CdD371'],
    transaction: PREPAID_CARD_PAYMENT_MOCK,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const PrepaidCardPayment = new PrepaidCardPaymentStrategy(contructorParams);

  it('returns the proper object', async () => {
    PrepaidCardPayment.mapTransaction()
      .then(value => {
        expect(value).toEqual(result);
      })
      .catch(err => console.log('Error: ', err));
  });

  it('returns the proper object without merchant info and card customization', async () => {
    const newParams = {
      ...contructorParams,
      transaction: {
        prepaidCardPayments: [
          {
            ...contructorParams.transaction.prepaidCardPayments[0],
            merchantSafe: null,
            prepaidCard: {
              ...contructorParams.transaction.prepaidCardPayments[0]
                .prepaidCard,
              customizationDID: null,
            },
          },
        ],
      },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new PrepaidCardPaymentStrategy(newParams)
      .mapTransaction()
      .then(value => {
        expect(value).toHaveProperty('merchantInfo', undefined);
        expect(value).toHaveProperty('cardCustomization', undefined);
      })
      .catch(err => console.log('Error: ', err));
  });

  it('returns true with proper constructors', () => {
    expect(PrepaidCardPayment.handlesTransaction()).toBeTruthy();
  });

  it('returns false with empty prepaidCardPayments', () => {
    const newParams = {
      ...contructorParams,
      transaction: { prepaidCardPayments: [] },
    };

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new PrepaidCardPaymentStrategy(newParams).handlesTransaction()
    ).toBeFalsy();
  });
});
