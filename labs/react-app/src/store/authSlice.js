import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logoutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { loginUser, logoutUser, updateUser } = authSlice.actions
export default authSlice.reducer
