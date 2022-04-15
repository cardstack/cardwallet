import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Keyboard } from 'react-native';

import {
  Container,
  SheetHandle,
  CurrencySelection,
} from '@cardstack/components';

const CurrencySelectionGlobalModal = () => {
  const { goBack } = useNavigation();

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const onChange = () => {
    goBack();
  };

  return (
    <Container flex={1} justifyContent="flex-end" alignItems="center">
      <Container
        width="100%"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        height="50%"
        backgroundColor="white"
        overflow="scroll"
        paddingBottom={10}
      >
        <Container width="100%" alignItems="center" padding={5}>
          <SheetHandle />
        </Container>
        <CurrencySelection onChange={onChange} />
      </Container>
    </Container>
  );
};

export default CurrencySelectionGlobalModal;
