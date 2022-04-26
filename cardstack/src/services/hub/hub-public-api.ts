import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchHubBaseQuery } from './hub-service';
import { EoaClaimedArg, EoaClaimedResultType } from './hub-types';

const routes = {
  emailCardDropRequest: ({ eoa }: EoaClaimedArg) =>
    `/api/email-card-drop-requests?eoa=${eoa}`,
};

export const hubPublicApi = createApi({
  reducerPath: 'hubPublicApi',
  baseQuery: fetchHubBaseQuery,
  endpoints: builder => ({
    getEoaClaimed: builder.query<EoaClaimedResultType, EoaClaimedArg>({
      query: routes.emailCardDropRequest,
      transformResponse: (response: {
        data: { attributes: { claimed: EoaClaimedResultType } };
      }) => response?.data?.attributes?.claimed,
    }),
  }),
});

export const { useGetEoaClaimedQuery } = hubPublicApi;
