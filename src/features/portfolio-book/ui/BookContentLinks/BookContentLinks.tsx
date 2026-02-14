import { bookPagesStore } from '@/entities'
import type { IBookContentLinks } from '@/entities/book-pages/model/book.types'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import styles from './BookContentLinks.module.css'

interface BookContentLinksProps {
  onSelectPage: (pageIndex: number) => void
}

export const BookContentLinks = observer(
  ({ onSelectPage }: BookContentLinksProps) => {
    const { contentLinks, loadBookContentLinks } = bookPagesStore

    useEffect(() => {
      loadBookContentLinks()
    }, [])

    return (
      <div className={styles['book-content-links']}>
        {contentLinks.map((link: IBookContentLinks, index: number) => (
          <a key={index} onClick={() => onSelectPage(link.pageNumber)}>
            {link.projectTitle}
          </a>
        ))}
      </div>
    )
  },
)
