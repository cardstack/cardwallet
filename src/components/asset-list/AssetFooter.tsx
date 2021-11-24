import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Button, Container } from '@cardstack/components';
import { useHiddenItemOptions } from '@rainbow-me/hooks';

const AssetFooter = () => {
  const {
    editing,
    selected,
    pinned,
    hidden,
    pin,
    unpin,
    show,
    hide,
  } = useHiddenItemOptions();

  const isInitialSelectionPinned = pinned.includes(selected[0]);
  const isInitialSelectionHidden = hidden.includes(selected[0]);
  const buttonsDisabled = selected?.length === 0;

  const handleHiddenPress = () => {
    if (isInitialSelectionHidden) {
      show();
    } else {
      hide();
    }

    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
  };

  const handlePinnedPress = () => {
    if (isInitialSelectionPinned) {
      unpin();
    } else {
      pin();
    }

    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
  };

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
        iconProps={
          !isInitialSelectionPinned
            ? {
                iconFamily: 'MaterialCommunity',
                iconSize: 'medium',
                marginRight: 2,
                name: 'pin',
              }
            : {
                iconFamily: 'MaterialCommunity',
                iconSize: 'medium',
                marginRight: 2,
                name: 'pin-off',
              }
        }
        onPress={handlePinnedPress}
        variant="small"
      >
        {isInitialSelectionPinned ? 'Unpin' : 'Pin'}
      </Button>
      <Button
        disabled={buttonsDisabled}
        iconProps={
          !isInitialSelectionHidden
            ? {
                iconSize: 'medium',
                marginRight: 2,
                name: 'eye-off',
              }
            : {
                iconSize: 'medium',
                marginRight: 2,
                name: 'eye',
              }
        }
        onPress={handleHiddenPress}
        variant="small"
      >
        {isInitialSelectionHidden ? 'Unhide' : 'Hide'}
      </Button>
    </Container>
  );
};

export default AssetFooter;
