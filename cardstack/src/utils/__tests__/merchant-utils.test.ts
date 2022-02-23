import { Share } from 'react-native';
import { Device } from '../device';
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

const currencyConversionRates = {
  AUD: 1.34202,
  CAD: 1.252625,
  CNY: 6.453498,
  EUR: 0.841695,
  GBP: 0.721335,
  INR: 72.99465,
  JPY: 109.749773,
  KRW: 1155.749904,
  NZD: 1.398215,
  RUB: 72.69605,
  TRY: 8.32148,
  USD: 1,
  ZAR: 14.297496,
};

describe('Merchant utils', () => {
  describe('shareRequestPaymentLink', () => {
    const merchantName = 'MerchantName';
    const amountWithSymbol = '$1.00 USD';
    const paymentRequestLink = `cardwallet://pay/xdai/0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811?amount=100&currency=USD`;

    const title = `${merchantName} Requests ${amountWithSymbol}`;
    const message = `${title} \nURL: ${paymentRequestLink}`;

    it('should return a share link with right params for iOS', async () => {
      Device.isIOS = true;
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(
        paymentRequestLink,
        merchantName,
        amountWithSymbol
      );

      expect(share).toBeCalledWith(
        {
          title,
          message,
          url: paymentRequestLink,
        },
        {
          excludedActivityTypes: [
            `com.apple.UIKit.activity.CopyToPasteboard`,
            `com.apple.UIKit.activity.AddToReadingList`,
          ],
          subject: title,
        }
      );
    });

    it('should return a share link with right params and without iOS specifics if not iOS', async () => {
      Device.isIOS = false;
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(
        paymentRequestLink,
        merchantName,
        amountWithSymbol
      );

      expect(share).toBeCalledWith(
        {
          title,
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
          'USD',
          currencyConversionRates,
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
          'USD',
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
