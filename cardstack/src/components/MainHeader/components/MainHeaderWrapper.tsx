import React, { memo, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Container, SafeAreaView, ContainerProps } from '@cardstack/components';

export const NAV_HEADER_HEIGHT = 54;

const MainHeaderWrapper: React.FC<ContainerProps> = ({
  children,
  backgroundColor = 'backgroundBlue',
  ...props
}) => {
  const insets = useSafeArea();

  const safeAreaStyle = useMemo(
    () => ({
      // Android uses StatusBar.currentHeight and iOS insets.top
      paddingTop: StatusBar.currentHeight || insets.top,
    }),
    [insets]
  );

  return (
    <SafeAreaView backgroundColor={backgroundColor} style={safeAreaStyle}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        height={NAV_HEADER_HEIGHT}
        paddingHorizontal={5}
        {...props}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

export default memo(MainHeaderWrapper);
