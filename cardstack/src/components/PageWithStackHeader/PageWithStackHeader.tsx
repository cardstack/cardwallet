import React, { memo, PropsWithChildren } from 'react';

import { Container, NavigationStackHeader } from '@cardstack/components';

import usePageWithStackHeader, {
  PageWithStackHeaderProps,
} from './usePageWithStackHeader';

const PageWithStackHeader = ({
  flow,
  canGoBack,
  customSkipPress,
  children,
  footer,
  leftIconProps,
}: PropsWithChildren<PageWithStackHeaderProps>) => {
  const { containerStyles, handleSkipPress } = usePageWithStackHeader({
    customSkipPress,
    flow,
  });

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

export default memo(PageWithStackHeader);
