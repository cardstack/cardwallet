import React from 'react';
import { Image } from 'react-native';
import SVG, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import logo from '../../assets/cardstackLogoTransparent.png';
import { Container } from '../Container';
import { Text } from '../Text';

export const PrepaidCard = () => (
  <Container
    backgroundColor={'white'}
    borderRadius={10}
    overflow={'hidden'}
    borderColor="buttonPrimaryBorder"
    width={'100%'}
  >
    <SVG
      width={'100%'}
      height={100}
      viewBox="0 0 400 100"
      style={{ position: 'absolute', top: -2 }}
    >
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#00ebe5" stopOpacity="1" />
          <Stop offset="1" stopColor="#c3fc33" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect id="Gradient" width="100%" height="100" fill="url(#grad)" />
      <G
        id="Bottom_platter"
        data-name="Bottom platter"
        transform="translate(0 64.325)"
      >
        <Path
          id="Union_18"
          data-name="Union 18"
          d="M0,164.992v-.127H0V0H139.563s13.162.132,24.094,12.362,15.768,15.605,15.768,15.605,7.3,8.09,22.43,8.452H335l-.064,128.572Z"
          fill="#fff"
        />
      </G>
    </SVG>
    <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
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
