import { useCallback, useMemo } from 'react';
import { convertToSpend } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/core';
import { strings } from './strings';
import {
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
  useRegisterToRewardProgramMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/helpers/networkTypes';
import { MainRoutes, useLoadingOverlay } from '@cardstack/navigation';
import { Alert } from '@rainbow-me/components/alerts';
import { useMutationEffects } from '@cardstack/hooks';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
  // TestID
  [networkTypes.xdai]: '0xf1223b57D5832fc4229c767E9AD4A8FCfab8A6cA',
};

export const useRewardsCenterScreen = () => {
  const { navigate } = useNavigation();
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
      },
      options: {
        skip: !accountAddress,
      },
    }),
    [accountAddress, nativeCurrency]
  );

  const {
    isLoading: isLoadindSafes,
    data: { rewardSafes } = {},
  } = useGetRewardsSafeQuery(query.params, query.options);

  const {
    isLoading: isLoadingTokens,
    data: { rewardPoolTokenBalances } = {},
  } = useGetRewardPoolTokenBalancesQuery(query.params, query.options);

  const [
    registerToRewardProgram,
    { isSuccess: isRegistrationSuccess, isError: isRegistrationError },
  ] = useRegisterToRewardProgramMutation();

  const registeredPools = useMemo(
    () =>
      rewardSafes?.filter(safe =>
        rewardPoolTokenBalances?.some(
          ({ rewardProgramId }) => rewardProgramId === safe?.rewardProgramId
        )
      ),
    [rewardPoolTokenBalances, rewardSafes]
  );

  const isRegistered = useMemo(
    () =>
      rewardSafes?.some(
        ({ rewardProgramId }) =>
          rewardProgramId === rewardDefaultProgramId[network]
      ),
    [network, rewardSafes]
  );

  // Checks if available tokens matches default program and has amount
  const mainPoolTokenInfo = useMemo(
    () =>
      rewardPoolTokenBalances?.find(
        ({ rewardProgramId, balance: { amount } }) =>
          Number(amount) > 0 &&
          rewardProgramId === rewardDefaultProgramId[network]
      ),
    [network, rewardPoolTokenBalances]
  );

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { selectedWallet } = useWallets();

  const onRegisterEnd = useCallback(
    ({ title, message }) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [{ text: 'Okay' }],
      });
    },
    [dismissLoadingOverlay]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isRegistrationSuccess,
          callback: onRegisterEnd({
            title: 'Success',
            message: 'Registration successful',
          }),
        },
        error: {
          status: isRegistrationError,
          callback: onRegisterEnd({
            title: 'Error',
            message: 'Registration failed',
          }),
        },
      }),
      [isRegistrationError, isRegistrationSuccess, onRegisterEnd]
    )
  );

  const onRegisterConfirmPress = useCallback(
    (prepaidCardAddress, rewardProgramId) => () => {
      showLoadingOverlay({ title: strings.register.loading });

      registerToRewardProgram({
        prepaidCardAddress,
        accountAddress,
        network,
        rewardProgramId,
        walletId: selectedWallet.id,
      });
    },
    [
      accountAddress,
      network,
      registerToRewardProgram,
      selectedWallet.id,
      showLoadingOverlay,
    ]
  );

  const onPrepaidCardSelection = useCallback(
    prepaidCard => {
      // TODO: Replace with confirmation sheet
      Alert({
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Confirm',
            onPress: onRegisterConfirmPress(
              prepaidCard.address,
              rewardDefaultProgramId[network]
            ),
          },
        ],
        title: 'Register Account',
        message: `Cardstack Rewards\n(${rewardDefaultProgramId[network]})\nPrepaid Card:\n${prepaidCard.address}`,
      });
    },
    [network, onRegisterConfirmPress]
  );

  const onRegisterPress = useCallback(() => {
    navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
      // Mocked estimated gas fee until we get from sdk
      spendAmount: convertToSpend(0.01, 'USD', 1),
      onConfirmChoosePrepaidCard: onPrepaidCardSelection,
    });
  }, [navigate, onPrepaidCardSelection]);

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    onRegisterPress,
    hasRewardsAvailable: !!mainPoolTokenInfo,
    mainPoolTokenInfo,
    isLoading: isLoadindSafes || isLoadingTokens,
  };
};
