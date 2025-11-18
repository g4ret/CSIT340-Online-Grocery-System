import { useState } from 'react'

function LoginPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      if (onLogin) {
        const result = onLogin(formData.email, formData.password)
        if (!result.success) {
          setError(result.message || 'Invalid credentials. Please try again.')
          setIsLoading(false)
        }
      } else {
        setError('Login function not available')
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <main className="customer-module auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue shopping</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="demo-credentials">
            <p>
              <strong>Demo Credentials:</strong>
            </p>
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
            <div className="admin-credentials">
              <p>
                <strong>Admin Access:</strong>
              </p>
              <p>Email: admin@lazshoppe.com</p>
              <p>Password: admin123</p>
              <small>Dashboard is restricted to authorized staff members.</small>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="auth-btn primary" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
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
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigate && onNavigate('register')}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}

export default LoginPage

