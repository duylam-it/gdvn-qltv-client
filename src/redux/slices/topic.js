import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'
// store
import { dispatch } from '../store'

const initialState = {
  isLoading: false,
  error: null,
  topics: [],
}

const slice = createSlice({
  name: 'topic',
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

    // GET TOPICS
    getTopicsSuccess(state, action) {
      state.isLoading = false
      state.topics = action.payload
    },
  },
})

// Reducer
export default slice.reducer

// Actions
export function getTopics() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/topic/readAll')
      dispatch(slice.actions.getTopicsSuccess(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error))
    }
  }
}
