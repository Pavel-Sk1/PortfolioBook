import { makeAutoObservable, runInAction, toJS } from 'mobx'
import { getAllBookContentLinks, getAllBookPages } from '../api/bookPagesApi'
import type { IBookContentLinks, IPageImage } from './book.types'

export class BookPagesStore {
  pages: IPageImage[] = []
  pagesError: string | null = null
  isLoadingPages: boolean = false
  currentPage: number = 0
  contentLinks: IBookContentLinks[] = []
  isLoadingBookLinks: boolean = false
  bookLinksError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // Действие для установки текущей страницы (стрелка сохраняет this при деструктуризации)
  setCurrentPage = (page: number) => {
    this.currentPage = page
  }

  // Действие для загрузки всех страниц книги
  async loadBookPages() {
    runInAction(() => {
      this.isLoadingPages = true
      this.pagesError = null
    })
    try {
      const pages = await getAllBookPages()
      runInAction(() => {
        this.pages = pages
      })
    } catch (pagesError) {
      runInAction(() => {
        this.pagesError =
          (pagesError as Error)?.message || 'Ошибка при получении страниц книги'
      })
    } finally {
      runInAction(() => {
        this.isLoadingPages = false
      })
    }
  }

  loadBookContentLinks = async () => {
    runInAction(() => {
      this.isLoadingBookLinks = true
      this.bookLinksError = null
    })

    try {
      const response = await getAllBookContentLinks()

      runInAction(() => {
        this.contentLinks = response.data.map(item => ({
          projectTitle: item.project_title,
          pageNumber: item.page_number,
        }))
      })
    } catch (error) {
    } finally {
      runInAction(() => {
        this.isLoadingBookLinks = false
      })
    }
  }
}

// Создаем единственный экземпляр store (singleton)
export const bookPagesStore = new BookPagesStore()
