import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from '../../utils/axios'
// store
import { dispatch } from '../store'

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  books: [],
  book: null,
  images: [],
  sortBy: null,
}

const slice = createSlice({
  name: 'book',
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

    // GET PRODUCTS
    getBooksSuccess(state, action) {
      state.isLoading = false
      state.books = action.payload
    },

    // GET PRODUCT
    getBookSuccess(state, action) {
      state.isLoading = false
      state.book = action.payload
    },

    // GET IMAGES
    getImagesSuccess(state, action) {
      state.isLoading = false
      state.images = action.payload
    },
  },
})

// Reducer
export default slice.reducer

// Actions

// ----------------------------------------------------------------------

export function getBooks() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      let response = await axios.get('/book/readAll')
      let data = response.data.data
      for (let j = 0; j < data.length; j++) {
        const book = data[j]
        response = await axios.post('/file/getFiles/', {
          images: book.image,
        })
        const dataImages = response.data.data
        let images = []
        for (let i = 0; i < dataImages.length; i++) {
          const extname = dataImages[i].extname.split('.').pop()
          const resultFetch = await fetch(
            `data:image/${extname};base64, ${dataImages[i].base64}`
          )
          const blob = await resultFetch.blob()
          const file = new File([blob], dataImages[i].basename, {
            type: blob.type,
            lastModified: new Date().getTime,
          })
          images.push(
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        }
        data[j].images = images
      }
      dispatch(slice.actions.getBooksSuccess(data))
    } catch (error) {
      dispatch(slice.actions.hasError(error))
    }
  }
}

export function updateBooks() {
  return async () => {
    dispatch(slice.actions.startLoading())
    await new Promise((resolve) => setTimeout(resolve, 1000))
    dispatch(slice.actions.stopLoading())
  }
}

export function getProduct(name) {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      const response = await axios.get('/api/products/product', {
        params: { name },
      })
      dispatch(slice.actions.getBookSuccess(response.data.product))
    } catch (error) {
      console.error(error)
      dispatch(slice.actions.hasError(error))
    }
  }
}
