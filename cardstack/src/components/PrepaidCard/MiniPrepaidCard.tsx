import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { Container } from '@cardstack/components';
import { PrepaidCardCustomization } from '@cardstack/types';

import { CustomizableBackground } from './components/CustomizableBackground';

const styles = StyleSheet.create({
  cardWrapper: {
    shadowColor: 'black',
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    borderRadius: 3,
    borderWidth: 0.3,
    overflow: 'hidden',
  },
});

const MiniPrepaidCard = ({
  cardCustomization,
}: {
  cardCustomization: PrepaidCardCustomization;
}) => (
  <Container
    width={20}
    height={16}
    borderColor="borderGray"
    style={styles.cardWrapper}
  >
    <CustomizableBackground
      cardCustomization={{ ...cardCustomization, patternUrl: null }} // Not applying pattern on miniCard
      isEditing={false}
      variant="mini"
      address="miniPrepaidCard"
    />
    <Container />
  </Container>
);

export default memo(MiniPrepaidCard);
