import { useState } from 'react';
import Navbar from './components/Navbar';
import NutritionCard from './components/NutritionCard';
import { useOpenFoodFacts } from './hooks/useOpenFoodFacts';

const SOURCE_COLORS = {
  openfoodfacts: { bg: '#E1F5EE', color: '#085041', border: '#6EE7B7', label: '📦 Open Food Facts' },
  usda: { bg: '#EEF2FF', color: '#3730A3', border: '#C7D2FE', label: '📊 USDA' },
};

function ResultSideCard({ item, isSelected, onClick }) {
  const src = SOURCE_COLORS[item.source] || SOURCE_COLORS.usda;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        background: isSelected ? 'var(--color-background-secondary)' : 'var(--color-background-primary)',
        border: isSelected ? '1.5px solid #888' : '0.5px solid var(--color-border-tertiary)',
        borderRadius: 10,
        padding: '10px 12px',
        cursor: 'pointer',
        marginBottom: 6,
        transition: 'border 0.15s, background 0.15s',
      }}
    >
      {/* Food image thumbnail */}
      {item.imageUrl && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 8,
            background: '#f0f0ee',
          }}
        >

          <img
            src={item.imageUrl}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none'
            }}
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}

      <p style={{
        fontSize: 13, fontWeight: 500, margin: '0 0 2px',
        color: 'var(--color-text-primary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {item.name}
      </p>

      {item.brand && (
        <p style={{
          fontSize: 11, color: 'var(--color-text-tertiary)', margin: '0 0 4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {item.brand}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {item.calories} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-secondary)' }}>kcal</span>
        </span>
        <span style={{
          fontSize: 10, padding: '2px 6px', borderRadius: 10,
          background: src.bg, color: src.color, border: `0.5px solid ${src.border}`,
        }}>
          {item.source === 'usda' ? 'USDA' : 'OFF'}
        </span>
      </div>
    </button>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const { result, results, selectedIndex, selectResult, loading, error, source, lookup } =
    useOpenFoodFacts();

  function handleSearch() {
    const q = query.trim();

    if (!q || loading) return;

    lookup(q);
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }

  const srcInfo = SOURCE_COLORS[source];
  const hasResults = results.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background-tertiary)' }}>
      <Navbar />

      <main style={{ maxWidth: hasResults ? 900 : 560, margin: '0 auto', padding: '2rem 1rem 4rem', transition: 'max-width 0.3s ease' }}>

        {/* Heading */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, margin: '0 0 4px', color: 'var(--color-text-primary)' }}>
            Food nutrition lookup
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
            Packaged products via Open Food Facts · Whole foods via USDA
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. tofu, chicken breast, Nutella, oat milk..."
            style={{ flex: 1, fontSize: 15 }}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            style={{ padding: '0 20px', fontWeight: 500, fontSize: 14, opacity: loading || !query.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Searching…' : 'Look up'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FCEBEB', border: '0.5px solid #F09595',
            borderRadius: 8, padding: '10px 14px', fontSize: 13,
            color: '#791F1F', marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Results layout: side list + main card */}
        {hasResults && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

            {/* Side list */}
            <div
              style={{
                width: 260,
                flexShrink: 0,
                maxHeight: '80vh',
                overflowY: 'auto',
                paddingRight: 4,
              }}
            >
              <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', margin: '0 0 8px', letterSpacing: '0.04em' }}>
                {results.length} RESULT{results.length !== 1 ? 'S' : ''}
              </p>
              {results.map((item, i) => (
                <ResultSideCard
                  key={i}
                  item={item}
                  isSelected={i === selectedIndex}
                  onClick={() => selectResult(i)}
                />
              ))}
            </div>

            {/* Main card */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Source badge */}
              {srcInfo && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: srcInfo.bg, color: srcInfo.color, border: `0.5px solid ${srcInfo.border}`,
                  }}>
                    {srcInfo.label}
                  </span>
                </div>
              )}
              {result && <NutritionCard result={result} />}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasResults && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-tertiary)', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🥗</div>
            <p style={{ margin: 0 }}>Type any food or product name to get started</p>
            <p style={{ margin: '6px 0 0', fontSize: 12 }}>
              Packaged products · Whole foods · No API key needed in the UI
            </p>
          </div>
        )}
      </main>
    </div>
  );
}