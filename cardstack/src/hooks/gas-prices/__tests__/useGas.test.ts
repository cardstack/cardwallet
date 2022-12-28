import { act, renderHook } from '@testing-library/react-native';

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
  useGetGasPricesQuery: jest.fn().mockImplementation(() => ({
    data: {
      slow: '115462975454',
      standard: '116835862219',
      fast: '118756059321',
    },
    isLoading: false,
  })),
}));

describe('useGas', () => {
  const spyEstimateGasLimit = jest.spyOn(Web3Handlers, 'estimateGasLimit');

  it('should return the gas limit estimation when calling updateTxFees', async () => {
    spyEstimateGasLimit.mockReturnValueOnce('21000');

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

  it.todo(
    `should NOT update the txFee state if there's no gas price estimation`
  );

  it.todo(
    `should expose the selected fee based on the default speed (standard)`
  );

  it.todo(
    `should expose hasSufficientForGas as true if the user has balance for gas`
  );

  it.todo(
    `should expose hasSufficientForGas as false if the user doesn't have balance for gas`
  );

  it.todo(
    `should show ActionSheet with 3 speed options when calling showTransactionSpeedActionSheet`
  );

  it.todo(
    `should update the setSelectedGasSpeed with the new speed and the selected fee`
  );
});
