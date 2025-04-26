import Image from "next/image"

export function Owl({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizes = {
    small: 60,
    medium: 100,
    large: 150,
  }

  const pixelSize = sizes[size]

  return (
    <div className="flex justify-center">
      <div className="relative" style={{ width: pixelSize, height: pixelSize }}>
        <Image
          src="/placeholder.svg?height=150&width=150"
          alt="AI Owl Assistant"
          width={pixelSize}
          height={pixelSize}
          className="rounded-full bg-purple-100 p-2"
        />
        <div className="absolute -bottom-1 -right-1 bg-purple-600 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        </div>
      </div>
    </div>
  )
}

