import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WYRE_ENDPOINT } from 'react-native-dotenv';

export type Country = {
  name: string;
};

export type SupportedCountries = Record<string, Country>;

const routes = {
  supportedCountries: '/v3/widget/supportedCountries',
};

export const wyreApi = createApi({
  reducerPath: 'wyreApi',
  baseQuery: fetchBaseQuery({ baseUrl: WYRE_ENDPOINT }),
  endpoints: builder => ({
    getWyreSupportedCountries: builder.query<SupportedCountries, void>({
      query: () => routes.supportedCountries,
      transformResponse: (response: string[]) => {
        const getCountryName = new Intl.DisplayNames(['en'], {
          type: 'region',
        });

        const supportedCountriesWithName = response.reduce(
          (countries, countryCode) => {
            const name = getCountryName.of(countryCode);

            return {
              ...countries,
              [countryCode]: { name },
            };
          },
          {}
        );

        return supportedCountriesWithName;
      },
    }),
  }),
});

export const { useGetWyreSupportedCountriesQuery } = wyreApi;
