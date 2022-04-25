import { useCallback, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { defaultErrorAlert } from '@cardstack/constants';
import { useMutationEffects } from '@cardstack/hooks';
import { useRequestEmailCardDropMutation } from '@cardstack/services/hub/hub-api';
import { isEmailPartial, isEmailValid } from '@cardstack/utils/validators';

import { Alert } from '@rainbow-me/components/alerts';

import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const [email, setEmail] = useState('');
  const [inputHasError, setHasError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const [
    requestCardDrop,
    { isError, isSuccess, isLoading },
  ] = useRequestEmailCardDropMutation();

  useMutationEffects(
    useMemo(
      () => ({
        error: {
          status: isError,
          callback: () => Alert(defaultErrorAlert),
        },
      }),
      [isError]
    )
  );

  const onChangeText = useCallback(text => {
    setEmail(text);

    setHasError(!isEmailPartial(text));
    setCanSubmit(isEmailValid(text));
  }, []);

  const onSubmitPress = useCallback(() => {
    if (!canSubmit) {
      setHasError(true);

      return;
    }

    requestCardDrop({ email });
  }, [canSubmit, email, requestCardDrop]);

  const onSupportLinkPress = useCallback(() => {
    Linking.openURL(strings.termsBanner.link);
  }, []);

  return {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    canSubmit,
    inputHasError,
    hasRequested: false || isSuccess,
    isAuthenticated: false,
    email,
    isLoading,
  };
};
