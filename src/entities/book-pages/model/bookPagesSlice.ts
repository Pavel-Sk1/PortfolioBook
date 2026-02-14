import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getAllBookPagesThunk } from '../api/bookPagesThunkApi'
import type { IPageImage } from './book.types'

type BookPagesState = {
  pages: IPageImage[]
  error: string | null
  loading: boolean
  currentPage: number
}

const initialState: BookPagesState = {
  pages: [],
  error: null,
  loading: false,
  currentPage: 0,
}

const bookPagesSlice = createSlice({
  name: 'bookPages',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllBookPagesThunk.pending, state => {
        state.loading = true
      })
      .addCase(getAllBookPagesThunk.fulfilled, (state, action) => {
        state.pages = action.payload.data
        state.loading = false
        state.error = null
      })
      .addCase(getAllBookPagesThunk.rejected, (state, action) => {
        state.error =
          action.payload?.message || 'Ошибка при получении страниц книги'
        state.loading = false
      })
  },
})

export const bookPagesReducer = bookPagesSlice.reducer
export const { setCurrentPage } = bookPagesSlice.actions
