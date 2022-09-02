import { useNavigation, StackActions } from '@react-navigation/native';
import React, {
  memo,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import {
  Container,
  IconName,
  IconProps,
  NavigationStackHeader,
} from '@cardstack/components';
import { skipProfileCreation } from '@cardstack/redux/persistedFlagsSlice';

import { OnboardingFlows } from './types';

interface OnboardingPageProps {
  flow: OnboardingFlows;
  footer?: ReactNode;
  canGoBack?: boolean;
  customSkipPress?: () => void;
  skipAmount?: number;
  leftIconProps?: Omit<IconProps, 'name'> & {
    name?: IconName;
  };
}

const OnboardingPage = ({
  flow,
  canGoBack,
  customSkipPress,
  skipAmount = 1,
  children,
  footer,
  leftIconProps,
}: PropsWithChildren<OnboardingPageProps>) => {
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

  return (
    <Container
      backgroundColor="backgroundDarkPurple"
      flex={1}
      justifyContent="space-between"
      style={containerStyles}
      paddingHorizontal={5}
    >
      <NavigationStackHeader
        canGoBack={canGoBack}
        onSkipPress={handleSkipPress}
        backgroundColor="backgroundDarkPurple"
        marginBottom={4}
        leftIconProps={leftIconProps}
        paddingHorizontal={0}
      />
      <Container flex={1}>{children}</Container>
      {!!footer && <Container flex={0.3}>{footer}</Container>}
    </Container>
  );
};

export default memo(OnboardingPage);
