import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text } from '@cardstack/components';
import { useBottomToast } from '@cardstack/hooks';
import {
  setUserAccessType,
  UserAccessType,
} from '@cardstack/services/analytics';
import { forceFetch } from '@cardstack/services/remote-config';

import { useAppVersion } from '@rainbow-me/hooks';

import logger from 'logger';

const AppVersionStamp = () => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);
  const { ToastComponent, showToast } = useBottomToast();

  const handleVersionPress = useCallback(async () => {
    // Temporarely only allowing to switch to beta on DEV.
    // We'll need a PIN validation before moving to prod.
    if (!__DEV__) return;

    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        await setUserAccessType(UserAccessType.BETA);
        await forceFetch();
        showToast({ label: `User now part of ${UserAccessType.BETA} access.` });
      } catch (error) {
        logger.error('Error while trying to set user property.', error);
      }
    }
  }, [showToast]);

  return (
    <>
      <TouchableWithoutFeedback onPress={handleVersionPress}>
        <Text color="grayText" size="small" weight="bold">
          Version {appVersion}
        </Text>
      </TouchableWithoutFeedback>
      <ToastComponent />
    </>
  );
};

export default memo(AppVersionStamp);
