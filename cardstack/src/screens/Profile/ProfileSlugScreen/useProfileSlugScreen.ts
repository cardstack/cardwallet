import { useState, useCallback } from 'react';

export const useProfileSlugScreen = () => {
  const [username, setUsername] = useState<string>('');

  const [invalidUsernameMessage] = useState<string | undefined>(
    'Already taken'
  );

  const onGoBackPressed = useCallback(() => {
    // TODO
  }, []);

  const onSkipPressed = useCallback(() => {
    // TODO
  }, []);

  const onContinuePress = useCallback(() => {
    // TODO
  }, []);

  // TODO (CS-4085): Validate username uniqueness and report if not.
  const onUsernameChange = useCallback(async ({ nativeEvent: { text } }) => {
    setUsername(text);
  }, []);

  return {
    username,
    onUsernameChange,
    onGoBackPressed,
    onSkipPressed,
    onContinuePress,
    invalidUsernameMessage,
  };
};
