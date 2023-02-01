import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl, baseUrl, isLocal } from '../../constants';
import { RootState } from '@/redux/store';

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
      headers.set('url', baseUrl);
      headers.set(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      );
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Cart', 'Branch', 'Area'],
  keepUnusedDataFor: 60 * 60,
  refetchOnReconnect: false,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({}),
});
