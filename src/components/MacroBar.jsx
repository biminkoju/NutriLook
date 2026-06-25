export default function MacroBar({ label, value, unit, color, bg, textColor, maxVal }) {
    const pct = maxVal > 0 ? Math.round((value / maxVal) * 100) : 0;

    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    {label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: textColor, background: bg, padding: "2px 8px", borderRadius: 6 }}>
                    {value}{unit}
                </span>
            </div>
            <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
            </div>
        </div>
    );
}