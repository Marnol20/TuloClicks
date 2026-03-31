import axios from 'axios'
import '../styles/Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      alert('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    axios.post('http://localhost:5000/api/auth/signup', {
      name,
      email,
      password
    })
    .then(() => {
      alert('Account created successfully!')
      navigate('/login')
    })
    .catch((err) => {
      alert(err.response?.data?.error || 'Signup failed')
    })
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Create Account</h2>
        <p>Sign up to start using the system</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name"
              value={name}
              onChange={function(e) { setName(e.target.value) }}
            />
          </div>
          
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

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={function(e) { setConfirmPassword(e.target.value) }}
            />
          </div>
          
          <button type="submit" className="login-submit-btn">Sign Up</button>
        </form>

        <p className="signup-link">
          Already have an account?{' '}
          <span 
            style={{ color: '#22c55e', cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp