import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { avatarColor } from '@cardstack/theme';
import { useAccountProfile } from '@rainbow-me/hooks';

interface ProfileFormContextType {
  businessName: string;
  businessId: string;
  businessColor: string;
  isUniqueId: boolean;
  setBusinessName: Dispatch<SetStateAction<string>>;
  setBusinessId: Dispatch<SetStateAction<string>>;
  setBusinessColor: Dispatch<SetStateAction<string>>;
  setIdUniqueness: Dispatch<SetStateAction<boolean>>;
}

export const ProfileFormContext = createContext<ProfileFormContextType>({
  businessName: '',
  businessId: '',
  businessColor: '',
  isUniqueId: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBusinessName: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBusinessId: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBusinessColor: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIdUniqueness: () => {},
});

export const ProfileFormContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accountColor } = useAccountProfile();
  const [businessName, setBusinessName] = useState<string>('');
  const [businessId, setBusinessId] = useState<string>('');
  const [isUniqueId, setIdUniqueness] = useState<boolean>(false);

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

  const contextValues = useMemo(
    () => ({
      businessName,
      setBusinessName,
      businessId,
      setBusinessId,
      businessColor,
      setBusinessColor,
      isUniqueId,
      setIdUniqueness,
    }),
    [businessColor, businessId, businessName, isUniqueId]
  );

  return (
    <ProfileFormContext.Provider value={contextValues}>
      {children}
    </ProfileFormContext.Provider>
  );
};
