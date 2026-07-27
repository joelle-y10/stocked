import { Fragment, useMemo, useState } from 'react';
import { favoriteStoresOnBoard, groceries, storeLeaderboard } from '../data/groceries';
import { PRICE_AS_OF, stores } from '../data/stores';
import type { StoreId } from '../data/types';
import { useAppState } from '../context/AppState';

export function Compare() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const {
    favoriteItems,
    toggleFavoriteItem,
    favoriteStores,
    toggleFavoriteStore,
  } = useAppState();

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(groceries.map((g) => g.category))).sort()],
    [],
  );

  const rows = useMemo(() => {
    return groceries.filter((g) => {
      const matchQ = g.name.toLowerCase().includes(q.toLowerCase());
      const matchC = category === 'All' || g.category === category;
      return matchQ && matchC;
    });
  }, [q, category]);

  return (
    <div className="page page-wide">
      <div className="section-head">
        <div>
          <span className="eyebrow">Price board · CAD · approx. {PRICE_AS_OF}</span>
          <h2>Compare grocery prices</h2>
        </div>
        <p>
          Approximate Canadian shelf prices across Costco, Superstore, Walmart, No Frills, FreshCo,
          and Food Basics. Star shops you visit — they highlight on every leaderboard.
        </p>
      </div>

      <div className="fav-store-bar">
        <div className="fav-store-toggles">
          <span className="fav-store-label">Favorite shops</span>
          <div className="store-fav-chips" role="group" aria-label="Favorite shops">
            {stores.map((s) => {
              const on = favoriteStores.has(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`store-fav-chip ${on ? 'on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggleFavoriteStore(s.id)}
                >
                  <span className="store-dot" style={{ background: s.color }} />
                  {s.name}
                  <span className="store-fav-star" aria-hidden>
                    {on ? '★' : '☆'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="muted">
          {favoriteStores.size === 0
            ? 'Tap shops you visit often — they’ll badge in the compare table and top boards.'
            : 'Favorited shops show a ★ badge and highlighted column whenever they appear.'}
        </p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search items…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search groceries"
        />
        <div className="chips" role="tablist" aria-label="Categories">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th aria-label="Favorite" />
              <th>Item</th>
              <th>Unit</th>
              {stores.map((s) => {
                const isFav = favoriteStores.has(s.id);
                return (
                  <th key={s.id} className={isFav ? 'col-fav-store' : undefined}>
                    <span className="store-dot" style={{ background: s.color }} />
                    {s.short}
                    {isFav && (
                      <span className="col-fav-mark" title="Favorite shop">
                        ★
                      </span>
                    )}
                  </th>
                );
              })}
              <th>Best</th>
              <th>Board</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const board = storeLeaderboard(item);
              const bestId = board[0]?.storeId;
              const isFav = favoriteItems.has(item.id);
              const favHits = favoriteStoresOnBoard(item, favoriteStores);
              const open = expanded === item.id;

              return (
                <Fragment key={item.id}>
                  <tr>
                    <td>
                      <button
                        type="button"
                        className={`fav-btn ${isFav ? 'on' : ''}`}
                        aria-label={isFav ? `Unfavorite ${item.name}` : `Favorite ${item.name}`}
                        aria-pressed={isFav}
                        onClick={() => toggleFavoriteItem(item.id)}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                      <div className="muted">{item.category}</div>
                      {favHits.length > 0 && (
                        <div className="fav-hit-row">
                          {favHits.map((h) => (
                            <span key={h.storeId} className="fav-rank-badge in">
                              {h.storeName} #{h.rank}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>{item.unit}</td>
                    {stores.map((s) => {
                      const price = item.prices[s.id as StoreId];
                      const isBest = s.id === bestId;
                      const isFavCol = favoriteStores.has(s.id);
                      return (
                        <td key={s.id} className={isFavCol ? 'col-fav-store' : undefined}>
                          <span className={isBest ? 'price-best' : undefined}>
                            ${price.toFixed(2)}
                          </span>
                        </td>
                      );
                    })}
                    <td>{stores.find((s) => s.id === bestId)?.name}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm board-toggle"
                        aria-expanded={open}
                        onClick={() => setExpanded(open ? null : item.id)}
                      >
                        {open ? 'Hide' : 'Board'}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="leaderboard-row">
                      <td colSpan={3 + stores.length + 2}>
                        <ol className="leaderboard">
                          {board.map((r) => {
                            const isFavShop = favoriteStores.has(r.storeId);
                            return (
                              <li key={r.storeId} className={isFavShop ? 'lb-fav' : undefined}>
                                <span className="lb-rank">#{r.rank}</span>
                                <span
                                  className="store-dot"
                                  style={{
                                    background: stores.find((s) => s.id === r.storeId)?.color,
                                  }}
                                />
                                <strong>{r.storeName}</strong>
                                <span className="lb-price">${r.price.toFixed(2)}</span>
                                {isFavShop && <span className="have-badge">Favorite shop</span>}
                              </li>
                            );
                          })}
                        </ol>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted price-disclaimer">
        Prices are approximate CAD shelf tags as of {PRICE_AS_OF} — not a live store feed. Sources
        are documented in the project’s PRICE_SOURCES notes.
      </p>
    </div>
  );
}
