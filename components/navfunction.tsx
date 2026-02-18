"use client"
import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"

export default function NavFunction({ icon: Icon, label = "", active = false, fn = () => {} }) {
  const [show, setShow] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const ref = useRef<HTMLButtonElement>(null)

  const handleEnter = () => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 8
      })
    }
    setShow(true)
  }

  return (
    <>
        <button
          ref={ref}
          onMouseEnter={handleEnter}
          onMouseLeave={() => setShow(false)}
          onClick={fn}
          className={`
            group relative w-10 h-10 rounded-sm flex items-center justify-center transition-colors
            ${active
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }
          `}
        >
          <Icon className="w-5 h-5" />
        </button>

      {show && createPortal(
        <div
          className="fixed px-2 py-1 bg-card/95 backdrop-blur-glass text-foreground text-xs rounded-sm border border-border-glass z-[9999] whitespace-nowrap pointer-events-none"
          style={{
            top: coords.top,
            left: coords.left,
            transform: "translateY(-50%)"
          }}
        >
          {label}
        </div>,
        document.body
      )}
    </>
  )
}