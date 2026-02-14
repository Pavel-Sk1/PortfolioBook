import { configureStore } from '@reduxjs/toolkit'
import { bookPagesReducer } from '@/entities/book-pages/model/bookPagesSlice'

export const store = configureStore({
  reducer: {
    bookPages: bookPagesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch