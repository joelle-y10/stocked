import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tutorials } from '../data/tutorials';
import type { TutorialCategory } from '../data/types';

const cats: Array<'all' | TutorialCategory> = [
  'all',
  'shopping',
  'stores',
  'planning',
  'waste',
  'breakfast',
  'lunch',
  'dinner',
  'dessert',
  'drinks',
  'tools',
  'techniques',
];

const catLabel: Record<(typeof cats)[number], string> = {
  all: 'All',
  shopping: 'Shopping',
  stores: 'Stores',
  planning: 'Planning',
  waste: 'Waste',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
  drinks: 'Drinks',
  tools: 'Tools',
  techniques: 'Techniques',
};

export function Learn() {
  const [cat, setCat] = useState<(typeof cats)[number]>('all');
  const list = useMemo(
    () => tutorials.filter((t) => cat === 'all' || t.category === cat),
    [cat],
  );

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Kitchen school</span>
          <h2>Learn to shop & cook smarter</h2>
        </div>
        <p>
          Grocery literacy, Canadian store strategy, fridge inventory, meal planning, and
          cooking techniques — with materials, tools, and real steps.
        </p>
      </div>

      <div className="chips" style={{ marginBottom: '1.25rem' }}>
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {catLabel[c]}
          </button>
        ))}
      </div>

      <div className="learn-grid">
        {list.map((t) => (
          <Link key={t.id} to={`/learn/${t.id}`} className="learn-tile">
            <span className="eyebrow">{catLabel[t.category]}</span>
            <h3>{t.title}</h3>
            <p className="muted">{t.summary}</p>
            <div className="recipe-meta">
              <span>{t.duration}</span>
              <span>{t.level}</span>
              <span>{t.steps.length} steps</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LearnDetail() {
  const { id } = useParams();
  const tutorial = tutorials.find((t) => t.id === id);

  if (!tutorial) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Lesson not found.</p>
          <Link className="btn btn-dark" to="/learn" style={{ marginTop: '1rem' }}>
            Back to Learn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/learn" className="muted" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← All lessons
      </Link>
      <div className="section-head">
        <div>
          <span className="eyebrow">{catLabel[tutorial.category]}</span>
          <h2>{tutorial.title}</h2>
        </div>
        <p>
          {tutorial.duration} · {tutorial.level} · {tutorial.steps.length} steps
        </p>
      </div>
      <p style={{ maxWidth: '68ch', marginBottom: '1.25rem', lineHeight: 1.55 }}>{tutorial.summary}</p>

      <div className="split-two">
        <div className="panel">
          <h3>Materials</h3>
          <ul>
            {tutorial.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3>Tools</h3>
          <ul>
            {tutorial.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3>Steps</h3>
        <ol>
          {tutorial.steps.map((s, i) => (
            <li key={`${i}-${s.slice(0, 24)}`}>{s}</li>
          ))}
        </ol>
      </div>

      <div
        className="panel"
        style={{ marginTop: '1rem', background: 'var(--leaf)', color: 'var(--paper)' }}
      >
        <h3 style={{ color: 'var(--lime)' }}>Pro tip</h3>
        <p style={{ lineHeight: 1.55 }}>{tutorial.tip}</p>
      </div>
    </div>
  );
}
