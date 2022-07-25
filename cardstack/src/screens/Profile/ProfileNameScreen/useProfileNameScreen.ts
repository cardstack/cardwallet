import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { contrastingTextColor } from '@cardstack/utils';

interface NavParams {
  profileUrl: string;
}

export const useProfileNameScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();
  const { navigate } = useNavigation();

  const [profileName, setProfileName] = useState('');
  const [profileColor, setProfileColor] = useState('#0089f9');

  const profileUrl = params?.profileUrl || 'mandello.card.yxz'; // Temp url

  const profile = useMemo(
    () => ({
      name: profileName,
      slug: profileUrl,
      color: profileColor,
      'text-color': contrastingTextColor(profileColor),
    }),
    [profileColor, profileName, profileUrl]
  );

  const onChangeText = useCallback(text => {
    setProfileName(text);
  }, []);

  const onPressEditColor = useCallback(() => {
    navigate(Routes.COLOR_PICKER_MODAL, {
      defaultColor: profileColor,
      onSelectColor: setProfileColor,
    });
  }, [navigate, profileColor]);

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
    onPressEditColor,
    profile,
  };
};
