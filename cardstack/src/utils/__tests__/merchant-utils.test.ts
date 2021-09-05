import { Share } from 'react-native';
import { Device } from '../device';
import {
  generateMerchantPaymentUrl,
  getMerchantClaimTransactionDetails,
  getMerchantEarnedTransactionDetails,
  shareRequestPaymentLink,
} from '../merchant-utils';
import {
  MERCHANT_CLAIM_MOCK_DATA,
  MERCHANT_EARNED_MOCK_DATA,
} from '@cardstack/utils/__mocks__/merchant-strategies';

jest.mock('../device');

describe('Merchant utils', () => {
  describe('generateMerchantPaymentUrl', () => {
    const merchantSafeID = '0x0000000000000000000000000000000000000000';
    const amount = 100;

    it('should return the right payment url given the specific parameters', () => {
      const url = generateMerchantPaymentUrl({
        merchantSafeID,
        amount,
        network: 'xdai',
        currency: 'USD',
      });

      expect(url).toBe(
        `https://wallet.cardstack.com/pay/xdai/0x0000000000000000000000000000000000000000?amount=100&currency=USD`
      );
    });

    it('should return the right payment url with default values', () => {
      const url = generateMerchantPaymentUrl({ merchantSafeID, amount });

      expect(url).toBe(
        `https://wallet.cardstack.com/pay/sokol/0x0000000000000000000000000000000000000000?amount=100&currency=SPD`
      );
    });

    it('should return the right payment url without amount', () => {
      const url = generateMerchantPaymentUrl({ merchantSafeID });

      expect(url).toBe(
        `https://wallet.cardstack.com/pay/sokol/0x0000000000000000000000000000000000000000?currency=SPD`
      );
    });
  });

  describe('shareRequestPaymentLink', () => {
    const address = '0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811';
    const paymentRequestLink = `https://wallet.cardstack.com/pay/xdai/0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811?amount=100&currency=USD`;

    const expectedContent = {
      message: `Payment Request\nTo: 0xd6F3...5811\nURL: https://wallet.cardstack.com/pay/xdai/0xd6F3F565E207A4e4B1b2E51F1A86d26D3DBf5811?amount=100&currency=USD`,
      title: 'Payment Request',
    };

    it('should return a share link with right params for iOS', async () => {
      Device.isIOS = true;
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(address, paymentRequestLink);

      expect(share).toBeCalledWith(expectedContent, {
        excludedActivityTypes: [
          `com.apple.UIKit.activity.CopyToPasteboard`,
          `com.apple.UIKit.activity.AddToReadingList`,
        ],
      });
    });

    it('should return a share link with right params and without iOS specifics if not iOS', async () => {
      Device.isIOS = false;
      const share = jest.spyOn(Share, 'share').mockImplementation(jest.fn());

      await shareRequestPaymentLink(address, paymentRequestLink);

      expect(share).toBeCalledWith(expectedContent, undefined);
    });
  });

  describe('Get Merchant Claim txn details', () => {
    it('Should return proper object according to params', () => {
      expect(
        getMerchantClaimTransactionDetails(
          MERCHANT_CLAIM_MOCK_DATA,
          'USD',
          '0xD7182E380b7dFa33C186358De7E1E5d0950fCAE7'
        )
      ).toStrictEqual({
        gasFee: '0.0000974 DAI',
        gasUsdFee: '$0.0000974 USD',
        grossClaimed: '0.00 DAI',
        netClaimed: '0.0000974 DAI',
      });

      expect(
        getMerchantClaimTransactionDetails(
          MERCHANT_CLAIM_MOCK_DATA,
          'USD',
          undefined
        )
      ).toBeNull();

      expect(
        getMerchantClaimTransactionDetails(
          undefined,
          'USD',
          '0xD7182E380b7dFa33C186358De7E1E5d0950fCAE7'
        )
      ).toBeNull();
    });
  });

  describe('Get Merchant Earned txn details', () => {
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

    it('Should return proper object according to params', () => {
      expect(
        getMerchantEarnedTransactionDetails(
          MERCHANT_EARNED_MOCK_DATA,
          'USD',
          0.49999999,
          currencyConversionRates,
          'DAI'
        )
      ).toStrictEqual({
        customerSpend: '50',
        customerSpendUsd: '$0.50 USD',
        protocolFee: '0.0025 DAI',
        protocolFeeUsd: '$0.0025 USD',
        spendConversionRate: '$0.01 USD',
      });

      expect(
        getMerchantEarnedTransactionDetails(
          null,
          'USD',
          0.49999999,
          currencyConversionRates,
          'DAI'
        )
      ).toBeNull();
    });
  });
});
