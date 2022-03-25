import { useCallback, useMemo } from 'react';
import { convertToSpend } from '@cardstack/cardpay-sdk';
import { useNavigation, StackActions } from '@react-navigation/core';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { groupBy } from 'lodash';
import { strings } from './strings';
import { TokensWithSafeAddress } from './components';
import {
  RewardsRegisterData,
  TransactionConfirmationType,
  TokenType,
} from '@cardstack/types';
import {
  useClaimRewardsMutation,
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
  useRegisterToRewardProgramMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';
import { networkTypes } from '@rainbow-me/helpers/networkTypes';
import { MainRoutes, useLoadingOverlay } from '@cardstack/navigation';
import { Alert } from '@rainbow-me/components/alerts';
import { useMutationEffects } from '@cardstack/hooks';
import { RewardeeClaim, useGetRewardClaimsQuery } from '@cardstack/graphql';
import { groupTransactionsByDate } from '@cardstack/utils';
import { RewardsSafeType } from '@cardstack/services/rewards-center/rewards-center-types';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
  // TestID
  [networkTypes.xdai]: '0xf1223b57D5832fc4229c767E9AD4A8FCfab8A6cA',
};

export const useRewardsCenterScreen = () => {
  const { navigate, dispatch: navDispatch } = useNavigation();
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
    isUninitialized,
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

  const [
    claimRewards,
    { isSuccess: isClaimSuccess, isError: isClaimError, error: claimError },
  ] = useClaimRewardsMutation();

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

  const onMutationEndAlert = useCallback(
    ({ title, message, shouldGoBack }) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [
          {
            text: 'Okay',
            onPress: shouldGoBack
              ? () => {
                  navDispatch(StackActions.pop(2));
                }
              : undefined,
          },
        ],
      });
    },
    [dismissLoadingOverlay, navDispatch]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isRegistrationSuccess,
          callback: onMutationEndAlert({
            title: 'Success',
            message: 'Registration successful',
            shouldGoBack: true,
          }),
        },
        error: {
          status: isRegistrationError,
          callback: onMutationEndAlert({
            title: 'Error',
            message: 'Registration failed',
          }),
        },
      }),
      [isRegistrationError, isRegistrationSuccess, onMutationEndAlert]
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
      const data: RewardsRegisterData = {
        type: TransactionConfirmationType.REWARDS_REGISTER,
        spendAmount: convertToSpend(0.01, 'USD', 1),
        prepaidCard: prepaidCard.address,
        programName: 'Cardstack Rewards',
      };

      navigate(MainRoutes.TRANSACTION_CONFIRMATION_SHEET, {
        data,
        onConfirm: onRegisterConfirmPress(
          prepaidCard.address,
          rewardDefaultProgramId[network]
        ),
      });
    },
    [navigate, network, onRegisterConfirmPress]
  );

  const onRegisterPress = useCallback(() => {
    navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
      // Mocked estimated gas fee until we get from sdk
      spendAmount: convertToSpend(0.01, 'USD', 1),
      onConfirmChoosePrepaidCard: onPrepaidCardSelection,
    });
  }, [navigate, onPrepaidCardSelection]);

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isClaimSuccess,
          callback: onMutationEndAlert({
            title: 'Success',
            message: 'Rewards claimed successfully',
          }),
        },
        error: {
          status: isClaimError,
          callback: onMutationEndAlert({
            title: 'Error',
            message: `Claiming failed - ${
              (claimError as FetchBaseQueryError)?.data
            }`,
          }),
        },
      }),
      [claimError, isClaimError, isClaimSuccess, onMutationEndAlert]
    )
  );

  const onClaimPress = useCallback(
    (tokenAddress, rewardProgramId) => () => {
      const rewardSafeForProgram = rewardSafes?.find(
        safe => safe.rewardProgramId === rewardProgramId
      );

      showLoadingOverlay({ title: strings.claim.loading });

      claimRewards({
        tokenAddress,
        accountAddress,
        network,
        rewardProgramId,
        walletId: selectedWallet.id,
        safeAddress: rewardSafeForProgram?.address || '',
      });
    },
    [
      accountAddress,
      claimRewards,
      network,
      rewardSafes,
      selectedWallet.id,
      showLoadingOverlay,
    ]
  );

  const { data } = useGetRewardClaimsQuery({
    skip: !accountAddress,
    variables: {
      rewardeeAddress: accountAddress,
    },
    context: { network },
  });

  const claimHistorySectionData = useMemo(
    () => ({
      sections: Object.entries(
        groupBy(data?.rewardeeClaims, groupTransactionsByDate)
      ).map(([title, claims]) => ({
        title,
        data: claims as RewardeeClaim[],
      })),
    }),
    [data]
  );

  const tokensBalanceData = useMemo(
    () => ({
      // Get tokens from all rewardSafes
      data: rewardSafes?.reduce(
        (tokens: TokenType[], safe: RewardsSafeType) => {
          const tokensWithAddress = safe.tokens?.map(token => ({
            ...token,
            safeAddress: safe.address,
          }));

          return [...tokens, ...tokensWithAddress] as TokensWithSafeAddress;
        },
        []
      ),
    }),
    [rewardSafes]
  );

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    onRegisterPress,
    hasRewardsAvailable: !!mainPoolTokenInfo,
    mainPoolTokenInfo,
    isLoading: isLoadindSafes || isLoadingTokens || isUninitialized,
    onClaimPress,
    claimHistorySectionData,
    tokensBalanceData,
  };
};
