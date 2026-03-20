import type { IPageImage } from "@/entities";
import styles from './ZoomView.module.css'

interface ZoomedViewProps {
    pages: IPageImage[],
    currentPage: number
}
export const ZoomedView = ({ pages, currentPage }: ZoomedViewProps) => (
    <div className={styles['zoom-spread']}>
      {currentPage === 0 || currentPage === pages.length - 1 ? (
        <img src={pages[currentPage].image} alt="" />
      ) : (
        <>
          <img src={pages[currentPage].image} alt="" />
          <img src={pages[currentPage + 1].image} alt="" />
        </>
      )}
    </div>
  );