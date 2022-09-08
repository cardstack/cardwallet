import { useNavigation, StackActions } from '@react-navigation/native';
import { useMemo, useCallback, ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { IconProps, IconName } from '@cardstack/components';
import { skipProfileCreation } from '@cardstack/redux/persistedFlagsSlice';

import { OnboardingFlows } from './types';

export interface PageWithStackHeaderProps {
  flow: OnboardingFlows;
  footer?: ReactNode;
  canGoBack?: boolean;
  customSkipPress?: () => void;
  skipAmount?: number;
  leftIconProps?: Omit<IconProps, 'name'> & {
    name?: IconName;
  };
}

const usePageWithStackHeader = ({
  skipAmount,
  flow,
  customSkipPress,
}: Pick<
  PageWithStackHeaderProps,
  'skipAmount' | 'flow' | 'customSkipPress'
>) => {
  // handles SafeAreaView bottom spacing for consistency
  const { bottom } = useSafeAreaInsets();

  const containerStyles = useMemo(
    () => ({
      paddingBottom: bottom,
    }),
    [bottom]
  );

  const { dispatch: navDispatch } = useNavigation();
  const dispatch = useDispatch();

  const handleSkipPress = useCallback(() => {
    if (customSkipPress) {
      customSkipPress();

      return;
    }

    if (flow === 'profile-creation') {
      dispatch(skipProfileCreation(true));
    }

    navDispatch(StackActions.pop(skipAmount));
  }, [navDispatch, customSkipPress, skipAmount, flow, dispatch]);

  return {
    containerStyles,
    handleSkipPress,
  };
};

export default usePageWithStackHeader;
