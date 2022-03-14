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
  const [businessName, setBusinessName] = useState<string>('');
  const [businessId, setBusinessId] = useState<string>('');

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
    setBusinessName(formData.businessName);
    setBusinessId(formData.businessId);
    setBusinessColor(formData.businessColor);
  }, []);

  const contextValues = useMemo(
    () => ({
      businessName,
      businessId,
      businessColor,
      onUpdateProfileForm,
    }),
    [businessColor, businessId, businessName, onUpdateProfileForm]
  );

  return (
    <ProfileFormContext.Provider value={contextValues}>
      {children}
    </ProfileFormContext.Provider>
  );
};
