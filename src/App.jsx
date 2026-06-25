import { useState } from "react";
import Navbar from "./components/Navbar";
import NutritionCard from "./components/NutritionCard";
import { useOpenFoodFacts } from "./hooks/useOpenFoodFacts";

export default function App() {
  const [query, setQuery] = useState("");

  // const [usdaKey, setUsdaKey] = useState("");
  // const [keyStored, setKeyStored] = useState(false);
  // const [showKey, setShowKey] = useState(false);


  const { result, loading, error, source, lookup } = useOpenFoodFacts();

  function handleSearch() { lookup(query); }
  function handleKeyDown(e) { if (e.key === "Enter") handleSearch(); }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <Navbar />

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* Heading */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>
            Food nutrition lookup
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
            Packaged products via Open Food Facts · Whole foods via USDA
          </p>
        </div>

        {/* USDA API key */}
        {/* <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
          }}
        >
          <label
            htmlFor="usda-key"
            style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em" }}
          >
            USDA API KEY <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional — needed for whole foods)</span>
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              id="usda-key"
              type={showKey ? "text" : "password"}
              value={usdaKey}
              onChange={(e) => { setUsdaKey(e.target.value); setKeyStored(false); }}
              placeholder="Get a free key at fdc.nal.usda.gov"
              style={{ flex: 1, fontSize: 13, fontFamily: "monospace" }}
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? "Hide key" : "Show key"}
              style={{ padding: "0 10px", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}
            >
              {showKey ? "🙈" : "👁️"}
            </button>
            <button
              onClick={() => { if (usdaKey.trim()) setKeyStored(true); }}
              style={{ whiteSpace: "nowrap", fontSize: 13 }}
            >
              {keyStored ? "✓ Saved" : "Save"}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "6px 0 0" }}>
            Without this key, only packaged/branded products are searchable.
          </p>
        </div> */}

        {/* Search bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
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
            style={{ padding: "0 20px", fontWeight: 500, fontSize: 14, opacity: loading || !query.trim() ? 0.5 : 1 }}
          >
            {loading ? "Searching…" : "Look up"}
          </button>
        </div>

        {/* Source badge */}
        {source && !loading && (
          <div style={{ marginBottom: "0.75rem" }}>
            <span
              style={{
                fontSize: 12,
                padding: "3px 10px",
                borderRadius: 20,
                background: source === "usda" ? "#EEF2FF" : "#E1F5EE",
                color: source === "usda" ? "#3730A3" : "#085041",
                border: `0.5px solid ${source === "usda" ? "#C7D2FE" : "#6EE7B7"}`,
              }}
            >
              {source === "usda" ? "📊 USDA FoodData Central" : "📦 Open Food Facts"}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#FCEBEB",
              border: "0.5px solid #F09595",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#791F1F",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && <NutritionCard result={result} />}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--color-text-tertiary)", fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🥗</div>
            <p style={{ margin: 0 }}>Type any food or product name to get started</p>
            <p style={{ margin: "6px 0 0", fontSize: 12 }}>
              Packaged products need no key ·{" "}
              <a
                href="https://fdc.nal.usda.gov/api-key-signup"
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Get a USDA key
              </a>
              {" "}for whole foods
            </p>
          </div>
        )}
      </main>
    </div>
  );
}