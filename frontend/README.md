# Online Grocery System – Frontend

Modern React + Vite interface for the Online Grocery System. It showcases the entire customer journey—from browsing, product exploration, cart, checkout, and order tracking—styled with a pastel-inspired UI and responsive layouts.

## Tech Stack

- [Vite](https://vitejs.dev/) + React 18
- CSS Modules / global CSS for styling
- ESLint for linting (default Vite config)

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Available Pages

- Homepage with hero, best selling, explore products, and categories sections
- Category view with filterable product listing
- Product details highlight
- Add to cart summary and totals
- Checkout form and order review
- Orders & tracking dashboard

## Project Structure

```
frontend/
├─ src/
│  ├─ components/          # Shared header/footer, etc.
│  ├─ pages/               # Page-level views
│  ├─ data/                # Mock product data
│  ├─ App.jsx / App.css    # Root React component & global styles
│  └─ main.jsx             # Vite entry
└─ public/                 # Static assets
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build

## Notes

- The design is UI-focused to match the provided mockups; connect to the backend API when ready.
- Header navigation updates the React state to swap page views with a small transition.
- Product data currently lives in `src/data/products.js` for demo purposes.
