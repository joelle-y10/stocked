import { useState } from 'react';
import { groceries } from '../data/groceries';
import { useAppState } from '../context/AppState';

export function Inventory() {
  const { inventory, setInventoryQty, addToInventory, removeFromInventory } = useAppState();
  const [pick, setPick] = useState(groceries[0]?.id ?? '');

  const ownedIds = new Set(inventory.map((i) => i.itemId));
  const available = groceries.filter((g) => !ownedIds.has(g.id));

  function bump(itemId: string, current: number, delta: number) {
    const next = +(current + delta).toFixed(1);
    if (next <= 0) {
      removeFromInventory(itemId);
      return;
    }
    setInventoryQty(itemId, next);
  }

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Pantry</span>
          <h2>Your inventory</h2>
        </div>
        <p>Log what you already have. Quantities use the same units as the price board.</p>
      </div>

      <div className="inv-add">
        <select
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          aria-label="Add grocery to inventory"
        >
          {(available.length ? available : groceries).map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.unit})
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (pick) addToInventory(pick);
          }}
        >
          Add to pantry
        </button>
      </div>

      {inventory.length === 0 ? (
        <div className="empty-state">Nothing logged yet — add staples you already own.</div>
      ) : (
        <div className="inv-list">
          {inventory.map((entry) => {
            const g = groceries.find((x) => x.id === entry.itemId);
            if (!g) return null;
            return (
              <div className="inv-row" key={entry.itemId}>
                <div>
                  <strong>{g.name}</strong>
                  <div className="muted">
                    {g.category} · {g.unit}
                  </div>
                </div>
                <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  Qty
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={entry.qty}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (n <= 0) removeFromInventory(entry.itemId);
                      else setInventoryQty(entry.itemId, n);
                    }}
                  />
                </label>
                <div className="qty-btns">
                  <button
                    type="button"
                    className="btn btn-sm qty-btn"
                    aria-label={`Decrease ${g.name}`}
                    onClick={() => bump(entry.itemId, entry.qty, -1)}
                  >
                    −1
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    aria-label={`Increase ${g.name}`}
                    onClick={() => bump(entry.itemId, entry.qty, 1)}
                  >
                    +1
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ background: 'transparent', border: '1px solid var(--line)' }}
                  onClick={() => removeFromInventory(entry.itemId)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
