import React, { memo, useCallback, useRef } from 'react';

import { VERSION_TAP_COUNT } from 'react-native-dotenv';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Text } from '@cardstack/components';
import { useTabBarFlag } from '@cardstack/navigation/tabBarNavigator';
import { useAppVersion } from '@rainbow-me/hooks';

const AppVersionStamp = () => {
  const appVersion = useAppVersion();
  const numberOfTaps = useRef(0);

  const { setIsTabBarEnabled, isTabBarEnabled } = useTabBarFlag();

  const handleVersionPress = useCallback(async () => {
    numberOfTaps.current++;

    if (numberOfTaps.current === parseInt(VERSION_TAP_COUNT)) {
      setIsTabBarEnabled(!isTabBarEnabled);
    }
  }, [isTabBarEnabled, setIsTabBarEnabled]);

  return (
    <TouchableWithoutFeedback onPress={handleVersionPress}>
      <Text color="grayText" weight="bold" size="small">
        Version {appVersion}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default memo(AppVersionStamp);
