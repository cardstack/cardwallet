import React, { Children, ReactNode } from 'react';
import styled from 'styled-components';

import { Device } from '@cardstack/utils';

import { padding } from '@rainbow-me/styles';

import { FlexItem, Row } from '../../layout';

interface ContainerProps {
  ignorePaddingTop?: boolean;
  ignorePaddingBottom?: boolean;
}

const Container = styled(Row).attrs({
  justify: 'space-around',
})`
  ${(props: ContainerProps) =>
    padding(
      props.ignorePaddingTop ? 0 : 19,
      11.5,
      props.ignorePaddingBottom ? 0 : 24
    )};
  width: 100%;
  z-index: 2;
`;

function renderButton(child: ReactNode) {
  if (Device.isAndroid) {
    return child;
  }
  if (!child) return null;
  return <FlexItem marginHorizontal={7.5}>{child}</FlexItem>;
}

interface SheetActionButtonRowProps {
  children?: ReactNode;
  ignorePaddingBottom?: boolean;
  ignorePaddingTop?: boolean;
}

export default function SheetActionButtonRow({
  children,
  ignorePaddingBottom,
  ignorePaddingTop,
}: SheetActionButtonRowProps) {
  return (
    <Container
      ignorePaddingBottom={ignorePaddingBottom}
      ignorePaddingTop={ignorePaddingTop}
    >
      {Children.map(children, renderButton)}
    </Container>
  );
}
