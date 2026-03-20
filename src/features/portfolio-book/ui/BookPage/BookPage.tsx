import { forwardRef } from 'react'
import { BookContentLinks } from '../BookContentLinks/BookContentLinks'
import styles from './BookPage.module.css'
import { observer } from 'mobx-react-lite'
import { bookPagesStore } from '@/entities'

interface BookPageProps {
  image: string
  width: number
  height: number
  pageNumber: number
  onLinkClick: (linkIndex: number) => void
}

export const BookPage = observer(
  forwardRef<HTMLDivElement, BookPageProps>(
    ({ pageNumber, image, width, height, onLinkClick }, ref) => {
      const { pages } = bookPagesStore
      const pageShadowGradient =
        pageNumber % 2 === 0
          ? 'linear-gradient(to right, transparent 95%, rgba(0, 0, 0, 0.2) 100%)' // левая страница – тень справа
          : 'linear-gradient(to left, transparent 95%, rgba(0, 0, 0, 0.15) 100%)' // правая страница – тень слева
      const isBookCover = pageNumber === 1 || pageNumber === pages.length

      return (
        <div
          ref={ref}
          className={styles['book-page']}
          style={{
            height: height,
            width: width / 2,
          }}
        >
          <div style={{ position: 'relative' }}>
            {!isBookCover && (
              <div
                className={styles['shadow-gradient']}
                style={{
                  background: pageShadowGradient,
                }}
              />
            )}
            <img
              src={image}
              alt={`Страница ${pageNumber}`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={e => {
                // Если изображение не загрузилось, показываем заглушку
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.style.backgroundColor = 'var(--background-primary)'
                  parent.style.display = 'flex'
                  parent.style.alignItems = 'center'
                  parent.style.justifyContent = 'center'

                  const errorText = document.createElement('div')
                  errorText.textContent = `Страница ${pageNumber}`
                  errorText.style.fontSize = 'var(--font-size-large)'
                  errorText.style.color = 'var(--text-color-primary)'
                  parent.appendChild(errorText)
                }
              }}
            />

            <BookContentLinks
              onSelectPage={onLinkClick}
              pageNumber={pageNumber}
            />
          </div>
        </div>
      )
    },
  ),
)

BookPage.displayName = 'BookPage'
