import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchHubBaseQuery } from './hub-service';

export enum HubPublicCacheTags {
  HUB_EOA_CLAIMED = 'HUB_EOA_CLAIMED',
}

interface EoaClaimedParams {
  eoa: string;
}

export const hubPublicApi = createApi({
  reducerPath: 'hubPublicApi',
  baseQuery: fetchHubBaseQuery,
  tagTypes: [...Object.values(HubPublicCacheTags)],
  endpoints: builder => ({
    getEoaClaimed: builder.query<any, EoaClaimedParams>({
      query: ({ eoa }) => `/api/email-card-drop-requests?eoa=${eoa}`,
      providesTags: [HubPublicCacheTags.HUB_EOA_CLAIMED],
      transformResponse: (response: any) => {
        return response?.data?.attributes?.claimed;
      },
    }),
  }),
});

export const { useGetEoaClaimedQuery } = hubPublicApi;
