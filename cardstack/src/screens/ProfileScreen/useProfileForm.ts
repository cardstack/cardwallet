import { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import { ProfileFormContext, strings, exampleMerchantData } from './components';
import { useAuthToken, useMutationEffects } from '@cardstack/hooks';
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
import { useCreateProfileMutation } from '@cardstack/services';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import { logger } from '@rainbow-me/utils';
import { colors } from '@cardstack/theme';
import { displayLocalNotification } from '@cardstack/notification-handler';

const CreateProfileFeeInSpend = 100;

type useProfileFormParams = {
  onFormSubmitSuccess?: () => void;
};

export const useProfileForm = (params?: useProfileFormParams) => {
  const { navigate } = useNavigation();
  const { authToken, isLoading } = useAuthToken();
  const { accountSymbol, accountAddress } = useAccountProfile();
  const { network } = useAccountSettings();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();

  const { selectedWallet } = useWallets();

  const [
    createProfile,
    { isSuccess, isError, error },
  ] = useCreateProfileMutation();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isSuccess,
          callback: () => {
            dismissLoadingOverlay();
            displayLocalNotification({
              notification: {
                title: strings.notification.profileCreated,
                body: strings.notification.profileCreatedMessage,
              },
              isManualNotification: true,
            });

            navigate(RainbowRoutes.PROFILE_SCREEN);
          },
        },
        error: {
          status: isError,
          callback: () => {
            dismissLoadingOverlay();
            logger.sentry('Error creating profile - ', error);
            Alert.alert(strings.validation.createProfileErrorMessage);
          },
        },
      }),
      [dismissLoadingOverlay, error, isError, isSuccess, navigate]
    )
  );

  const {
    businessName: businessNameData,
    businessId: businessIdData,
    businessColor: businessColorData,
    onUpdateProfileForm,
  } = useContext(ProfileFormContext);

  const [isUniqueId, setIdUniqueness] = useState<boolean>(false);
  const [businessName, setBusinessName] = useState<string>(businessNameData);
  const [businessId, setBusinessId] = useState<string>(businessIdData);
  const [businessColor, setBusinessColor] = useState<string>(businessColorData);
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const checkIdUniqueness = useCallback(
    async (id: string) => {
      if (!isLoading && authToken && id) {
        const validateErrorMessage = validateMerchantId(id);

        if (validateErrorMessage) {
          return;
        }

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
      // check unqiuness when returned to create profile screen
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

  const onChangeBusinessColor = useCallback(
    ({ nativeEvent: { text } }) => {
      const validColor = (text || '').startsWith('#') ? text : `#${text}`;
      setBusinessColor(validColor.replace(/[^#0-9a-fA-F]/gi, ''));
    },
    [setBusinessColor]
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
        : strings.validation.businessNameRequired,
      businessId:
        validateMerchantId(businessId) ||
        (isUniqueId ? undefined : strings.validation.businessIdShouldBeUnique),
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

  const onConfirmCreateProfile = useCallback(
    (selectedPrepaidCard: PrepaidCardType) => async () => {
      if (!isLoading && authToken) {
        showLoadingOverlay({ title: strings.notification.creatingProfile });

        const merchantInfoData = {
          name: businessName,
          slug: businessId,
          color: businessColor,
          'text-color': colors.white,
        };

        const profileDID = await createBusinessInfoDID(
          merchantInfoData,
          authToken
        );

        if (!profileDID) {
          dismissLoadingOverlay();
          Alert.alert(strings.validation.createProfileErrorMessage);

          return;
        }

        createProfile({
          selectedWallet,
          network,
          selectedPrepaidCardAddress: selectedPrepaidCard.address,
          profileDID,
          accountAddress,
        });
      }
    },
    [
      isLoading,
      accountAddress,
      authToken,
      showLoadingOverlay,
      businessName,
      businessId,
      businessColor,
      createProfile,
      selectedWallet,
      network,
      dismissLoadingOverlay,
    ]
  );

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

  const onConfirmChoosePrepaidCard = useCallback(
    (prepaidCard: PrepaidCardType) => {
      const data: RegisterMerchantDecodedData = {
        type: TransactionConfirmationType.REGISTER_MERCHANT,
        spendAmount: CreateProfileFeeInSpend,
        prepaidCard: prepaidCard.address,
        merchantInfo: newMerchantInfo,
      };

      navigate(MainRoutes.TRANSACTION_CONFIRMATION_SHEET, {
        data,
        onConfirm: onConfirmCreateProfile(prepaidCard),
      });
    },
    [newMerchantInfo, navigate, onConfirmCreateProfile]
  );

  const onPressCreate = useCallback(() => {
    navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
      spendAmount: CreateProfileFeeInSpend,
      onConfirmChoosePrepaidCard,
    });
  }, [navigate, onConfirmChoosePrepaidCard]);

  return {
    businessName,
    businessId,
    businessColor,
    isUniqueId,
    avatarName,
    errors,
    onChangeBusinessColor,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
    onPressCreate,
    newMerchantInfo,
  };
};
