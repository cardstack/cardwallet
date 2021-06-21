import React from 'react';
import { ViewProps } from 'react-native';
import { Container } from '../Container';

export const HandleHeight = 5;

export const SheetHandle = ({ color = 'black' }: SheetHandleProps) => {
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

export interface SheetHandleProps extends ViewProps {
  /** color*/
  color?: any;
}
