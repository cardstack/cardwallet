import { StackActions, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { skipProfileCreation } from '@cardstack/redux/persistedFlagsSlice';

export const useProfileScreensHelper = () => {
  const { dispatch: navDispatch } = useNavigation();
  const dispatch = useDispatch();

  const onSkipPress = useCallback(
    (skipAmount: number) => () => {
      dispatch(skipProfileCreation(true));
      navDispatch(StackActions.pop(skipAmount || 1));
    },
    [navDispatch, dispatch]
  );

  // handles SafeAreaView bottom spacing for consistency
  const { bottom } = useSafeAreaInsets();

  const containerStyles = useMemo(
    () => ({
      paddingBottom: bottom,
    }),
    [bottom]
  );

  return {
    onSkipPress,
    containerStyles,
  };
};
