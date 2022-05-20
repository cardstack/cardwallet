import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/native';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';

import { getSafesInstance } from '@cardstack/models/safes-providers';
import { getUsdConverter } from '@cardstack/services/exchange-rate-service';
import { reshapeSingleDepotTokenToAsset } from '@cardstack/utils';

import { useAccountAssets, useAccountSettings } from '@rainbow-me/hooks';

import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { useSendSheetDepotScreen } from '../useSendSheetDepotScreen';

jest.mock('@cardstack/utils/device', () => ({ Device: { isAndroid: false } }));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountAssets: jest.fn(),
  useAccountSettings: jest.fn().mockImplementation(() => ({
    accountAddress: '0x0000000000000000000',
    nativeCurrency: 'USD',
    network: 'sokol',
  })),
  useMagicAutofocus: () => ({
    handleFocus: jest.fn(),
    triggerFocus: jest.fn(),
  }),
  useWallets: () => ({ selectedWallet: 'fooSelectedWallet' }),
}));

jest.mock('@rainbow-me/components/send/SendSheet', () => ({
  useSendAddressValidation: () => true,
}));

jest.mock('@cardstack/models/safes-providers', () => ({
  getSafesInstance: jest.fn(),
}));

jest.mock('@cardstack/services/hub/hub-service', () => ({
  getExchangeRatesQuery: jest
    .fn()
    .mockResolvedValue({ data: { USD: 1, EUR: 0.86 } }),
}));

jest.mock('../../../services/exchange-rate-service.ts', () => {
  const actualExchange = jest.requireActual(
    '../../../services/exchange-rate-service.ts'
  );

  return {
    ...actualExchange,
    getUsdConverter: jest.fn(),
  };
});

jest.mock('@cardstack/models/hd-provider', () => ({
  get: jest.fn(),
  reset: jest.fn(),
}));

describe('useSendSheetDepotScreen', () => {
  beforeEach(() => {
    (useAccountAssets as jest.Mock).mockImplementation(() => ({
      depots: updatedData.updatedDepots,
    }));

    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        asset: updatedData.updatedDepots[0].tokens[0],
      },
    }));
  });

  afterEach(() => jest.clearAllMocks());

  it('should return selected undefined if not route param is passed', async () => {
    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {},
    }));

    const { result } = renderHook(() => useSendSheetDepotScreen());
    expect(result.current.selected).toBeUndefined();
  });

  it('should return the current reshaped token from params if no depot is found', async () => {
    (useAccountAssets as jest.Mock).mockImplementation(() => ({
      depots: [],
    }));

    const weiGasEstimate = '12041962649411652';
    const usdGasEstimate = 0.00020291;

    const mockSendTokensGasEstimate = jest
      .fn()
      .mockResolvedValue(weiGasEstimate);

    (getSafesInstance as jest.Mock).mockResolvedValue({
      sendTokensGasEstimate: mockSendTokensGasEstimate,
    });

    const mockConverter = jest.fn(() => usdGasEstimate);

    (getUsdConverter as jest.Mock).mockResolvedValue(mockConverter);

    const expectedAssets = [
      reshapeSingleDepotTokenToAsset(
        updatedData.updatedDepots[0].tokens[0] as any
      ),
    ];

    const { result } = renderHook(() => useSendSheetDepotScreen());

    await waitFor(() =>
      expect(result.current.allAssets).toEqual(expectedAssets)
    );
  });

  it('should update gas fee and usdConverter initial render', async () => {
    const weiGasEstimate = '12041962649411652';
    const usdGasEstimate = 0.00020291;

    const selectedGasPrice = {
      amount: usdGasEstimate,
      nativeDisplay: '0.012041962649411652 CARD',
    };

    const mockSendTokensGasEstimate = jest
      .fn()
      .mockResolvedValue(weiGasEstimate);

    (getSafesInstance as jest.Mock).mockResolvedValue({
      sendTokensGasEstimate: mockSendTokensGasEstimate,
    });

    const mockConverter = jest.fn(() => usdGasEstimate);

    (getUsdConverter as jest.Mock).mockResolvedValue(mockConverter);

    const { result } = renderHook(() => useSendSheetDepotScreen());

    await waitFor(() =>
      expect(result.current.selectedGasPrice).toEqual(selectedGasPrice)
    );

    expect(mockSendTokensGasEstimate).toBeCalledWith(
      '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
      '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
      '0'
    );

    expect(mockConverter).toBeCalledWith(weiGasEstimate);
    expect(getUsdConverter).toBeCalledWith('CARD');
  });

  it('should update estimated gas fee with native currency amount', async () => {
    const currencyConversionRate = { EUR: 0.86 };

    (useAccountSettings as jest.Mock).mockImplementation(() => ({
      accountAddress: '0x0000000000000000000',
      nativeCurrency: NativeCurrency.EUR,
      network: 'sokol',
    }));

    const weiGasEstimate = '12041962649411652';
    const usdGasEstimate = 0.00020291;
    const eurGasEstimate = usdGasEstimate * currencyConversionRate.EUR;

    const SelectedGasPrice = {
      amount: eurGasEstimate,
      nativeDisplay: '0.012041962649411652 CARD',
    };

    const mockSendTokensGasEstimate = jest
      .fn()
      .mockResolvedValue(weiGasEstimate);

    (getSafesInstance as jest.Mock).mockResolvedValue({
      sendTokensGasEstimate: mockSendTokensGasEstimate,
    });

    const mockConverter = jest.fn(() => usdGasEstimate);

    (getUsdConverter as jest.Mock).mockResolvedValue(mockConverter);

    const { result } = renderHook(() => useSendSheetDepotScreen());

    await waitFor(() =>
      expect(result.current.selectedGasPrice).toEqual(SelectedGasPrice)
    );
  });

  // it('should enable max balance state if tap on max button', () => {});

  it('should sendTokens with undefined amount if max enabled', () => {
    (useAccountSettings as jest.Mock).mockImplementation(() => ({
      accountAddress: '0x0000000000000000000',
    }));

    const mockSendTokens = jest.fn();

    (getSafesInstance as jest.Mock).mockResolvedValue({
      sendTokens: mockSendTokens,
    });

    expect(mockSendTokens).toBeCalledWith(
      safeAddress,
      selected?.address || '',
      recipient,
      undefined,
      undefined,
      { from: accountAddress }
    );
  });
});
