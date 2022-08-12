import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useLoadingOverlay } from '@cardstack/navigation';
import { useUpdateProfileInfoMutation } from '@cardstack/services';
import { UpdateProfileInfoParams } from '@cardstack/services/hub/hub-types';

import { Alert } from '@rainbow-me/components/alerts';
import logger from 'logger';

import { useMutationEffects } from '../useMutationEffects';

const strings = {
  loading: 'Updating your profile',
};

export const useProfileUpdate = () => {
  const { goBack } = useNavigation();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const [
    updateProfileWith,
    { isSuccess, isError },
  ] = useUpdateProfileInfoMutation();

  const updateProfile = useCallback(
    (newProfileInfo: UpdateProfileInfoParams) => {
      showLoadingOverlay({ title: strings.loading });

      updateProfileWith(newProfileInfo);
    },
    [showLoadingOverlay, updateProfileWith]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: () => {
            dismissLoadingOverlay();
            goBack();
          },
        },
        error: {
          status: isError,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error updating profile');

            Alert(defaultErrorAlert);
          },
        },
      }),
      [dismissLoadingOverlay, goBack, isError, isSuccess]
    )
  );

  return {
    updateProfile,
  };
};
