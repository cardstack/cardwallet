import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useCallback, useMemo } from 'react';

import { useProfileUpdate } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import { RouteType } from '@cardstack/navigation/types';
import { CreateProfileInfoParams } from '@cardstack/services/hub/hub-types';
import { MerchantInformation } from '@cardstack/types';
import { contrastingTextColor } from '@cardstack/utils';

import { useAccountProfile } from '@rainbow-me/hooks';

interface NavParams extends Partial<MerchantInformation> {
  slug: string;
}

export const useProfileNameScreen = () => {
  const { params } = useRoute<RouteType<NavParams>>();

  const { slug, ...currentProfile } = params;

  const { navigate } = useNavigation();
  const { accountAddress } = useAccountProfile();

  const [profileName, setProfileName] = useState(currentProfile.name || '');

  const [profileColor, setProfileColor] = useState(
    currentProfile.color || '#0089F9'
  );

  const { updateProfile } = useProfileUpdate();

  const profile: CreateProfileInfoParams = useMemo(
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

  const isBlocked = useMemo(
    () =>
      !profile.name ||
      (currentProfile.name === profile.name &&
        currentProfile.color === profile.color),
    [profile, currentProfile]
  );

  const onContinuePress = useCallback(() => {
    // creation flow
    if (!currentProfile.name) {
      navigate(Routes.PROFILE_PURCHASE_CTA, { profile });

      return;
    }

    // update flow
    updateProfile({ ...profile, id: currentProfile.id || '' });
  }, [navigate, profile, currentProfile, updateProfile]);

  return {
    onContinuePress,
    onChangeText,
    onPressEditColor,
    profile,
    isUpdating: !!currentProfile.name,
    isBlocked,
  };
};
