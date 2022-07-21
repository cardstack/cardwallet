import { useRoute } from '@react-navigation/native';
import { useState, useCallback } from 'react';

import { RouteType } from '@cardstack/navigation/types';

interface NavParams {
  profileUrl: string;
}

export const useProfileNameScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();

  const [profileName, setProfileName] = useState('');

  const profileUrl = params?.profileUrl || 'mandello.card.yxz'; // Temp url

  const onChangeText = useCallback(text => {
    setProfileName(text);
  }, []);

  const onContinuePress = useCallback(() => {
    // TDB
    console.log({ profileName });
  }, [profileName]);

  const onSkipPress = useCallback(() => {
    // TDB
  }, []);

  return {
    onSkipPress,
    onContinuePress,
    onChangeText,
    profileUrl,
    profileName,
  };
};
