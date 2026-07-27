import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import type { MealSlot } from '../data/types';

const meals: Array<MealSlot | 'all'> = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'drinks'];

export function Recipes() {
  const [meal, setMeal] = useState<(typeof meals)[number]>('all');

  const list = useMemo(
    () => recipes.filter((r) => meal === 'all' || r.meal === meal),
    [meal],
  );

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Cookbook</span>
          <h2>Recipes for every slot</h2>
        </div>
        <p>
          Full ingredient amounts, timed steps, tips, and substitutions — then fridge-check what
          you own and shop the gaps.
        </p>
      </div>

      <div className="chips" style={{ marginBottom: '1.25rem' }}>
        {meals.map((m) => (
          <button
            key={m}
            type="button"
            className={`chip ${meal === m ? 'active' : ''}`}
            onClick={() => setMeal(m)}
          >
            {m === 'all' ? 'All' : m}
          </button>
        ))}
      </div>

      <div className="recipe-grid">
        {list.map((r, i) => (
          <Link
            key={r.id}
            to={`/recipes/${r.id}`}
            className="recipe-tile"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="recipe-visual" style={{ background: r.image }}>
              <span className="meal-tag">{r.meal}</span>
            </div>
            <div className="recipe-body">
              <h3>{r.title}</h3>
              <p className="muted">{r.blurb}</p>
              <div className="recipe-meta">
                <span>{r.timeMin} min</span>
                <span>
                  {r.prepMin} prep · {r.cookMin} cook
                </span>
                <span>{r.servings} servings</span>
                <span>{r.difficulty}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
