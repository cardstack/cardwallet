import { useState, useCallback } from 'react';

export const useProfileSlugScreen = () => {
  const [username, setUsername] = useState<string>('');

  // TODO (CS-4085): Validate username uniqueness and report if not.
  const onUsernameChange = useCallback(async ({ nativeEvent: { text } }) => {
    setUsername(text);
  }, []);

  return {
    username,
    onUsernameChange,
  };
};
