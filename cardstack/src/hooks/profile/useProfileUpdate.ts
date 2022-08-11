import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

import { defaultErrorAlert } from '@cardstack/constants';
import { useLoadingOverlay } from '@cardstack/navigation';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';

import { Alert } from '@rainbow-me/components/alerts';
import logger from 'logger';

import { useMutationEffects } from '../useMutationEffects';

const strings = {
  loading: 'Updating your profile',
};

export const useProfileUpdate = () => {
  const { goBack } = useNavigation();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  // TODO: update this with the correct mutation after hub is done
  const updateProfile = useCallback(
    (profile: CreateProfileInfoParams) => {
      showLoadingOverlay({ title: strings.loading });
      console.log('profile', profile);

      // TODO: call mutations
    },
    [showLoadingOverlay]
  );

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: false,
          callback: () => {
            dismissLoadingOverlay();
            goBack();
          },
        },
        error: {
          status: false,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error updating profile');

            Alert(defaultErrorAlert);
          },
        },
      }),
      [dismissLoadingOverlay, goBack]
    )
  );

  return {
    updateProfile,
  };
};
