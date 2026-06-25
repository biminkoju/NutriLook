import { useState } from "react";
import { MACRO_CONFIG } from "../constants/macros";
import MacroBar from "./MacroBar";
import BenefitChip from "./BenefitChip";

const NUTRI_SCORE_COLORS = {
    A: { bg: "#1a7f37", text: "#fff" },
    B: { bg: "#85c44f", text: "#fff" },
    C: { bg: "#f5c518", text: "#333" },
    D: { bg: "#ef8c1f", text: "#fff" },
    E: { bg: "#e63946", text: "#fff" },
};

function NutriScoreBadge({ grade }) {
    const colors = NUTRI_SCORE_COLORS[grade] || { bg: "#aaa", text: "#fff" };
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", letterSpacing: "0.04em" }}>NUTRI-SCORE</span>
            <span
                style={{
                    display: "inline-block",
                    background: colors.bg,
                    color: colors.text,
                    fontWeight: 700,
                    fontSize: 13,
                    borderRadius: 5,
                    padding: "2px 8px",
                    lineHeight: 1.4,
                }}
            >
                {grade}
            </span>
        </div>
    );
}

export default function NutritionCard({ result }) {
    const [imgError, setImgError] = useState(false);

    const maxMacro = Math.max(result.protein, result.fat, result.carbs);
    const calPct = result.calories > 0
        ? {
            protein: Math.round((result.protein * 4 / result.calories) * 100),
            fat: Math.round((result.fat * 9 / result.calories) * 100),
            carbs: Math.round((result.carbs * 4 / result.calories) * 100),
        }
        : null;

    const showImage = result.imageUrl && !imgError;

    return (
        <div>
            {/* ── Main card ── */}
            <div
                style={{
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: "1rem",
                }}
            >
                {/* Food image */}
                {showImage && (
                    <div
                        style={{
                            width: "100%",
                            height: 200,
                            background: "#f0f0ee",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={result.imageUrl}
                            alt={result.name}
                            onError={() => setImgError(true)}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </div>
                )}

                <div style={{ padding: "1.25rem" }}>
                    {/* Header: name + calories */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                        <div style={{ flex: 1, paddingRight: 12 }}>
                            <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 2px", color: "var(--color-text-primary)", textTransform: "capitalize" }}>
                                {result.name}
                            </p>
                            {result.brand && (
                                <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 6px" }}>
                                    {result.brand}
                                </p>
                            )}
                            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
                                per {result.serving}
                            </p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontSize: 32, fontWeight: 500, margin: 0, color: "var(--color-text-primary)", lineHeight: 1 }}>
                                {result.calories}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "3px 0 6px", letterSpacing: "0.05em" }}>
                                CALORIES
                            </p>
                            {result.nutriScore && <NutriScoreBadge grade={result.nutriScore} />}
                        </div>
                    </div>

                    {/* Macro tiles */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(76px, 1fr))",
                            gap: 8,
                            marginBottom: "1.25rem",
                            paddingBottom: "1.25rem",
                            borderBottom: "0.5px solid var(--color-border-tertiary)",
                        }}
                    >
                        {MACRO_CONFIG.map((m) => (
                            <div key={m.key} style={{ background: m.bg, borderRadius: 8, padding: "10px 12px" }}>
                                <p style={{ fontSize: 11, fontWeight: 500, margin: "0 0 4px", color: m.textColor, letterSpacing: "0.05em" }}>
                                    {m.label.toUpperCase()}
                                </p>
                                <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 1px", color: m.textColor }}>
                                    {result[m.key]}<span style={{ fontSize: 11 }}>g</span>
                                </p>
                                {calPct && (
                                    <p style={{ fontSize: 11, color: m.textColor, margin: 0, opacity: 0.7 }}>
                                        {calPct[m.key]}% cals
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Fiber tile */}
                        <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 12px" }}>
                            <p style={{ fontSize: 11, fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-secondary)", letterSpacing: "0.05em" }}>
                                FIBER
                            </p>
                            <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 1px", color: "var(--color-text-primary)" }}>
                                {result.fiber}<span style={{ fontSize: 11 }}>g</span>
                            </p>
                            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0 }}>
                                {result.sugar}g sugar
                            </p>
                        </div>
                    </div>

                    {/* Macro bars */}
                    {MACRO_CONFIG.map((m) => (
                        <MacroBar
                            key={m.key}
                            label={m.label}
                            value={result[m.key]}
                            unit="g"
                            color={m.color}
                            bg={m.bg}
                            textColor={m.textColor}
                            maxVal={maxMacro}
                        />
                    ))}

                    {/* Extra stats row */}
                    <div
                        style={{
                            display: "flex",
                            gap: 16,
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "0.5px solid var(--color-border-tertiary)",
                        }}
                    >
                        <div>
                            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 2px", letterSpacing: "0.04em" }}>SAT. FAT</p>
                            <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{result.saturatedFat}g</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 2px", letterSpacing: "0.04em" }}>SALT</p>
                            <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{result.salt}g</p>
                        </div>
                        {result.novaGroup && (
                            <div>
                                <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "0 0 2px", letterSpacing: "0.04em" }}>NOVA</p>
                                <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{result.novaGroup}/4</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Allergens card ── */}
            {result.allergens.length > 0 && (
                <div
                    style={{
                        background: "#FFFBEB",
                        border: "0.5px solid #FDE68A",
                        borderRadius: 12,
                        padding: "1rem 1.25rem",
                        marginBottom: "1rem",
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 8px", color: "#92400E", letterSpacing: "0.04em" }}>
                        ⚠️ ALLERGENS
                    </p>
                    <div>
                        {result.allergens.map((a, i) => (
                            <BenefitChip key={i} text={a} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Ingredients card ── */}
            {result.ingredients && (
                <div
                    style={{
                        background: "var(--color-background-primary)",
                        border: "0.5px solid var(--color-border-tertiary)",
                        borderRadius: 12,
                        padding: "1rem 1.25rem",
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-secondary)", letterSpacing: "0.04em" }}>
                        INGREDIENTS
                    </p>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
                        {result.ingredients}
                    </p>
                </div>
            )}
        </div>
    );
}