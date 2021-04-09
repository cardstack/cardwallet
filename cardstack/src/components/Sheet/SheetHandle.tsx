import React from 'react';
import { ViewProps } from 'react-native';
import { Container } from '../Container';

export const HandleHeight = 5;

export const SheetHandle = ({ color = 'black' }: SheetProps) => {
  return (
    <Container
      backgroundColor={color}
      height={5}
      width={36}
      borderRadius={3}
      opacity={0.25}
    />
  );
};

export interface SheetProps extends ViewProps {
  /** color*/
  color?: any;
}
