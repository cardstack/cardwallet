import { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import { ProfileFormContext, strings, exampleMerchantData } from './components';
import { useAuthToken } from '@cardstack/hooks';
import { MainRoutes, useLoadingOverlay } from '@cardstack/navigation';
import {
  checkBusinessIdUniqueness,
  createBusinessInfoDID,
} from '@cardstack/services/hub-service';
import {
  useAccountProfile,
  useAccountSettings,
  useWallets,
} from '@rainbow-me/hooks';
import {
  RegisterMerchantDecodedData,
  PrepaidCardType,
  TransactionConfirmationType,
} from '@cardstack/types';
import {
  useGetSafesDataQuery,
  useCreateProfileMutation,
} from '@cardstack/services';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import { logger } from '@rainbow-me/utils';
import { colors } from '@cardstack/theme';

const CreateProfileFeeInSpend = 100;

type useProfileFormParams = {
  onFormSubmitSuccess?: () => void;
};

export const useProfileForm = (params?: useProfileFormParams) => {
  const { navigate } = useNavigation();
  const { authToken, isLoading } = useAuthToken();
  const { accountSymbol } = useAccountProfile();
  const { accountAddress, network, nativeCurrency } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { refetch: refetchSafes, isFetching } = useGetSafesDataQuery(
    { address: accountAddress, nativeCurrency },
    {
      skip: !accountAddress,
    }
  );

  const { selectedWallet } = useWallets();

  const [
    createProfile,
    { isSuccess, isError, error },
  ] = useCreateProfileMutation();

  useEffect(() => {
    if (isError) {
      dismissLoadingOverlay();
      logger.sentry('Error creating profile-', error);
      Alert.alert(
        'Could not create profile, please try again. If this problem persists please reach out to support@cardstack.com'
      );
    }
  }, [dismissLoadingOverlay, error, isError]);

  useEffect(() => {
    if (isSuccess && !isFetching) {
      dismissLoadingOverlay();
      navigate(RainbowRoutes.HOME_SCREEN);
    }
  }, [dismissLoadingOverlay, isSuccess, isFetching, navigate]);

  const {
    businessName: businessNameData,
    businessId: businessIdData,
    businessColor: businessColorData,
    onUpdateProfileForm,
  } = useContext(ProfileFormContext);

  const [isUniqueId, setIdUniqueness] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>(businessNameData);
  const [businessId, setBusinessId] = useState<string>(businessIdData);

  const [
    selectedPrepaidCard,
    setPrepaidCard,
  ] = useState<PrepaidCardType | null>(null);

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

    if (isUniqueId && businessName.trim() && !validateMerchantId(businessId)) {
      onUpdateProfileForm({
        businessName,
        businessId,
        businessColor,
      });

      params?.onFormSubmitSuccess && params?.onFormSubmitSuccess();
    }
  }, [
    isUniqueId,
    onUpdateProfileForm,
    businessName,
    businessId,
    businessColor,
    params,
  ]);

  const avatarName = useMemo(
    () =>
      businessName || accountSymbol || exampleMerchantData.merchantInfo.name,
    [accountSymbol, businessName]
  );

  const onConfirmCreateProfile = useCallback(async () => {
    if (!isLoading && authToken && selectedPrepaidCard) {
      showLoadingOverlay({ title: 'Creating Profile' });

      const merchantInfoData = {
        name: businessName,
        slug: businessId,
        color: businessColor,
        'text-color': '#fff',
      };

      const profileDID = await createBusinessInfoDID(
        merchantInfoData,
        authToken
      );

      if (!profileDID) {
        return;
      }

      await createProfile({
        selectedWallet,
        network,
        selectedPrepaidCardAddress: selectedPrepaidCard.address,
        profileDID,
      });

      refetchSafes();
    }
  }, [
    isLoading,
    authToken,
    selectedPrepaidCard,
    businessName,
    businessId,
    businessColor,
    createProfile,
    selectedWallet,
    network,
    refetchSafes,
    showLoadingOverlay,
  ]);

  const newMerchantInfo = useMemo(
    () => ({
      color: businessColor,
      name: businessName,
      did: '',
      textColor: colors.white,
      slug: businessId,
      ownerAddress: '',
    }),
    [businessColor, businessId, businessName]
  );

  const onPressCreate = useCallback(() => {
    if (selectedPrepaidCard) {
      // profile create confirmation screen params
      const data: RegisterMerchantDecodedData = {
        type: TransactionConfirmationType.REGISTER_MERCHANT,
        spendAmount: CreateProfileFeeInSpend,
        prepaidCard: selectedPrepaidCard.address,
        merchantInfo: newMerchantInfo,
      };

      navigate(MainRoutes.TRANSACTION_CONFIRMATION_SHEET, {
        data,
        onConfirm: onConfirmCreateProfile,
      });
    } else {
      navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
        spendAmount: CreateProfileFeeInSpend,
        onConfirmChoosePrepaidCard: setPrepaidCard,
      });
    }
  }, [
    onConfirmCreateProfile,
    navigate,
    newMerchantInfo,
    selectedPrepaidCard,
    setPrepaidCard,
  ]);

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
    selectedPrepaidCard,
    setPrepaidCard,
    onPressCreate,
    newMerchantInfo,
  };
};
