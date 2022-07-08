import { useState } from 'react';

export const useProfileSlugScreen = () => {
  const [username, setUsername] = useState('');
  return {
    username,
    setUsername,
  };
};
