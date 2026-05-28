import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Feedback', 'Users'],
  endpoints: (builder) => ({
    getFeedback: builder.query({
      query: () => '/feedback',
      providesTags: ['Feedback'],
    }),
    addFeedback: builder.mutation({
      query: (newFeedback) => ({
        url: '/feedback',
        method: 'POST',
        body: newFeedback,
      }),
      invalidatesTags: ['Feedback'],
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/feedback/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Feedback'],
    }),
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useGetFeedbackQuery,
  useAddFeedbackMutation,
  useDeleteFeedbackMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = apiSlice
