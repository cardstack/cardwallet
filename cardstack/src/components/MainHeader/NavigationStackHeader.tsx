import React, { memo, ReactNode } from 'react';

import { useNavigation } from '@react-navigation/native';
import { ContainerProps } from '../Container';
import {
  Container,
  Icon,
  Text,
  MainHeaderWrapper,
} from '@cardstack/components';

interface Props extends ContainerProps {
  title?: string;
  children?: ReactNode;
}

const NavigationStackHeader = ({
  title,
  children,
  ...containerProps
}: Props) => {
  const { goBack } = useNavigation();

  return (
    <MainHeaderWrapper {...containerProps}>
      <Container flex={1} alignItems="flex-start">
        <Icon
          color="teal"
          iconSize="medium"
          name="chevron-left"
          onPress={goBack}
          size={28}
        />
      </Container>
      <Container flex={4} alignItems="center" flexDirection="column">
        {!children
          ? !!title && (
              <Text color="white" size="body" weight="bold">
                {title}
              </Text>
            )
          : children}
      </Container>
      {/* Right end spacing so title gets properly centered. */}
      <Container flex={1} />
    </MainHeaderWrapper>
  );
};

export default memo(NavigationStackHeader);
