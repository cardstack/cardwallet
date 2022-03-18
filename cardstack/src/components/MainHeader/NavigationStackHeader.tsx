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

const SIDES_SIZE = 28;

const NavigationStackHeader = ({
  title,
  children,
  ...containerProps
}: Props) => {
  const { goBack } = useNavigation();

  return (
    <MainHeaderWrapper {...containerProps}>
      <Icon
        color="teal"
        iconSize="medium"
        name="chevron-left"
        onPress={goBack}
        size={SIDES_SIZE}
      />
      {!children ? (
        <Container flex={1} alignItems="center" flexDirection="column">
          {!!title && (
            <Text color="white" size="body" weight="bold">
              {title}
            </Text>
          )}
        </Container>
      ) : (
        children
      )}
      {/* Right end spacing so title gets properly centered. */}
      <Container width={SIDES_SIZE} />
    </MainHeaderWrapper>
  );
};

export default memo(NavigationStackHeader);
