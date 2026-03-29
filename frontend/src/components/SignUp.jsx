import '../styles/SignUp.css'
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
    alert('Account created successfully!')
    navigate('/login')
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Account</h2>
        <p>Sign up to get started with EventHub</p>
        
        <form className="signup-form" onSubmit={handleSubmit}>
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
              placeholder="Create a password"
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
          
          <button type="submit" className="signup-submit-btn">Create Account</button>
        </form>
        
        <p className="login-link">
          Already have an account? <a onClick={function() { navigate('/login') }}>Sign In</a>
        </p>
      </div>
    </div>
  )
}

export default SignUp
