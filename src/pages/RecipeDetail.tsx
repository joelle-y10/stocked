import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipe } from '../data/recipes';
import { getGrocery, storeLeaderboard } from '../data/groceries';
import { useAppState } from '../context/AppState';
import { stores } from '../data/stores';

export function RecipeDetail() {
  const { id } = useParams();
  const recipe = getRecipe(id ?? '');
  const {
    inventoryMap,
    setMeal,
    toggleHaveItem,
    buildTripPlan,
    favoriteItems,
    toggleFavoriteItem,
    favoriteStores,
  } = useAppState();

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [tripVisible, setTripVisible] = useState(false);

  useEffect(() => {
    if (!recipe) return;
    const initial: Record<string, boolean> = {};
    recipe.ingredients.forEach((ing) => {
      const have = inventoryMap.get(ing.itemId) ?? 0;
      initial[ing.itemId] = have >= Math.max(0.05, ing.qty - 0.05);
    });
    setChecks(initial);
    setSaved(false);
    setTripVisible(false);
  }, [recipe, inventoryMap]);

  const missingIds = useMemo(
    () =>
      recipe
        ? recipe.ingredients.filter((ing) => !checks[ing.itemId]).map((ing) => ing.itemId)
        : [],
    [recipe, checks],
  );

  const trip = useMemo(() => buildTripPlan(missingIds), [buildTripPlan, missingIds]);

  if (!recipe) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Recipe not found.</p>
          <Link className="btn btn-dark" to="/recipes" style={{ marginTop: '1rem' }}>
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  function saveInventory(e?: FormEvent) {
    e?.preventDefault();
    recipe!.ingredients.forEach((ing) => {
      const checked = !!checks[ing.itemId];
      toggleHaveItem(ing.itemId, checked, Math.max(ing.qty, 1));
    });
    setSaved(true);
    setTripVisible(true);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
      saveInventory();
    }
  }

  return (
    <div className="page" onKeyDown={onKeyDown}>
      <Link to="/recipes" className="muted" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← All recipes
      </Link>
      <div className="section-head">
        <div>
          <span className="eyebrow">{recipe.meal}</span>
          <h2>{recipe.title}</h2>
        </div>
        <p>
          {recipe.timeMin} min total · {recipe.prepMin} prep · {recipe.cookMin} cook ·{' '}
          {recipe.servings} servings · {recipe.difficulty}
        </p>
      </div>

      <div
        className="recipe-visual"
        style={{
          background: recipe.image,
          borderRadius: 'var(--radius)',
          height: 200,
          marginBottom: '1.25rem',
        }}
      />

      <p style={{ marginBottom: '1.25rem', maxWidth: '60ch' }}>{recipe.blurb}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setMeal('monday', recipe.id)}
        >
          Add to Monday
        </button>
        <Link className="btn btn-dark btn-sm" to="/plan">
          Open meal plan
        </Link>
      </div>

      <div className="detail-layout">
        <form className="panel" onSubmit={saveInventory}>
          <h3>Ingredients — what’s in your fridge?</h3>
          <p className="muted" style={{ marginBottom: '0.85rem' }}>
            Check items you already have, then press Enter or Save. We’ll tell you where to buy
            the rest.
          </p>
          <ul className="check-list">
            {recipe.ingredients.map((ing) => {
              const g = getGrocery(ing.itemId);
              const board = g ? storeLeaderboard(g) : [];
              const best = board[0];
              const isItemFav = favoriteItems.has(ing.itemId);
              const favHits = board.filter((r) => favoriteStores.has(r.storeId));
              return (
                <li key={ing.itemId}>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={!!checks[ing.itemId]}
                      onChange={(e) =>
                        setChecks((c) => ({ ...c, [ing.itemId]: e.target.checked }))
                      }
                    />
                    <span>
                      <strong>
                        {ing.displayAmount} {g?.name ?? ing.itemId}
                      </strong>
                      {ing.note ? ` (${ing.note})` : ''}
                      {checks[ing.itemId] ? (
                        <span className="have-badge">Have it</span>
                      ) : (
                        <span className="missing-badge">Need it</span>
                      )}
                      {g && (
                        <div className="muted">
                          Pantry: ~{ing.qty} {g.unit}
                          {best ? ` · Best: ${best.storeName} · $${best.price.toFixed(2)}` : ''}
                        </div>
                      )}
                      {favHits.length > 0 && (
                        <div className="fav-hit-row">
                          {favHits.map((h) => (
                            <span key={h.storeId} className="fav-rank-badge in">
                              {h.storeName} #{h.rank}
                            </span>
                          ))}
                        </div>
                      )}
                    </span>
                  </label>
                  {g && (
                    <button
                      type="button"
                      className={`fav-btn inline ${isItemFav ? 'on' : ''}`}
                      aria-label={isItemFav ? 'Unfavorite' : 'Favorite'}
                      onClick={() => toggleFavoriteItem(ing.itemId)}
                    >
                      {isItemFav ? '★' : '☆'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="inv-save-row">
            <button type="submit" className="btn btn-primary">
              Save fridge check
            </button>
            {saved && <span className="have-badge">Saved to pantry</span>}
          </div>
        </form>

        <div>
          <div className="panel" style={{ marginBottom: '1rem' }}>
            <h3>Tools</h3>
            <ul>
              {recipe.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="panel" style={{ marginBottom: '1rem' }}>
            <h3>Steps</h3>
            <ol>
              {recipe.steps.map((s, i) => (
                <li key={`${i}-${s.slice(0, 24)}`}>{s}</li>
              ))}
            </ol>
          </div>

          {recipe.tips && recipe.tips.length > 0 && (
            <div className="panel" style={{ marginBottom: '1rem' }}>
              <h3>Tips</h3>
              <ul>
                {recipe.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div className="panel" style={{ marginBottom: '1rem' }}>
              <h3>Substitutions</h3>
              <ul>
                {recipe.substitutions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {tripVisible && (
            <div className="panel trip-panel">
              <h3>Where to get the missing stuff</h3>
              {missingIds.length === 0 ? (
                <p className="muted">You’re covered — nothing to buy for this recipe.</p>
              ) : (
                <>
                  <p className="muted" style={{ marginBottom: '0.85rem' }}>
                    Shopping trip plan based on each item’s lowest price:
                  </p>
                  <ul className="trip-list">
                    {trip.map((stop) => (
                      <li
                        key={stop.storeId}
                        className={favoriteStores.has(stop.storeId) ? 'lb-fav' : undefined}
                      >
                        <strong>
                          <span
                            className="store-dot"
                            style={{
                              background: stores.find((s) => s.id === stop.storeId)?.color,
                            }}
                          />
                          {stop.storeName}
                          {favoriteStores.has(stop.storeId) ? ' ★' : ''}
                        </strong>
                        <span className="muted">
                          {' '}
                          — get {stop.items.map((i) => i.name).join(', ')} (~$
                          {stop.subtotal.toFixed(2)})
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
