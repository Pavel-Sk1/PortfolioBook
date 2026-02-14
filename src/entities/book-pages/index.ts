// Redux exports (можно удалить после полного перехода на MobX)
export { getAllBookPagesThunk } from './api/bookPagesThunkApi'
export { setCurrentPage, type IPageImage } from './model/bookPagesSlice'

// MobX exports
export { bookPagesStore } from './model/BookPagesStore'
export { getAllBookPages } from './api/bookPagesApi'
