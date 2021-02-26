import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { Container } from '../Container';
import { Text } from '../Text';

export const PrepaidCard = () => (
  <Container
    borderRadius={10}
    borderWidth={1}
    borderColor="buttonPrimaryBorder"
    minHeight={250}
    width={'100%'}
  >
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={['#00EBE5', '#C3FC33']}
      locations={[0.2, 1]}
      style={{
        alignItems: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        borderRadius: 10,
        padding: 16,
        justifyContent: 'space-between',
      }}
    >
      <Container>
        <Text fontSize={11}>{'Issued by'}</Text>
        <Text fontSize={13} variant="bold">
          {'Cardstack'}
        </Text>
      </Container>
      <Container flexDirection="row">
        <Text variant="shadowRoboto">{'0xbeA3'}</Text>
        <Text variant="shadowRoboto" letterSpacing={1.35}>
          {'...'}
        </Text>
        <Text variant="shadowRoboto">{'7eF8'}</Text>
      </Container>
    </LinearGradient>
  </Container>
);
