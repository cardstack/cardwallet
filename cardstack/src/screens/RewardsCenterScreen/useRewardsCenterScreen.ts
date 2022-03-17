import { useCallback } from 'react';

export const useRewardsCenterScreen = () => {
  const onRegisterPress = useCallback(() => {
    //pass
  }, []);

  return {
    rewardsSafe: [],
    onRegisterPress,
  };
};
