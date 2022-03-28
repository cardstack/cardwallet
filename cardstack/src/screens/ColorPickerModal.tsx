import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, memo, useState } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import { Keyboard } from 'react-native';
import { Button, Container, SheetHandle } from '@cardstack/components';
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
    <Container flex={1} justifyContent="flex-end" alignItems="center">
      <Container
        width="100%"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        height="50%"
        overflow="scroll"
        backgroundColor="white"
        paddingHorizontal={5}
      >
        <Container width="100%" alignItems="center" padding={5}>
          <SheetHandle />
        </Container>
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={setSelectedColor}
          thumbSize={40}
          sliderSize={20}
          noSnap={true}
          row={false}
        />
        <Container alignItems="center" paddingVertical={8}>
          <Button onPress={onSelect}>Select</Button>
        </Container>
      </Container>
    </Container>
  );
};

export default memo(ColorPickerModal);
