import { useNavigation } from '@react-navigation/native';
import { useRef, useMemo, useCallback } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useLoadingOverlay, Routes } from '@cardstack/navigation';
import {
  useCreateProfileMutation,
  useCreateProfileInfoMutation,
} from '@cardstack/services';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';
import {
  TransactionConfirmationType,
  MerchantInformation,
  PrepaidCardType,
} from '@cardstack/types';
import { transformObjKeysToCamelCase } from '@cardstack/utils';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings } from '@rainbow-me/hooks';
import logger from 'logger';

import { useMutationEffects } from '..';

const strings = {
  loading: 'Creating profile',
};

const CreateProfileFeeInSpend = 100;

export const useCreateProfile = (profile: CreateProfileInfoParams) => {
  const { navigate } = useNavigation();
  const { accountAddress } = useAccountSettings();

  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const selectedPrepaidCard = useRef('');

  const [
    createProfile,
    { isSuccess, isError, error },
  ] = useCreateProfileMutation();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: () => {
            dismissLoadingOverlay();

            navigate(Routes.PROFILE_SCREEN);
          },
        },
        error: {
          status: isError,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error creating profile', error);

            Alert(defaultErrorAlert);
          },
        },
      }),
      [dismissLoadingOverlay, error, isError, isSuccess, navigate]
    )
  );

  const [
    createProfileInfo,
    {
      isSuccess: isProfileInfoSuccess,
      isError: isProfileInfoSuccessError,
      data: profileDID,
    },
  ] = useCreateProfileInfoMutation();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isProfileInfoSuccess,
          callback: () => {
            if (profileDID) {
              createProfile({
                selectedPrepaidCardAddress: selectedPrepaidCard.current,
                profileDID,
                accountAddress,
              });
            }
          },
        },
        error: {
          status: isProfileInfoSuccessError,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error creating profile did');

            Alert(defaultErrorAlert);
          },
        },
      }),
      [
        accountAddress,
        createProfile,
        dismissLoadingOverlay,
        isProfileInfoSuccess,
        isProfileInfoSuccessError,
        profileDID,
      ]
    )
  );

  const buildTxConfirmationData = useCallback(
    (prepaidCardAddress: string) => {
      selectedPrepaidCard.current = prepaidCardAddress;

      return {
        type: TransactionConfirmationType.REGISTER_MERCHANT,
        spendAmount: CreateProfileFeeInSpend,
        prepaidCard: prepaidCardAddress,
        merchantInfo: transformObjKeysToCamelCase(
          profile
        ) as MerchantInformation,
      };
    },
    [profile]
  );

  const purchaseWithPrepaidCard = useCallback(() => {
    navigate(Routes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: CreateProfileFeeInSpend,
      onConfirmChoosePrepaidCard: (prepaidCard: PrepaidCardType) => {
        // Go to Tx_Sheet with profile and card info
        navigate(Routes.TRANSACTION_CONFIRMATION_SHEET, {
          data: buildTxConfirmationData(prepaidCard.address),
          // On confirm profile register tx
          onConfirm: () => {
            showLoadingOverlay({ title: strings.loading });
            // Creates DID
            createProfileInfo(profile);
          },
        });
      },
    });
  }, [
    buildTxConfirmationData,
    createProfileInfo,
    navigate,
    profile,
    showLoadingOverlay,
  ]);

  return {
    purchaseWithPrepaidCard,
  };
};
