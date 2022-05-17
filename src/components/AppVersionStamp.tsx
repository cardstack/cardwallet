import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Text } from '@cardstack/components';
import { useToast } from '@cardstack/hooks';
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
  const { ToastComponent, setToast } = useToast();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      numberOfTaps.current = 0;
      try {
        await setUserAccessType(UserAccessType.BETA);
        await forceFetch();
        setToast({ label: `User now part of ${UserAccessType.BETA} access.` });
      } catch (error) {
        logger.error('Error while trying to set user property.', error);
      }
    }
  }, [setToast]);

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
