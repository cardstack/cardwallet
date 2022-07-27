import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import {
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Alert, InteractionManager } from 'react-native';

import { useMutationEffects } from '@cardstack/hooks';
import { useLoadingOverlay } from '@cardstack/navigation';
import { Routes } from '@cardstack/navigation/routes';
import { displayLocalNotification } from '@cardstack/notification-handler';
import {
  useCreateProfileInfoMutation,
  useCreateProfileMutation,
  useLazyValidateProfileSlugQuery,
} from '@cardstack/services';
import { colors } from '@cardstack/theme';
import {
  RegisterMerchantDecodedData,
  PrepaidCardType,
  TransactionConfirmationType,
} from '@cardstack/types';

import { useAccountProfile } from '@rainbow-me/hooks';
import { logger } from '@rainbow-me/utils';

import { ProfileFormContext, strings, exampleMerchantData } from './components';

const CreateProfileFeeInSpend = 100;

type useProfileFormParams = {
  onFormSubmitSuccess?: () => void;
};

export const useProfileForm = (params?: useProfileFormParams) => {
  const { navigate } = useNavigation();
  const { accountSymbol, accountAddress = '' } = useAccountProfile();
  const { showLoadingOverlay, dismissLoadingOverlay } = useLoadingOverlay();
  const selectedPrepaidCard = useRef('');

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
            InteractionManager.runAfterInteractions(() => {
              dismissLoadingOverlay();
              displayLocalNotification({
                notification: {
                  title: strings.notification.profileCreated,
                  body: strings.notification.profileCreatedMessage,
                },
                isManualNotification: true,
              });

              navigate(Routes.PROFILE_SCREEN);
            });
          },
        },
        error: {
          status: isError,
          callback: () => {
            logger.sentry('Error creating profile - ', error);
            InteractionManager.runAfterInteractions(() => {
              dismissLoadingOverlay();
              Alert.alert(strings.validation.createProfileErrorMessage);
            });
          },
        },
      }),
      [dismissLoadingOverlay, error, isError, isSuccess, navigate]
    )
  );

  const [
    createProfileInfo,
    {
      isSuccess: isProfileInfoSuccess,
      isError: isProfileInfoSuccessError,
      data: profileDID,
    },
  ] = useCreateProfileInfoMutation();

  useMutationEffects(
    useMemo(
      () => ({
        success: {
          status: isProfileInfoSuccess,
          callback: () => {
            if (profileDID) {
              createProfile({
                selectedPrepaidCardAddress: selectedPrepaidCard.current,
                profileDID,
                accountAddress,
              });
            }
          },
        },
        error: {
          status: isProfileInfoSuccessError,
          callback: () => {
            dismissLoadingOverlay();
            Alert.alert(strings.validation.createProfileErrorMessage);
          },
        },
      }),
      [
        accountAddress,
        createProfile,
        dismissLoadingOverlay,
        isProfileInfoSuccess,
        isProfileInfoSuccessError,
        profileDID,
      ]
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

  const localValidateMerchantId = useCallback((id: string) => {
    const trimmedId = id.trim();

    if (trimmedId && trimmedId.length < 4) {
      return strings.validation.profileIdLengthError;
    }

    return validateMerchantId(trimmedId);
  }, []);

  const [
    validateSlugHub,
    { data: hubValidation },
  ] = useLazyValidateProfileSlugQuery();

  const checkIdUniqueness = useCallback(
    (id: string) => {
      const validateErrorMessage = localValidateMerchantId(id);

      if (validateErrorMessage) {
        return;
      }

      validateSlugHub({ slug: id });
    },
    [localValidateMerchantId, validateSlugHub]
  );

  useEffect(() => {
    setIdUniqueness(hubValidation?.slugAvailable ?? false);
  }, [hubValidation]);

  useEffect(() => {
    if (businessId) {
      // check businessId unqiuness when get back to the create profile screen
      checkIdUniqueness(businessId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIdUniqueness]);

  const onChangeBusinessName = useCallback(
    ({ nativeEvent: { text } }) => {
      setBusinessName(text);
    },
    [setBusinessName]
  );

  const onSelectColor = useCallback(
    (color: string) => {
      const validColor = (color || '').startsWith('#') ? color : `#${color}`;

      const upperCaseColor = validColor
        .replace(/[^#0-9a-fA-F]/gi, '')
        .toUpperCase();

      setBusinessColor(upperCaseColor);
    },
    [setBusinessColor]
  );

  const onPressBusinessColor = useCallback(() => {
    navigate(Routes.COLOR_PICKER_MODAL, {
      defaultColor: businessColor,
      onSelectColor,
    });
  }, [businessColor, navigate, onSelectColor]);

  const onChangeBusinessId = useCallback(
    async ({ nativeEvent: { text } }) => {
      setBusinessId(text);
      setIdUniqueness(false);

      checkIdUniqueness(text);
    },
    [checkIdUniqueness]
  );

  const errors = useMemo(() => {
    if (!isSubmitPressed) return;

    const businessIdValidateErrorMessage =
      localValidateMerchantId(businessId) ||
      (isUniqueId ? undefined : strings.validation.businessIdShouldBeUnique);

    return {
      businessName: businessName.trim()
        ? undefined
        : strings.validation.thisFieldIsRequied,
      businessId: businessIdValidateErrorMessage,
    };
  }, [
    isSubmitPressed,
    businessName,
    isUniqueId,
    businessId,
    localValidateMerchantId,
  ]);

  const onSubmitForm = useCallback(() => {
    setIsSubmitPressed(true);

    if (
      isUniqueId &&
      businessName.trim() &&
      !localValidateMerchantId(businessId)
    ) {
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
    localValidateMerchantId,
  ]);

  const avatarName = useMemo(
    () =>
      businessName || accountSymbol || exampleMerchantData.merchantInfo.name,
    [accountSymbol, businessName]
  );

  const onConfirmCreateProfile = useCallback(
    (selectedCard: PrepaidCardType) => () => {
      showLoadingOverlay({ title: strings.notification.creatingProfile });

      selectedPrepaidCard.current = selectedCard.address;

      createProfileInfo({
        name: businessName,
        slug: businessId,
        color: businessColor,
        'text-color': colors.white,
      });
    },
    [
      showLoadingOverlay,
      createProfileInfo,
      businessName,
      businessId,
      businessColor,
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

      navigate(Routes.TRANSACTION_CONFIRMATION_SHEET, {
        data,
        onConfirm: onConfirmCreateProfile(prepaidCard),
      });
    },
    [newMerchantInfo, navigate, onConfirmCreateProfile]
  );

  const onPressCreate = useCallback(() => {
    navigate(Routes.CHOOSE_PREPAIDCARD_SHEET, {
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
    onPressBusinessColor,
    onChangeBusinessName,
    onChangeBusinessId,
    onSubmitForm,
    onPressCreate,
    newMerchantInfo,
  };
};
