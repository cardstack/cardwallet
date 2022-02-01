import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { STATUS_API_BASE_URL } from 'react-native-dotenv';
import { filterIncident } from './utils/filter-incident';
import { IncidentType } from '@cardstack/types';

export enum ServiceStatusTags {
  SERVICE_STATUS = 'SERVICE_STATUS',
}

export const serviceStatusApi = createApi({
  reducerPath: 'serviceStatusApi',
  baseQuery: fetchBaseQuery({ baseUrl: STATUS_API_BASE_URL }),
  tagTypes: [...Object.values(ServiceStatusTags)],
  endpoints: builder => ({
    getServiceStatus: builder.query<IncidentType | null, void>({
      query: () => '/summary.json',
      providesTags: [ServiceStatusTags.SERVICE_STATUS],
      transformResponse: (response: any) =>
        filterIncident([
          ...response.incidents,
          ...response.scheduled_maintenances,
        ]),
    }),
  }),
});

export const { useGetServiceStatusQuery } = serviceStatusApi;
