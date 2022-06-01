import { convertToSpend, getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation, StackActions } from '@react-navigation/native';
import { groupBy } from 'lodash';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import {
  useGetRewardClaimsQuery,
  useGetTransactionsFromSafesQuery,
} from '@cardstack/graphql';
import { useMutationEffects } from '@cardstack/hooks';
import { Routes, useLoadingOverlay } from '@cardstack/navigation';
import {
  useLazyGetRegisterRewardeeGasEstimateQuery,
  useRegisterToRewardProgramMutation,
} from '@cardstack/services/rewards-center/rewards-center-api';
import { RewardsSafeType } from '@cardstack/services/rewards-center/rewards-center-types';
import {
  RewardsRegisterData,
  TransactionConfirmationType,
  TokenType,
} from '@cardstack/types';
import {
  groupTransactionsByDate,
  isLayer1,
  sortByTime,
} from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings, useWallets } from '@rainbow-me/hooks';

import { ClaimOrTokenWithdraw, TokenWithSafeAddress } from './components';
import { strings } from './strings';
import useRewardsDataFetch from './useRewardsDataFetch';

const defaultGasEstimateInSpend = convertToSpend(0.07, 'USD', 1);

export const useRewardsCenterScreen = () => {
  const { navigate, dispatch: navDispatch } = useNavigation();
  const { accountAddress, network } = useAccountSettings();

  const {
    rewardSafes,
    rewardPoolTokenBalances,
    defaultRewardProgramId,
    isLoading,
    mainPoolTokenInfo,
  } = useRewardsDataFetch();

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
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardSafes, defaultRewardProgramId]
  );

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { signerParams } = useWallets();

  const onMutationEndAlert = useCallback(
    ({ title, message, popStackNavigation = 0 }) => () => {
      dismissLoadingOverlay();

      Alert({
        message,
        title,
        buttons: [
          {
            text: 'Okay',
            onPress: popStackNavigation
              ? () => {
                  navDispatch(StackActions.pop(popStackNavigation));
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
            popStackNavigation: 2,
          }),
        },
        error: {
          status: isRegistrationError,
          callback: onMutationEndAlert(defaultErrorAlert),
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
        rewardProgramId,
        signerParams,
      });
    },
    [accountAddress, registerToRewardProgram, showLoadingOverlay, signerParams]
  );

  const [
    getRegisterGasEstimate,
    { data: registerEstimatedGas, isError: hasRegisterGasErrored },
  ] = useLazyGetRegisterRewardeeGasEstimateQuery();

  const registerConfirmationData = useRef<RewardsRegisterData>({
    type: TransactionConfirmationType.REWARDS_REGISTER,
    programName: 'Cardstack Rewards',
    prepaidCard: '',
    spendAmount: defaultGasEstimateInSpend,
  });

  const updateRegisterConfirmationDataWith = useCallback(
    (overwriteParams: Partial<RewardsRegisterData>) => {
      registerConfirmationData.current = {
        ...registerConfirmationData.current,
        ...overwriteParams,
      };
    },
    []
  );

  const onPrepaidCardSelection = useCallback(
    async prepaidCard => {
      showLoadingOverlay({
        title: strings.register.gasLoading,
      });

      updateRegisterConfirmationDataWith({
        prepaidCard: prepaidCard.address,
      });

      getRegisterGasEstimate({
        prepaidCardAddress: prepaidCard.address,
        rewardProgramId: defaultRewardProgramId,
      });
    },
    [
      getRegisterGasEstimate,
      showLoadingOverlay,
      updateRegisterConfirmationDataWith,
      defaultRewardProgramId,
    ]
  );

  const navigateToRegisterTxConfirmation = useCallback(() => {
    dismissLoadingOverlay();

    // Update estimate if exists, otherwise use default value
    if (registerEstimatedGas) {
      updateRegisterConfirmationDataWith({
        spendAmount: registerEstimatedGas,
      });
    }

    navigate(Routes.TRANSACTION_CONFIRMATION_SHEET, {
      data: registerConfirmationData.current,
      onConfirm: onRegisterConfirmPress(
        registerConfirmationData.current.prepaidCard,
        defaultRewardProgramId
      ),
    });
  }, [
    dismissLoadingOverlay,
    navigate,
    onRegisterConfirmPress,
    registerEstimatedGas,
    updateRegisterConfirmationDataWith,
    defaultRewardProgramId,
  ]);

  useEffect(() => {
    // Navigate even if there's an error on gasEstimate, it uses default value
    if (registerEstimatedGas || hasRegisterGasErrored) {
      navigateToRegisterTxConfirmation();
    }
  }, [
    hasRegisterGasErrored,
    navigateToRegisterTxConfirmation,
    registerEstimatedGas,
  ]);

  const onRegisterPress = useCallback(() => {
    navigate(Routes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: defaultGasEstimateInSpend,
      onConfirmChoosePrepaidCard: onPrepaidCardSelection,
      payCostDesc: strings.register.payCostDescription.toUpperCase(),
    });
  }, [navigate, onPrepaidCardSelection]);

  const {
    data: rewardClaims,
    refetch: refetchClaimHistory,
  } = useGetRewardClaimsQuery({
    skip: !accountAddress,
    variables: {
      rewardeeAddress: accountAddress,
    },
    context: { network },
  });

  const rewardSafesAddresses = useMemo(
    () => rewardSafes?.map(({ address }) => address),
    [rewardSafes]
  );

  const {
    data: rewardSafeWithdraws,
    refetch: refetchWithdrawHistory,
  } = useGetTransactionsFromSafesQuery({
    skip: !rewardSafesAddresses || isLayer1(network),
    variables: {
      safeAddresses: rewardSafesAddresses,
      relayAddress: !isLayer1(network)
        ? getAddressByNetwork('relay', network)
        : '',
    },
    context: { network },
  });

  const historySectionData = useMemo(
    () => ({
      sections: Object.entries(
        groupBy(
          [
            ...(rewardClaims?.rewardeeClaims || []),
            ...(rewardSafeWithdraws?.tokenTransfers || []),
          ],
          groupTransactionsByDate
        )
      )
        .map(([title, data]) => ({
          title,
          data: data.sort(sortByTime) as ClaimOrTokenWithdraw[],
        }))
        .sort((a, b) => sortByTime(a.data[0], b.data[0])),
    }),
    [rewardClaims, rewardSafeWithdraws]
  );

  // Refetchs when rewardSafes or rewardPoolTokenBalances updates
  useEffect(() => {
    refetchClaimHistory();
    refetchWithdrawHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardSafes, rewardPoolTokenBalances]);

  const tokensBalanceData = useMemo(
    () => ({
      // Get tokens from all rewardSafes
      data: rewardSafes?.reduce(
        (tokens: TokenType[], safe: RewardsSafeType) => {
          const tokensWithAddress = safe.tokens?.map(token => ({
            ...token,
            safeAddress: safe.address,
          }));

          return [...tokens, ...tokensWithAddress] as TokenWithSafeAddress[];
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
    isLoading,
    historySectionData,
    tokensBalanceData,
  };
};
