import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppState } from '../context/AppState';
import { getGrocery } from '../data/groceries';
import { stores, dayNames, PRICE_AS_OF } from '../data/stores';

const dayShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function Shop() {
  const { missing, plan, buildTripPlan, favoriteStores, favoriteItems } = useAppState();
  const plannedCount = Object.values(plan).filter(Boolean).length;

  const totalEst = missing.reduce((sum, m) => sum + m.estimatedPrice, 0);

  const byDay = missing.reduce<Record<string, number>>((acc, m) => {
    acc[m.bestDay] = (acc[m.bestDay] ?? 0) + 1;
    return acc;
  }, {});
  const topDay =
    Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Wednesday';

  const trip = useMemo(
    () => buildTripPlan(missing.map((m) => m.itemId)),
    [buildTripPlan, missing],
  );

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Shopping intelligence · approx. {PRICE_AS_OF}</span>
          <h2>What to buy — and when</h2>
        </div>
        <p>
          Gaps from your meal plan, store leaderboards (favorited shops badge clearly), and a trip
          plan that routes missing items to the cheapest shelves.
        </p>
      </div>

      <div className="stat-row">
        <div className="stat">
          <strong>{missing.length}</strong>
          Items to pick up
        </div>
        <div className="stat">
          <strong>${totalEst.toFixed(0)}</strong>
          Est. at best timing
        </div>
        <div className="stat">
          <strong>{topDay.slice(0, 3)}</strong>
          Best overall day
        </div>
      </div>

      {plannedCount === 0 ? (
        <div className="empty-state">
          <p>No meals planned yet.</p>
          <Link className="btn btn-primary" to="/plan" style={{ marginTop: '1rem' }}>
            Build your week
          </Link>
        </div>
      ) : missing.length === 0 ? (
        <div className="empty-state">
          <p>Pantry covers this week’s plan. Nice work.</p>
          <Link className="btn btn-dark" to="/recipes" style={{ marginTop: '1rem' }}>
            Browse more recipes
          </Link>
        </div>
      ) : (
        <>
          <div className="panel trip-panel" style={{ marginBottom: '1.5rem' }}>
            <h3>Shopping trip plan</h3>
            <p className="muted" style={{ marginBottom: '0.85rem' }}>
              Get missing items where they’re cheapest this week:
            </p>
            <ul className="trip-list">
              {trip.map((stop) => (
                <li key={stop.storeId} className={favoriteStores.has(stop.storeId) ? 'lb-fav' : undefined}>
                  <strong>
                    <span
                      className="store-dot"
                      style={{ background: stores.find((s) => s.id === stop.storeId)?.color }}
                    />
                    {stop.storeName}
                    {favoriteStores.has(stop.storeId) ? ' ★' : ''}
                  </strong>
                  <span className="muted">
                    {' '}
                    — {stop.items.map((i) => i.name).join(', ')} (~${stop.subtotal.toFixed(2)})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shop-list">
            {missing.map((m, i) => {
              const item = getGrocery(m.itemId);
              const store = stores.find((s) => s.id === m.cheapest.store);
              const shortfall = Math.max(0.1, +(m.needed - m.have).toFixed(2));
              const favHits = m.leaderboard.filter((r) => favoriteStores.has(r.storeId));
              const isFavItem = favoriteItems.has(m.itemId);

              return (
                <article
                  key={m.itemId}
                  className="shop-item"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div>
                    <h3>
                      {m.name}
                      {isFavItem ? ' ★' : ''}
                    </h3>
                    <p className="muted">
                      Need {shortfall} more {m.unit} (have {m.have}, plan uses {m.needed})
                    </p>
                    <p className="muted" style={{ marginTop: '0.35rem' }}>
                      For: {m.forRecipes.map((f) => `${f.title} · ${f.day}`).join(' · ')}
                    </p>
                    <span className="timing-pill">Best day: {m.bestDay}</span>
                    {favHits.length > 0 && (
                      <div className="fav-hit-row" style={{ marginTop: '0.45rem' }}>
                        {favHits.map((h) => (
                          <span key={h.storeId} className="fav-rank-badge in">
                            {h.storeName} #{h.rank}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="muted">Store board</div>
                    <ol className="leaderboard compact">
                      {m.leaderboard.map((r) => (
                        <li key={r.storeId} className={favoriteStores.has(r.storeId) ? 'lb-fav' : undefined}>
                          <span className="lb-rank">#{r.rank}</span>
                          <strong>{r.storeName}</strong>
                          <span className="lb-price">${r.price.toFixed(2)}</span>
                          {favoriteStores.has(r.storeId) && (
                            <span className="have-badge">Favorite</span>
                          )}
                        </li>
                      ))}
                    </ol>
                    <p className="muted" style={{ marginTop: '0.5rem' }}>
                      Pick up at {store?.name} · ~${m.estimatedPrice.toFixed(2)} on {m.bestDay}
                    </p>
                  </div>
                  <div>
                    <div className="muted">Weekly savings pattern</div>
                    <div className="week-bars" aria-label={`Savings by day for ${m.name}`}>
                      {item?.weekdaySavings.map((s, idx) => (
                        <span
                          key={dayNames[idx]}
                          className={idx === m.bestDayIndex ? 'best' : undefined}
                          style={{ height: `${Math.max(8, s * 320)}%` }}
                          data-d={dayShort[idx]}
                          title={`${dayNames[idx]}: ~${Math.round(s * 100)}% off`}
                        />
                      ))}
                    </div>
                    <p className="muted" style={{ marginTop: '1.35rem' }}>
                      {m.tip}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
