import React from 'react';
import { Linking, Share } from 'react-native';
import styled from 'styled-components';

import ButtonPressAnimation from '../../../components/animations/ButtonPressAnimation';
import { buildUniqueTokenName } from '../../../helpers/assets';
import { magicMemo, showActionSheetWithOptions } from '../../../utils';
import { ColumnWithMargins, FlexItem, RowWithMargins } from '../../layout';
import { Container, Icon, Text } from '@cardstack/components';

const paddingHorizontal = 19;
const HeadingColumn = styled(ColumnWithMargins).attrs({
  align: 'start',
  justify: 'start',
  margin: 3,
  shrink: 1,
})`
  padding-right: ${paddingHorizontal};
`;

const UniqueTokenExpandedStateHeader = ({ asset }) => {
  const onContextMenuPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Share', 'View on OpenSea', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          Share.share({
            title: `Share ${buildUniqueTokenName(asset)} Info`,
            url: asset.permalink,
          });
        } else if (buttonIndex === 1) {
          // View on OpenSea
          Linking.openURL(asset.permalink);
        }
      }
    );
  };

  return (
    <Container
      alignItems="center"
      flexDirection="row"
      justifyContent="space-between"
      paddingHorizontal={5}
      paddingVertical={3}
    >
      <HeadingColumn>
        <Container>
          <Container
            backgroundColor="backgroundLightGray"
            borderRadius={50}
            marginBottom={2}
            maxWidth={150}
            paddingHorizontal={2}
            style={{ paddingVertical: 1 }}
          >
            <Text
              color="networkBadge"
              fontSize={9}
              numberOfLines={1}
              weight="bold"
            >
              #{asset.id}
            </Text>
          </Container>
          <Text color="blueText" size="small" weight="extraBold">
            {asset.asset_contract.name.toUpperCase()}
          </Text>
        </Container>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Container width="80%">
            <Text size="medium" weight="extraBold">
              {buildUniqueTokenName(asset)}
            </Text>
          </Container>
          <ButtonPressAnimation onPress={onContextMenuPress}>
            <Icon
              fill="backgroundBlue"
              name="more-circle"
              stroke="backgroundBlue"
            />
          </ButtonPressAnimation>
        </Container>
      </HeadingColumn>
    </Container>
  );
};

export default magicMemo(UniqueTokenExpandedStateHeader, 'asset');
