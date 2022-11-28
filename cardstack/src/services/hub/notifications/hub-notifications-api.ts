import { BottomSheetAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { hubApi, HubCacheTags } from '../hub-api';
import { hubBodyBuilder } from '../hub-service';

import {
  RegisterFCMTokenQueryParams,
  NotificationsPreferenceTypeStatusParam,
  NotificationsPreferenceDataType,
} from './hub-notifications-types';

const routes = {
  registerFCMToken: '/push-notification-registrations',
  notificationsPreferences: '/notification-preferences',
};

export const hubNotifications = hubApi.injectEndpoints({
  endpoints: builder => ({
    registerFcmToken: builder.query<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: routes.registerFCMToken,
        method: 'POST',
        body: hubBodyBuilder('push-notification-registration', {
          'push-client-id': fcmToken,
        }),
      }),
    }),
    unregisterFcmToken: builder.mutation<string, RegisterFCMTokenQueryParams>({
      query: ({ fcmToken }) => ({
        url: `${routes.registerFCMToken}/${fcmToken}`,
        method: 'DELETE',
        responseHandler: response => response.text(),
      }),
    }),
    getNotificationsPreferences: builder.query<
      NotificationsPreferenceDataType[],
      void
    >({
      query: () => routes.notificationsPreferences,
      providesTags: [HubCacheTags.NOTIFICATION_PREFERENCES],
      extraOptions: { appendFCMToken: true },
      transformResponse: (response: {
        data: NotificationsPreferenceDataType[];
      }) => response?.data,
    }),
    setNotificationsPreferences: builder.mutation<
      void,
      NotificationsPreferenceTypeStatusParam
    >({
      query: ({ notificationType, status }) => ({
        url: routes.notificationsPreferences,
        method: 'PUT',
        body: JSON.stringify({
          data: {
            type: 'notification-preference',
            attributes: {
              'notification-type': notificationType,
              status,
            },
          },
        }),
      }),
      onQueryStarted(
        { notificationType, status },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          hubApi.util.updateQueryData(
            'getNotificationsPreferences',
            { notificationType, status },
            (preferences: NotificationsPreferenceDataType[]) => {
              const updateItem = preferences?.find(
                (item: NotificationsPreferenceDataType) =>
                  item.attributes['notification-type'] === notificationType
              );

              if (updateItem) {
                updateItem.attributes.status = status;
                Object.assign(preferences, updateItem);
              }
            }
          )
        );

        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [HubCacheTags.NOTIFICATION_PREFERENCES],
      extraOptions: { appendFCMToken: true },
    }),
  }),
});

export const {
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
  useGetNotificationsPreferencesQuery,
  useSetNotificationsPreferencesMutation,
} = hubNotifications;
