import { useNavigation, StackActions } from '@react-navigation/native';
import React, {
  memo,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Container,
  IconName,
  IconProps,
  NavigationStackHeader,
} from '@cardstack/components';

import { ContainerProps } from '../Container';

interface PageWithStackHeaderProps {
  canGoBack?: boolean;
  showSkip?: boolean;
  skipPressCallback?: () => void;
  footer?: ReactNode;
  leftIconProps?: Omit<IconProps, 'name'> & {
    name?: IconName;
  };
  headerContainerProps?: ContainerProps;
}

const PageWithStackHeader = ({
  canGoBack,
  showSkip = true,
  skipPressCallback,
  children,
  footer,
  leftIconProps,
  headerContainerProps,
}: PropsWithChildren<PageWithStackHeaderProps>) => {
  const { dispatch: navDispatch } = useNavigation();

  // handles SafeAreaView bottom spacing for consistency
  const { bottom } = useSafeAreaInsets();

  const containerStyles = useMemo(
    () => ({
      paddingBottom: bottom,
    }),
    [bottom]
  );

  const handleSkipPress = useCallback(() => {
    navDispatch(StackActions.popToTop());

    if (skipPressCallback) {
      skipPressCallback();
    }
  }, [navDispatch, skipPressCallback]);

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
        onSkipPress={showSkip ? handleSkipPress : undefined}
        backgroundColor="backgroundDarkPurple"
        marginBottom={4}
        leftIconProps={leftIconProps}
        paddingHorizontal={0} // reset MainHeaderWrapper's default padding
        {...headerContainerProps}
      />
      <Container flex={1}>{children}</Container>
      {!!footer && <Container flex={0.3}>{footer}</Container>}
    </Container>
  );
};

export default memo(PageWithStackHeader);
