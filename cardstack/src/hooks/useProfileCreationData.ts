import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

import { Routes } from '@cardstack/navigation/routes';
import { CreateBusinessInfoDIDParams } from '@cardstack/types';
import { contrastingTextColor } from '@cardstack/utils';

import { useAccountProfile } from '@rainbow-me/hooks';

export const useProfileCreationData = () => {
  const { navigate } = useNavigation();

  const [profile, setProfileInfo] = useState<CreateBusinessInfoDIDParams>();
  const { accountAddress = '' } = useAccountProfile();

  // todo: move to new hook
  const updateProfileInfo = useCallback(
    (values: Partial<CreateBusinessInfoDIDParams>) => {
      const updateProfile = { ...profile, ...values };
      setProfileInfo(updateProfile as CreateBusinessInfoDIDParams);
    },
    [profile, setProfileInfo]
  );

  const onSelectColor = useCallback(
    (color: string) => {
      const validColor = (color || '').startsWith('#') ? color : `#${color}`;

      const upperCaseColor = validColor
        .replace(/[^#0-9a-fA-F]/gi, '')
        .toUpperCase();

      updateProfileInfo({
        color: upperCaseColor,
        'text-color': contrastingTextColor(upperCaseColor),
      });
    },
    [updateProfileInfo]
  );

  const onPressBusinessColor = useCallback(() => {
    navigate(Routes.COLOR_PICKER_MODAL, {
      onSelectColor,
    });
  }, [navigate, onSelectColor]);

  const profileAttributes = useMemo(
    () => ({
      ...(profile as CreateBusinessInfoDIDParams),
      ownerAddress: accountAddress,
    }),
    [profile, accountAddress]
  );

  return {
    profile,
    profileAttributes,
    updateProfileInfo,
    onPressBusinessColor,
  };
};
