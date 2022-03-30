import { useCallback, useEffect, useMemo, useRef } from 'react';
import { convertToSpend } from '@cardstack/cardpay-sdk';
import { useNavigation, StackActions } from '@react-navigation/core';
import { groupBy } from 'lodash';
import { strings } from './strings';
import { TokensWithSafeAddress } from './components';
import {
  RewardsRegisterData,
  RewardsClaimData,
  TransactionConfirmationType,
  TokenType,
} from '@cardstack/types';
import {
  useClaimRewardsMutation,
  useGetRewardPoolTokenBalancesQuery,
  useGetRewardsSafeQuery,
  useLazyGetRegisterRewardeeGasEstimateQuery,
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
import { defaultErrorAlert } from '@cardstack/constants';

const rewardDefaultProgramId = {
  [networkTypes.sokol]: '0x5E4E148baae93424B969a0Ea67FF54c315248BbA',
  // TestID
  [networkTypes.xdai]: '0x979C9F171fb6e9BC501Aa7eEd71ca8dC27cF1185',
};

const defaultGasEstimateInSpend = convertToSpend(0.07, 'USD', 1);

export const useRewardsCenterScreen = () => {
  const { navigate, goBack, dispatch: navDispatch } = useNavigation();
  const { accountAddress, nativeCurrency, network } = useAccountSettings();

  const query = useMemo(
    () => ({
      params: {
        accountAddress,
        nativeCurrency,
      },
      options: {
        skip: !accountAddress,
        refetchOnMountOrArgChange: 30,
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
    { isSuccess: isClaimSuccess, isError: isClaimError },
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
        rewardProgramId: rewardDefaultProgramId[network],
      });
    },
    [
      getRegisterGasEstimate,
      network,
      showLoadingOverlay,
      updateRegisterConfirmationDataWith,
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

    navigate(MainRoutes.TRANSACTION_CONFIRMATION_SHEET, {
      data: registerConfirmationData.current,
      onConfirm: onRegisterConfirmPress(
        registerConfirmationData.current.prepaidCard,
        rewardDefaultProgramId[network]
      ),
    });
  }, [
    dismissLoadingOverlay,
    navigate,
    network,
    onRegisterConfirmPress,
    registerEstimatedGas,
    updateRegisterConfirmationDataWith,
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
    navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: defaultGasEstimateInSpend,
      onConfirmChoosePrepaidCard: onPrepaidCardSelection,
      payCostDesc: strings.register.payCostDescription.toUpperCase(),
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
            popStackNavigation: 1,
          }),
        },
        error: {
          status: isClaimError,
          callback: onMutationEndAlert(defaultErrorAlert),
        },
      }),
      [isClaimError, isClaimSuccess, onMutationEndAlert]
    )
  );

  const onClaimPress = useCallback(
    (tokenAddress, rewardProgramId) => () => {
      const rewardSafeForProgram = rewardSafes?.find(
        safe => safe.rewardProgramId === rewardProgramId
      );

      // Cant assign undefined mainPoolTokenInfo to data.
      if (mainPoolTokenInfo) {
        const data: RewardsClaimData = {
          type: TransactionConfirmationType.REWARDS_CLAIM,
          estGasFee: 0.01,
          ...mainPoolTokenInfo,
        };

        navigate(MainRoutes.REWARDS_CLAIM_SHEET, {
          data,
          onConfirm: () => {
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
          onCancel: goBack,
        });
      }
    },
    [
      accountAddress,
      claimRewards,
      network,
      rewardSafes,
      selectedWallet.id,
      showLoadingOverlay,
      navigate,
      goBack,
      mainPoolTokenInfo,
    ]
  );

  const { data, refetch: refetchClaimHistory } = useGetRewardClaimsQuery({
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

  // Refetchs when rewardSafes or rewardPoolTokenBalances updates
  useEffect(() => {
    refetchClaimHistory();
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
