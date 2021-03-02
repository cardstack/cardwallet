import React from 'react';
import { Image } from 'react-native';

import daiIcon from '../../assets/dai.png';
import sentIcon from '../../assets/sent.png';
import { Container, Text } from '@cardstack/components';

export const TransactionCoinRow = () => (
  <Container
    alignItems="center"
    justifyContent="space-between"
    flexDirection="row"
    width="100%"
    padding={4}
    backgroundColor="white"
    borderRadius={10}
    borderColor="borderGray"
  >
    <Left />
    <Right />
  </Container>
);

const Left = () => (
  <Container flexDirection="row">
    <Container height={40} width={40} marginRight={3}>
      <Image
        source={daiIcon}
        resizeMode="contain"
        style={{
          height: '100%',
          width: '100%',
        }}
      />
    </Container>
    <Container>
      <Container flexDirection="row" alignItems="center">
        <Container
          height={20}
          width={20}
          justifyContent="center"
          alignItems="center"
        >
          <Image
            source={sentIcon}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '100%',
              top: 1,
            }}
          />
        </Container>
        <Text fontSize={13} color="blueText">
          Paid
        </Text>
      </Container>
      <Text fontWeight="700">Spend</Text>
    </Container>
  </Container>
);

const Right = () => (
  <Container>
    <Container flexDirection="row">
      <Text color="blueText" fontSize={13} marginRight={1}>
        To
      </Text>
      <Text color="blueText" fontSize={13} fontWeight="700">
        BGY Solutions
      </Text>
    </Container>
    <Container marginTop={4} alignItems="flex-end">
      <Text color="blueText" fontSize={13} marginRight={1}>
        §600 SPEND
      </Text>
      <Text fontWeight="700">- $6.00 USD</Text>
    </Container>
  </Container>
);
