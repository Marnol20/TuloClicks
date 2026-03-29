import '../styles/Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (email === '' || password === '') {
      alert('Please fill in all fields')
      return
    }
    alert('Login successful!')
    navigate('/')
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
          Don't have an account? <a onClick={function() { navigate('/signup') }}>Sign Up</a>
        </p>
      </div>
    </div>
  )
}

export default Login
