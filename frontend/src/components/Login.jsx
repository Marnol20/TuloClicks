import axios from 'axios'
import '../styles/Login.css'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const target = location.state?.target || null

  function handleSubmit(e) {
    e.preventDefault()

    if (email === '' || password === '') {
      alert('Please fill in all fields')
      return
    }

    axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    })
    .then((res) => {
      const user = res.data.user

      localStorage.setItem('user', JSON.stringify(user))

      alert('Login successful!')

      // If clicked "Switch to Admin"
      if (target === 'admin') {
        if (user.role === 'admin') {
          navigate('/dashboard')
        } else {
          alert('This account is not allowed to access admin.')
          localStorage.removeItem('user')
        }
        return
      }

      // If clicked "Switch to User View"
      if (target === 'user') {
        navigate('/')
        return
      }

      // Default login behavior
      if (user.role === 'admin') {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    })
    .catch((err) => {
      alert(err.response?.data?.error || 'Login failed')
    })
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
              onChange={function(e) { setEmail(e.target.value) }}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={function(e) { setPassword(e.target.value) }}
            />
          </div>
          
          <button type="submit" className="login-submit-btn">Sign In</button>
        </form>

        <p className="signup-link">
          Don’t have an account?{' '}
          <span 
            style={{ color: '#22c55e', cursor: 'pointer' }}
            onClick={() => navigate('/signup')}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login