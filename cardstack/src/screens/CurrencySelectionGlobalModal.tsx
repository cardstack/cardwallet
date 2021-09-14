import React from 'react';
import {
  Container,
  SheetHandle,
  CurrencySelection,
} from '@cardstack/components';

const CurrencySelectionGlobalModal = () => {
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
        <CurrencySelection />
      </Container>
    </Container>
  );
};

export default CurrencySelectionGlobalModal;
