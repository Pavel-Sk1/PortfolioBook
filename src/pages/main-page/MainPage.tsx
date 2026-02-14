import { PortfolioBook } from '@/features'
import styles from './MainPage.module.css'

export function MainPage() {
  return (
    <div className={styles['page-container']}>
      <PortfolioBook />
    </div>
  )
}
