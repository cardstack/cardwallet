import React, { ReactNode } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../Container';

import { TouchableBackDrop } from './TouchableBackDrop';

export const Sheet = ({
  borderRadius = 39,
  children,
  hideHandle = false,
}: SheetProps) => {
  const { goBack } = useNavigation();
  const insets = useSafeArea();

  return (
    <Container flex={1} justifyContent="flex-end">
      <TouchableBackDrop onPress={goBack} />
      <Container
        backgroundColor="white"
        borderTopStartRadius={borderRadius}
        borderTopEndRadius={borderRadius}
        paddingBottom={insets.bottom}
        width="100%"
      >
        <Container
          paddingTop={3}
          paddingBottom={4}
          height={5}
          justifyContent="center"
          alignItems="center"
          flex={-1}
        >
          {!hideHandle && (
            <Container
              backgroundColor="black"
              height={5}
              width={36}
              borderRadius={5}
              opacity={0.25}
            />
          )}
        </Container>
        {children}
      </Container>
    </Container>
  );
};

export interface SheetProps {
  /** optional children */
  children?: ReactNode;
  /** borderRadius for initials */
  borderRadius?: number;
  /** hideHandle */
  hideHandle?: boolean;
}
