import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl, getHost, xDomain } from '../../constants';
import { RootState } from '@/redux/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: async (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      const host = await getHost().then(
        (r: any) => r.url.split('//')[1].split('/')[0]
      );
      // const otherHost = await getHost().then((r: any) => r.data);
      // console.log('the host ============>', host);
      // console.log('the xdomain ============>', xDomain);
      await headers.set('url', host);
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
