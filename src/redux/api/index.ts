import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { apiUrl, getHost, xDomain } from '../../constants';
import { RootState } from '@/redux/store';

// const host = async () =>
//   await getHost().then((req) => req.url.split('//')[1].split('/')[0]);
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}`,
    prepareHeaders: (
      headers,
      { getState, type, endpoint, extra }: RootState
    ) => {
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,Accept,Authentication,Content-Type'
      );
      // const fetchOrigin = await getHost().then(
      //     (req) => req.url.split('//')[1].split('/')[0]
      // );
      // console.log('the xdomain ============>', xDomain);
      // console.log('the fetchOrigin ============>', fetchOrigin);
      headers.set('url', xDomain);
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
