import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/Login.css'
import { loginUser } from '../../services/auth'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      const user = await loginUser(email, password)

      // role-based redirect
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'organizer') {
        navigate('/organizer')
      } else {
        navigate('/home')
      }

    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="signup-link">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login