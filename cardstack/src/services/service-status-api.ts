import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IncidentType } from '@cardstack/types';

// TODO: Move to .env
const STATUS_PAGE_URL = 'https://status.cardstack.com/api/v2/';

export enum ServiceStatusTags {
  SERVICE_STATUS = 'SERVICE_STATUS',
}

const filterRelevantIncident = (incidents: IncidentType[]) => {
  const critical = incidents.filter((a: IncidentType) =>
    a.impact?.includes('critical')
  );

  if (critical.length > 0) {
    return critical.sort((a: IncidentType, b: IncidentType) => {
      return +new Date(b.started_at) - +new Date(a.started_at);
    })[0];
  }

  const major = incidents.filter((a: IncidentType) =>
    a.impact?.includes('major')
  );

  return (
    major.sort((a: IncidentType, b: IncidentType) => {
      return +new Date(b.started_at) - +new Date(a.started_at);
    })[0] || null
  );
};

export const serviceStatusApi = createApi({
  reducerPath: 'serviceStatusApi',
  baseQuery: fetchBaseQuery({ baseUrl: STATUS_PAGE_URL }),
  tagTypes: [...Object.values(ServiceStatusTags)],
  endpoints: builder => ({
    getServiceStatus: builder.query({
      query: () => '/incidents/unresolved.json',
      providesTags: [ServiceStatusTags.SERVICE_STATUS],
      transformResponse: (response: any) =>
        filterRelevantIncident(response.incidents),
    }),
  }),
});

export const { useGetServiceStatusQuery } = serviceStatusApi;
