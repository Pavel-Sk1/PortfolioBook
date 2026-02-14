import {
  DownloadIcon,
  PlusZoomIcon,
  FullScreenIcon,
  MinusZoomIcon,
} from '@/shared/assets'
import { portfolioBookStore } from '../../model/portfolioBookStore'
import styles from './BookControlButtons.module.css'
import { observer } from 'mobx-react-lite'

export const BookControlButtons = observer(() => {
  const { isZoomed, toggleZoom } = portfolioBookStore

  const handleDownloadPdf = () => {
    const link = document.createElement('a')
    link.href = '/YarmolchukA_portfolio.pdf'
    link.download = 'YarmolchukA_portfolio.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleToggleFullscreen = async () => {
    const root = document.getElementById('root')
    if (!root) return

    if (!document.fullscreenElement) {
      await root.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  return (
    <div className={styles['control-buttons']}>
      <button
        type="button"
        onClick={toggleZoom}
        title="Увеличить/уменьшить книгу"
      >
        {isZoomed ? <MinusZoomIcon /> : <PlusZoomIcon />}
      </button>

      <button
        type="button"
        onClick={handleDownloadPdf}
        title="Скачать YarmolchukA_portfolio.pdf"
      >
        <DownloadIcon />
      </button>
      <button
        type="button"
        onClick={handleToggleFullscreen}
        title="Открыть / выйти из полноэкранного режима"
      >
        <FullScreenIcon />
      </button>
    </div>
  )
})
