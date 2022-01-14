import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { filterIncident } from './utils/filter-incident';
import { IncidentType } from '@cardstack/types';

// TODO: Move to .env
const STATUS_PAGE_URL = 'https://status.cardstack.com/api/v2/';

export enum ServiceStatusTags {
  SERVICE_STATUS = 'SERVICE_STATUS',
}

export const serviceStatusApi = createApi({
  reducerPath: 'serviceStatusApi',
  baseQuery: fetchBaseQuery({ baseUrl: STATUS_PAGE_URL }),
  tagTypes: [...Object.values(ServiceStatusTags)],
  endpoints: builder => ({
    getServiceStatus: builder.query<IncidentType | null, void>({
      query: () => '/incidents/unresolved.json',
      providesTags: [ServiceStatusTags.SERVICE_STATUS],
      transformResponse: (response: any) => filterIncident(response.incidents),
    }),
  }),
});

export const { useGetServiceStatusQuery } = serviceStatusApi;
