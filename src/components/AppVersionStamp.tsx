import React, { memo, useCallback, useRef } from 'react';
import { Alert, TouchableWithoutFeedback } from 'react-native';

import { Text } from '@cardstack/components';
import { useAppVersion, useWalletsDebug } from '@rainbow-me/hooks';

const VERSION_TAP_COUNT = 3;

const AppVersionStamp = () => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);
  const debug = useWalletsDebug();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === VERSION_TAP_COUNT) {
      const { status, data } = await debug();
      if (status === 'restored') {
        Alert.alert('Account restored successfully!', data);
      } else {
        Alert.alert('DEBUG INFO', data);
      }
    }
  }, [debug]);

  return (
    <TouchableWithoutFeedback onPress={handleVersionPress}>
      <Text color="grayText" fontWeight="bold" size="small">
        {appVersion}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default memo(AppVersionStamp);
