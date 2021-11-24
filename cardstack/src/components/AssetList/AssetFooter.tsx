import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Button, Container } from '@cardstack/components';
import { useHiddenItemOptions } from '@rainbow-me/hooks';

export const AssetFooter = () => {
  const { editing, selected, hidden, show, hide } = useHiddenItemOptions();

  const isInitialSelectionHidden = hidden.includes(selected[0]);

  const buttonsDisabled = selected?.length === 0; //selected length is zero

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
