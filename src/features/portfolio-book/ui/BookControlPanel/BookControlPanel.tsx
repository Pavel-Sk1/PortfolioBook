import { bookPagesStore } from '@/entities'
import { observer } from 'mobx-react-lite'
import { BookControlButtons } from '../BookControlButtons/BookControlButtons'
import styles from './BookControlPanel.module.css'

export const BookControlPanel = observer(() => {
  const { pages, isLoadingPages, currentPage } = bookPagesStore
  const controlPanelPagesCount =
    currentPage === 0 || currentPage === pages.length - 1
      ? `${currentPage} `
      : `${currentPage}-${currentPage + 1} `

  return (
    <div className={styles['book-control-panel']}>
      {!isLoadingPages && pages.length > 0 && (
        <>
          <div className={styles['control-panel-count']}>
            {controlPanelPagesCount} из {pages.length - 1}
          </div>
          <BookControlButtons />
        </>
      )}
    </div>
  )
})
