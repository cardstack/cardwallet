import { useContext, useCallback, useMemo } from 'react';
import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { ProfileFormContext, strings } from './components';
import { useAuthToken } from '@cardstack/hooks';
import { checkBusinessIdUniqueness } from '@cardstack/services/hub-service';

export const useProfileForm = () => {
  // ToDo: update with color picker, for now we use accountColor as businessAccount's default color

  const {
    businessName,
    businessId,
    businessColor,
    isUniqueId,
    setBusinessName,
    setBusinessId,
    setIdUniqueness,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBusinessColor,
  } = useContext(ProfileFormContext);

  const { authToken, isLoading } = useAuthToken();

  const onChangeBusinessName = useCallback(
    ({ nativeEvent: { text } }) => setBusinessName(text),
    [setBusinessName]
  );

  const onChangeBusinessId = useCallback(
    async ({ nativeEvent: { text } }) => {
      setBusinessId(text);
      setIdUniqueness(false);

      if (!isLoading && authToken && text) {
        const uniquenessResult = await checkBusinessIdUniqueness(
          text,
          authToken
        );

        if (uniquenessResult?.slugAvailable) {
          setIdUniqueness(true);
        }
      }
    },
    [authToken, isLoading, setBusinessId, setIdUniqueness]
  );

  const errors = useMemo(() => {
    return {
      businessName: businessName.trim()
        ? undefined
        : strings.businessNameRequired,
      businessId: validateMerchantId(businessId),
    };
  }, [businessName, businessId]);

  return {
    businessName,
    onChangeBusinessName,
    businessId,
    businessColor,
    onChangeBusinessId,
    isUniqueId,
    errors,
  };
};
