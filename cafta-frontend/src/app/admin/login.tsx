import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        // Login successful, redirect to admin dashboard
        router.push('/admin')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-login in development for easier testing
  useEffect(() => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Auto-login after a short delay in development
      const timer = setTimeout(() => {
        // Simulate pressing Enter with any password
        handleSubmit(new Event('submit') as unknown as React.FormEvent)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            CAFTA Admin
          </h2>
          <p className="mt-2 text-center text-sm text-white/60">
            Acesse a área administrativa
          </p>
          {/* Development mode notice */}
          {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded">
              ⚠️ Modo de desenvolvimento: Autenticação desabilitada. Acesso concedido automaticamente.
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md bg-cafta-primary p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="admin-password" className="sr-only">
                  Senha
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-white focus:border-white/30 focus:bg-white/10 sm:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-white/50">
            {' '}
            <Link href="/" className="font-medium text-white hover:text-cafta-gold">
              Voltar ao site
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

function useEffect(arg0: () => (() => void) | undefined, arg1: never[]) {
  throw new Error('Function not implemented.')
}
