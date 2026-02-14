import { makeAutoObservable } from 'mobx'

export class PortfolioBookStore {
  scale: number = 1

  bookOffset: number = 0

  isZoomed: boolean = false

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
}
export const portfolioBookStore = new PortfolioBookStore()
