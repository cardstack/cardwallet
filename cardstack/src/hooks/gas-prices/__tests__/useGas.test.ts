import { act, renderHook } from '@testing-library/react-native';
import { ActionSheetIOS } from 'react-native';

import { useAssets } from '@cardstack/hooks/assets/useAssets';
import { useGetGasPricesQuery } from '@cardstack/services';
import { GasPricesQueryResults } from '@cardstack/services/hub/gas-prices/gas-prices-types';
import { Device } from '@cardstack/utils';

import * as Web3Handlers from '@rainbow-me/handlers/web3';

import { useGas } from '../useGas';

const mockedAsset = {
  id: 'TST',
  address: '0x',
  tokenID: 'TST',
  name: 'TST',
  symbol: 'TST',
  decimals: 18,
  type: 'token',
};

const mockedAccountSettings = {
  accountAddress: '0x0000000000000000000',
  network: 'polygon',
  nativeCurrency: 'USD',
};

jest.mock('@rainbow-me/hooks', () => ({
  useAccountSettings: () => mockedAccountSettings,
}));

jest.mock('@cardstack/hooks/assets/useAssets', () => ({
  useAssets: jest.fn().mockImplementation(() => ({
    getAssetBalance: jest.fn().mockReturnValue({
      amount: '1',
      display: '',
    }),
    getAssetPrice: jest.fn().mockReturnValue('10'),
    getAsset: jest.fn().mockReturnValue(mockedAsset),
  })),
}));

jest.mock('@cardstack/services', () => ({
  useGetGasPricesQuery: jest.fn(),
}));

describe('useGas', () => {
  Device.isIOS = true;

  const spyActionSheet = jest
    .spyOn(ActionSheetIOS, 'showActionSheetWithOptions')
    .mockImplementation(jest.fn());

  const spyEstimateGasLimit = jest.spyOn(Web3Handlers, 'estimateGasLimit');

  const mockedGasPriceEstimation = (data?: GasPricesQueryResults) =>
    (useGetGasPricesQuery as jest.Mock).mockImplementation(() => ({
      data,
      isLoading: false,
    }));

  beforeEach(() => {
    mockedGasPriceEstimation({
      slow: '115462975454',
      standard: '116835862219',
      fast: '118756059321',
    });

    spyEstimateGasLimit.mockReturnValue('21000');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the gas limit estimation when calling updateTxFees', async () => {
    const { result } = renderHook(() => useGas());

    await act(async () => {
      const gasLimit = await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });

      expect(gasLimit).toBe('21000');
    });

    expect(spyEstimateGasLimit).toBeCalledWith(
      {
        address: mockedAccountSettings.accountAddress,
        amount: 1,
        asset: mockedAsset,
        recipient: '0x',
      },
      mockedAccountSettings.network,
      true
    );

    expect(result.current.selectedFee).not.toBeUndefined();
  });

  it(`should NOT update the txFee state if there's no gas price estimation`, async () => {
    mockedGasPriceEstimation();

    const { result } = renderHook(() => useGas());

    await act(async () => {
      const gasLimit = await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });

      expect(gasLimit).toBe('21000');
    });

    expect(result.current.selectedFee).toBeUndefined();
  });

  it(`should expose the selected fee based on the default speed (standard)`, async () => {
    const { result } = renderHook(() => useGas());

    await act(async () => {
      await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });
    });

    expect(result.current.selectedFee).toEqual({
      gasPrice: '116835862219',
      native: {
        amount: '0.02453553106599',
        display: '$0.025 USD',
      },
      value: {
        amount: '0.002453553106599',
        display: '0.00245 TST',
      },
    });
  });

  it(`should expose hasSufficientForGas as true if the user has balance for gas`, async () => {
    const { result } = renderHook(() => useGas());

    await act(async () => {
      await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });
    });

    expect(result.current.hasSufficientForGas).toBeTruthy();
  });

  it(`should expose hasSufficientForGas as false if the user doesn't have balance for gas`, async () => {
    spyEstimateGasLimit.mockReturnValue('999999999999');

    (useAssets as jest.Mock).mockImplementation(() => ({
      getAssetBalance: jest.fn().mockReturnValue({
        amount: '0',
        display: '',
      }),
      getAssetPrice: jest.fn().mockReturnValue('10'),
      getAsset: jest.fn().mockReturnValue(mockedAsset),
    }));

    const { result } = renderHook(() => useGas());

    await act(async () => {
      await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });
    });

    expect(result.current.hasSufficientForGas).toBeFalsy();
  });

  it(`should show ActionSheet with 3 speed options when calling showTransactionSpeedActionSheet`, async () => {
    const { result } = renderHook(() => useGas());

    await act(async () => {
      await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });
    });

    act(() => {
      result.current.showTransactionSpeedActionSheet();
    });

    expect(spyActionSheet).toBeCalledTimes(1);
    expect(spyActionSheet).toBeCalledWith(
      {
        cancelButtonIndex: 3,
        options: [
          'Slow: $0.024 USD',
          'Standard: $0.025 USD',
          'Fast: $0.025 USD',
          'Cancel',
        ],
      },
      expect.any(Function)
    );
  });

  it(`should update the setSelectedGasSpeed with the new speed and the selected fee`, async () => {
    const { result } = renderHook(() => useGas());

    await act(async () => {
      await result.current.updateTxFees({
        asset: mockedAsset,
        amount: 1,
        recipient: '0x',
      });
    });

    act(() => {
      result.current.showTransactionSpeedActionSheet();

      // click the first item
      spyActionSheet.mock.calls[0][1](0);
    });

    expect(result.current.selectedFee).toEqual({
      gasPrice: '115462975454',
      native: {
        amount: '0.02424722484534',
        display: '$0.024 USD',
      },
      value: {
        amount: '0.002424722484534',
        display: '0.00242 TST',
      },
    });
  });
});
