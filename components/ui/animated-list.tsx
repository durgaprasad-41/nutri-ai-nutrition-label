"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import styles from "@/components/ui/animated-list.module.css"

function AnimatedItem({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}: {
  children: ReactNode
  delay?: number
  index: number
  onMouseEnter: () => void
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: "0.75rem", cursor: "pointer" }}
    >
      {children}
    </motion.div>
  )
}

export default function AnimatedList<T>({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  renderItem,
}: {
  items: T[]
  onItemSelect?: (item: T, index: number) => void
  showGradients?: boolean
  enableArrowNavigation?: boolean
  className?: string
  itemClassName?: string
  displayScrollbar?: boolean
  initialSelectedIndex?: number
  renderItem?: (item: T, index: number, selected: boolean) => ReactNode
}) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const keyboardNavRef = useRef(false)
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
  const [topGradientOpacity, setTopGradientOpacity] = useState(0)
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1)

  const handleItemMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleItemClick = useCallback(
    (item: T, index: number) => {
      setSelectedIndex(index)
      onItemSelect?.(item, index)
    },
    [onItemSelect]
  )

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setTopGradientOpacity(Math.min(scrollTop / 50, 1))
    const bottomDistance = scrollHeight - (scrollTop + clientHeight)
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1))
  }, [])

  useEffect(() => {
    if (!enableArrowNavigation) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault()
        keyboardNavRef.current = true
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1))
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault()
        keyboardNavRef.current = true
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < items.length) {
        e.preventDefault()
        onItemSelect?.(items[selectedIndex], selectedIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation])

  useEffect(() => {
    if (!keyboardNavRef.current || selectedIndex < 0 || !listRef.current) return

    const container = listRef.current
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLDivElement | null
    if (selectedItem) {
      const extraMargin = 50
      const containerScrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      const itemTop = selectedItem.offsetTop
      const itemBottom = itemTop + selectedItem.offsetHeight

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" })
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        })
      }
    }
    keyboardNavRef.current = false
  }, [selectedIndex])

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        ref={listRef}
        className={`${styles.list} ${!displayScrollbar ? styles.noScrollbar : ""}`}
        onScroll={handleScroll}
      >
        {items.map((item, index) => {
          const selected = selectedIndex === index
          return (
            <AnimatedItem
              key={index}
              delay={0.08}
              index={index}
              onMouseEnter={() => handleItemMouseEnter(index)}
              onClick={() => handleItemClick(item, index)}
            >
              <div className={`${styles.item} ${selected ? styles.itemSelected : ""} ${itemClassName}`}>
                {renderItem ? renderItem(item, index, selected) : <p className="m-0 p-4 text-sm text-card-foreground">{String(item)}</p>}
              </div>
            </AnimatedItem>
          )
        })}
      </div>

      {showGradients && (
        <>
          <div className={styles.topGradient} style={{ opacity: topGradientOpacity }} />
          <div className={styles.bottomGradient} style={{ opacity: bottomGradientOpacity }} />
        </>
      )}
    </div>
  )
}
