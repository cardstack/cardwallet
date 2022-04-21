import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

import { isEmailPartial, isEmailValid } from '@cardstack/utils/validators';

import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const [email, setEmail] = useState('');
  const [inputHasError, setHasError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

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
  }, [canSubmit]);

  const onSupportLinkPress = useCallback(() => {
    Linking.openURL(strings.termsBanner.link);
  }, []);

  return {
    onSupportLinkPress,
    onSubmitPress,
    onChangeText,
    canSubmit,
    inputHasError,
    hasRequested: false,
    isAuthenticated: false,
    email,
  };
};
