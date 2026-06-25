import { useState } from "react";
import Navbar from "./components/Navbar";
import NutritionCard from "./components/NutritionCard";
import { useGemini } from "./hooks/useGemini";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStored, setKeyStored] = useState(false);
  const [query, setQuery] = useState("");

  const { result, loading, error, lookup } = useGemini(apiKey);

  function handleSearch() {
    lookup(query);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      <Navbar />

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* Page heading */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 26, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>
            Food nutrition lookup
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
            Calories, macros & health benefits — powered by Gemini
          </p>
        </div>

        {/* API key input */}
        <div
          style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: 12,
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
          }}
        >
          <label
            htmlFor="api-key"
            style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 6, fontWeight: 500, letterSpacing: "0.04em" }}
          >
            GEMINI API KEY
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setKeyStored(false); }}
              placeholder="AIza..."
              style={{ flex: 1, fontSize: 13, fontFamily: "monospace" }}
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? "Hide key" : "Show key"}
              style={{ padding: "0 10px", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--color-text-secondary)" }}
            >
              {showKey ? "🙈" : "👁️"}
            </button>
            <button
              onClick={() => { if (apiKey.trim()) setKeyStored(true); }}
              style={{ whiteSpace: "nowrap", fontSize: 13 }}
            >
              {keyStored ? "✓ Saved" : "Save"}
            </button>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "6px 0 0" }}>
            Your key stays in-browser and is never stored.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. tofu, grilled chicken, avocado..."
            style={{ flex: 1, fontSize: 15 }}
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            style={{ padding: "0 20px", fontWeight: 500, fontSize: 14, opacity: loading || !query.trim() ? 0.5 : 1 }}
          >
            {loading ? "Looking up…" : "Look up"}
          </button>
        </div>

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
            Type any food to get started
          </div>
        )}
      </main>
    </div>
  );
}