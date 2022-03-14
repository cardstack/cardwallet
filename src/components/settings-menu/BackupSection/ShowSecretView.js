import React from 'react';
import { Centered } from '../../layout';
import { ModalHeaderHeight } from '../../modal';
import SecretDisplaySection from '../../secret-display/SecretDisplaySection';

export default function ShowSecretView() {
  return (
    <Centered flex={1} paddingBottom={ModalHeaderHeight}>
      <SecretDisplaySection />
    </Centered>
  );
}
