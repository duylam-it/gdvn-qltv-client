import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// slices
import bookReducer from './slices/book'
import borrowReducer from './slices/borrow'
import calendarReducer from './slices/calendar'
import categoryReducer from './slices/category'
import chatReducer from './slices/chat'
import kanbanReducer from './slices/kanban'
import mailReducer from './slices/mail'
import productReducer from './slices/product'
import topicReducer from './slices/topic'
import userReducer from './slices/user'

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
}

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
}

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  book: bookReducer,
  topic: topicReducer,
  category: categoryReducer,
  borrow: borrowReducer,
  user: userReducer,
})

export { rootPersistConfig, rootReducer }
