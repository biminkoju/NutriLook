export default function Navbar() {
    return (
        <nav
            style={{
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                padding: "0 1.5rem",
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--color-background-primary)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }} aria-hidden="true">🥗</span>
                <span style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)" }}>
                    NutriLook
                </span>
            </div>

            <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 13, color: "var(--color-text-secondary)", textDecoration: "none" }}
            >
                Get API key ↗
            </a>
        </nav>
    );
}