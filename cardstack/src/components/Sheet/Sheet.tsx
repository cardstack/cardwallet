import React, { memo, ReactNode, useMemo } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, StatusBar, StyleSheet } from 'react-native';
import { ScrollView } from '../ScrollView';
import { CenteredContainer } from '../Container';
import { TouchableBackDrop } from './TouchableBackDrop';
import { SheetHandle } from './SheetHandle';
import { Container } from '@cardstack/components';

import { Device } from '@cardstack/utils';
import { shadow } from '@rainbow-me/styles';

const styles = StyleSheet.create({
  wrapperBase: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    minHeight: '40%',
  },
});

const layouts = {
  contentPaddingBottom: {
    scrollable: 42,
    fixed: 30,
  },
  wrapperFlex: {
    full: 1,
    fixed: 0,
  },
};

export interface SheetProps {
  children: ReactNode;
  borderRadius?: number;
  hideHandle?: boolean;
  isFullScreen?: boolean;
  scrollEnabled?: boolean;
  shadowEnabled?: boolean;
}

const Sheet = ({
  borderRadius = 30,
  children,
  hideHandle = false,
  isFullScreen = false,
  scrollEnabled = false,
  shadowEnabled = false,
}: SheetProps) => {
  const insets = useSafeArea();
  const { goBack } = useNavigation();

  const containerStyle = useMemo(
    () => ({
      // Android barHeight or iOS top insets
      paddingTop: StatusBar.currentHeight || insets.top,
    }),
    [insets]
  );

  const wrapperStyle = useMemo(() => {
    const { full, fixed } = layouts.wrapperFlex;

    const flex = isFullScreen ? full : fixed;
    const shadowStyle = shadowEnabled ? shadow.buildAsObject(0, 1, 2) : {};

    return {
      ...styles.wrapperBase,
      ...shadowStyle,
      flex,
      borderTopStartRadius: borderRadius,
      borderTopEndRadius: borderRadius,
    };
  }, [borderRadius, isFullScreen, shadowEnabled]);

  const contentContainerStyle = useMemo(() => {
    const { scrollable, fixed } = layouts.contentPaddingBottom;

    const isScrollableOrHasBottom = insets.bottom || scrollEnabled;

    return {
      flexGrow: 1,
      paddingBottom: isScrollableOrHasBottom ? scrollable : fixed,
    };
  }, [insets, scrollEnabled]);

  return (
    <Container flex={1} justifyContent="flex-end" style={containerStyle}>
      <TouchableBackDrop onPress={goBack} />
      <KeyboardAvoidingView
        behavior={Device.isIOS ? 'padding' : 'height'}
        style={wrapperStyle}
      >
        <CenteredContainer paddingVertical={4}>
          {!hideHandle && <SheetHandle />}
        </CenteredContainer>
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          directionalLockEnabled
          keyboardShouldPersistTaps="always"
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default memo(Sheet);
