import React, { memo, useCallback, useMemo } from 'react';
import { LayoutAnimation } from 'react-native';
import { IconProps } from '../Icon';
import { Button, Container } from '@cardstack/components';
import { usePinnedAndHiddenItemOptions } from '@rainbow-me/hooks';

const layoutAnimation = () => {
  LayoutAnimation.configureNext(
    LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
  );
};

const PinHideOptionsFooter = () => {
  const {
    editing,
    selected,
    pinned,
    hidden,
    pin,
    unpin,
    show,
    hide,
  } = usePinnedAndHiddenItemOptions();

  const isInitialSelectionPinned = pinned.includes(selected[0]);
  const isInitialSelectionHidden = hidden.includes(selected[0]);

  const buttonsDisabled = selected?.length === 0; //selected length is zero

  const handleHiddenPress = useCallback(() => {
    if (isInitialSelectionHidden) {
      show();
    } else {
      hide();
    }

    layoutAnimation();
  }, [hide, isInitialSelectionHidden, show]);

  const handlePinnedPress = useCallback(() => {
    if (isInitialSelectionPinned) {
      unpin();
    } else {
      pin();
    }

    layoutAnimation();
  }, [isInitialSelectionPinned, pin, unpin]);

  const pinIconProps: IconProps = useMemo(
    () => ({
      iconFamily: 'MaterialCommunity',
      iconSize: 'medium',
      marginRight: 2,
      name: isInitialSelectionPinned ? 'pin-off' : 'pin',
    }),
    [isInitialSelectionPinned]
  );

  const hideIconProps: IconProps = useMemo(
    () => ({
      iconSize: 'medium',
      marginRight: 2,
      name: isInitialSelectionHidden ? 'eye' : 'eye-off',
    }),
    [isInitialSelectionHidden]
  );

  if (!editing) {
    return null;
  }

  return (
    <Container
      bottom={80}
      flexDirection="row"
      justifyContent="space-around"
      padding={4}
      position="absolute"
      width="100%"
    >
      <Button
        disabled={buttonsDisabled}
        iconProps={pinIconProps}
        onPress={handlePinnedPress}
        variant="small"
      >
        {isInitialSelectionPinned ? 'Unpin' : 'Pin'}
      </Button>
      <Button
        disabled={buttonsDisabled}
        iconProps={hideIconProps}
        onPress={handleHiddenPress}
        variant="small"
      >
        {isInitialSelectionHidden ? 'Unhide' : 'Hide'}
      </Button>
    </Container>
  );
};

export default memo(PinHideOptionsFooter);
