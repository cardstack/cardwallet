import { useCallback, useMemo, useState, useEffect } from 'react';
import { Linking } from 'react-native';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { setEmailCardDropClaimed } from '@cardstack/models/card-drop-banner';
import { useRequestEmailCardDropMutation } from '@cardstack/services';
import { isEmailPartial, isEmailValid } from '@cardstack/utils/validators';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings } from '@rainbow-me/hooks';

import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const { accountAddress } = useAccountSettings();
  const [email, setEmail] = useState('');
  const [inputHasError, setHasError] = useState(false);
  const [inputValid, setInputValid] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const [
    requestCardDrop,
    { isError, isSuccess, isLoading, error },
  ] = useRequestEmailCardDropMutation();

  const errorMessage = useMemo(() => {
    const is503 = error && 'status' in error && error.status === 503;

    return is503 ? strings.customError : defaultErrorAlert;
  }, [error]);

  useMutationEffects(
    useMemo(
      () => ({
        error: {
          status: isError,
          callback: () => Alert(errorMessage),
        },
        success: {
          status: isSuccess,
          callback: () => setEmailCardDropClaimed(accountAddress),
        },
      }),
      [isError, errorMessage, isSuccess, accountAddress]
    )
  );

  useEffect(() => {
    setCanSubmit(inputValid && termsAccepted);
  }, [inputValid, termsAccepted]);

  const onChangeText = useCallback(text => {
    setEmail(text);

    setHasError(!isEmailPartial(text));
    setInputValid(isEmailValid(text));
  }, []);

  const onTermsAcceptToggle = useCallback(() => {
    setTermsAccepted(!termsAccepted);
  }, [termsAccepted]);

  const onSubmitPress = useCallback(() => {
    // error message should only be triggered with email validation
    if (!inputValid) {
      setHasError(true);

      return;
    }

    // handles the validation combo of email + checkbox
    if (!canSubmit) {
      return;
    }

    requestCardDrop({ email });
  }, [canSubmit, inputValid, email, requestCardDrop]);

  const onSupportLinkPress = useCallback(() => {
    Linking.openURL(strings.termsBanner.link.url);
  }, []);

  return {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    onTermsAcceptToggle,
    inputValid,
    inputHasError,
    canSubmit,
    hasRequested: false || isSuccess,
    email,
    isLoading,
  };
};
