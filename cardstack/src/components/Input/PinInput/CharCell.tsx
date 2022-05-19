import React, { memo, useMemo } from 'react';

import { CenteredContainer, Text } from '@cardstack/components';
import {
  colorStyleVariants,
  ThemeVariant,
} from '@cardstack/theme/colorStyleVariants';

const cellStyle: typeof colorStyleVariants = {
  ...colorStyleVariants,
  backgroundColor: {
    light: 'grayLightBackground',
    dark: 'backgroundDarkerPurple',
  },
};

const SECURE_CHAR = '●';

export const cellLayout = {
  height: 70,
  width: 45,
  radius: 8,
};

export interface CharCellProps {
  index: number;
  inputValue: string;
  variant: ThemeVariant;
  secureText?: boolean;
}

const CharCell = ({
  index,
  inputValue,
  secureText,
  variant,
}: CharCellProps) => {
  const renderCharValue = useMemo(() => {
    const char = inputValue.charAt(index);
    const hasValue = !!char;
    const shouldHide = hasValue && secureText;

    return shouldHide ? SECURE_CHAR : char;
  }, [index, inputValue, secureText]);

  const isActive = index === inputValue.length;

  return (
    <CenteredContainer
      borderWidth={1}
      borderColor={isActive ? 'teal' : cellStyle.borderColor[variant]}
      borderRadius={cellLayout.radius}
      height={cellLayout.height}
      width={cellLayout.width}
      backgroundColor={cellStyle.backgroundColor[variant]}
    >
      <Text color={cellStyle.textColor[variant]} weight="bold" fontSize={24}>
        {renderCharValue}
      </Text>
    </CenteredContainer>
  );
};

export default memo(CharCell);
