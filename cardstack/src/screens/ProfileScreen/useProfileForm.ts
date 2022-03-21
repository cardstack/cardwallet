import { useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { validateMerchantId, getSDK } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/core';
import { ProfileFormContext, strings, exampleMerchantData } from './components';
import Web3Instance from '@cardstack/models/web3-instance';
import { useAuthToken } from '@cardstack/hooks';
import { MainRoutes } from '@cardstack/navigation';
import {
  checkBusinessIdUniqueness,
  createBusinessInfoDID,
} from '@cardstack/services/hub-service';
import { useAccountProfile, useAccountSettings } from '@rainbow-me/hooks';
import { PrepaidCardType } from '@cardstack/types';
import logger from 'logger';
import {
  getAllWallets,
  getWalletByAddress,
  loadAddress,
} from '@rainbow-me/model/wallet';

const CreateProfileFeeInSpend = 100;

type useProfileFormParams = {
  onFormSubmitSuccess?: () => void;
};

export const useProfileForm = (params?: useProfileFormParams) => {
  const { navigate } = useNavigation();
  const { authToken, isLoading } = useAuthToken();
  const { accountSymbol } = useAccountProfile();
  const { network } = useAccountSettings();

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

  const createProfile = useCallback(async () => {
    if (!isLoading && authToken && selectedPrepaidCard) {
      const merchantInfoData = {
        name: businessName,
        slug: businessId,
        color: businessColor,
        'text-color': '#fff',
      };

      const did = await createBusinessInfoDID(merchantInfoData, authToken);

      if (!did) {
        return;
      }

      const address = (await loadAddress()) || '';

      const allWallets = await getAllWallets();

      const walletId =
        getWalletByAddress({ walletAddress: address, allWallets })?.id || '';

      const web3 = await Web3Instance.get({
        walletId,
        network,
      });

      const revenuePool = await getSDK('RevenuePool', web3);

      try {
        const newMerchant = await revenuePool.registerMerchant(
          selectedPrepaidCard?.address,
          did
        );

        return newMerchant;
      } catch (e) {
        logger.sentry('Hub authenticate failed', e);
      }
    }
  }, [
    authToken,
    businessColor,
    businessId,
    businessName,
    isLoading,
    network,
    selectedPrepaidCard,
  ]);

  const newMerchantInfo = useMemo(
    () => ({
      color: businessColor,
      name: businessName,
      did: '',
      textColor: '#fff',
      slug: businessId,
      ownerAddress: '',
    }),
    [businessColor, businessId, businessName]
  );

  const onPressCreate = useCallback(() => {
    if (selectedPrepaidCard) {
      // ToDo: Navigate to confirmation sheet, need to redesign this as well
      navigate(MainRoutes.TRANSACTION_CONFIRM, {
        prepaidCard: selectedPrepaidCard.address,
        spendAmount: CreateProfileFeeInSpend,
        currency: 'USD',
        merchantInfo: newMerchantInfo,
        onConfirm: createProfile,
      });
    } else {
      navigate(MainRoutes.CHOOSE_PREPAIDCARD_SHEET, {
        spendAmount: CreateProfileFeeInSpend,
        onConfirmChoosePrepaidCard: setPrepaidCard,
      });
    }
  }, [
    createProfile,
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
