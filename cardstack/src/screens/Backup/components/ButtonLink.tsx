import React, { PropsWithChildren } from 'react';

import { Touchable, Text } from '@cardstack/components';
import { hitSlop } from '@cardstack/utils';

interface ButtonLinkProps {
  onPress: () => void;
}

export const ButtonLink = ({
  onPress,
  children,
}: PropsWithChildren<ButtonLinkProps>) => (
  <Touchable onPress={onPress} paddingVertical={5} hitSlop={hitSlop.medium}>
    <Text color="white" variant="semibold">
      {children}
    </Text>
  </Touchable>
);
