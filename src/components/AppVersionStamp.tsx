import React, { memo, useCallback, useRef } from 'react';
import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text, useMessageOverlay } from '@cardstack/components';
import { appVersion } from '@cardstack/constants';
import { useRemoteConfigs } from '@cardstack/hooks';
import {
  setUserAccessType,
  UserAccessType,
} from '@cardstack/services/analytics';

import logger from 'logger';

const AppVersionStamp = ({ showBetaUserDisclaimer = false }) => {
  const numberOfTaps = useRef(0);
  const { configs, fetchRemoteConfigs } = useRemoteConfigs();

  const { showMessage } = useMessageOverlay();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        if (configs.betaAccessGranted) {
          await setUserAccessType(null);
          showMessage({
            message: (
              <Text>
                Removed from <Text variant="bold">{UserAccessType.BETA}</Text>{' '}
                access.
              </Text>
            ),
          });
        } else {
          await setUserAccessType(UserAccessType.BETA);
          showMessage({
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
  }, [configs, fetchRemoteConfigs, showMessage]);

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
    </>
  );
};

export default memo(AppVersionStamp);
