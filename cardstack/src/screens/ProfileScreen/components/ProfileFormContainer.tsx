import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';

import { avatarColor } from '@cardstack/theme';

import { useAccountProfile } from '@rainbow-me/hooks';

interface ProfileFormData {
  businessName: string;
  businessId: string;
  businessColor: string;
}
interface ProfileFormContextType extends ProfileFormData {
  onUpdateProfileForm: (data: ProfileFormData) => void;
}

export const ProfileFormContext = createContext<ProfileFormContextType>({
  businessName: '',
  businessId: '',
  businessColor: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdateProfileForm: (_: ProfileFormData) => {},
});

export const ProfileFormContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accountColor } = useAccountProfile();

  const [businessNameAndId, setBusinessNameAndId] = useState<{
    name: string;
    id: string;
  }>({ name: '', id: '' });

  const [businessColor, setBusinessColor] = useState<string>(
    avatarColor[accountColor]
  );

  useEffect(() => {
    // ToDo: use default avatar colors before implement color picker
    if (accountColor && !businessColor) {
      setBusinessColor(avatarColor[accountColor]);
    } else if (!accountColor && !businessColor) {
      setBusinessColor(avatarColor[0]);
    }
  }, [accountColor, businessColor]);

  const onUpdateProfileForm = useCallback((formData: ProfileFormData) => {
    setBusinessNameAndId({
      name: formData.businessName,
      id: formData.businessId,
    });

    setBusinessColor(formData.businessColor);
  }, []);

  const contextValues = useMemo(
    () => ({
      businessName: businessNameAndId.name,
      businessId: businessNameAndId.id,
      businessColor,
      onUpdateProfileForm,
    }),
    [businessColor, businessNameAndId, onUpdateProfileForm]
  );

  return (
    <ProfileFormContext.Provider value={contextValues}>
      {children}
    </ProfileFormContext.Provider>
  );
};
