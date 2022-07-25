import { validateMerchantId } from '@cardstack/cardpay-sdk';
import { useState, useCallback, useEffect, useMemo } from 'react';

import { useMerchantInfoValidateSlugQuery } from '@cardstack/services';

const MIN_USERNAME_LENGTH = 4;

export const useProfileSlugScreen = () => {
  const [username, setUsername] = useState('');
  const [validateUsername, setValidateUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [message, setMessage] = useState('');

  const { data, error } = useMerchantInfoValidateSlugQuery(
    { slug: validateUsername },
    {
      skip: validateUsername === '',
    }
  );

  const onGoBackPressed = useCallback(() => {
    // TODO
  }, []);

  const onContinuePress = useCallback(() => {
    // TODO
  }, []);

  const onUsernameChange = useCallback(
    async text => {
      setUsername(text.trim());
    },
    [setUsername]
  );

  const showMessage = useMemo(() => username.length >= MIN_USERNAME_LENGTH, [
    username,
  ]);

  useEffect(() => {
    if (username.length >= MIN_USERNAME_LENGTH) {
      const sdkIDValidationError = validateMerchantId(username);

      if (sdkIDValidationError) {
        setIsUsernameValid(false);
        setMessage(sdkIDValidationError);

        return;
      }

      setValidateUsername(username);
    }
  }, [username]);

  useEffect(() => {
    if (data) {
      setIsUsernameValid(data.slugAvailable);
      setMessage(data.detail);
    }
  }, [data, error]);

  return {
    username,
    onUsernameChange,
    onGoBackPressed,
    onContinuePress,
    isUsernameValid,
    message,
    showMessage,
  };
};
