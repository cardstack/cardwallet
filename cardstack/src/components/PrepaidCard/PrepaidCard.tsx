import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme';
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
      colors={[colors.blue, colors.green]}
      locations={[0.2, 1]}
      style={{
        width: '100%',
        borderRadius: 10,
      }}
    >
      <Container width="100%" padding={4} paddingBottom={0}>
        <Container width="100%">
          <Text fontSize={11}>{'Issued by'}</Text>
        </Container>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={13} variant="bold">
            {'Cardstack'}
          </Text>
          <Container flexDirection="row">
            <Text variant="shadowRoboto">{'0xbeA3'}</Text>
            <Text variant="shadowRoboto" letterSpacing={1.35}>
              {'...'}
            </Text>
            <Text variant="shadowRoboto">{'7eF8'}</Text>
          </Container>
        </Container>
        <Container width="100%" alignItems="flex-end">
          <Text fontSize={11}>{'on xDai chain'}</Text>
        </Container>
      </Container>
      <Container
        width="100%"
        justifyContent="space-between"
        flexDirection="row"
        height={39}
      >
        <Container width="40%" backgroundColor="white" />
        <Container width="10%" overflow={'hidden'}>
          <Container
            width={0}
            height={0}
            borderBottomWidth={50}
            borderBottomColor={'white'}
            borderRightWidth={50}
            borderRightColor={'transparent'}
          />
        </Container>
        <Container width="50%" />
      </Container>
    </LinearGradient>
  </Container>
);
