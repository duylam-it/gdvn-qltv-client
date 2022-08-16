import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'
// store
import { dispatch } from '../store'

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  borrows: [],
}

const slice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true
    },

    // START LOADING
    stopLoading(state) {
      state.isLoading = false
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false
      state.error = action.payload
    },

    // GET BORROWS
    getBorrowsSuccess(state, action) {
      state.isLoading = false
      state.borrows = action.payload
    },
  },
})

// Reducer
export default slice.reducer

// Actions

// ----------------------------------------------------------------------
export function getBorrows() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/borrow/readAll')
      dispatch(slice.actions.getBorrowsSuccess(response.data.data))
    } catch (error) {
      dispatch(slice.actions.hasError(error))
    }
  }
}
