import React, { useRef, useState, useEffect } from "react"
import "./Feed.css"

interface Props {
  mode: string
}

export const Feed: React.FC<Props> = ({ mode }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<string[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (images.length === 20) {
      setShowGallery(true)
    }
  }, [images.length])

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
        setCameraActive(true)
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
    setCameraActive(false)
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    
    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    if (flashRef.current) {
      flashRef.current.classList.add('active')
      setTimeout(() => {
        flashRef.current?.classList.remove('active')
      }, 100)
    }

    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setImages(prev => [...prev, imageData])
  }

  const deleteImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const submitImages = async () => {
    if (images.length === 0) {
      setSubmissionMessage({ type: 'error', text: 'No images to submit!' })
      setTimeout(() => setSubmissionMessage(null), 3000)
      return
    }

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images }),
      })

      if (!response.ok) {
        throw new Error("Submission failed")
      }

      const data = await response.json()
      setSubmissionMessage({ type: 'success', text: `Successfully submitted ${images.length} images!` })
      setTimeout(() => setSubmissionMessage(null), 3000)
    } catch (error) {
      console.error("Error submitting images:", error)
      setSubmissionMessage({ type: 'error', text: 'Failed to submit images. Check backend connection.' })
      setTimeout(() => setSubmissionMessage(null), 3000)
    }
  }

  return (
    <div className={`feed-container ${mode === "dark" ? "dark" : ""}`}>
      <div className="feed-header">
        <h1>Sign Language Image Capture</h1>
        <p>Capture sign language images and submit them for processing</p>
      </div>

      <div className="feed-content">
        <div className="camera-section">
          <div className="camera-wrapper">
            <video
              ref={videoRef}
              className="camera-feed"
              autoPlay
              playsInline
              muted
            />
            
            {!cameraActive && (
              <div className="camera-placeholder">
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
                <p>Camera initializing...</p>
              </div>
            )}

            <div className="picture-counter">
              {images.length} / 20 pictures
            </div>

            <div ref={flashRef} className="capture-flash"></div>
          </div>

          <div className="feed-controls">
            <button
              className="btn btn-capture"
              onClick={captureImage}
              disabled={!cameraActive || images.length >= 20}
            >
              <svg
                width="20"
                height="20"
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
              Click Picture
            </button>

            <button
              className="btn btn-list"
              onClick={() => setShowGallery(!showGallery)}
              disabled={images.length === 0}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              {showGallery ? 'Hide List' : 'See List'}
            </button>

            <button
              className="btn btn-submit"
              onClick={submitImages}
              disabled={images.length === 0}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Submit
            </button>
          </div>

          {submissionMessage && (
            <div className={`submission-message ${submissionMessage.type}`}>
              {submissionMessage.text}
            </div>
          )}
        </div>

        {showGallery && (
          <div className="image-gallery">
            <div className="gallery-header">
              <h2>Captured Images</h2>
              <span className="count">{images.length} image{images.length !== 1 ? 's' : ''}</span>
            </div>

            {images.length > 0 ? (
              <div className="gallery-grid">
                {images.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img src={image} alt={`Capture ${index + 1}`} />
                    <button
                      className="delete-btn"
                      onClick={() => deleteImage(index)}
                      title="Delete image"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-gallery">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <p>No images captured yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}