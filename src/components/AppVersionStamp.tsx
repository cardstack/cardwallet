import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text, useToast } from '@cardstack/components';
import { useRemoteConfigs } from '@cardstack/hooks';
import {
  setUserAccessType,
  UserAccessType,
} from '@cardstack/services/analytics';

import { useAppVersion } from '@rainbow-me/hooks';

import logger from 'logger';

const AppVersionStamp = ({ showBetaUserDisclaimer = false }) => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);
  const { configs, fetchRemoteConfigs } = useRemoteConfigs();

  const { showToast } = useToast();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        if (configs.betaAccessGranted) {
          await setUserAccessType(null);
          showToast({
            message: (
              <Text>
                Removed from <Text variant="bold">{UserAccessType.BETA}</Text>{' '}
                access.Removed from{' '}
                <Text variant="bold">{UserAccessType.BETA}</Text> access.
              </Text>
            ),
          });
        } else {
          await setUserAccessType(UserAccessType.BETA);
          showToast({
            message: (
              <Text>
                You are now part of{' '}
                <Text variant="bold">{UserAccessType.BETA}</Text> access.
              </Text>
            ),
          });
        }
        await fetchRemoteConfigs();
      } catch (error) {
        logger.error('Error while trying to set user property.', error);
      }
    }
  }, [configs, fetchRemoteConfigs, showToast]);

  return (
    <>
      <TouchableWithoutFeedback onPress={handleVersionPress}>
        <Text color="grayText" size="xs" textAlign="center">
          Version {appVersion}
        </Text>
        {showBetaUserDisclaimer && configs.betaAccessGranted && (
          <Text color="grayText" padding={6} size="xs" textAlign="center">
            Disclaimer: BETA features may contain unknown bugs, use them at you
            own discretion.
          </Text>
        )}
      </TouchableWithoutFeedback>
      {/* <ToastComponent /> */}
    </>
  );
};

export default memo(AppVersionStamp);
