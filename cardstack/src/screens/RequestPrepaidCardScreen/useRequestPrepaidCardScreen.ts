import { useCallback, useMemo, useState, useEffect } from 'react';
import { Linking } from 'react-native';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import {
  useCheckHubAuthQuery,
  useRequestEmailCardDropMutation,
} from '@cardstack/services/hub/hub-api';
import { isEmailPartial, isEmailValid } from '@cardstack/utils/validators';

import { Alert } from '@rainbow-me/components/alerts';
import { useAccountSettings } from '@rainbow-me/hooks';

import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const [email, setEmail] = useState('');
  const [inputHasError, setHasError] = useState(false);
  const [inputValid, setInputValid] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const { accountAddress, network } = useAccountSettings();

  const { data: isAuthenticated = false } = useCheckHubAuthQuery(
    {
      accountAddress,
      network,
    },
    { skip: !accountAddress, refetchOnFocus: true }
  );

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
      }),
      [isError, errorMessage]
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
    if (!canSubmit) {
      setHasError(true);

      return;
    }

    requestCardDrop({ email });
  }, [canSubmit, email, requestCardDrop]);

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
    isAuthenticated,
    email,
    isLoading,
  };
};
