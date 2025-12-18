import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadIcon, ReloadIcon, Cross2Icon, CheckIcon, ExitIcon } from '@radix-ui/react-icons'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default function AppPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [transforming, setTransforming] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem('kyureto_auth')
    if (!auth) {
      navigate('/')
      return
    }
    setUser(JSON.parse(auth))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('kyureto_auth')
    navigate('/')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (selectedFile: File) => {
    setFile(selectedFile)
    setMessage(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setOriginalImage(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
    setTransformedImage(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleTransformImage = async () => {
    if (!file || !originalImage) {
      setMessage({ type: 'error', text: 'UPLOAD AN IMAGE FIRST' })
      return
    }

    setTransforming(true)
    setMessage(null)

    try {
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
        setTransformedImage(`${BACKEND_URL}${data.filePath}`)
        setMessage({ type: 'success', text: 'TRANSFORMATION COMPLETE' })
      } else {
        setMessage({ type: 'error', text: data.message || 'TRANSFORMATION FAILED' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'CONNECTION ERROR' })
      console.error('Error:', error)
    } finally {
      setTransforming(false)
    }
  }

  const clearImage = () => {
    setFile(null)
    setOriginalImage(null)
    setTransformedImage(null)
    setMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-light noise">
      {/* Header */}
      <header className="border-b-3 border-primary">
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-4xl tracking-[0.05em] font-semibold" style={{ fontFamily: 'Belanosima, sans-serif' }}>kyureto</span>
          <div className="flex items-center gap-4">
            <span className="text-sm tracking-wide hidden sm:block">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-3 border-primary hover:bg-primary hover:text-light transition-colors text-sm tracking-[0.1em] uppercase"
            >
              <ExitIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Sidebar */}
        <div className="col-span-1 border-r-3 border-primary hidden lg:flex flex-col justify-between py-8">
          <div className="rotate-90 origin-center translate-y-16">
            <span className="text-display text-lg tracking-[0.5em] whitespace-nowrap">STUDIO</span>
          </div>
          <div className="rotate-90 origin-center -translate-y-12">
            <span className="text-xs tracking-[0.3em] opacity-50">V1.0</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-11 flex flex-col">
          {/* Upload & Transform Section */}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Upload Zone */}
            <div className="border-b-3 lg:border-b-0 lg:border-r-3 border-primary p-6 md:p-12 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-display text-3xl tracking-[0.1em] uppercase">Input</h2>
                {originalImage && (
                  <button
                    onClick={clearImage}
                    className="p-2 border-3 border-primary hover:bg-primary hover:text-light transition-colors"
                    aria-label="Clear image"
                  >
                    <Cross2Icon className="w-5 h-5" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="file-input"
              />

              {!originalImage ? (
                <label
                  htmlFor="file-input"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    flex-1 border-3 border-dashed border-black flex flex-col items-center justify-center
                    cursor-pointer transition-all min-h-[300px]
                    ${isDragging ? 'bg-primary text-light' : 'hover:bg-primary hover:text-light'}
                  `}
                >
                  <UploadIcon className="w-16 h-16 mb-6" />
                  <span className="text-display text-2xl tracking-[0.2em] uppercase mb-2">
                    {isDragging ? 'DROP IT' : 'DROP FILE'}
                  </span>
                  <span className="text-xs tracking-[0.1em] opacity-60">
                    OR CLICK TO BROWSE
                  </span>
                </label>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 border-3 border-primary overflow-hidden bg-light">
                    <img
                      src={originalImage}
                      alt="Original product"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {file && (
                    <div className="mt-4 flex items-center justify-between border-3 border-primary p-3">
                      <span className="text-xs tracking-wide truncate flex-1 mr-4 font-bold uppercase">
                        {file.name}
                      </span>
                      <span className="text-xs tracking-wider opacity-60">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Output Zone */}
            <div className="p-6 md:p-12 flex flex-col bg-light">
              <h2 className="text-display text-3xl tracking-[0.1em] uppercase mb-6">Output</h2>

              <div className="flex-1 border-3 border-primary bg-light flex items-center justify-center min-h-[300px] overflow-hidden">
                {transformedImage ? (
                  <img
                    src={transformedImage}
                    alt="Transformed product"
                    className="w-full h-full object-contain"
                  />
                ) : transforming ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-primary brutal-spin mx-auto mb-4"></div>
                    <span className="text-display text-xl tracking-[0.2em] uppercase">
                      PROCESSING
                    </span>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 border-3 border-dashed border-primary/30 mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl opacity-20">?</span>
                    </div>
                    <span className="text-xs tracking-[0.2em] uppercase opacity-40">
                      AWAITING TRANSFORMATION
                    </span>
                  </div>
                )}
              </div>

              {/* Transform Button */}
              <button
                onClick={handleTransformImage}
                disabled={!originalImage || transforming}
                className="btn-brutal mt-6 w-full flex items-center justify-center gap-3"
              >
                {transforming ? (
                  <>
                    <ReloadIcon className="w-5 h-5 brutal-spin" />
                    TRANSFORMING...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">→</span>
                    TRANSFORM
                  </>
                )}
              </button>

              {/* Message Display */}
              {message && (
                <div
                  className={`
                    mt-4 p-4 border-3 flex items-center gap-3
                    ${message.type === 'success'
                      ? 'border-black bg-primary text-light'
                      : 'border-black bg-light'
                    }
                  `}
                >
                  {message.type === 'success' ? (
                    <CheckIcon className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <Cross2Icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-xs tracking-[0.1em] font-bold uppercase">
                    {message.text}
                  </span>
                </div>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t-3 border-primary">
            <div className="grid grid-cols-12">
              <div className="col-span-6 md:col-span-3 p-4 border-r-3 border-primary">
                <span className="text-xs tracking-[0.2em] opacity-50">© 2025</span>
              </div>
              <div className="col-span-6 md:col-span-6 p-4 border-r-0 md:border-r-3 border-primary">
                <span className="text-xs tracking-[0.2em]">KYURETO STUDIO</span>
              </div>
              <div className="hidden md:block col-span-3 p-4">
                <span className="text-xs tracking-[0.2em] opacity-50">BRUTALIST EDITION</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

