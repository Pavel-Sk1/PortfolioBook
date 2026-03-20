import { bookPagesStore } from '@/entities'
import { observer } from 'mobx-react-lite'
import styles from './BookContentLinks.module.css'
import { toJS } from 'mobx'

interface BookContentLinksProps {
  onSelectPage: (pageIndex: number) => void
  pageNumber: number
}

export const BookContentLinks = observer(
  ({ onSelectPage, pageNumber }: BookContentLinksProps) => {
    const { getPageLinks, bookLinksError, isLoadingBookLinks } = bookPagesStore
    console.log(pageNumber,  "page number")

    const pageContent = getPageLinks(pageNumber - 1)

    if (isLoadingBookLinks) {
      return <div className={styles.loading}>Загрузка...</div>
    }

    if (bookLinksError) {
      return <div className={styles.error}>Ошибка загрузки ссылок</div>
    }

    if (!pageContent) {
      return null
    }

    return (
      <div
        className={styles['book-content-links']}
        style={{
          top: `${pageContent.position.top}px`,
          left: `${pageContent.position.left}px`,
        }}
      >
        <h3
          className={styles['page-name']}
          style={{ color: `${pageContent.projectTextColor}` }}
        >
          {pageContent.pageName || ''}
        </h3>
        <ul
          className={styles['links-list']}
          style={{ color: `${pageContent.linksTextColor}` }}
        >
          {pageContent.pageLinks.map((link, idx) => (
            <li key={idx}>
              <a onClick={() => onSelectPage(link.pageNumber)}>
                {link.projectTitle}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  },
)
