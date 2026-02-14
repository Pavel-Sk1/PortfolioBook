import { ReactComponent as ArrowIcon } from '@/shared/assets/icons/arrow_icon.svg'

import styles from './BookButton.module.css'

interface BookButtonProps {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  style?: React.CSSProperties
  className?: CSSModuleClasses | string
}
export const BookButton = ({
  direction,
  onClick,
  disabled = false,
  style,  
}: BookButtonProps) => {
  const rotation = direction === 'left' ? 'rotate(0deg)' : 'rotate(180deg)'
  const buttonBorderRadius =
    direction === 'left' ? '15px 0 0 15px' : '0 15px 15px 0'
  return (
    <button
      className={styles['book-arrow-button']}
      style={{ ...style, borderRadius: buttonBorderRadius }}
      onClick={onClick}
      disabled={disabled}
    >
      <ArrowIcon
        style={{
          transform: rotation,          
          width: '20px',
          height: '20px',
          fill: 'var(--background-secondary)',           
        }}
      />
    </button>
  )
}
