import { NotificationsPreferenceDataType } from '@cardstack/types';

import { hubApi, HubCacheTags } from '../hub-api';
import { hubBodyBuilder } from '../hub-service';

import {
  RegisterFCMTokenQueryParams,
  NotificationsPreferenceTypeStatusParam,
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
          hubNotifications.util.updateQueryData(
            'getNotificationsPreferences',
            undefined,
            (preferencesDraft: NotificationsPreferenceDataType[]) => {
              preferencesDraft?.map((item: NotificationsPreferenceDataType) => {
                if (item.attributes['notification-type'] === notificationType) {
                  item.attributes.status = status;
                }

                return item;
              });
            }
          )
        );

        queryFulfilled.catch(patchResult.undo);
      },
      invalidatesTags: [HubCacheTags.NOTIFICATION_PREFERENCES],
      extraOptions: { appendFCMToken: true },
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
  }),
});

export const {
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
  useSetNotificationsPreferencesMutation,
  useGetNotificationsPreferencesQuery,
} = hubNotifications;
