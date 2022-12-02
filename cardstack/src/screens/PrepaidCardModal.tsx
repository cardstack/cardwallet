import { useNavigation, useRoute } from '@react-navigation/native';
import React, { memo } from 'react';
import { SectionList } from 'react-native';

import {
  Container,
  Icon,
  ListEmptyComponent,
  PrepaidCard,
  PrepaidCardProps,
  SafeAreaView,
  SheetHandle,
  Text,
  Touchable,
  TransactionItem,
} from '@cardstack/components';
import { usePrepaidCardTransactions } from '@cardstack/hooks';
import { Device } from '@cardstack/utils';
import { listStyle } from '@cardstack/utils/layouts';

import { TransactionListLoading } from '../components/TransactionList/TransactionListLoading';

const PrepaidCardModal = () => {
  const {
    params: { prepaidCardProps },
  } = useRoute() as { params: { prepaidCardProps: PrepaidCardProps } };

  const { sections, loading } = usePrepaidCardTransactions(
    prepaidCardProps.address
  );

  const { goBack } = useNavigation();

  return (
    <SafeAreaView flex={1} width="100%" alignItems="center" paddingTop={1}>
      {/* TODO NAVIGATION: remove this workaround after handling gestures manually */}
      {Device.isAndroid ? (
        <Touchable onPress={goBack} alignSelf="flex-start">
          <Icon name="chevron-left" color="teal" size={30} />
        </Touchable>
      ) : (
        <SheetHandle color="buttonDarkBackground" opacity={1} />
      )}
      <PrepaidCard
        {...prepaidCardProps}
        disabled
        paddingHorizontal={0}
        marginBottom={1}
        marginTop={2}
      />
      <Container
        alignItems="center"
        paddingTop={1}
        borderRadius={20}
        minHeight="100%"
        backgroundColor="white"
        width="100%"
      >
        <Container width="100%" paddingVertical={4} paddingHorizontal={5}>
          <Text size="medium">Recent Activity</Text>
        </Container>
        {loading ? (
          <TransactionListLoading light />
        ) : (
          <SectionList
            ListEmptyComponent={<ListEmptyComponent text="No transactions" />}
            contentContainerStyle={listStyle.sheetHeightPaddingBottom}
            renderItem={props => (
              <TransactionItem
                {...props}
                includeBorder
                prepaidInlineTransaction
              />
            )}
            sections={sections}
            renderSectionHeader={({ section: { title } }) => (
              <Container
                paddingVertical={2}
                paddingHorizontal={5}
                width="100%"
                backgroundColor="white"
              >
                <Text color="blueText">{title}</Text>
              </Container>
            )}
            style={listStyle.fullWidth}
          />
        )}
      </Container>
    </SafeAreaView>
  );
};

export default memo(PrepaidCardModal);
