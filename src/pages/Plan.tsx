import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { recipes, getRecipe } from '../data/recipes';
import { days } from '../data/stores';
import type { DayKey } from '../data/types';

const planRecipes = recipes.filter(
  (r) => r.meal === 'dinner' || r.meal === 'lunch' || r.meal === 'breakfast',
);

function DayMealPicker({
  dayKey,
  label,
  recipeId,
  onSelect,
}: {
  dayKey: DayKey;
  label: string;
  recipeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return planRecipes.slice(0, 6);
    return planRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.meal.toLowerCase().includes(q) ||
        r.blurb.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = recipeId ? getRecipe(recipeId) : null;

  return (
    <div className="meal-picker">
      <label className="muted" htmlFor={`search-${dayKey}`} style={{ fontSize: '0.75rem' }}>
        Search recipes
      </label>
      <input
        id={`search-${dayKey}`}
        className="meal-search"
        type="search"
        placeholder={`Find a meal for ${label}…`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Allow click on results before closing
          window.setTimeout(() => setOpen(false), 150);
        }}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={`results-${dayKey}`}
        aria-expanded={open}
      />

      {open && (
        <ul id={`results-${dayKey}`} className="meal-results" role="listbox">
          {matches.length === 0 ? (
            <li className="muted meal-result-empty">No recipes match “{query}”</li>
          ) : (
            matches.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={`meal-result ${r.id === recipeId ? 'selected' : ''}`}
                  role="option"
                  aria-selected={r.id === recipeId}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(r.id);
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <strong>{r.title}</strong>
                  <span className="muted">
                    {r.meal} · {r.timeMin} min
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {selected && (
        <button
          type="button"
          className="btn btn-sm clear-meal"
          onClick={() => {
            onSelect(null);
            setQuery('');
          }}
        >
          Clear meal
        </button>
      )}

      <details className="meal-advanced">
        <summary>Or pick from full list</summary>
        <select
          id={`meal-${dayKey}`}
          value={recipeId ?? ''}
          onChange={(e) => onSelect(e.target.value || null)}
          aria-label={`${label} meal dropdown`}
        >
          <option value="">— Clear —</option>
          {planRecipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </details>
    </div>
  );
}

export function Plan() {
  const { plan, setMeal, missing } = useAppState();

  return (
    <div className="page page-wide">
      <div className="section-head">
        <div>
          <span className="eyebrow">Weekly chart</span>
          <h2>What’s for dinner?</h2>
        </div>
        <p>
          Search recipes for each day, then we’ll flag missing ingredients for the whole week.
        </p>
      </div>

      <div className="plan-grid">
        {days.map((d, i) => {
          const recipeId = plan[d.key];
          const recipe = recipeId ? getRecipe(recipeId) : null;
          return (
            <div key={d.key} className="day-col" style={{ animationDelay: `${i * 0.05}s` }}>
              <h3>{d.label}</h3>
              <DayMealPicker
                dayKey={d.key as DayKey}
                label={d.label}
                recipeId={recipeId}
                onSelect={(id) => setMeal(d.key as DayKey, id)}
              />
              {recipe ? (
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="day-preview"
                  style={{ background: recipe.image }}
                >
                  {recipe.title}
                </Link>
              ) : (
                <div className="day-preview empty">No meal set</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="plan-insights">
        <div className="panel">
          <h3>Missing for this week</h3>
          {missing.length === 0 ? (
            <p className="muted">You’re covered — pantry has what these recipes need.</p>
          ) : (
            <ul>
              {missing.slice(0, 8).map((m) => (
                <li key={m.itemId}>
                  <strong>{m.name}</strong> — need {m.needed} {m.unit} (have {m.have})
                  <div className="muted">
                    For{' '}
                    {m.forRecipes
                      .map((f) => `${f.title} (${f.day})`)
                      .slice(0, 2)
                      .join(', ')}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link className="btn btn-dark btn-sm" to="/shop" style={{ marginTop: '1rem' }}>
            Shop smart →
          </Link>
        </div>
        <div className="panel">
          <h3>How this works</h3>
          <ol>
            <li>Search and pick meals for each day.</li>
            <li>We compare your inventory against every ingredient.</li>
            <li>Shop Smart shows the cheapest store and best weekday to buy.</li>
          </ol>
          <Link className="btn btn-primary btn-sm" to="/inventory" style={{ marginTop: '1rem' }}>
            Update inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
