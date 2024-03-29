import { useNavigation } from '@react-navigation/native';
import React, { memo, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, StatusBar, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@cardstack/components';
import { Device } from '@cardstack/utils';

import { shadow } from '@rainbow-me/styles';

import { CenteredContainer } from '../Container';

import { SheetHandle } from './SheetHandle';
import { TouchableBackDrop } from './TouchableBackDrop';

const styles = StyleSheet.create({
  wrapperBase: {
    justifyContent: 'flex-end',
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
  overlayColor?: string;
  cardBackgroundColor?: string;
  keyboardBehavior?: 'height' | 'position' | 'padding';
  Header?: JSX.Element;
  Footer?: JSX.Element;
}

const Sheet = ({
  borderRadius = 30,
  children,
  hideHandle = false,
  isFullScreen = false,
  scrollEnabled = false,
  shadowEnabled = false,
  overlayColor = 'transparent',
  cardBackgroundColor = 'white',
  keyboardBehavior = Device.keyboardBehavior,
  Header,
  Footer,
}: SheetProps) => {
  const insets = useSafeAreaInsets();
  const { goBack, setOptions } = useNavigation();

  useEffect(() => {
    if (isFullScreen && !scrollEnabled && Device.isIOS) {
      setOptions({
        gestureResponseDistance: Device.screenHeight,
        gestureDirection: 'vertical',
      });
    }
  }, [isFullScreen, scrollEnabled, setOptions]);

  const containerStyle = useMemo(
    () => ({
      // Android barHeight or iOS top insets
      paddingTop: StatusBar.currentHeight || insets.top,
      backgroundColor: overlayColor,
    }),
    [insets, overlayColor]
  );

  const wrapperStyle = useMemo(() => {
    const { full, fixed } = layouts.wrapperFlex;

    const flex = isFullScreen ? full : fixed;
    const shadowStyle = shadowEnabled ? shadow.buildAsObject(0, 1, 2) : {};

    return {
      ...styles.wrapperBase,
      ...shadowStyle,
      flex,
      backgroundColor: cardBackgroundColor,
      borderTopStartRadius: borderRadius,
      borderTopEndRadius: borderRadius,
    };
  }, [borderRadius, isFullScreen, shadowEnabled, cardBackgroundColor]);

  const contentContainerStyle = useMemo(() => {
    const { scrollable, fixed } = layouts.contentPaddingBottom;

    const isScrollableOrHasBottom = insets.bottom || scrollEnabled;

    return {
      flexGrow: 1,
      paddingBottom: isScrollableOrHasBottom ? scrollable : fixed,
    };
  }, [insets, scrollEnabled]);

  const onMomentumScrollBegin = useCallback(
    ({ nativeEvent: { contentOffset } }) => {
      const hasOverScrolledToTop = contentOffset.y <= Device.scrollSheetOffset;

      if (hasOverScrolledToTop) {
        goBack();
      }
    },
    [goBack]
  );

  return (
    <Container flex={1} justifyContent="flex-end" style={containerStyle}>
      <TouchableBackDrop onPress={goBack} />
      <KeyboardAvoidingView behavior={keyboardBehavior} style={wrapperStyle}>
        <CenteredContainer paddingVertical={4}>
          {!hideHandle && <SheetHandle />}
        </CenteredContainer>
        {Header}
        <ScrollView
          onMomentumScrollBegin={onMomentumScrollBegin}
          overScrollMode="always"
          contentContainerStyle={contentContainerStyle}
          directionalLockEnabled
          keyboardShouldPersistTaps="always"
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {children}
        </ScrollView>
        {Footer}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default memo(Sheet);
