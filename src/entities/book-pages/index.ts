// Redux exports (можно удалить после полного перехода на MobX)
export { getAllBookPagesThunk } from './api/bookPagesThunkApi'

// MobX exports
export { bookPagesStore } from './model/bookPagesStore'
export { getAllBookPages } from './api/bookPagesApi'
export { type IPageImage } from './model/book.types'
