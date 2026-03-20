import { useCallback, useState } from 'react'

export function useDraggable(enabled: boolean) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [pan, setPan] = useState({ x: 0, y: 0 })

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    },
    [enabled, pan.x, pan.y],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !isDragging || !dragStart) return
      e.preventDefault()
      e.stopPropagation()
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [enabled, isDragging, dragStart],
  )

  const stopDragging = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
  }, [isDragging])

  return {
    isDragging,
    pan,
    onMouseDown,
    onMouseMove,
    stopDragging,
  }
}
