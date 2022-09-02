import React, { memo, PropsWithChildren, ReactNode, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Container,
  IconName,
  IconProps,
  NavigationStackHeader,
} from '@cardstack/components';

interface OnboardingPageProps {
  footer?: ReactNode;
  canGoBack?: boolean;
  onSkipPress: () => void;
  leftIconProps?: Omit<IconProps, 'name'> & {
    name?: IconName;
  };
}

const OnboardingPage = ({
  canGoBack,
  onSkipPress,
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
        onSkipPress={onSkipPress}
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
