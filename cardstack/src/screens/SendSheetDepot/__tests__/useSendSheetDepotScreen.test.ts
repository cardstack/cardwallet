import { NativeCurrency } from '@cardstack/cardpay-sdk';
import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import Web3 from 'web3';

import { getSafesInstance } from '@cardstack/models/safes-providers';
import { useGetSafesDataQuery } from '@cardstack/services';
import { getUsdConverter } from '@cardstack/services/exchange-rate-service';
import { reshapeSingleDepotTokenToAsset } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { useSendSheetDepotScreen } from '../useSendSheetDepotScreen';

jest.mock('@cardstack/utils/device', () => ({ Device: { isAndroid: false } }));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

const mockedShowOverlay = jest.fn();
const mockedDismissOverlay = jest.fn();
jest.mock('@cardstack/navigation', () => ({
  useLoadingOverlay: () => ({
    showLoadingOverlay: mockedShowOverlay,
    dismissLoadingOverlay: mockedDismissOverlay,
  }),
  Routes: {
    WALLET_SCREEN: 'WalletScreen',
  },
}));

const mockAccountAddress = '0x0000000000000000000';

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: jest.fn().mockImplementation(() => ({
    accountAddress: mockAccountAddress,
    nativeCurrency: 'USD',
    network: 'sokol',
  })),
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

jest.mock('@cardstack/services', () => ({
  useGetSafesDataQuery: jest.fn(),
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

// Gas Converter mocking
const weiGasEstimate = '12041962649411652';
const usdGasEstimate = 0.00020291;

const mockSendTokens = jest.fn();

const mockSendTokensGasEstimate = jest.fn().mockResolvedValue(weiGasEstimate);
const mockConverter = jest.fn(() => usdGasEstimate);

const mockConverterHelper = () => {
  (getSafesInstance as jest.Mock).mockResolvedValue({
    sendTokensGasEstimate: mockSendTokensGasEstimate,
    sendTokens: mockSendTokens,
  });

  (getUsdConverter as jest.Mock).mockResolvedValue(mockConverter);
};

const mainDepot = updatedData.updatedDepots[0];

describe('useSendSheetDepotScreen', () => {
  beforeEach(() => {
    (useGetSafesDataQuery as jest.Mock).mockImplementation(() => ({
      depots: updatedData.updatedDepots,
    }));

    (useRoute as jest.Mock).mockImplementation(() => ({
      params: {
        asset: mainDepot.tokens[0],
      },
    }));

    mockConverterHelper();
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
    (useGetSafesDataQuery as jest.Mock).mockImplementation(() => ({
      depots: [],
    }));

    const expectedAssets = [
      reshapeSingleDepotTokenToAsset(mainDepot.tokens[0] as any),
    ];

    const { result } = renderHook(() => useSendSheetDepotScreen());

    await waitFor(() =>
      expect(result.current.allAssets).toEqual(expectedAssets)
    );
  });

  it('should update gas fee and usdConverter initial render', async () => {
    const selectedGasPrice = {
      amount: usdGasEstimate,
      nativeDisplay: '0.012041962649411652 CARD',
    };

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
      accountAddress: mockAccountAddress,
      nativeCurrency: NativeCurrency.EUR,
      network: 'sokol',
    }));

    const eurGasEstimate = usdGasEstimate * currencyConversionRate.EUR;

    const SelectedGasPrice = {
      amount: eurGasEstimate,
      nativeDisplay: '0.012041962649411652 CARD',
    };

    const { result } = renderHook(() => useSendSheetDepotScreen());

    await waitFor(() =>
      expect(result.current.selectedGasPrice).toEqual(SelectedGasPrice)
    );
  });

  it('should call sendTokens without an amount if onMaxBalance is pressed', async () => {
    const recipient = '0x888';

    const selectedTokenAddress = mainDepot.tokens[0].tokenAddress;

    const safeAddress = mainDepot.address;

    const { result } = renderHook(() => useSendSheetDepotScreen());

    // wait gas

    await waitFor(() =>
      expect(result.current.selectedGasPrice.amount).toBeTruthy()
    );

    await act(async () => {
      await result.current.setRecipient(recipient);
      await result.current.onMaxBalancePress();
    });

    // wait amount to be updated
    await waitFor(() =>
      expect(result.current.amountDetails.assetAmount).toBeTruthy()
    );

    await act(async () => {
      await result.current.onSendPress();
    });

    expect(mockSendTokens).toBeCalledWith(
      safeAddress,
      selectedTokenAddress || '',
      recipient,
      undefined,
      undefined,
      { from: mockAccountAddress }
    );
  });

  it('should call sendTokens with user defined amount after value update, cancelling previously pressed onMaxBalance', async () => {
    const recipient = '0x888';

    const selectedTokenAddress = mainDepot.tokens[0].tokenAddress;

    const safeAddress = mainDepot.address;

    const updatedAssetAmount = '0.5';

    const { result } = renderHook(() => useSendSheetDepotScreen());

    // wait gas

    await waitFor(() =>
      expect(result.current.selectedGasPrice.amount).toBeTruthy()
    );

    await act(async () => {
      await result.current.setRecipient(recipient);
      await result.current.onMaxBalancePress();
      await result.current.onChangeAssetAmount(updatedAssetAmount);
    });

    // wait amount to be updated
    await waitFor(() =>
      expect(result.current.amountDetails.assetAmount).toBeTruthy()
    );

    await act(async () => {
      await result.current.onSendPress();
    });

    expect(mockSendTokens).toBeCalledWith(
      safeAddress,
      selectedTokenAddress || '',
      recipient,
      Web3.utils.toWei(updatedAssetAmount),
      undefined,
      { from: mockAccountAddress }
    );
  });
});
