import { apiSlice } from './index';
import { AppQueryResult, Feedback } from '@/types/queries';

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation<
    AppQueryResult<any>,
    {
      body: {
        user_name: string;
        rate: number;
        note: string;
        phone: number | null
      }
    }
  >({
    query: (body) => ({
      url: `feedbacks/create`,
      method: `POST`,
      body,
      validateStatus: (response, result) =>
       result.status,
    }),
  }),
  }),
});

export const { useCreateFeedbackMutation } = feedbackApi;
