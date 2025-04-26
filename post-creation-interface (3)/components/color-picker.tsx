"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value || "#000000")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 rounded-md border" style={{ backgroundColor: color }} aria-label="בחר צבע" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="color"
            value={color}
            onChange={handleChange}
            className="w-32 h-32 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={handleChange}
            className="px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

