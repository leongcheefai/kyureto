import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckIcon } from '@radix-ui/react-icons'
import AuthModal from '../components/AuthModal'

const NAV_HEIGHT = 68

const FEATURES = [
  { title: 'Ai Powered', desc: 'Neural network trained on millions of professional photos' },
  { title: 'Instant', desc: 'Results in seconds, not hours' },
  { title: 'High Res', desc: 'Export up to 4K resolution' },
  { title: 'Batch', desc: 'Process multiple images at once' },
]

const PRICING = [
  {
    name: 'starter',
    price: '0',
    period: 'forever',
    features: ['5 transforms/month', 'standard quality', 'basic backgrounds', 'email support'],
    cta: 'start free',
    featured: false,
  },
  {
    name: 'pro',
    price: '29',
    period: '/month',
    features: ['unlimited transforms', 'ultra HD quality', 'custom backgrounds', 'priority support', 'API access'],
    cta: 'go pro',
    featured: true,
  },
  {
    name: 'enterprise',
    price: '99',
    period: '/month',
    features: ['everything in pro', 'white-label', 'dedicated account', 'SLA guarantee', 'custom integrations'],
    cta: 'contact us',
    featured: false,
  },
]

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const navigate = useNavigate()

  // Derived states
  const scrolled = scrollProgress >= 1
  const showNavLogo = scrollProgress >= 0.95

  // Track window dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Track scroll progress with requestAnimationFrame for performance
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const heroHeight = window.innerHeight - NAV_HEIGHT
          const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1)
          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate animated hero text styles
  const heroTextStyles = useMemo(() => {
    if (dimensions.height === 0) return { transform: 'translateX(-50%)', opacity: 1 }

    // Font sizes
    const initialSize = Math.min(dimensions.width * 0.9, 400) // Up to 400px
    const targetSize = 36
    const finalScale = targetSize / initialSize

    // Starting position: below nav, text vertically centered in upper area
    const startY = NAV_HEIGHT - 130
    // End position: nav bar center, accounting for scaled text height
    const endY = (NAV_HEIGHT - targetSize) / 2

    // Interpolate position and scale
    const scale = 1 - (1 - finalScale) * scrollProgress
    const currentY = startY + (endY - startY) * scrollProgress

    // Fade out in last 10% of animation
    const opacity = scrollProgress < 0.9 ? 1 : 1 - ((scrollProgress - 0.9) / 0.1)

    return {
      top: `${currentY}px`,
      transform: `translateX(-50%) scale(${scale})`,
      transformOrigin: 'center top',
      opacity
    }
  }, [scrollProgress, dimensions])

  const handleAuthSuccess = () => {
    setAuthModal(null)
    navigate('/app')
  }

  return (
    <div className="bg-light noise min-h-screen">
      {/* Fixed Hero Text - animates on scroll */}
      <div
        className="fixed left-1/2 z-40 pointer-events-none"
        style={{
          ...heroTextStyles,
          fontFamily: 'Belanosima, sans-serif',
          willChange: 'transform, opacity, top'
        }}
      >
        <span className="text-light whitespace-nowrap" style={{ fontSize: 'min(90vw, 400px)' }}>
          kyureto
        </span>
      </div>

      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#FFF7F4] border-b-3 border-primary' : 'bg-transparent'}`}>
        <div className="grid grid-cols-3 items-center px-6 py-4">
          {/* Left - Links */}
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className={`text-xs tracking-[0.2em] uppercase font-bold hover:opacity-70 transition-opacity hidden sm:block ${scrolled ? 'text-primary' : 'text-light'}`}
            >
              Features
            </a>
            <a
              href="#pricing"
              className={`text-xs tracking-[0.2em] uppercase font-bold hover:opacity-70 transition-opacity hidden sm:block ${scrolled ? 'text-primary' : 'text-light'}`}
            >
              Pricing
            </a>
          </div>

          {/* Center - Logo (hidden until hero text animation completes) */}
          <div className="flex justify-center">
            <span
              className={`text-4xl tracking-[0.05em] font-semibold transition-all duration-300 ${
                showNavLogo ? 'opacity-100' : 'opacity-0'
              } ${scrolled ? 'text-primary' : 'text-light'}`}
              style={{ fontFamily: 'Belanosima, sans-serif' }}
            >
              kyureto
            </span>
          </div>

          {/* Right - Login */}
          <div className="flex justify-end">
            <button
              onClick={() => setAuthModal('login')}
              className="px-6 py-2 rounded-full text-xs tracking-[0.15em] font-bold border-3 transition-colors flex items-center justify-center uppercase bg-accent text-white border-accent hover:bg-[#FF8855] hover:border-[#FF8855]"
              aria-label="Login"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Screen with Background Image */}
      <section
        className="h-screen bg-cover bg-center bg-no-repeat relative border-b-3 border-primary"
        style={{ backgroundImage: "url('/assets/mainphoto.jpg')" }}
      >
      </section>

      {/* Tagline Section */}
      <section className="py-20 md:py-32 px-8 border-b-3 border-primary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-4xl lg:text-5xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-medium text-primary mb-10" style={{ fontFamily: 'Belanosima, sans-serif' }}>
            Transform any product photos into professional studio shots. Ready for your menu, social media and websites. Be your own food photographer and stylist.
          </p>
          <button
            onClick={() => setAuthModal('signup')}
            className="btn-brutal"
          >
            GET STARTED
          </button>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-primary text-light py-3 overflow-hidden border-b-3 border-primary">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-sm tracking-[0.3em] font-bold text-display">
              PROFESSIONAL PHOTOS • NO EQUIPMENT • INSTANT RESULTS • AI POWERED •
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="border-b-3 border-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`p-8 md:p-12 ${i < FEATURES.length - 1 ? 'border-b-3 md:border-b-0 md:border-r-3 border-primary' : ''} ${i < 2 ? 'lg:border-b-0' : ''}`}
            >
              <div className="w-12 h-12 bg-accent text-light flex items-center justify-center text-display text-2xl mb-6 rounded-full">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-body text-2xl font-semibold tracking-tight mb-3">{feature.title}</h3>
              <p className="text-sm leading-relaxed opacity-70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b-3 border-primary">
        <div className="p-8 md:p-16 border-b-3 border-primary">
          <h2 className="text-5xl md:text-7xl tracking-[0.05em] text-center" style={{ fontFamily: 'Belanosima, sans-serif' }}>pricing</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {PRICING.map((plan, i) => (
            <div
              key={plan.name}
              className={`
                p-8 md:p-12 flex flex-col
                ${i < PRICING.length - 1 ? 'border-b-3 md:border-b-0 md:border-r-3 border-primary' : ''}
                ${plan.featured ? 'bg-accent text-light' : ''}
              `}
            >
              <div className="mb-6">
                <span className={`text-sm tracking-[0.1em] ${plan.featured ? 'text-light/60' : 'opacity-60'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {plan.name}
                </span>
              </div>
              <div className="mb-8">
                <span className="text-6xl md:text-7xl" style={{ fontFamily: 'Belanosima, sans-serif' }}>${plan.price}</span>
                <span className={`text-sm tracking-wider ${plan.featured ? 'text-light/60' : 'opacity-60'}`} style={{ fontFamily: 'Belanosima, sans-serif' }}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckIcon className={`w-4 h-4 flex-shrink-0 ${plan.featured ? 'text-light' : ''}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setAuthModal('signup')}
                className={`
                  w-full py-4 text-lg tracking-[0.1em] border-3 transition-all
                  ${plan.featured
                    ? 'bg-light text-primary border-light hover:bg-transparent hover:text-light'
                    : 'bg-primary text-light border-primary hover:bg-light hover:text-primary'
                  }
                `}
                style={{ fontFamily: 'Belanosima, sans-serif' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-b-3 border-primary">
        <div className="px-8 py-12 md:px-16 flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left - Logo and Copyright */}
          <div className="flex flex-col gap-2">
            <span className="text-3xl" style={{ fontFamily: 'Belanosima, sans-serif' }}>kyureto</span>
            <span className="text-xs opacity-50">© 2025 Kyureto</span>
          </div>

          {/* Right - Links */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <a href="/about" className="text-sm hover:opacity-70 transition-opacity">
              About Us
            </a>
            <a href="/privacy" className="text-sm hover:opacity-70 transition-opacity">
              Policy
            </a>
            <a href="/terms" className="text-sm hover:opacity-70 transition-opacity">
              Terms
            </a>
            <a href="/socials" className="text-sm hover:opacity-70 transition-opacity">
              Socials
            </a>
            <a
              href="mailto:hello@kyureto.com"
              className="px-5 py-2 bg-accent text-white text-sm font-medium rounded-full hover:bg-[#FF8855] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        mode={authModal}
        onClose={() => setAuthModal(null)}
        onSwitch={(mode) => setAuthModal(mode)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

