import { renderHook } from '@testing-library/react-hooks';
import { useRoute } from '@react-navigation/native';
import { updatedData } from '../../../helpers/__mocks__/dataMocks';
import { useSendSheetDepotScreen } from '../useSendSheetDepotScreen';
import { useAccountAssets } from '@rainbow-me/hooks';
import { getSafesInstance } from '@cardstack/models/safes-providers';
import { getUsdConverter } from '@cardstack/services/exchange-rate-service';
import { reshapeSingleDepotTokenToAsset } from '@cardstack/utils';

jest.mock('@cardstack/utils/device', () => ({ Device: { isAndroid: false } }));
jest.mock('@rainbow-me/navigation/Navigation', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@rainbow-me/hooks', () => ({
  useAccountAssets: jest.fn(),
  useAccountSettings: () => ({
    accountAddress: '0x0000000000000000000',
    nativeCurrency: 'USD',
    network: 'sokol',
  }),
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

jest.mock('@cardstack/services/exchange-rate-service', () => ({
  getUsdConverter: jest.fn(),
}));

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

    const expectedAssets = [
      reshapeSingleDepotTokenToAsset(
        updatedData.updatedDepots[0].tokens[0] as any
      ),
    ];

    const { result } = renderHook(() => useSendSheetDepotScreen());

    expect(result.current.allAssets).toEqual(expectedAssets);
  });

  it('should update gas fee and usdConverter initial render', async () => {
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

    const { waitForNextUpdate } = renderHook(() => useSendSheetDepotScreen());

    await waitForNextUpdate();

    expect(mockSendTokensGasEstimate).toBeCalledWith(
      '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
      '0xB236ca8DbAB0644ffCD32518eBF4924ba866f7Ee',
      '0x107c1F2e2cE594cCb60629eaf33cF703419E01fb',
      '0'
    );

    expect(mockConverter).toBeCalledWith(weiGasEstimate);
    expect(getUsdConverter).toBeCalledWith('CARD');
  });
});