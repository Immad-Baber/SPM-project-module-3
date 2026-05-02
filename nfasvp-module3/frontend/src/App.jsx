import { useState, useEffect } from "react";

// ── Gigs screens ──────────────────────────────────────────────────────────────
import BrowseGigs        from "./pages/gigs/G03_BrowseGigs.jsx";
import GigDetail         from "./pages/gigs/G03_GigDetail.jsx";
import MyGigs            from "./pages/gigs/G03_MyGigs.jsx";
import CreateGig         from "./pages/gigs/G03_CreateGig.jsx";
import EditGig           from "./pages/gigs/G03_EditGig.jsx";
import CategorySelection from "./pages/gigs/G03_CategorySelection.jsx";

// ── Bids / Jobs screens ───────────────────────────────────────────────────────
import BrowseJobs           from "./pages/bids/G03_BrowseJobs.jsx";
import JobDetail            from "./pages/bids/G03_JobDetail.jsx";
import SubmitProposal       from "./pages/bids/G03_SubmitProposal.jsx";
import MyProposals          from "./pages/bids/G03_MyProposals.jsx";
import AcceptRejectProposal from "./pages/bids/G03_AcceptRejectProposal.jsx";

// ── API Service Layer (backend integration) ───────────────────────────────────
import { setAuthToken, loadStoredToken, checkHealth } from "./services/api.js";
import { getDevToken } from "./services/devAuth.js";

// ─────────────────────────────────────────────────────────────────────────────
// Screen registry — maps route keys → components
// ─────────────────────────────────────────────────────────────────────────────
const SCREENS = {
  // Gigs
  browse:     BrowseGigs,
  detail:     GigDetail,
  mygigs:     MyGigs,
  create:     CreateGig,
  edit:       EditGig,
  categories: CategorySelection,

  // Jobs / Bids
  browsejobs:   BrowseJobs,
  jobdetail:    JobDetail,
  submit:       SubmitProposal,
  myproposals:  MyProposals,
  acceptreject: AcceptRejectProposal,
};

// ─────────────────────────────────────────────────────────────────────────────
// Home landing — pick a module to demo
// ─────────────────────────────────────────────────────────────────────────────
function Home({ onNavigate, backendStatus }) {
  const gigs = [
    { key: "browse",     label: "Browse Gigs",          icon: "🔍" },
    { key: "detail",     label: "Gig Detail",           icon: "📄" },
    { key: "mygigs",     label: "My Gigs",              icon: "📋" },
    { key: "create",     label: "Create Gig",           icon: "➕" },
    { key: "edit",       label: "Edit Gig",             icon: "✏️" },
    { key: "categories", label: "Category Selection",   icon: "🗂️" },
  ];
  const jobs = [
    { key: "browsejobs",   label: "Browse Jobs",              icon: "💼" },
    { key: "jobdetail",    label: "Job Detail",               icon: "📄" },
    { key: "submit",       label: "Submit Proposal",          icon: "📨" },
    { key: "myproposals",  label: "My Proposals",             icon: "📑" },
    { key: "acceptreject", label: "Accept / Reject Proposal", icon: "✅" },
  ];

  const cardStyle = {
    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
    padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
    cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s",
    fontFamily: "'DM Sans', sans-serif",
  };

  const statusColors = {
    checking: { bg: "#FEF9C3", dot: "#D97706", text: "#92400E", label: "Checking backend…" },
    online:   { bg: "#DCFCE7", dot: "#16A34A", text: "#14532D", label: "Backend online ✓ (port 4003)" },
    offline:  { bg: "#FEE2E2", dot: "#DC2626", text: "#7F1D1D", label: "Backend offline — run: npm run dev in /backend" },
  };
  const st = statusColors[backendStatus] || statusColors.checking;

  return (
    <div style={{ minHeight: "100vh", background: "#F9F9FF", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#000", color: "#fff", padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>GigMarket</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, opacity: 0.6 }}>NFASVP · Module 3 – Gig & Proposal Management</p>
        </div>
        {/* Backend connection status badge */}
        <div style={{
          background: st.bg, borderRadius: 8, padding: "8px 14px",
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: st.dot, display: "inline-block",
            boxShadow: backendStatus === "online" ? `0 0 0 3px ${st.dot}33` : "none",
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: st.text }}>{st.label}</span>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 36 }}>

        {/* Gigs */}
        <section>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>🖥️ Gigs Module (G03)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {gigs.map(({ key, label, icon }) => (
              <div
                key={key}
                onClick={() => onNavigate(key)}
                style={cardStyle}
                onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{ fontSize: 26 }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: "#0F172A" }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs / Bids */}
        <section>
          <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700, color: "#0F172A" }}>💼 Jobs / Bids Module (G03)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {jobs.map(({ key, label, icon }) => (
              <div
                key={key}
                onClick={() => onNavigate(key)}
                style={cardStyle}
                onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <span style={{ fontSize: 26 }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: "#0F172A" }}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* API endpoints reference panel */}
        <section style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "20px 24px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "#0F172A", fontFamily: "'DM Sans', sans-serif" }}>
            🔗 Backend API Endpoints (port 4003)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              ["GET", "/api/v1/health",       "Health check"],
              ["GET", "/api/v1/gigs",         "List gigs"],
              ["GET", "/api/v1/jobs",         "List jobs"],
              ["GET", "/api/v1/bids/my-bids", "My proposals"],
              ["GET", "/api/v1/categories",   "Categories"],
              ["GET", "/api/v1/search",       "Global search"],
            ].map(([method, path, desc]) => (
              <div key={path} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                <span style={{
                  background: method === "GET" ? "#DBEAFE" : "#FCE7F3",
                  color: method === "GET" ? "#1D4ED8" : "#BE185D",
                  borderRadius: 4, padding: "2px 7px", fontWeight: 700, fontSize: 11,
                  minWidth: 36, textAlign: "center",
                }}>
                  {method}
                </span>
                <code style={{ color: "#374151", background: "#F9FAFB", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{path}</code>
                <span style={{ color: "#6B7280" }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App — manages active screen + initializes the API service layer
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [backendStatus, setBackendStatus] = useState("checking");

  // Initialize API layer on mount:
  //   1. Restore any stored JWT from sessionStorage
  //   2. Generate a dev JWT if none exists (uses VITE_DEV_JWT_SECRET from .env)
  //   3. Ping /api/v1/health to check if backend is reachable
  useEffect(() => {
    async function initApi() {
      const stored = loadStoredToken();

      if (!stored) {
        try {
          const devToken = await getDevToken("freelancer");
          setAuthToken(devToken);
        } catch (e) {
          console.warn("[API] Could not generate dev token:", e.message);
        }
      }

      try {
        await checkHealth();
        setBackendStatus("online");
      } catch {
        setBackendStatus("offline");
      }
    }

    initApi();
  }, []);

  const onNavigate = (key) => {
    if (key in SCREENS || key === "home") setScreen(key);
  };

  if (screen === "home") return <Home onNavigate={onNavigate} backendStatus={backendStatus} />;

  const Screen = SCREENS[screen];
  if (!Screen) return <Home onNavigate={onNavigate} backendStatus={backendStatus} />;

  return <Screen onNavigate={onNavigate} />;
}
