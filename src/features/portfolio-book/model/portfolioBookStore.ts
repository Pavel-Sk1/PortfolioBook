import { makeAutoObservable } from 'mobx'
import type { PageState } from './book.types'

export class PortfolioBookStore {
  scale: number = 1

  bookOffset: number = 0

  isZoomed: boolean = false

  pageState: PageState = 'read'

  constructor() {
    makeAutoObservable(this)
  }

  setScale = (newScale: number) => {
    this.scale = newScale
  }

  setBookOffset = (newOffset: number) => {
    this.bookOffset = newOffset
  }

  setIsZoomed = (value: boolean) => {
    this.isZoomed = value
  }

  toggleZoom = () => {
    this.isZoomed = !this.isZoomed
  }

  setPageState = (state: PageState) => {
    this.pageState = state
  }
}
export const portfolioBookStore = new PortfolioBookStore()
