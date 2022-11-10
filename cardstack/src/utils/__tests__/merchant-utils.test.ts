import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { Share, Platform } from 'react-native';

import {
  getMerchantClaimTransactionDetails,
  getMerchantEarnedTransactionDetails,
  shareRequestPaymentLink,
} from '@cardstack/utils';
import {
  MERCHANT_CLAIM_MOCK_DATA,
  MERCHANT_EARNED_MOCK_DATA,
} from '@cardstack/utils/__mocks__/merchant-strategies';

jest.mock('../device');

jest.mock('@cardstack/services', () => ({
  getNativeBalanceFromOracle: jest.fn().mockReturnValue(0.0000974),
}));

describe('Merchant utils', () => {
  describe('shareRequestPaymentLink', () => {
    beforeAll(() => {
      jest
        .spyOn(Platform, 'select')
        .mockImplementation(obj => obj[Platform.OS]);
    });

    const merchantName = 'MerchantName';
    const amountWithSymbol = '$1.00 USD';
    const paymentRequestLink = `cardwallet://pay/gnosis/0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811?amount=100&currency=USD`;

    const title = `${merchantName} Requests ${amountWithSymbol}`;
    const message = paymentRequestLink;

    it('should return a share link with right params for iOS', async () => {
      Platform.OS = 'ios';
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(
        paymentRequestLink,
        merchantName,
        amountWithSymbol
      );

      expect(share).toBeCalledWith(
        {
          url: paymentRequestLink,
        },
        {
          excludedActivityTypes: [
            `com.apple.UIKit.activity.CopyToPasteboard`,
            `com.apple.UIKit.activity.AddToReadingList`,
          ],
          subject: paymentRequestLink,
        }
      );
    });

    it('should return a share link with right params and without iOS specifics if not iOS', async () => {
      Platform.OS = 'android';
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(
        paymentRequestLink,
        merchantName,
        amountWithSymbol
      );

      expect(share).toBeCalledWith(
        {
          message,
        },
        { dialogTitle: title }
      );
    });
  });

  describe('Get Merchant Claim txn details', () => {
    it('Should return proper object according to params', async () => {
      expect(
        await getMerchantClaimTransactionDetails(
          MERCHANT_CLAIM_MOCK_DATA,
          NativeCurrency.USD,
          '0xD7182E380b7dFa33C186358De7E1E5d0950fCAE7'
        )
      ).toStrictEqual({
        gasFee: '0.0000974 DAI',
        gasNativeFee: '$0.0000974 USD',
        grossClaimed: '0.00 DAI',
        netClaimed: '0.0000974 DAI',
      });
    });
  });

  describe('Get Merchant Earned txn details', () => {
    it('Should return proper object according to params', async () => {
      expect(
        await getMerchantEarnedTransactionDetails(
          MERCHANT_EARNED_MOCK_DATA,
          NativeCurrency.USD,
          'DAI'
        )
      ).toStrictEqual({
        protocolFee: '0.0025 DAI',
        revenueCollected: '0.499 DAI',
        netEarned: {
          amount: '0.496506986027944111',
          display: '0.497 DAI',
        },
        netEarnedNativeDisplay: '$0.0000974 USD',
      });
    });
  });
});
