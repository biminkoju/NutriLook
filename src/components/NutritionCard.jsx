import { MACRO_CONFIG } from "../constants/macros";
import MacroBar from "./MacroBar";
import BenefitChip from "./BenifitChip";

export default function NutritionCard({ result }) {
    const maxMacro = Math.max(result.protein, result.fat, result.carbs);
    const totalCals = result.protein * 4 + result.fat * 9 + result.carbs * 4;
    const calPct = totalCals > 0 ? {
        protein: Math.round((result.protein * 4 / result.calories) * 100),
        fat: Math.round((result.fat * 9 / result.calories) * 100),
        carbs: Math.round((result.carbs * 4 / result.calories) * 100),
    } : null;

    return (
        <div>
            {/* Macros card */}
            <div
                style={{
                    background: "var(--color-background-primary)",
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: 12,
                    padding: "1.25rem",
                    marginBottom: "1rem",
                }}
            >
                {/* Header: name + calorie count */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    <div>
                        <p style={{ fontSize: 20, fontWeight: 500, margin: "0 0 3px", color: "var(--color-text-primary)", textTransform: "capitalize" }}>
                            {result.name}
                        </p>
                        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
                            per {result.serving}
                        </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 32, fontWeight: 500, margin: 0, color: "var(--color-text-primary)", lineHeight: 1 }}>
                            {Math.round(result.calories)}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "3px 0 0", letterSpacing: "0.05em" }}>
                            CALORIES
                        </p>
                    </div>
                </div>

                {/* Macro tiles grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
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
            </div>

            {/* Benefits card */}
            {result.benefits?.length > 0 && (
                <div
                    style={{
                        background: "var(--color-background-primary)",
                        border: "0.5px solid var(--color-border-tertiary)",
                        borderRadius: 12,
                        padding: "1.25rem",
                    }}
                >
                    <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px", color: "var(--color-text-secondary)", letterSpacing: "0.04em" }}>
                        ♥ HEALTH BENEFITS
                    </p>
                    <div>
                        {result.benefits.map((b, i) => (
                            <BenefitChip key={i} text={b} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}