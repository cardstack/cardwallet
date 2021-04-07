import React from 'react';

// import { RowWithMargins } from '../layout';
import { Container, Icon, Text } from '@cardstack/components';
import BiometryTypes from '@rainbow-me/helpers/biometryTypes';
import { useBiometryType } from '@rainbow-me/hooks';

export default function BiometricButtonContent({
  color,
  showIcon,
  text,
  testID,
}) {
  const biometryType = useBiometryType();
  console.log({ biometryType });
  const showBiometryIcon =
    showIcon &&
    (biometryType === BiometryTypes.passcode ||
      biometryType === BiometryTypes.TouchID ||
      biometryType === BiometryTypes.Fingerprint);
  const showFaceIDCharacter =
    showIcon &&
    (biometryType === BiometryTypes.FaceID ||
      biometryType === BiometryTypes.Face);

  return (
    <Container centered margin={7}>
      {!android && showBiometryIcon && (
        <Icon
          color={color}
          name={
            showBiometryIcon
              ? 'thumbprint'
              : showFaceIDCharacter
              ? 'face-id'
              : null
          }
        />
      )}
      <Text color="settingsGray" fontWeight="600" testID={testID}>
        {text}
      </Text>
    </Container>
  );
}
