import { useState, useCallback } from "react"

interface UseVoiceRecordingReturn {
  isRecording: boolean
  transcript: string
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  const startRecording = useCallback(async () => {
    try {
      if (!("webkitSpeechRecognition" in window)) {
        throw new Error("Speech recognition is not supported in this browser")
      }

      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "he-IL" // Hebrew language

      recognition.onstart = () => {
        setIsRecording(true)
        setError(null)
      }

      recognition.onresult = (event) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptText = result[0].transcript

        if (result.isFinal) {
          setTranscript((prev) => prev + " " + transcriptText)
        }
      }

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognition)
      recognition.start()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording")
      setIsRecording(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
    }
  }, [recognition])

  return {
    isRecording,
    transcript,
    startRecording,
    stopRecording,
    error,
  }
} 