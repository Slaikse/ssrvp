import { createSlice } from '@reduxjs/toolkit'

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    items: [],
  },
  reducers: {
    setFeedback: (state, action) => {
      state.items = action.payload
    },
    addFeedback: (state, action) => {
      state.items.push(action.payload)
    },
    deleteFeedback: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
})

export const { setFeedback, addFeedback, deleteFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
