import styles from './PortfolioBook.module.css'
import { useRef, useCallback, useEffect, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { BookButton } from './ui/BookButton/BookButton'
import { BookPage } from './ui/BookPage/BookPage'
import { bookPagesStore, type IPageImage } from '@/entities'
import { observer } from 'mobx-react-lite'
import { BookContentNotFound } from './ui/BookContentNotFound/BookContentNotFound'
import { BookControlPanel } from './ui/BookControlPanel/BookControlPanel'
import { portfolioBookStore } from './model/portfolioBookStore'
import { useContainerDimensions } from '@/shared'

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
//-- 1336 ширина, 877 высота
const BASE_PAGE_WIDTH = 620
const BASE_PAGE_HEIGHT = 877
const MAX_BOOK_WIDTH = 1683
export const PortfolioBook = observer(() => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const containerSize = useContainerDimensions(containerRef)
  const flipBookRef = useRef<HTMLFlipBookInstance>(null)
  const { pages, isLoadingPages, setCurrentPage, currentPage } = bookPagesStore
  const { scale, bookOffset, setBookOffset, isZoomed } = portfolioBookStore

  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    bookPagesStore.loadBookPages()
  }, [])

  // Эффект для автоматического центрирования/сдвига книги
  useEffect(() => {
    if (pages.length === 0 || containerSize.width === 0) return

    let newOffset = 0
    const effectiveBookWidth = Math.min(containerSize.width, MAX_BOOK_WIDTH)
    const pageWidth = Math.floor(effectiveBookWidth / 2)

    if (currentPage === 0) {
      newOffset = -(pageWidth * scale) / 2
    } else if (currentPage === pages.length - 1) {
      newOffset = (pageWidth * scale) / 2
    } else {
      if (currentPage === 1) {
        newOffset = 0
      }
    }

    setBookOffset(newOffset)
  }, [currentPage, pages.length, scale, containerSize.width]) // Добавьте containerSize.width в зависимости

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
      flipBookRef.current?.pageFlip().flip(pageIndex)
    },
    [isZoomed],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [isZoomed, pan.x, pan.y],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !isDragging || !dragStart) return
      e.preventDefault()
      e.stopPropagation()
      const nextX = e.clientX - dragStart.x
      const nextY = e.clientY - dragStart.y
      setPan({ x: nextX, y: nextY })
    },
    [isZoomed, isDragging, dragStart],
  )

  const stopDragging = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
  }, [isDragging])

  const isLeftArrowButtonVisible =
    isZoomed || currentPage === 0 || isLoadingPages || pages.length === 0
  const isRightArrowButtonVisible =
    isZoomed ||
    currentPage === pages.length - 1 ||
    isLoadingPages ||
    pages.length === 0

  const effectiveBookWidth = Math.min(containerSize.width, MAX_BOOK_WIDTH)
  const pageWidth = Math.floor(effectiveBookWidth / 2)
  const pageAspectRatio = BASE_PAGE_HEIGHT / BASE_PAGE_WIDTH
  const desiredPageHeight = Math.floor(pageWidth * pageAspectRatio)
  const bookHeight =
    containerSize.height > 0
      ? Math.min(desiredPageHeight, containerSize.height)
      : 0

  // Добавьте для отладки
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.getBoundingClientRect()
    }
  }, [containerSize])

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
                width: effectiveBookWidth + 96,
                height: bookHeight,
              }}
            >
              {/* Левая вертикальная кнопка */}
              {!isLeftArrowButtonVisible && (
                <BookButton
                  direction="left"
                  onClick={handlePrevClick}
                  style={{
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(${bookOffset}px)`,
                    height: bookHeight,
                  }}
                />
              )}

              {/* Книга */}
              <div
                className={styles['book-pages']}
                style={{
                  width: effectiveBookWidth,
                  height: bookHeight,
                  transition: isZoomed
                    ? undefined
                    : 'transform 0.5s ease-in-out',
                  transform: `translateX(${bookOffset}px)`,
                }}
              >
                {containerSize.width > 0 &&
                  containerSize.height > 0 &&
                  bookHeight > 0 && (
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
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={stopDragging}
                      onMouseLeave={stopDragging}
                    >
                      {isZoomed ? (
                        // ЗУМ-РЕЖИМ: статичный разворот без FlipBook
                        <div className={styles['zoom-spread']}>
                          {currentPage === 0 ||
                          currentPage === pages.length - 1 ? (
                            <img src={pages[currentPage].image} alt="" />
                          ) : (
                            <>
                              <img src={pages[currentPage].image} alt="" />
                              <img src={pages[currentPage + 1].image} alt="" />
                            </>
                          )}
                        </div>
                      ) : (
                        // Обычный режим: FlipBook со всеми анимациями
                        <HTMLFlipBook
                          key={`book-${effectiveBookWidth}-${bookHeight}`}
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
                          maxShadowOpacity={0.1}
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
                          onChangeState={() => {}}
                          onInit={() => {}}
                          style={isZoomed ? { pointerEvents: 'none' } : {}}
                          onUpdate={() => {}}
                          className="portfolio-flipbook"
                        >
                          {pages.map((pageImage: IPageImage, index: number) => (
                            <BookPage
                              key={index}
                              pageNumber={pageImage.page}
                              image={pageImage.image}
                              width={pageWidth}
                              height={bookHeight}
                              onLinkClick={handlePageSelect}
                            />
                          ))}
                        </HTMLFlipBook>
                      )}
                    </div>
                  )}
              </div>

              {/* Правая вертикальная кнопка */}
              {!isRightArrowButtonVisible && (
                <BookButton
                  direction="right"
                  style={{
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(${bookOffset}px)`,
                    height: bookHeight,
                  }}
                  onClick={handleNextClick}
                />
              )}
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
