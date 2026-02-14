import { useState, useEffect, useRef } from 'react'

export const useContainerDimensions = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const updateDimensions = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Создаем экземпляр ResizeObserver
    observerRef.current = new ResizeObserver(updateDimensions)

    // Начинаем наблюдение за элементом
    observerRef.current.observe(ref.current)

    // Первоначальное измерение
    updateDimensions()

    // Очистка при размонтировании
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [ref])

  return dimensions
}
