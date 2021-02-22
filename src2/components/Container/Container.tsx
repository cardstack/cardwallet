import { createBox } from '@shopify/restyle';
import React, { FC } from 'react';

import { Theme } from '../../theme';

export const Container = createBox<Theme>();

const BaseCenteredContainer: FC = ({ children, ...props }) => (
  <Container alignItems="center" justifyContent="center" {...props}>
    {children}
  </Container>
);

export const CenteredContainer = createBox<Theme>(BaseCenteredContainer);
