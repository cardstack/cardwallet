import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text } from '@cardstack/components';
import { useBottomToast, useRemoteConfigs } from '@cardstack/hooks';
import {
  setUserAccessType,
  UserAccessType,
} from '@cardstack/services/analytics';

import { useAppVersion } from '@rainbow-me/hooks';

import logger from 'logger';

const AppVersionStamp = () => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);
  const { ToastComponent, showToast } = useBottomToast();
  const { configs, fetchRemoteConfigs } = useRemoteConfigs();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        if (configs.betaAccessGranted) {
          await setUserAccessType(null);
          showToast({
            label: `Removed from ${UserAccessType.BETA} access.`,
          });
        } else {
          await setUserAccessType(UserAccessType.BETA);
          showToast({
            label: `You are now part of ${UserAccessType.BETA} access.`,
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
        <Text color="grayText" size="xs">
          Version {appVersion}
        </Text>
      </TouchableWithoutFeedback>
      <ToastComponent />
    </>
  );
};

export default memo(AppVersionStamp);
