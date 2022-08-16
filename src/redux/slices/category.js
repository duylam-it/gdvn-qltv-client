import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'
// store
import { dispatch } from '../store'

const initialState = {
  isLoading: false,
  error: null,
  categories: [],
}

const slice = createSlice({
  name: 'category',
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

    // GET CATEGORIES
    getCategoriesSuccess(state, action) {
      state.isLoading = false
      state.categories = action.payload
    },
  },
})

// Reducer
export default slice.reducer

// Actions
export function getCategories() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/category/readAll')
      dispatch(slice.actions.getCategoriesSuccess(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error))
    }
  }
}
