import React from 'react';
import { FlatList, Switch } from 'react-native';
import { Container, Skeleton, Text } from '@cardstack/components';
import {
  NotificationsOptionsStrings,
  useUpdateNotificationPreferences,
} from '@cardstack/hooks';
import { NotificationsPreferenceDataType } from '@cardstack/types';

const NotificationsSection = () => {
  const {
    options,
    onUpdateOptionStatus,
    error,
  } = useUpdateNotificationPreferences();

  const OptionListItem = ({
    item,
  }: {
    item: NotificationsPreferenceDataType;
  }) => {
    return (
      <Container
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        paddingHorizontal={6}
        paddingVertical={2}
        testID="option-item"
      >
        <Text>
          {
            NotificationsOptionsStrings[
              item?.attributes[
                'notification-type'
              ] as keyof typeof NotificationsOptionsStrings
            ]
          }
        </Text>
        <Switch
          onValueChange={value => onUpdateOptionStatus(item, value)}
          value={item?.attributes.status === 'enabled'}
        />
      </Container>
    );
  };

  const ListError = () => (
    <Container alignItems="center" flex={1} justifyContent="center">
      <Text>{error}</Text>
    </Container>
  );

  const ListLoading = () => (
    <Container flexDirection="column" paddingHorizontal={6} paddingVertical={2}>
      <Skeleton height={40} light marginBottom={1} width="100%" />
      <Skeleton height={40} light width="100%" />
    </Container>
  );

  return (
    <FlatList
      ListEmptyComponent={error ? ListError : ListLoading}
      contentContainerStyle={{ paddingTop: 16 }}
      data={options}
      keyExtractor={(item: NotificationsPreferenceDataType) =>
        item.attributes['notification-type']
      }
      renderItem={OptionListItem}
    />
  );
};

export default NotificationsSection;
