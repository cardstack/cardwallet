import React from 'react';
import { Centered } from '../../layout';
import SecretDisplaySection from '../../secret-display/SecretDisplaySection';

export default function ShowSecretView() {
  return (
    <Centered flex={1} paddingBottom={50}>
      <SecretDisplaySection />
    </Centered>
  );
}
