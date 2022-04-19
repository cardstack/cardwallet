import { useCallback, useRef, useState } from 'react';
import { Linking } from 'react-native';

import { isEmailPartial, isEmailValid } from '@cardstack/utils/validators';

import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const email = useRef('');

  const [inputHasError, setHasError] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const onChangeText = useCallback(text => {
    email.current = text;

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
  };
};
