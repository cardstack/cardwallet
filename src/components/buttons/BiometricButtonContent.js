import React from 'react';
import styled from 'styled-components';

import { Icon } from '../icons';
import { RowWithMargins } from '../layout';
import { Text } from '@cardstack/components';
import BiometryTypes from '@rainbow-me/helpers/biometryTypes';
import { useBiometryType } from '@rainbow-me/hooks';

const BiometryIcon = styled(Icon).attrs(({ biometryType, color }) => ({
  color,
  name: biometryType.toLowerCase(),
  size: biometryType === BiometryTypes.passcode ? 19 : 20,
}))`
  margin-bottom: ${({ biometryType }) =>
    biometryType === BiometryTypes.passcode ? 1.5 : 0};
`;

export default function BiometricButtonContent({
  color,
  showIcon,
  text,
  testID,
  ...props
}) {
  const biometryType = useBiometryType();
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
    <RowWithMargins centered margin={7} {...props}>
      {!android && showBiometryIcon && (
        <BiometryIcon biometryType={biometryType} color={color} />
      )}
      <Text color="settingsGray" fontWeight="600" testID={testID}>
        {showFaceIDCharacter && '􀎽 '}
        {text}
      </Text>
    </RowWithMargins>
  );
}
