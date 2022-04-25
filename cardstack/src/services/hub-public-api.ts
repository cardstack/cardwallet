import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HUB_URL } from 'react-native-dotenv';

export enum HubPublicCacheTags {
  HUB_EOA_CLAIMED = 'HUB_EOA_CLAIMED',
}

interface EoaClaimedParams {
  eoa: string;
}

export const hubPublicApi = createApi({
  reducerPath: 'hubPublicApi',
  baseQuery: fetchBaseQuery({
    baseUrl: HUB_URL,
    prepareHeaders: headers => {
      headers.set('Accept', 'application/vnd.api+json');
      headers.set('Content-Type', 'application/vnd.api+json');

      return headers;
    },
  }),
  tagTypes: [...Object.values(HubPublicCacheTags)],
  endpoints: builder => ({
    getEoaClaimed: builder.query<any, EoaClaimedParams>({
      query: ({ eoa }) => `/api/email-card-drop-requests?eoa=${eoa}`,
      providesTags: [HubPublicCacheTags.HUB_EOA_CLAIMED],
    }),
  }),
});

export const { useGetEoaClaimedQuery } = hubPublicApi;
