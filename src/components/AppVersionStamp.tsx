import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text } from '@cardstack/components';
import { useBottomToast } from '@cardstack/hooks';
import {
  setUserAccessType,
  UserAccessType,
} from '@cardstack/services/analytics';
import { forceFetch, remoteFlags } from '@cardstack/services/remote-config';

import { useAppVersion } from '@rainbow-me/hooks';

import logger from 'logger';

const AppVersionStamp = () => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);
  const { ToastComponent, showToast } = useBottomToast();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        if (remoteFlags().betaAccessGranted) {
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
        await forceFetch();
      } catch (error) {
        logger.error('Error while trying to set user property.', error);
      }
    }
  }, [showToast]);

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
