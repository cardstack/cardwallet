import React, { useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import { Button, Container } from '@cardstack/components';
import EditOptions from '@rainbow-me/helpers/editOptionTypes';
import { useCoinListEdited, useCoinListEditOptions } from '@rainbow-me/hooks';

const AssetFooter = () => {
  const { isCoinListEdited } = useCoinListEdited();

  const {
    currentAction,
    setHiddenCoins,
    setPinnedCoins,
  } = useCoinListEditOptions();
  const buttonsDisabled = currentAction === EditOptions.none;

  const handleHiddenPress = useCallback(() => {
    setHiddenCoins();

    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
  }, [setHiddenCoins]);

  const handlePinnedPress = useCallback(() => {
    setPinnedCoins();

    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
  }, [setPinnedCoins]);

  if (!isCoinListEdited) {
    return null;
  }

  return (
    <Container
      bottom={80}
      flexDirection="row"
      justifyContent="space-between"
      padding={4}
      position="absolute"
      width="100%"
    >
      <Button
        disabled={buttonsDisabled}
        iconProps={
          currentAction !== EditOptions.unpin
            ? {
                iconSize: 'medium',
                marginRight: 2,
                name: 'pin',
              }
            : undefined
        }
        onPress={handlePinnedPress}
        variant="small"
      >
        {currentAction === EditOptions.unpin ? 'Unpin' : 'Pin'}
      </Button>
      <Button
        disabled={buttonsDisabled}
        iconProps={
          currentAction !== EditOptions.unhide
            ? {
                iconSize: 'medium',
                marginRight: 2,
                name: 'eye-off',
              }
            : undefined
        }
        onPress={handleHiddenPress}
        variant="small"
      >
        {currentAction === EditOptions.unhide ? 'Unhide' : 'Hide'}
      </Button>
    </Container>
  );
};

export default AssetFooter;
