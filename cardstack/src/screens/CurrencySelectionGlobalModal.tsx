import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Container,
  SheetHandle,
  CurrencySelection,
} from '@cardstack/components';

const CurrencySelectionGlobalModal = () => {
  const { goBack } = useNavigation();

  const onChange = () => {
    goBack();
  };

  return (
    <Container flex={1} justifyContent="flex-end" alignItems="center">
      <Container
        width="100%"
        borderRadius={20}
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
