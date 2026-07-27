import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppState';

export function Home() {
  const { missing } = useAppState();

  return (
    <>
      <section className="hero" aria-label="Hero">
        <div className="hero-inner">
          <p className="hero-brand">
            STOCK<span>ED</span>
          </p>
          <h1>Know what’s in your kitchen. Buy only what you need.</h1>
          <p>
            Compare CAD prices across Costco, Superstore, Walmart, No Frills, FreshCo, and Food
            Basics — then plan dinners and shop at the cheapest moment.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/plan">
              Plan this week
            </Link>
            <Link className="btn btn-ghost" to="/compare">
              Compare prices
            </Link>
          </div>
        </div>
        <span className="hero-scroll">Scroll</span>
      </section>

      <div className="home-strip page-wide" style={{ width: 'min(1120px, calc(100% - 2rem))', margin: '0 auto' }}>
        <article>
          <strong>6 stores</strong>
          <p>Side-by-side prices so you stop guessing which aisle wins.</p>
        </article>
        <article>
          <strong>{missing.length} missing</strong>
          <p>Ingredients you still need for the dinners already on your plan.</p>
        </article>
        <article>
          <strong>Buy timing</strong>
          <p>See the best weekday to grab each item for less.</p>
        </article>
      </div>

      <section className="page">
        <div className="section-head">
          <div>
            <span className="eyebrow">Everything in one place</span>
            <h2>From recipe to receipt</h2>
          </div>
          <p>Plan meals, check the pantry, fill gaps, and learn techniques as you go.</p>
        </div>
        <div className="feature-grid">
          <Link className="feature-link" to="/compare">
            <h3>Price compare</h3>
            <p>Scan staples across major stores and spot the lowest tag instantly.</p>
          </Link>
          <Link className="feature-link" to="/recipes">
            <h3>Recipes</h3>
            <p>Full amounts, timed steps, tips, and fridge checks that feed your trip plan.</p>
          </Link>
          <Link className="feature-link" to="/inventory">
            <h3>Inventory</h3>
            <p>Track what you already own so the shopping list stays honest.</p>
          </Link>
          <Link className="feature-link" to="/learn">
            <h3>Learn</h3>
            <p>Unit prices, Canadian stores, meal planning, waste cuts — plus kitchen skills.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
