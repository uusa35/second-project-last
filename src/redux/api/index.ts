import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { apiUrl, getApiCountry, isLocal } from '../../constants';
import { AppQueryResult, Country, StaticPage } from '@/types/queries';
import { RootState } from '@/redux/store';
import { Locale } from '@/types/index';
import { Auth } from '@/types/queries';
import Cookies from 'js-cookie';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: async (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      const { auth } = getState() as RootState;
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      headers.set('url', 'pages.testbedbynd.com');
      // headers.set('lang', getState().locale.lang);
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      );
      if (auth.access_token) {
        headers.set('Authorization', `Bearer ${auth.access_token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  // tagTypes: ['Category', 'Product', 'Vendor', 'Venue', 'Auth', 'Pre'],
  keepUnusedDataFor: 300,
  refetchOnReconnect: false,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
    // if (action.type === REHYDRATE) {
    //   return action.payload[reducerPath];
    // }
  },
  endpoints: (builder) => ({
    getStaticPages: builder.query<AppQueryResult<StaticPage[]>, Locale['lang']>(
      {
        query: (lang) => ({
          url: `pages`,
          headers: {
            'Accept-Language': lang,
          },
        }),
      }
    ),
  }),
});

export const { useGetStaticPagesQuery } = apiSlice;
