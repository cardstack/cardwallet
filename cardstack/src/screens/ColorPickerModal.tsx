import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, memo, useState } from 'react';
import { Keyboard } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import { Button, Container, Sheet } from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';

type ColorPickerModalRouteType = RouteType<{
  defaultColor?: string;
  onSelectColor: (color: string) => void;
}>;

const ColorPickerModal = () => {
  const { goBack } = useNavigation();

  const {
    params: { defaultColor = '#000000', onSelectColor },
  } = useRoute<ColorPickerModalRouteType>();

  const [selectedColor, setSelectedColor] = useState(defaultColor);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const onSelect = useCallback(() => {
    onSelectColor(selectedColor);
    goBack();
  }, [goBack, onSelectColor, selectedColor]);

  return (
    <Sheet scrollEnabled={false}>
      <Container paddingHorizontal={5}>
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={setSelectedColor}
          thumbSize={40}
          sliderSize={20}
          noSnap={true}
          row={false}
        />
        <Container alignItems="center" marginTop={8}>
          <Button onPress={onSelect}>Select</Button>
        </Container>
      </Container>
    </Sheet>
  );
};

export default memo(ColorPickerModal);
