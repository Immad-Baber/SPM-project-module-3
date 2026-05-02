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
export function Navbar({ onNavigate, currentScreen }) {
  const links = [
    { label: "Find Work",    key: "jobs"      },
    { label: "My Proposals", key: "proposals" },
    { label: "Messages",     key: "messages"  },
    { label: "Resources",    key: "resources" },
  ];

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
        }}>
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
          <input placeholder="Search jobs..."
            style={{
              width: 256, height: 36, background: "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 8,
              padding: "0 16px 0 36px", fontSize: 14,
              color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif",
              outline: "none",
            }} />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)" }}>🔔</button>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.8)" }}>⚙️</button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1E3A5F", border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontWeight: 700, fontSize: 13,
          fontFamily: "'Inter', sans-serif", cursor: "pointer",
        }}>AS</div>
      </div>
    </nav>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
export function Sidebar({ activeItem = "browse", onNavigate }) {
  const items = [
    { icon: "🏠", label: "Overview",     key: "overview"   },
    { icon: "🔍", label: "Browse Jobs",  key: "jobs"       },
    { icon: "📋", label: "My Proposals", key: "proposals"  },
    { icon: "💬", label: "Messages",     key: "messages"   },
    { icon: "⚙️", label: "Settings",     key: "settings"   },
  ];

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
        }}>AS</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>Alex Sterling</div>
          <div style={{ fontSize: 12, color: "#64748B", fontFamily: "'Inter', sans-serif" }}>Freelancer</div>
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

// ─── JOB CARDS DATA ──────────────────────────────────────────────────────────
export const JOB_CARDS = [
  {
    id: 1,
    title: "Senior Product Designer for Mobile Banking App",
    client: "FinTech Solutions",
    verified: true,
    budget: "$1,500 – $3,000",
    posted: "Posted 2 days ago",
    type: "Fixed Price",
    skills: ["Figma", "UI/UX", "Prototyping"],
    desc: "We are looking for an experienced product designer to help us rethink our mobile banking experience. You will be responsible for user research, low-fidelity…",
  },
  {
    id: 2,
    title: "React Developer for Enterprise CRM Dashboard",
    client: "DataViz Corp",
    verified: true,
    budget: "$2,000 – $5,000",
    posted: "Posted 1 day ago",
    type: "Hourly",
    skills: ["React", "Tailwind CSS", "D3.js"],
    desc: "Join our team to build high-performance data visualizations for an enterprise CRM dashboard. Deep knowledge of React, Tailwind CSS, and D3.js is…",
  },
  {
    id: 3,
    title: "Full Stack Developer for E-commerce Platform",
    client: "ShopNow Ltd.",
    verified: true,
    budget: "$3,000 – $6,000",
    posted: "Posted 3 days ago",
    type: "Fixed Price",
    skills: ["Node.js", "Next.js", "MongoDB"],
    desc: "Looking for a skilled full-stack developer to build and maintain our growing e-commerce platform with a focus on performance and scalability…",
  },
  {
    id: 4,
    title: "Mobile App Developer for iOS & Android Fitness App",
    client: "FitPulse Inc.",
    verified: false,
    budget: "$4,000 – $8,000",
    posted: "Posted 5 days ago",
    type: "Fixed Price",
    skills: ["Flutter", "Firebase", "Swift"],
    desc: "We need a talented mobile developer to build a cross-platform fitness tracking app with real-time sync, social features and health integrations…",
  },
];

export const MILESTONES = [
  { title: "Discovery & Wireframes", due: "Week 2", budget: "$400",   status: "Pending" },
  { title: "Frontend Development",   due: "Week 6", budget: "$1,200", status: "Pending" },
  { title: "Testing & Handoff",      due: "Week 8", budget: "$400",   status: "Pending" },
];

export const PROPOSALS = [
  { id: 1, job: "Senior React Developer...", client: "TechCorp Inc.", amount: "$2,000", date: "Apr 20, 2025", status: "Pending"  },
  { id: 2, job: "UI/UX for Mobile App",      client: "StartupXYZ",   amount: "$1,500", date: "Apr 18, 2025", status: "Accepted" },
  { id: 3, job: "Backend API Integration",   client: "DevAgency",    amount: "$3,200", date: "Apr 15, 2025", status: "Rejected" },
  { id: 4, job: "Logo Design & Branding",    client: "BrandCo",      amount: "$800",   date: "Apr 12, 2025", status: "Pending"  },
  { id: 5, job: "WordPress Site Rebuild",    client: "LocalBiz",     amount: "$600",   date: "Apr 10, 2025", status: "Accepted" },
];