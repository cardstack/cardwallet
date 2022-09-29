import React from 'react';

import { Container, Icon, Text } from '@cardstack/components';

interface Props {
  children?: React.ReactNode;
  showArrow?: boolean;
}

const ListItemArrowGroup: React.FC = ({
  children,
  showArrow = true,
}: Props) => (
  <Container
    alignItems="center"
    flex={1}
    flexDirection="row"
    justifyContent="flex-end"
  >
    {typeof children === 'string' ? (
      <Text color="settingsGrayDark">{children}</Text>
    ) : (
      children
    )}
    {showArrow && (
      <Icon
        color="settingsGrayChevron"
        iconSize="medium"
        name="chevron-right"
        paddingLeft={2}
      />
    )}
  </Container>
);

export default React.memo(ListItemArrowGroup);
