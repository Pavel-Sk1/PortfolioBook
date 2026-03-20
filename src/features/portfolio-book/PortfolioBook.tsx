import styles from './PortfolioBook.module.css'
import { useRef, useCallback, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { BookButton } from './ui/BookButton/BookButton'
import { BookPage } from './ui/BookPage/BookPage'
import { bookPagesStore, type IPageImage } from '@/entities'
import { observer } from 'mobx-react-lite'
import { BookContentNotFound } from './ui/BookContentNotFound/BookContentNotFound'
import { BookControlPanel } from './ui/BookControlPanel/BookControlPanel'
import { portfolioBookStore } from './model/portfolioBookStore'
import { useContainerDimensions } from './lib/useContainerDimensions'
import { useDraggable } from './lib/useDraggable'
import { ZoomedView } from './ui/ZoomView/ZoomView'
import {
  MAX_BOOK_WIDTH,
  BOOK_ASPECT_RATIO,
} from './lib/constants/bookDimensions'
import type { PageState } from './model/book.types'
import { toJS } from 'mobx'

interface HTMLFlipBookInstance {
  pageFlip: () => {
    flipNext: (corner?: 'top' | 'bottom') => void
    flipPrev: (corner?: 'top' | 'bottom') => void
    flip: (pageNum: number, corner?: 'top' | 'bottom') => void
    turnToPage: (pageNum: number) => void
    getPageCount: () => number
    getCurrentPageIndex: () => number
    getOrientation: () => 'portrait' | 'landscape'
    getState: () => 'read' | 'flipping' | 'user_fold' | 'fold_corner'
    loadFromImages: (imagesHref: string[]) => void
    loadFromHTML: (elements: HTMLElement[]) => void
    updateFromHtml: (elements: HTMLElement[]) => void
    destroy: () => void
  }
}

export const PortfolioBook = observer(() => {
  const flipBookRef = useRef<HTMLFlipBookInstance>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const {
    pages,
    isLoadingPages,
    setCurrentPage,
    currentPage,
    loadBookPages,
    loadBookContentLinks,
  } = bookPagesStore
  const {
    scale,
    bookOffset,
    setBookOffset,
    isZoomed,
    pageState,
    setPageState,
  } = portfolioBookStore

  const { width: containerWidth, height: containerHeight } =
    useContainerDimensions(containerRef)
  const { isDragging, pan, onMouseDown, onMouseMove, stopDragging } =
    useDraggable(isZoomed)

  const isLeftArrowButtonVisible =
    isZoomed ||
    currentPage === 0 ||
    isLoadingPages ||
    pages.length === 0 ||
    ((pageState === 'fold_corner' || pageState === 'flipping') &&
      currentPage === pages.length - 3)
  const isRightArrowButtonVisible =
    isZoomed ||
    currentPage === pages.length - 1 ||
    isLoadingPages ||
    pages.length === 0 ||
    ((pageState === 'fold_corner' || pageState === 'flipping') &&
      (currentPage === pages.length - 3 || currentPage === 0))

  // Вариант 1: исходим из доступной ширины (с учётом максимума)
  const maxWidth = Math.min(containerWidth, MAX_BOOK_WIDTH)
  const heightFromWidth = maxWidth / BOOK_ASPECT_RATIO

  // Вариант 2: исходим из доступной высоты
  const widthFromHeight = containerHeight * BOOK_ASPECT_RATIO

  let bookWidth, bookHeight

  if (heightFromWidth <= containerHeight) {
    // Помещается по ширине
    bookWidth = maxWidth
    bookHeight = heightFromWidth
  } else {
    // Помещается по высоте
    bookWidth = widthFromHeight
    bookHeight = containerHeight
  }

  // Дополнительная проверка: если bookWidth превышает MAX_BOOK_WIDTH (при расчёте от высоты)
  if (bookWidth > MAX_BOOK_WIDTH) {
    bookWidth = MAX_BOOK_WIDTH
    bookHeight = bookWidth / BOOK_ASPECT_RATIO
    // Если после этого высота всё ещё больше контейнера (редко)
    if (bookHeight > containerHeight) {
      bookHeight = containerHeight
      bookWidth = bookHeight * BOOK_ASPECT_RATIO
    }
  }

  // Округляем до целых чисел, чтобы избежать дрожания
  bookWidth = Math.floor(bookWidth)
  bookHeight = Math.floor(bookHeight)

  // Ширина одной страницы
  const pageWidth = Math.floor(bookWidth / 2)

  const handleNextClick = useCallback(() => {
    if (isZoomed) return
    flipBookRef.current?.pageFlip().flipNext()
  }, [isZoomed])

  const handlePrevClick = useCallback(() => {
    if (isZoomed) return
    flipBookRef.current?.pageFlip().flipPrev()
  }, [isZoomed])

  const handlePageFlip = useCallback(
    (e: { data: number }) => {
      if (isZoomed) return
      setCurrentPage(e.data)
    },
    [isZoomed],
  )

  const handlePageSelect = useCallback(
    (pageIndex: number) => {
      if (isZoomed) return
      // flipBookRef.current?.pageFlip().flip(pageIndex)
      const pageFlip = flipBookRef.current?.pageFlip()
      if (pageFlip) {
        pageFlip.turnToPage(pageIndex) // pageNumber – 1‑based
      }
    },
    [isZoomed],
  )

  const handleChangeState = useCallback((state: any) => {
    setPageState(state.data)
  }, [])

  useEffect(() => {
    loadBookPages()
    loadBookContentLinks()
  }, [])

  useEffect(() => {
    if (pages.length === 0 || containerWidth === 0) return

    const maxWidth = Math.min(containerWidth, MAX_BOOK_WIDTH)
    const heightFromWidth = maxWidth / BOOK_ASPECT_RATIO
    let w, h
    if (heightFromWidth <= containerHeight) {
      w = maxWidth
      h = heightFromWidth
    } else {
      w = containerHeight * BOOK_ASPECT_RATIO
      h = containerHeight
    }
    if (w > MAX_BOOK_WIDTH) {
      w = MAX_BOOK_WIDTH
      h = w / BOOK_ASPECT_RATIO
      if (h > containerHeight) {
        h = containerHeight
        w = h * BOOK_ASPECT_RATIO
      }
    }
    w = Math.floor(w)
    const pageW = Math.floor(w / 2)

    let newOffset = 0
    if (currentPage === 0) {
      newOffset = -(pageW * scale) / 2
    } else if (currentPage === pages.length - 1) {
      newOffset = (pageW * scale) / 2
    }

    setBookOffset(newOffset)
  }, [currentPage, pages.length, scale, containerWidth, containerHeight])

  return (
    <>
      {/* Область книги */}
      <div ref={containerRef} className={styles['book-container']}>
        {isLoadingPages ? (
          <div className={styles['book-loader']}>
            <div>Загрузка книги...</div>
          </div>
        ) : pages.length > 0 ? (
          <div className={styles['book-layout']}>
            {/* <BookSidebar onSelectPage={handlePageSelect} /> */}
            <div
              className={styles['book-content']}
              style={{
                width: bookWidth + 96,
                height: bookHeight,
              }}
            >
              {/* Левая вертикальная кнопка */}

              <BookButton
                direction="left"
                onClick={handlePrevClick}
                style={{
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(${bookOffset}px)`,
                  height: bookHeight,
                  opacity: isLeftArrowButtonVisible ? 0 : 1,
                }}
              />

              {/* Книга */}
              <div
                className={styles['book-pages']}
                style={{
                  width: bookWidth,
                  height: bookHeight,
                  transition: isZoomed
                    ? undefined
                    : 'transform 0.5s ease-in-out',
                  transform: `translateX(${bookOffset}px)`,
                }}
              >
                {bookWidth > 0 && (
                  <div
                    className={styles['book-zoom-wrapper']}
                    style={
                      isZoomed
                        ? {
                            cursor: isDragging ? 'grabbing' : 'grab',
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(1.5)`,
                            transformOrigin: 'center center',
                          }
                        : undefined
                    }
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={stopDragging}
                    onMouseLeave={stopDragging}
                  >
                    {isZoomed ? (
                      // ЗУМ-РЕЖИМ: статичный разворот без FlipBook
                      <ZoomedView pages={pages} currentPage={currentPage} />
                    ) : (
                      // Обычный режим: FlipBook со всеми анимациями
                      <HTMLFlipBook
                        key={`book-${bookWidth}-${bookHeight}`}
                        ref={flipBookRef}
                        width={pageWidth}
                        height={bookHeight}
                        minWidth={315}
                        maxWidth={2000}
                        minHeight={400}
                        maxHeight={1533}
                        size="fixed"
                        autoSize={false}
                        drawShadow={true}
                        flippingTime={800}
                        maxShadowOpacity={0.2}
                        usePortrait={false}
                        startZIndex={0}
                        startPage={currentPage}
                        showCover={true}
                        mobileScrollSupport={!isZoomed}
                        swipeDistance={isZoomed ? 10000 : 30}
                        clickEventForward={!isZoomed}
                        useMouseEvents={!isZoomed}
                        showPageCorners={!isZoomed}
                        disableFlipByClick={isZoomed}
                        onFlip={handlePageFlip}
                        onChangeOrientation={() => {}}
                        onChangeState={handleChangeState}
                        onInit={() => {}}
                        style={isZoomed ? { pointerEvents: 'none' } : {}}
                        onUpdate={() => {}}
                        className="portfolio-flipbook"
                      >
                        {pages.map((pageImage: IPageImage, index: number) => (
                          <BookPage
                            key={index}
                            image={pageImage.image}
                            width={pageWidth}
                            height={bookHeight}
                            pageNumber={pageImage.page}
                            onLinkClick={handlePageSelect}
                          />
                        ))}
                      </HTMLFlipBook>
                    )}
                  </div>
                )}
              </div>

              {/* Правая вертикальная кнопка */}

              <BookButton
                direction="right"
                style={{
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(${bookOffset}px)`,
                  height: bookHeight,
                  opacity: isRightArrowButtonVisible ? 0 : 1,
                }}
                onClick={handleNextClick}
              />
            </div>
          </div>
        ) : (
          <BookContentNotFound />
        )}
      </div>
      <BookControlPanel />
    </>
  )
})
