import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Image } from 'react-native';
import logo from '../../assets/cardstackLogoTransparent.png';

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
      <Container
        width="100%"
        paddingHorizontal={6}
        paddingVertical={4}
        paddingBottom={0}
      >
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
        <Container width="10%">
          <Container
            width={0}
            height={0}
            borderBottomWidth={50}
            borderBottomColor={'white'}
            borderRightWidth={50}
            borderRightColor={'transparent'}
          />
        </Container>
        <Container width="60%" />
      </Container>
    </LinearGradient>
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems={'center'}
      paddingHorizontal={6}
      paddingVertical={4}
    >
      <Container>
        <Text fontSize={13}>{'Spendable Balance'}</Text>
        <Text fontSize={40} variant={'bold'}>
          {'§2,500'}
        </Text>
      </Container>
      <Container height={46} width={42}>
        <Image
          source={logo}
          style={{
            height: '100%',
            resizeMode: 'contain',
            width: '100%',
          }}
        />
      </Container>
    </Container>
    <Container
      flexDirection="row"
      alignItems="flex-end"
      justifyContent={'space-between'}
      paddingHorizontal={6}
      paddingBottom={4}
    >
      <Text variant={'bold'}>{'$25.00 USD'}</Text>
      <Container alignItems="flex-end">
        <Text color="grayText" fontSize={10}>
          {'RELOADABLE'}
        </Text>
        <Text color="grayText" fontSize={10}>
          {'NON-TRANSFRERRABLE'}
        </Text>
      </Container>
    </Container>
  </Container>
);
