import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useNavigation } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';

import { useInitIAPProducts } from '@cardstack/hooks/usePurchaseProfile';
import { Routes } from '@cardstack/navigation';
import { useLazyValidateProfileSlugQuery } from '@cardstack/services';

import { strings, MIN_USERNAME_LENGTH } from './strings';

export const useProfileSlugScreen = () => {
  useInitIAPProducts();

  const { navigate } = useNavigation();

  const [slug, setSlug] = useState('');

  const [slugValidation, setSlugValidation] = useState({
    slugAvailable: false,
    detail: '',
  });

  const [
    validateSlugHub,
    { data: hubValidation, error },
  ] = useLazyValidateProfileSlugQuery();

  const onGoBackPressed = useCallback(() => {
    // TODO
  }, []);

  const onContinuePress = useCallback(() => {
    navigate(Routes.PROFILE_NAME, { slug });
  }, [navigate, slug]);

  const onSlugChange = useCallback(
    text => {
      const trimmedSlug = text.trim();

      setSlug(trimmedSlug);

      const sdkIDValidationError = validateMerchantId(trimmedSlug);

      const minimumLengthError =
        trimmedSlug.length < MIN_USERNAME_LENGTH
          ? strings.errors.minLength
          : '';

      const localValidationError = sdkIDValidationError || minimumLengthError;

      if (localValidationError) {
        setSlugValidation({
          slugAvailable: false,
          detail: localValidationError,
        });

        return;
      }

      validateSlugHub({ slug: trimmedSlug });
    },
    [validateSlugHub]
  );

  useEffect(() => {
    if (hubValidation) {
      setSlugValidation(hubValidation);
    } else if (error) {
      // API connection error, can't know correct invalid message so we'll use the default.
      setSlugValidation({
        slugAvailable: false,
        detail: strings.errors.noApiResponse,
      });
    }
  }, [hubValidation, error]);

  return {
    slug,
    onSlugChange,
    onGoBackPressed,
    onContinuePress,
    slugValidation,
  };
};
