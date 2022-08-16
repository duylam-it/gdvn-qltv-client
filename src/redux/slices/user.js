import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'
// store
import { dispatch } from '../store'

const initialState = {
  isLoading: false,
  error: null,
  users: [],
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false
      state.error = action.payload
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.isLoading = false
      state.users = action.payload
    },
  },
})

// Reducer
export default slice.reducer

// Actions
export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/user/readAll')
      dispatch(slice.actions.getUsersSuccess(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error))
    }
  }
}
