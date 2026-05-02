// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
export const C = {
  // Primary
  navy: "#001736",
  teal: "#80F5E7",
  tealDark: "#14B8A6",
  tealDeep: "#007168",
  tealText: "#2DD4BF",
  white: "#FFFFFF",

  // Backgrounds
  bgPage: "#F9F9FF",
  bgSidebar: "#F0F3FF",
  bgCard: "#FFFFFF",
  bgInput: "#FFFFFF",
  bgHover: "#F8FAFC",

  // Text
  textPrimary: "#001736",
  textBody: "#44474E",
  textMuted: "#747780",
  textDark: "#1B1B1E",

  // Borders
  border: "#C4C6D0",
  borderLight: "#E2E8F0",

  // Status — Active/Accepted (Teal)
  statusActiveBg: "#E1F5EE",
  statusActiveText: "#085041",

  // Status — Pending (Amber)
  statusPendingBg: "#FAEEDA",
  statusPendingText: "#633806",
  statusPendingNum: "#D97706",

  // Status — Rejected (Red)
  statusRejectedBg: "#FCEBEB",
  statusRejectedText: "#A32D2D",
  statusRejectedNum: "#DC2626",

  // Misc
  skillTag: "#81F6E8",
  skillTagText: "#007168",
  chipBg: "#EFEDF0",
  chipText: "#1B1B1E",
  mileStoneBg: "#FEF3C7",
  milestoneText: "#B45309",
  star: "#F59E0B",
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
export function Navbar({ onNavigate, currentScreen, role }) {
  const freelancerLinks = [
    { label: "Find Work",    key: "browsejobs" },
    { label: "My Proposals", key: "myproposals" },
    { label: "My Gigs",      key: "mygigs" },
  ];
  
  const clientLinks = [
    { label: "Find Freelancers", key: "browse" },
    { label: "My Jobs",          key: "myjobs" },
    { label: "Post a Job",       key: "createjob" },
  ];

  const links = role === "client" ? clientLinks : freelancerLinks;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      width: "100%", height: 64, background: C.navy,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 24px",
      boxSizing: "border-box", flexShrink: 0,
    }}>
      {/* Left: Logo + Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{
          fontFamily: "'Manrope', sans-serif", fontWeight: 800,
          fontSize: 20, color: C.white, letterSpacing: 1,
          cursor: "pointer"
        }} onClick={() => onNavigate("home")}>
          Nexus Pro
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {links.map(({ label, key }) => {
            const isActive = currentScreen === key;
            return (
              <button key={key}
                onClick={() => onNavigate && onNavigate(key)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "-0.35px",
                  color: isActive ? C.tealText : "rgba(255,255,255,0.8)",
                  borderBottom: isActive ? `2px solid ${C.tealText}` : "2px solid transparent",
                  padding: "20px 0",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseOver={e => {
                  if (!isActive) e.currentTarget.style.color = C.white;
                }}
                onMouseOut={e => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
              >{label}</button>
            );
          })}
        </div>
      </div>

      {/* Right: Search + Icons + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>🔍</span>
          <input placeholder="Search..."
            style={{
              width: 200, height: 36, background: "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 8,
              padding: "0 16px 0 36px", fontSize: 14,
              color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif",
              outline: "none",
            }} />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)" }}>🔔</button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1E3A5F", border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontWeight: 700, fontSize: 13,
          fontFamily: "'Inter', sans-serif", cursor: "pointer",
        }} onClick={() => onNavigate("switch_role")}>
          {role === "client" ? "CL" : "FL"}
        </div>
      </div>
    </nav>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
export function Sidebar({ activeItem = "jobs", onNavigate, role }) {
  const freelancerItems = [
    { icon: "🏠", label: "Overview",     key: "home"       },
    { icon: "🔍", label: "Browse Jobs",  key: "browsejobs" },
    { icon: "📋", label: "My Proposals", key: "myproposals"},
    { icon: "💼", label: "My Gigs",      key: "mygigs"     },
  ];

  const clientItems = [
    { icon: "🏠", label: "Dashboard",    key: "home"       },
    { icon: "🔍", label: "Browse Gigs",  key: "browse"     },
    { icon: "📋", label: "My Jobs",      key: "myjobs"     },
    { icon: "➕", label: "Post a Job",    key: "createjob"  },
  ];

  const items = role === "client" ? clientItems : freelancerItems;

  return (
    <aside style={{
      width: 240, flexShrink: 0, height: "100%",
      background: C.bgSidebar, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column",
      padding: "80px 16px 24px", boxSizing: "border-box", gap: 4,
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => {
          const isActive = activeItem === item.key;
          return (
            <div key={item.key}
              onClick={() => onNavigate && onNavigate(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                borderRadius: isActive ? "0 8px 8px 0" : 8,
                cursor: "pointer", transition: "all 0.15s",
                background: isActive ? C.white : "transparent",
                borderLeft: isActive ? `4px solid ${C.tealDark}` : "4px solid transparent",
                boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              }}
              onMouseOver={e => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.5)";
              }}
              onMouseOut={e => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                color: isActive ? C.navy : "#64748B",
              }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* User info */}
      <div style={{
        borderTop: `1px solid ${C.borderLight}`,
        display: "flex", alignItems: "center", gap: 12,
        padding: "16px 12px",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: C.navy, display: "flex", alignItems: "center",
          justifyContent: "center", color: C.white,
          fontWeight: 700, fontSize: 14, fontFamily: "'Inter', sans-serif",
        }}>{role === "client" ? "CL" : "FL"}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>Alex Sterling</div>
          <div style={{ fontSize: 12, color: "#64748B", fontFamily: "'Inter', sans-serif", textTransform: "capitalize" }}>{role}</div>
        </div>
      </div>
    </aside>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = {
    Pending:  { bg: C.statusPendingBg,  text: C.statusPendingText  },
    Accepted: { bg: C.statusActiveBg,   text: C.statusActiveText   },
    Rejected: { bg: C.statusRejectedBg, text: C.statusRejectedText },
    Active:   { bg: C.statusActiveBg,   text: C.statusActiveText   },
  };
  const s = cfg[status] || cfg.Pending;
  return (
    <span style={{
      background: s.bg, color: s.text,
      padding: "5px 16px", borderRadius: 2,
      fontSize: 12, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "-0.3px", fontFamily: "'Inter', sans-serif",
      display: "inline-block",
    }}>{status}</span>
  );
}

// ─── SKILL TAG ───────────────────────────────────────────────────────────────
export function SkillTag({ label }) {
  return (
    <span style={{
      background: C.skillTag, borderRadius: 9999,
      padding: "2px 10px", fontSize: 11, fontWeight: 600,
      color: C.skillTagText, fontFamily: "'Inter', sans-serif",
      display: "inline-block",
    }}>{label}</span>
  );
}

// ─── BTN ─────────────────────────────────────────────────────────────────────
export function Btn({ children, variant = "primary", onClick, style = {}, small }) {
  const base = {
    fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer",
    borderRadius: 8, fontSize: small ? 12 : 16,
    padding: small ? "8px 24px" : "0 24px",
    height: small ? 36 : 44,
    display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: 8, transition: "opacity 0.15s",
    letterSpacing: "-0.2px",
  };
  const variants = {
    primary:  { background: C.navy,        color: C.white,      border: "none"                      },
    outlined: { background: "transparent", color: C.navy,       border: `2px solid ${C.navy}`       },
    teal:     { background: C.teal,        color: C.navy,       border: "none"                      },
    danger:   { background: "transparent", color: "#DC2626",    border: `2px solid #DC2626`         },
    ghost:    { background: "transparent", color: C.textMuted,  border: "none", fontWeight: 500     },
  };
  return (
    <button onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
      onMouseOut={e => e.currentTarget.style.opacity = "1"}>
      {children}
    </button>
  );
}

// ─── SECTION CARD ────────────────────────────────────────────────────────────
export function SectionCard({ children, style = {} }) {
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 20,
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      ...style,
    }}>{children}</div>
  );
}

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
export function SectionHeading({ children }) {
  return (
    <h3 style={{
      margin: "0 0 12px", fontSize: 16, fontWeight: 700,
      color: C.navy, fontFamily: "'Manrope', sans-serif",
    }}>{children}</h3>
  );
}

// ─── MILESTONE BADGE ─────────────────────────────────────────────────────────
export function MilestoneBadge({ status = "Pending" }) {
  return (
    <span style={{
      background: C.mileStoneBg, color: C.milestoneText,
      padding: "2px 8px", borderRadius: 4,
      fontSize: 9, fontWeight: 700, letterSpacing: "0.45px",
      textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
    }}>{status}</span>
  );
}

export const MILESTONES = [
  { title: "Discovery & Wireframes", due: "Week 2", budget: "$400",   status: "Pending" },
  { title: "Frontend Development",   due: "Week 6", budget: "$1,200", status: "Pending" },
  { title: "Testing & Handoff",      due: "Week 8", budget: "$400",   status: "Pending" },
];
