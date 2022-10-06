import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

import {
  useInitIAPProducts,
  defaultProfilePrice,
} from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { usePersistedFlagsActions } from '@cardstack/redux/persistedFlagsSlice';
import { useLazyValidateProfileSlugQuery } from '@cardstack/services';
import { matchMinLength } from '@cardstack/utils/validators';

import { strings, MIN_SLUG_LENGTH } from './strings';

export const useProfileSlugScreen = () => {
  const { profileProduct } = useInitIAPProducts();

  const { navigate } = useNavigation();

  const [slug, setSlug] = useState('');

  const [slugValidation, setSlugValidation] = useState({
    slugAvailable: false,
    detail: '',
  });

  const isPartialValid = useRef(false);

  const [
    validateSlugHub,
    { data: hubValidation, error, isLoading, isFetching },
  ] = useLazyValidateProfileSlugQuery();

  const onContinuePress = useCallback(() => {
    navigate(Routes.PROFILE_NAME, { slug });
  }, [navigate, slug]);

  const onSlugChange = useCallback(
    text => {
      const trimmedSlug = text.trim();

      setSlug(trimmedSlug);

      const sdkIDValidationError = validateMerchantId(trimmedSlug);

      const minimumLengthError = !matchMinLength(trimmedSlug, MIN_SLUG_LENGTH)
        ? strings.errors.minLength
        : '';

      const localValidationError = sdkIDValidationError || minimumLengthError;

      if (localValidationError) {
        isPartialValid.current = false;
        setSlugValidation({
          slugAvailable: false,
          detail: localValidationError,
        });

        return;
      }

      isPartialValid.current = true;
      validateSlugHub({ slug: trimmedSlug });
    },
    [validateSlugHub]
  );

  useEffect(() => {
    if (hubValidation && isPartialValid.current) {
      setSlugValidation(hubValidation);
    } else if (error) {
      // API connection error, can't know correct invalid message so we'll use the default.
      setSlugValidation({
        slugAvailable: false,
        detail: strings.errors.noApiResponse,
      });
    }
  }, [hubValidation, error, slug]);

  const canContinue = useMemo(
    () => slugValidation.slugAvailable && !(isLoading || isFetching),
    [isFetching, isLoading, slugValidation.slugAvailable]
  );

  const purchaseDisclaimer = useMemo(
    () =>
      strings.purchaseDisclaimer(
        profileProduct?.localizedPrice || defaultProfilePrice
      ),
    [profileProduct]
  );

  const { triggerSkipProfileCreation } = usePersistedFlagsActions();

  return {
    slug,
    onSlugChange,
    onContinuePress,
    slugValidation,
    canContinue,
    triggerSkipProfileCreation,
    purchaseDisclaimer,
  };
};
