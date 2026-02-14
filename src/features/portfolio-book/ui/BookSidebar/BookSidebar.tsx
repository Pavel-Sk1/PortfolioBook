import { observer } from 'mobx-react-lite'
import { bookPagesStore } from '@/entities'
import styles from './BookSidebar.module.css'

interface BookSidebarProps {
  onSelectPage: (pageIndex: number) => void
}

export const BookSidebar = observer(({ onSelectPage }: BookSidebarProps) => {
  const { pages, isLoadingPages, currentPage } = bookPagesStore

  if (isLoadingPages || pages.length === 0) {
    return null
  }

  return (
    <aside className={styles['book-sidebar']}>
      <ul className={styles['book-sidebar-list']}>
        {pages.map((pageImage, index) => (
          <li
            key={pageImage.page ?? index}
            className={`${styles['book-sidebar-item']} ${
              index === currentPage ? styles['book-sidebar-item--active'] : ''
            }`}
            onClick={() => onSelectPage(index)}
          >
            <div className={styles['book-sidebar-thumb']}>
              <img src={pageImage.image} alt={`Страница ${pageImage.page}`} />
            </div>
            <span className={styles['book-sidebar-label']}>
              Стр. {pageImage.page}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
})

