import React, { memo, ReactNode } from 'react';

import { Container } from '@cardstack/components';

interface Props {
  children: ReactNode;
}

const PageWithStackHeaderFooter = ({ children }: Props) => (
  <Container justifyContent="flex-end" paddingTop={2} paddingBottom={5}>
    {children}
  </Container>
);

export default memo(PageWithStackHeaderFooter);
