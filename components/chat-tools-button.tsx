"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { 
  Settings2,
  Check,
} from "lucide-react"
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  flip,
  shift,
  offset,
  autoUpdate
} from '@floating-ui/react'
import { lmtools, Tool } from "@/business/tools"


interface ChatToolsButtonProps {
  onToolsChange?: (tools: Tool[]) => void
}

export function ChatToolsButton({ onToolsChange }: ChatToolsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [tools, setTools] = useState<Tool[]>(lmtools)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Floating UI Setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      offset(16),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ])

  const toggleTool = (toolId: string) => {
    const updatedTools = tools.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    )
    setTools(updatedTools)
    onToolsChange?.(updatedTools)
  }

  const enabledCount = tools.filter(t => t.enabled).length

  return (
    <>
      <Button
        ref={refs.setReference}
        {...getReferenceProps()}
        size="default"
        variant="outline"
        className="group bg-background hover:bg-muted text-foreground font-semibold px-4 py-2 hover:transition-all duration-300 hover:scale-105 cursor-pointer relative"
      >
        <Settings2 className="w-4 h-4" />
        {enabledCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
            {enabledCount}
          </span>
        )}
      </Button>

      {isOpen && isMounted && createPortal(
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={`
            absolute w-80 bg-card/80 border border-border rounded-lg shadow-2xl z-50
            origin-top-left
            transition-all duration-200 ease-in-out
            ${context.isPositioned ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <div className="p-2">
            {/* Header */}
            <div className="px-3 py-3 border-b border-border">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-foreground">Tools & Features</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enable tools to enhance responses
                  </p>
                </div>
              </div>
            </div>

            {/* Tools List */}
            <div className="py-2 px-2 max-h-96 overflow-y-auto scrollbar-thin">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`
                      w-full flex items-start space-x-3 mb-2 px-3 py-2.5 rounded-lg transition-all group
                      ${tool.enabled 
                        ? 'bg-primary/10 hover:bg-primary/20' 
                        : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                      ${tool.enabled 
                        ? 'bg-primary/20' 
                        : 'bg-muted'
                      }
                    `}>
                      <Icon className={`w-5 h-5 transition-colors ${
                        tool.enabled 
                          ? 'text-primary' 
                          : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`
                          text-sm font-medium transition-colors
                          ${tool.enabled ? 'text-foreground' : 'text-foreground/80'}
                        `}>
                          {tool.name}
                        </span>
                        {tool.enabled && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0 transition-colors" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-3 pt-3 pb-1 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{enabledCount} {enabledCount === 1 ? 'tool' : 'tools'} enabled</span>
                <button
                  onClick={() => {
                    const allDisabled = tools.map(t => ({ ...t, enabled: false }))
                    setTools(allDisabled)
                    onToolsChange?.(allDisabled)
                  }}
                  className="text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  )
}