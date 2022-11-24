import { hubApi } from '../hub-api';
import { hubBodyBuilder } from '../hub-service';

import { RegisterFCMTokenQueryParams } from './hub-notifications-types';

const routes = {
  registerFCMToken: '/push-notification-registrations',
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
  }),
});

export const {
  useRegisterFcmTokenQuery,
  useUnregisterFcmTokenMutation,
} = hubNotifications;
