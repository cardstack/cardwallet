import React from 'react';

import { Container, Icon, Text } from '@cardstack/components';

const ListItemArrowGroup: React.FC = ({ children }) => (
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
    <Icon
      color="settingsGrayChevron"
      iconSize="medium"
      name="chevron-right"
      paddingLeft={2}
    />
  </Container>
);

export default React.memo(ListItemArrowGroup);
