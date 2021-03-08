import React, { useCallback } from 'react';

import { LayoutAnimation } from 'react-native';
import { Container, Button } from '@cardstack/components';
import { useCoinListEdited, useCoinListEditOptions } from '@rainbow-me/hooks';
import EditOptions from '@rainbow-me/helpers/editOptionTypes';

export const AssetFooter = () => {
  const { isCoinListEdited } = useCoinListEdited();

  const {
    currentAction,
    setHiddenCoins,
    setPinnedCoins,
  } = useCoinListEditOptions();

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

  console.log('currentAction', currentAction);

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
        disabled={currentAction === EditOptions.none}
        variant="small"
        onPress={handlePinnedPress}
      >
        {currentAction === EditOptions.unpin ? 'Unpin' : 'Pin'}
      </Button>
      <Button
        disabled={currentAction === EditOptions.none}
        variant="small"
        onPress={handleHiddenPress}
      >
        {currentAction === EditOptions.unhide ? 'Unhide' : 'Hide'}
      </Button>
    </Container>
  );
};
