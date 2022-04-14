import { useCallback } from 'react';
import { Linking } from 'react-native';
import { strings } from './strings';

export const useRequestPrepaidCardScreen = () => {
  const onSupportLinkPress = useCallback(() => {
    Linking.openURL(strings.termsBanner.link);
  }, []);

  return {
    onSupportLinkPress,
  };
};
