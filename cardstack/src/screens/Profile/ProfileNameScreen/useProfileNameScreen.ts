import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useState, useCallback, useMemo } from 'react';

import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { CreateBusinessInfoDIDParams } from '@cardstack/types';
import { contrastingTextColor } from '@cardstack/utils';

import { useAccountProfile } from '@rainbow-me/hooks';

interface NavParams {
  slug: string;
}

export const useProfileNameScreen = () => {
  const {
    params: { slug },
  } = useRoute<RouteType<NavParams>>();

  const { navigate, dispatch: navDispatch } = useNavigation();
  const { accountAddress } = useAccountProfile();

  const [profileName, setProfileName] = useState('');
  const [profileColor, setProfileColor] = useState('#0089F9');

  const profile: CreateBusinessInfoDIDParams = useMemo(
    () => ({
      slug,
      name: profileName,
      color: profileColor,
      'text-color': contrastingTextColor(profileColor),
      'owner-address': accountAddress,
    }),
    [accountAddress, profileColor, profileName, slug]
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
    navigate(Routes.PROFILE_PURCHASE_CTA, { profile });
  }, [navigate, profile]);

  const onSkipPress = useCallback(() => {
    navDispatch(StackActions.pop(2));
  }, [navDispatch]);

  return {
    onSkipPress,
    onContinuePress,
    onChangeText,
    onPressEditColor,
    profile,
  };
};
