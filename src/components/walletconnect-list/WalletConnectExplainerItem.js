import React from 'react';
import { Container, Text } from '@cardstack/components';

export default function WalletConnectExplainerItem({
  renderContent,
  renderImage,
  title,
}) {
  return (
    <Container
      alignItems="center"
      alignSelf="center"
      justifyContent="center"
      marginBottom={4}
      marginTop={6}
      width={292}
    >
      {renderImage ? renderImage() : null}
      <Text
        color="black"
        lineHeight={22}
        size="body"
        textAlign="center"
        weight="bold"
      >
        {title}
      </Text>
      {renderContent ? renderContent() : null}
    </Container>
  );
}
