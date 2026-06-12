import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const syne = { fontFamily: "'Syne', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

export default function OwnerLoginPage() {
  const navigate = useNavigate()
  const { login } = useOwnerAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2" style={syne}>
            Owner Login
          </h1>
          <p className="text-white/60" style={dmSans}>
            Edit your website content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2" style={syne}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35]"
              style={dmSans}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2" style={syne}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35]"
              style={dmSans}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold transition-colors disabled:opacity-50"
            style={syne}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-white/60 hover:text-white transition-colors"
            style={dmSans}
          >
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  )
}
