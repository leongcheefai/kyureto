import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'

interface AuthModalProps {
  mode: 'login' | 'signup' | null
  onClose: () => void
  onSwitch: (mode: 'login' | 'signup') => void
  onSuccess: () => void
}

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate auth - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For now, just store a fake token and proceed
    localStorage.setItem('kyureto_auth', JSON.stringify({ email, name: name || email.split('@')[0] }))
    setLoading(false)
    onSuccess()
  }

  const isLogin = mode === 'login'

  return (
    <Dialog.Root open={mode !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-primary/80 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="bg-light border-3 border-primary shadow-brutal-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b-3 border-primary">
              <Dialog.Title className="text-display text-3xl tracking-[0.1em]">
                {isLogin ? 'LOGIN' : 'SIGN UP'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 border-3 border-primary hover:bg-primary hover:text-light transition-colors">
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase mb-2 font-bold">
                    NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-brutal"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2 font-bold">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-brutal"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-[0.2em] uppercase mb-2 font-bold">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-brutal pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-primary hover:text-light transition-colors"
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="w-5 h-5" />
                    ) : (
                      <EyeOpenIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 border-3 border-primary bg-primary text-light text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-brutal w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-orange-50/30 border-t-orange-50 brutal-spin"></div>
                    {isLogin ? 'LOGGING IN...' : 'SIGNING UP...'}
                  </>
                ) : (
                  isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="p-6 border-t-3 border-primary bg-light">
              <p className="text-sm text-center">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => onSwitch(isLogin ? 'signup' : 'login')}
                  className="font-bold underline underline-offset-4 hover:no-underline"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

