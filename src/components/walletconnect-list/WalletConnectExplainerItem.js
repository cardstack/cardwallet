import React from 'react';
import { Column } from '../layout';
import { Text } from '../text';

export default function WalletConnectExplainerItem({
  renderContent,
  renderImage,
  title,
}) {
  const { colors } = useTheme();
  return (
    <Column
      align="center"
      alignSelf="center"
      css={{ width: 290, marginTop: 24, marginBottom: 16 }}
    >
      {renderImage ? renderImage() : null}
      <Text
        align="center"
        color={colors.black}
        fontFamily="OpenSans-Regular"
        lineHeight={22}
        size={16}
        weight="semibold"
      >
        {title}
      </Text>
      {renderContent ? renderContent() : null}
    </Column>
  );
}
