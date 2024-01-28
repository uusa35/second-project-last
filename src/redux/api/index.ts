import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl, isLocal, xDomain } from '../../constants';
import { RootState } from '@/redux/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: isLocal ? 'https://pages-dash.testbedbynd.com/api/' : `${apiUrl}`,
    prepareHeaders: async (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      );
      headers.set('Cache-Control', 'no-store');
      if (isLocal) {
        headers.set('url', xDomain);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Cart', 'Branch', 'Area'],
  keepUnusedDataFor: 1,
  refetchOnReconnect: true,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({}),
});
