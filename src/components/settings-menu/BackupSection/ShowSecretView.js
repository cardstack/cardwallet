import React from 'react';
import { Centered } from '../../layout';
import { ModalHeaderHeight } from '../../modal';
import SecretDisplaySection from '../../secret-display/SecretDisplaySection';
import { CopyToast, ToastPositionContainer } from '../../toasts';

export default function ShowSecretView() {
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);

  return (
    <Centered flex={1} paddingBottom={ModalHeaderHeight}>
      <SecretDisplaySection
        setCopiedText={setCopiedText}
        setCopyCount={setCopyCount}
      />
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Centered>
  );
}
