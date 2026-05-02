// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
export const C = {
  navy: "#001736",
  black: "#000000",
  white: "#FFFFFF",
  bgPage: "#F9F9FF",
  bgAlt: "#F0F3FF",
  bgCard: "#FFFFFF",
  textPrimary: "#1B1B1D",
  textSecondary: "#45464D",
  textMuted: "#76777D",
  border: "#C6C6CD",
  green: "#10B981",
  greenDark: "#15803D",
  greenBg: "#DCFCE7",
  greenBorder: "#BBF7D0",
  red: "#BA1A1A",
  redBg: "#FEF2F2",
  redNote: "#FFDAD6",
  redDark: "#93000A",
  badgeBg: "#DCE0E4",
  badgeText: "#5E6367",
  yellow: "#FBBF24",
  chipBg: "#F6F3F5",
  navBg: "#1B1B1D",
  teal: "#80F5E7",
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
export function Navbar({ onNavigate, currentScreen }) {
  const links = [
    { label: "Browse",     key: "browse"     },
    { label: "My Gigs",    key: "mygigs"     },
    { label: "Create Gig", key: "create"     },
    { label: "Categories", key: "categories" },
  ];

  return (
    <nav style={{
      width: "100%", height: 64, background: C.navBg,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", boxSizing: "border-box",
      borderBottom: `2px solid ${C.black}`,
      position: "sticky", top: 0, zIndex: 100, flexShrink: 0,
    }}>
      {/* Left — Hamburger + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => onNavigate && onNavigate("browse")} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", gap: 5, padding: 6,
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", width: 26, height: 3, background: C.white, borderRadius: 2 }} />
          ))}
        </button>
        <button onClick={() => onNavigate && onNavigate("browse")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
          fontSize: 18, color: C.white, letterSpacing: "-0.5px",
          textDecoration: "none",
        }}>
          GigMarket
        </button>
      </div>

      {/* Right — Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {links.map(({ label, key }) => {
          const isActive = currentScreen === key;
          return (
            <button key={key}
              onClick={() => onNavigate && onNavigate(key)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.teal : C.white,
                padding: "20px 12px",
                borderBottom: isActive ? `2px solid ${C.teal}` : "2px solid transparent",
                opacity: isActive ? 1 : 0.8,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.opacity = "1";
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.opacity = "0.8";
                }
              }}
            >{label}</button>
          );
        })}

        {/* FAQ */}
        <button style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, fontWeight: 500, padding: "20px 12px",
          fontFamily: "'DM Sans', sans-serif", color: C.white,
          opacity: 0.8, borderBottom: "2px solid transparent",
          textDecoration: "none",
        }}>FAQ</button>

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "#374151", border: "1px solid #4B5563",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          marginLeft: 8,
        }}>SA</div>
      </div>
    </nav>
  );
}

// ─── STICKY NOTE ─────────────────────────────────────────────────────────────
export function StickyNote({ text }) {
  return (
    <div style={{
      background: C.redNote, borderLeft: `4px solid ${C.red}`,
      borderRadius: "0 4px 4px 0", padding: "10px 14px",
      fontSize: 12, color: C.redDark, fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    }}>{text}</div>
  );
}

// ─── VERIFIED BADGE ──────────────────────────────────────────────────────────
export function VerifiedBadge() {
  return (
    <span style={{
      background: C.greenBg, border: `1px solid ${C.greenBorder}`,
      borderRadius: 3, padding: "2px 7px", fontSize: 9,
      fontWeight: 700, color: C.greenDark, letterSpacing: "0.5px",
      textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 3,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <span style={{ fontSize: 8 }}>✓</span> Skill Verified
    </span>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = {
    Live:   { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", color: C.green,   dot: C.green   },
    Draft:  { bg: "#F1F5F9",              border: C.border,                color: "#64748B", dot: "#94A3B8" },
    Paused: { bg: "#FEF9C3",              border: "#FDE68A",               color: "#B45309", dot: "#D97706" },
  };
  const s = cfg[status] || cfg.Draft;
  return (
    <span style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12,
      padding: "3px 10px", fontSize: 11, fontWeight: 700, color: s.color,
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.4px",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

// ─── STARS ───────────────────────────────────────────────────────────────────
export function Stars({ rating, count }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span style={{ color: C.yellow, fontSize: 12 }}>★</span>
      <span style={{ fontWeight: 700, fontSize: 12, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{rating}</span>
      {count && <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>({count})</span>}
    </span>
  );
}

// ─── BTN ─────────────────────────────────────────────────────────────────────
export function Btn({ children, variant = "primary", onClick, style = {}, small }) {
  const base = {
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer",
    borderRadius: 4, fontSize: small ? 12 : 14, transition: "opacity 0.15s",
    padding: small ? "7px 14px" : "11px 20px",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
  };
  const variants = {
    primary:  { background: C.black,       color: C.white,         border: "none"                       },
    outlined: { background: "transparent", color: C.black,         border: `1.5px solid ${C.black}`     },
    danger:   { background: "transparent", color: C.red,           border: `1.5px solid ${C.red}`       },
    ghost:    { background: "transparent", color: C.textSecondary, border: "none", padding: 0, fontWeight: 500 },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.82"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}
    >
      {children}
    </button>
  );
}

// ─── GIG CARDS DATA ──────────────────────────────────────────────────────────
export const GIG_CARDS = [
  { id: 1, name: "Ahmed Raza",   rating: "4.9", reviews: "124", title: "I will build a high-performance React web application for your business",  tags: ["React", "Node.js"],  price: "PKR 5,000",  delivery: "3 days",  color: "#E8F4FD", icon: "💻" },
  { id: 2, name: "Sara Khan",    rating: "4.8", reviews: "87",  title: "I will create a unique brand identity and logo for your startup",          tags: ["Figma", "Branding"], price: "PKR 3,500",  delivery: "5 days",  color: "#FEF3C7", icon: "🎨" },
  { id: 3, name: "Usman Ali",    rating: "4.7", reviews: "65",  title: "I will write SEO-optimized blog posts and articles for your website",      tags: ["SEO", "Writing"],    price: "PKR 2,000",  delivery: "2 days",  color: "#F0FDF4", icon: "✍️" },
  { id: 4, name: "Fatima Noor",  rating: "4.9", reviews: "203", title: "I will develop a responsive mobile app using Flutter",                     tags: ["Flutter", "Dart"],   price: "PKR 12,000", delivery: "10 days", color: "#FDF2F8", icon: "📱" },
  { id: 5, name: "Bilal Hassan", rating: "4.6", reviews: "41",  title: "I will create data visualizations and analytics dashboards",              tags: ["Python", "PowerBI"], price: "PKR 8,000",  delivery: "7 days",  color: "#F0F9FF", icon: "📊" },
  { id: 6, name: "Zara Sheikh",  rating: "4.8", reviews: "93",  title: "I will produce and edit professional promotional videos",                  tags: ["Premiere", "AE"],    price: "PKR 6,500",  delivery: "4 days",  color: "#FFF7ED", icon: "🎬" },
];