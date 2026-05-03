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
import JobBidsList          from "./pages/bids/G03_JobBidsList.jsx";
import CreateJob            from "./pages/jobs/G03_CreateJob.jsx";
import MyJobs               from "./pages/jobs/G03_MyJobs.jsx";

// ── Person 4 Screens ──────────────────────────────────────────────────────────
import GlobalSearch         from "./pages/search/G03_GlobalSearch.jsx";
import ProjectStatus        from "./pages/projects/G03_ProjectStatus.jsx";
import ProjectDetail        from "./pages/projects/G03_ProjectDetail.jsx";
import Notifications        from "./pages/system/G03_Notifications.jsx";

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
  jobbids:      JobBidsList,
  createjob:    CreateJob,
  myjobs:       MyJobs,

  // Person 4
  globalsearch:  GlobalSearch,
  myprojects:    ProjectStatus,
  projectdetail: ProjectDetail,
  notifications: Notifications,
};

const ROUTE_ALIASES = {
  jobs: "browsejobs",
  proposals: "myproposals",
  review: "acceptreject",
  jobproposals: "jobbids",
  search: "globalsearch",
  projects: "myprojects",
};

// ─────────────────────────────────────────────────────────────────────────────
// Home Dashboard — Role-specific experience
// ─────────────────────────────────────────────────────────────────────────────
function Home({ onNavigate, backendStatus, role }) {
  const freelancerCards = [
    { key: "myprojects", label: "Active Projects",  icon: "🚀", desc: "Track your ongoing work and milestones." },
    { key: "mygigs",     label: "Manage Gigs",      icon: "📋", desc: "Edit your services and view performance." },
    { key: "browsejobs", label: "Find Work",        icon: "💼", desc: "Browse open job postings and bid." },
    { key: "myproposals",label: "My Proposals",     icon: "📑", desc: "Track your submitted bids and status." },
    { key: "create",     label: "Create New Gig",   icon: "➕", desc: "List a new service on the marketplace." },
  ];

  const clientCards = [
    { key: "myprojects", label: "Track Projects",   icon: "🚀", desc: "Monitor progress of your hired freelancers." },
    { key: "myjobs",     label: "Manage Jobs",      icon: "📋", desc: "View and edit your posted job listings." },
    { key: "browse",     label: "Hire Talent",      icon: "🔍", desc: "Find and order professional services." },
    { key: "createjob",  label: "Post a Job",       icon: "➕", desc: "Create a new project request for bids." },
    { key: "search",     label: "Global Search",    icon: "🌐", desc: "Search across all categories and skills." },
  ];

  const activeCards = role === "freelancer" ? freelancerCards : clientCards;

  const cardStyle = {
    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
    padding: "24px", display: "flex", flexDirection: "column", gap: 12,
    cursor: "pointer", transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'DM Sans', sans-serif", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  const stCfg = {
    checking: { dot: "#D97706", text: "#92400E", label: "System Check..." },
    online:   { dot: "#16A34A", text: "#14532D", label: "Ready & Connected" },
    offline:  { dot: "#DC2626", text: "#7F1D1D", label: "Backend Sync Error" },
  };
  const st = stCfg[backendStatus] || stCfg.checking;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Hero Header */}
      <div style={{ background: role === 'client' ? "#1E40AF" : "#065F46", color: "#fff", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, letterSpacing: "-1.5px" }}>
              Welcome, {role === 'client' ? 'Business Client' : 'Expert Freelancer'}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 18, opacity: 0.9, fontWeight: 400 }}>
              {role === 'client' ? 'Manage your team and projects from one central hub.' : 'Scale your freelance business with verified project management.'}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 20px", display: "inline-flex", alignItems: "center", gap: 10, backdropFilter: "blur(10px)" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: st.dot, boxShadow: `0 0 10px ${st.dot}` }} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{st.label}</span>
            </div>
            <div style={{ marginTop: 16 }}>
               <button onClick={() => onNavigate("switch_role")} style={{ background: "#fff", color: role === 'client' ? "#1E40AF" : "#065F46", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "transform 0.1s" }} onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                 Switch to {role === 'client' ? 'Freelancer' : 'Client'} Mode
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "-30px auto 40px", padding: "0 24px", position: "relative", zIndex: 3 }}>
        
        {/* Quick Stats Placeholder */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 32 }}>
           {[
             { label: "Active Projects", value: "4", color: "#3B82F6" },
             { label: "Unread Messages", value: "2", color: "#10B981" },
             { label: "Pending Payments", value: "PKR 12k", color: "#F59E0B" }
           ].map(stat => (
             <div key={stat.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
               <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
               <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
             </div>
           ))}
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
           <span>{role === 'client' ? '🏢' : '👩‍💻'}</span>
           Explore {role === 'client' ? 'Client' : 'Freelancer'} Workspace
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {activeCards.map(({ key, label, icon, desc }) => (
            <div
              key={key}
              onClick={() => onNavigate(key)}
              style={cardStyle}
              onMouseOver={e => { e.currentTarget.style.borderColor = role === 'client' ? "#3B82F6" : "#10B981"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ width: 48, height: 48, background: "#F1F5F9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Footer */}
        <div style={{ marginTop: 48, borderTop: "1px solid #E2E8F0", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", gap: 32 }}>
              <div style={{ fontSize: 13, color: "#64748B" }}>
                <strong style={{ color: "#0F172A" }}>Module 3</strong> - Gig & Proposal Lifecycle
              </div>
              <div style={{ fontSize: 13, color: "#64748B" }}>
                <strong style={{ color: "#0F172A" }}>Module 4</strong> - Admin & Dispute (Linked)
              </div>
           </div>
           <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8" }}>
              © 2026 NFASVP PLATFORM
           </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Role Selection Screen
// ─────────────────────────────────────────────────────────────────────────────
function RoleSelection({ onSelectRole }) {
  const cardStyle = {
    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
    padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
    cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s",
    fontFamily: "'DM Sans', sans-serif", width: "100%", textAlign: "center"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9F9FF", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, color: "#0F172A", letterSpacing: "-1px" }}>Select Your Role</h1>
      <div style={{ display: "flex", gap: 20, maxWidth: 600, width: "100%", padding: "0 20px" }}>
        <div style={cardStyle} onClick={() => onSelectRole("freelancer")}
             onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
             onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
          <span style={{ fontSize: 48 }}>👩‍💻</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: "#0F172A" }}>I am a Freelancer</span>
          <span style={{ fontSize: 14, color: "#64748B" }}>Create gigs, browse jobs, and submit proposals.</span>
        </div>
        <div style={cardStyle} onClick={() => onSelectRole("client")}
             onMouseOver={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
             onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
          <span style={{ fontSize: 48 }}>🏢</span>
          <span style={{ fontWeight: 700, fontSize: 20, color: "#0F172A" }}>I am a Client</span>
          <span style={{ fontSize: 14, color: "#64748B" }}>Browse gigs, post jobs, and accept proposals.</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App — manages active screen + initializes the API service layer
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [screenParams, setScreenParams] = useState({});
  const [backendStatus, setBackendStatus] = useState("checking");
  const [role, setRole] = useState(null);

  // Initialize API layer health check on mount
  useEffect(() => {
    async function initApi() {
      // First try to restore existing token and role from session storage
      const stored = loadStoredToken();
      if (stored) {
        try {
          const payloadStr = atob(stored.split('.')[1]);
          const payload = JSON.parse(payloadStr);
          if (payload.role) setRole(payload.role);
        } catch(e) { /* ignore */ }
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

  const handleSelectRole = async (selectedRole) => {
    try {
      const devToken = await getDevToken(selectedRole);
      setAuthToken(devToken);
      setRole(selectedRole);
      setScreen("home");
    } catch (e) {
      console.warn("[API] Could not generate dev token:", e.message);
    }
  };

  const onNavigate = (key, params = {}) => {
    if (key === "switch_role") {
      setRole(null);
      setScreen("home");
      setScreenParams({});
      setAuthToken(null);
      return;
    }
    const target = ROUTE_ALIASES[key] || key;
    if (target in SCREENS || target === "home") {
      setScreen(target);
      setScreenParams(params);
    }
  };

  if (!role) {
    return <RoleSelection onSelectRole={handleSelectRole} />;
  }

  if (screen === "home") return <Home onNavigate={onNavigate} backendStatus={backendStatus} role={role} />;

  const Screen = SCREENS[screen];
  if (!Screen) return <Home onNavigate={onNavigate} backendStatus={backendStatus} role={role} />;

  return <Screen onNavigate={onNavigate} params={screenParams} role={role} />;
}
