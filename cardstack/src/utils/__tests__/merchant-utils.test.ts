import { Share } from 'react-native';
import { Device } from '../device';
import {
  generateMerchantPaymentUrl,
  shareRequestPaymentLink,
} from '../merchant-utils';

jest.mock('../device');

describe('Merchant utils', () => {
  describe('generateMerchantPaymentUrl', () => {
    const merchantSafeID = '0x0000000000000000000000000000000000000000';
    const amount = 100;

    it('should return the right payment url given the specific parameters', () => {
      const url = generateMerchantPaymentUrl(
        merchantSafeID,
        amount,
        'xdai',
        'USD'
      );

      expect(url).toBe(
        `https://wallet.cardstack.com/pay/xdai/0x0000000000000000000000000000000000000000?amount=100&currency=USD`
      );
    });

    it('should return the right payment url with default values', () => {
      const url = generateMerchantPaymentUrl(merchantSafeID, amount);

      expect(url).toBe(
        `https://wallet.cardstack.com/pay/sokol/0x0000000000000000000000000000000000000000?amount=100&currency=SPD`
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
});
