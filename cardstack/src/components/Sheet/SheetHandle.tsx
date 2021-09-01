import React from 'react';
import { ViewProps } from 'react-native';
import { Container } from '../Container';

export const HandleHeight = 5;

export const SheetHandle = ({
  color = 'black',
  opacity = 0.25,
}: SheetHandleProps) => {
  return (
    <Container
      backgroundColor={color}
      height={5}
      width={36}
      borderRadius={3}
      opacity={opacity}
    />
  );
};

export interface SheetHandleProps extends ViewProps {
  /** color*/
  color?: any;
  /** opacity*/
  opacity?: number;
}
