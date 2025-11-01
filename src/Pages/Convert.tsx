import React, { useRef, useState, useEffect } from "react"
import "./Convert.css"

interface Props {
  mode: string
}

const Convert: React.FC<Props> = ({ mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [status, setStatus] = useState<"inactive" | "active" | "processing">("inactive")
  const [translation, setTranslation] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const captureFrames = async (): Promise<string[]> => {
    if (!videoRef.current || !canvasRef.current) return []
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    
    if (!ctx) return []

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const frames: string[] = []
    const frameCount = 10
    const interval = 200

    for (let i = 0; i < frameCount; i++) {
      await new Promise(resolve => setTimeout(resolve, interval))
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const frameData = canvas.toDataURL("image/jpeg", 0.7)
      frames.push(frameData)
    }

    return frames
  }

  const sendFramesToBackend = async (frames: string[]) => {
    try {
      setStatus("processing")
      setIsProcessing(true)

      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ frames })
      })

      if (!response.ok) {
        throw new Error("Backend request failed")
      }

      const data = await response.json()
      setTranslation(data.translation || "No translation received")
      setStatus("active")
    } catch (error) {
      console.error("Error sending frames:", error)
      setTranslation("Error: Unable to translate. Please check backend connection.")
      setStatus("active")
    } finally {
      setIsProcessing(false)
    }
  }

  const captureAndSend = async () => {
    if (!isCapturing || isProcessing) return

    const frames = await captureFrames()
    if (frames.length > 0) {
      await sendFramesToBackend(frames)
    }

    if (isCapturing && !isProcessing) {
      captureIntervalRef.current = setTimeout(captureAndSend, 100)
    }
  }

  const handleStart = async () => {
    await startCamera()
    setIsCapturing(true)
    setStatus("active")
    setTranslation("")
    
    setTimeout(() => {
      captureAndSend()
    }, 1000)
  }

  const handleStop = () => {
    setIsCapturing(false)
    setStatus("inactive")
    stopCamera()
    
    if (captureIntervalRef.current) {
      clearTimeout(captureIntervalRef.current)
      captureIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      handleStop()
    }
  }, [])

  return (
    <div className={`convert-container ${mode === "dark" ? "dark" : ""}`}>
      <div className="convert-header">
        <h1>Real-Time Sign Language Translation</h1>
        <p>Start translation to convert sign language to text in real-time</p>
      </div>

      <div className="video-section">
        <div className="video-wrapper">
          <video
            ref={videoRef}
            className="video-feed"
            autoPlay
            playsInline
            muted
            style={{ display: isCapturing ? "block" : "none" }}
          />
          
          {!isCapturing && (
            <div className="video-placeholder">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <p>Camera feed will appear here</p>
            </div>
          )}

          <div className={`status-indicator ${status}`}>
            <span className="status-dot"></span>
            {status === "inactive" && "Inactive"}
            {status === "active" && "Capturing"}
            {status === "processing" && "Processing"}
          </div>
        </div>

        <div className="controls">
          <button
            className="btn btn-start"
            onClick={handleStart}
            disabled={isCapturing}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Translation
          </button>

          <button
            className="btn btn-stop"
            onClick={handleStop}
            disabled={!isCapturing}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            Stop Translation
          </button>
        </div>

        <div className="translation-output">
          <h3>Translation:</h3>
          {isProcessing ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Processing frames...</span>
            </div>
          ) : (
            <p>{translation || "Translation will appear here..."}</p>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}

export default Convert