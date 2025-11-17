import { useState } from 'react'
import * as Label from '@radix-ui/react-label'
import { UploadIcon, CheckCircledIcon, CrossCircledIcon, ReloadIcon, MagicWandIcon } from '@radix-ui/react-icons'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [transforming, setTransforming] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setMessage(null)

      // Create preview URL for the original image
      const reader = new FileReader()
      reader.onloadend = () => {
        setOriginalImage(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset transformed image
      setTransformedImage(null)
    }
  }

  const handleTransformImage = async () => {
    if (!file || !originalImage) {
      setMessage({ type: 'error', text: 'Please upload an image first' })
      return
    }

    setTransforming(true)
    setMessage(null)

    try {
      // Convert file to base64
      const base64Image = originalImage.split(',')[1]

      const response = await fetch(`${BACKEND_URL}/api/images/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          quality: 'high',
          format: 'png',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Set the transformed image URL
        setTransformedImage(`${BACKEND_URL}${data.filePath}`)
        setMessage({ type: 'success', text: 'Image transformed successfully!' })
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to transform image' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error connecting to server' })
      console.error('Error:', error)
    } finally {
      setTransforming(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent mb-3">
            MenuReady
          </h1>
          <p className="text-slate-300 text-lg">
            Upload a food photo and transform it into a menu-ready image
          </p>
        </div>

        {/* Image Viewer Section */}
        {originalImage && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-accent-500/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-200">Original Image</h3>
                <div className="aspect-square w-full bg-slate-800 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Transformed Image */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-200">Transformed Image</h3>
                <div className="aspect-square w-full bg-slate-800 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                  {transformedImage ? (
                    <img
                      src={transformedImage}
                      alt="Transformed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <p className="text-slate-400 text-sm">No transformation yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Transform Button */}
            <button
              onClick={handleTransformImage}
              disabled={transforming}
              className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold rounded-lg shadow-lg hover:from-accent-700 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {transforming ? (
                <>
                  <ReloadIcon className="h-5 w-5 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  <MagicWandIcon className="h-5 w-5" />
                  Transform Image
                </>
              )}
            </button>
          </div>
        )}

        {/* Upload Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-accent-500/30">
          <div className="space-y-6">
            {/* File Upload Field */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="file-input"
                className="text-sm font-medium text-slate-200"
              >
                Upload Food Image
              </Label.Root>
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={transforming}
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className={`
                    flex items-center justify-center w-full px-4 py-8
                    border-2 border-dashed border-white/20 rounded-lg
                    cursor-pointer transition-all
                    ${transforming ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400 hover:bg-primary-500/10'}
                    ${file ? 'bg-accent-500/10 border-accent-400' : ''}
                  `}
                >
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    {file ? (
                      <>
                        <p className="text-sm text-accent-300 font-medium">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-300">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          JPG, PNG, GIF, or WebP (Max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`
                  flex items-start gap-3 p-4 rounded-lg border
                  ${message.type === 'success'
                    ? 'bg-accent-500/20 border-accent-400/50 text-accent-100'
                    : 'bg-primary-500/20 border-primary-400/50 text-primary-100'
                  }
                `}
              >
                {message.type === 'success' ? (
                  <CheckCircledIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <CrossCircledIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
