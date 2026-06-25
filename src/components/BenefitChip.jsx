export default function BenefitChip({ text }) {
    return (
        <span
            style={{
                display: "inline-block",
                background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 20,
                padding: "5px 12px",
                fontSize: 13,
                color: "var(--color-text-secondary)",
                margin: "4px 4px 4px 0",
                lineHeight: 1.4,
            }}
        >
            {text}
        </span>
    );
}