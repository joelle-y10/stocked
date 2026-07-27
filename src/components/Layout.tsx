import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/compare', label: 'Compare' },
  { to: '/recipes', label: 'Recipes' },
  { to: '/plan', label: 'Meal plan' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/shop', label: 'Shop smart' },
  { to: '/learn', label: 'Learn' },
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="site-nav">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">S</span>
          STOCKED
        </NavLink>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
      <footer className="footer">
        <span>STOCKED — grocery intelligence for real kitchens.</span>
        <span>Approx. CAD prices for planning — not live store APIs.</span>
      </footer>
    </>
  );
}
