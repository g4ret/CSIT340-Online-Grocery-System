import { useState } from 'react'

function RegisterPage({ onNavigate, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      if (!onRegister) {
        setError('Registration function not available')
        return
      }

      const result = await onRegister(formData)

      if (!result.success) {
        setError(result.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="customer-module auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start shopping for fresh groceries</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <a href="#" className="link-text">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="link-text">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          <button type="submit" className="auth-btn primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn">
            <span>🔵</span> Google
          </button>
          <button type="button" className="social-btn">
            <span>🔵</span> Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate && onNavigate('login')}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage

