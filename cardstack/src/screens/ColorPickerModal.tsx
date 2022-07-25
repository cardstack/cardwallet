import { useNavigation, useRoute } from '@react-navigation/native';
import chroma from 'chroma-js';
import React, { useCallback, useEffect, memo, useState, useMemo } from 'react';
import { Keyboard } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import {
  CenteredContainer,
  Container,
  Input,
  Text,
  Touchable,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { aspectRatio, screenHeight } from '@cardstack/utils';

const COLOR_LENGTH = 7;

const layouts = {
  dot: {
    size: 20,
    radius: 20,
  },
  wrapper: {
    paddingTop: '30%',
  },
  wheelStyle: {
    minHeight: undefined,
    maxWidth: undefined,
    justifyContent: 'flex-start',
    height: screenHeight * aspectRatio * 0.12,
  },
};

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

  const onColorChange = useCallback(color => {
    setSelectedColor(color.toUpperCase());
  }, []);

  const onChangeColorText = useCallback(
    text => {
      if (text.length === COLOR_LENGTH && chroma.valid(text)) {
        onColorChange(chroma(text).hex());
      }
    },
    [onColorChange]
  );

  const colorDotStyle = useMemo(() => ({ backgroundColor: selectedColor }), [
    selectedColor,
  ]);

  return (
    <Container
      flex={1}
      justifyContent="flex-end"
      flexDirection="column-reverse"
      alignItems="center"
      style={layouts.wrapper}
    >
      <Container
        padding={5}
        width="70%"
        backgroundColor="white"
        borderRadius={layouts.dot.radius}
        flex={0.4}
      >
        <Touchable onPress={onSelect}>
          <Text fontSize={14} textAlign="right" fontWeight="bold">
            Done
          </Text>
        </Touchable>
        <Container flex={1} paddingVertical={5}>
          <ColorPicker
            //@ts-expect-error custom patched property
            wheelStyle={layouts.wheelStyle}
            color={selectedColor}
            onColorChange={onColorChange}
            thumbSize={layouts.dot.size}
            sliderSize={15}
            swatches={false}
            gapSize={0}
            shadeSliderThumb
            autoResetSlider
            noSnap
            row
          />
        </Container>
        <CenteredContainer
          alignItems="center"
          justifyContent="center"
          width="85%"
          flexDirection="row"
        >
          <Container
            marginRight={2}
            borderRadius={layouts.dot.radius}
            height={layouts.dot.size}
            width={layouts.dot.size}
            style={colorDotStyle}
            borderColor="black"
            borderWidth={0.2}
          />
          <Input
            fontSize={18}
            defaultValue={selectedColor}
            onChangeText={onChangeColorText}
            maxLength={COLOR_LENGTH}
            autoCapitalize="characters"
          />
        </CenteredContainer>
      </Container>
    </Container>
  );
};

export default memo(ColorPickerModal);
