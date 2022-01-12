import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IncidentType } from '@cardstack/types';

// TODO: Move to .env
const STATUS_PAGE_URL = 'https://status.cardstack.com/api/v2/';

// const STATUS_PAGE_URL = 'https://my-json-server.typicode.com/douglaslondrina/depo/';
// //query: () => '/incidents',

export enum ServiceStatusTags {
  SERVICE_STATUS = 'SERVICE_STATUS',
}

const filterRelevantIncident = (incidents: IncidentType[]) => {
  const critical = incidents.filter((a: IncidentType) =>
    a.impact?.includes('critical')
  );

  return (
    critical.sort((a: IncidentType, b: IncidentType) => {
      return +new Date(b.started_at) - +new Date(a.started_at);
    })[0] || null
  );
};

export const serviceStatusApi = createApi({
  reducerPath: 'serviceStatusApi',
  baseQuery: fetchBaseQuery({ baseUrl: STATUS_PAGE_URL }),
  tagTypes: [...Object.values(ServiceStatusTags)],
  endpoints: builder => ({
    getServiceStatus: builder.query<IncidentType | undefined, any>({
      query: () => '/incidents/unresolved.json',
      providesTags: [ServiceStatusTags.SERVICE_STATUS],
      transformResponse: (response: any) => {
        return filterRelevantIncident(response.incidents);
      },
    }),
  }),
});

export const { useGetServiceStatusQuery } = serviceStatusApi;
