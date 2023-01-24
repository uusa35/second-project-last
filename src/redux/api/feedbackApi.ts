import { apiSlice } from './index';
import { AppQueryResult, Feedback } from '@/types/queries';

export const feedbackApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFeedback: builder.mutation<
    AppQueryResult<Feedback>,
    {
      body: {
        user_name: string;
        rate: number;
        note: string;
        phone: string
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
