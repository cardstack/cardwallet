import { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { ProfileFormContext, strings, exampleMerchantData } from './components';
import { useAuthToken } from '@cardstack/hooks';
import { checkBusinessIdUniqueness } from '@cardstack/services/hub-service';
import { useAccountProfile } from '@rainbow-me/hooks';

type useProfileFormParams = {
  onFormSubmitSuccess?: () => void;
};

export const useProfileForm = (params?: useProfileFormParams) => {
  const { authToken, isLoading } = useAuthToken();
  const { accountName } = useAccountProfile();

  const {
    businessName: businessNameData,
    businessId: businessIdData,
    businessColor: businessColorData,
    onUpdateProfileForm,
  } = useContext(ProfileFormContext);

  const [isUniqueId, setIdUniqueness] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>(businessNameData);
  const [businessId, setBusinessId] = useState<string>(businessIdData);
  // ToDo: update with custom color picker
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessColor, setBusinessColor] = useState<string>(businessColorData);
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const checkIdUniqueness = useCallback(
    async (id: string) => {
      if (!isLoading && authToken && id) {
        const uniquenessResult = await checkBusinessIdUniqueness(id, authToken);

        if (uniquenessResult?.slugAvailable) {
          setIdUniqueness(true);
        }
      }
    },
    [authToken, isLoading]
  );

  useEffect(() => {
    if (businessId && authToken && !isLoading) {
      // check unqiuness when get back to the screen again
      checkIdUniqueness(businessId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, checkIdUniqueness, isLoading]);

  const onChangeBusinessName = useCallback(
    ({ nativeEvent: { text } }) => {
      setBusinessName(text);
    },
    [setBusinessName]
  );

  const onChangeBusinessId = useCallback(
    async ({ nativeEvent: { text } }) => {
      setBusinessId(text);
      setIdUniqueness(false);

      await checkIdUniqueness(text);
    },
    [checkIdUniqueness]
  );

  const errors = useMemo(() => {
    if (!isSubmitPressed) return;

    return {
      businessName: businessName.trim()
        ? undefined
        : strings.businessNameRequired,
      businessId: !isUniqueId
        ? strings.businessIdShouldBeUnique
        : validateMerchantId(businessId),
    };
  }, [isSubmitPressed, businessName, isUniqueId, businessId]);

  const onSubmitForm = useCallback(() => {
    setIsSubmitPressed(true);

    if (isUniqueId && !errors?.businessId && !errors?.businessName) {
      onUpdateProfileForm({
        businessName,
        businessId,
        businessColor,
      });

      params?.onFormSubmitSuccess && params?.onFormSubmitSuccess();
    }
  }, [
    isUniqueId,
    errors,
    onUpdateProfileForm,
    businessName,
    businessId,
    businessColor,
    params,
  ]);

  const avatarName = useMemo(
    () => businessName || accountName || exampleMerchantData.merchantInfo.name,
    [accountName, businessName]
  );

  return {
    businessName,
    businessId,
    businessColor,
    isUniqueId,
    avatarName,
    errors,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
  };
};
