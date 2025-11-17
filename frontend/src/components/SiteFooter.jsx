const footerLinks = [
  'Privacy Policy',
  'Terms & Conditions',
  'Help Center',
  'Delivery Coverage',
  'Careers',
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span role="img" aria-label="cart">
          🛒
        </span>
        <div>
          <strong>Online Grocery</strong>
          <p>Trusted groceries delivered fast.</p>
        </div>
      </div>

      <ul className="footer-links">
        {footerLinks.map((item) => (
          <li key={item}>
            <a href="#">{item}</a>
          </li>
        ))}
      </ul>

      <p className="footer-copy">© {new Date().getFullYear()} Online Grocery. All rights reserved.</p>
    </footer>
  )
}

export default SiteFooter

