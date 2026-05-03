import { useState } from "react";
import { C, Navbar, StickyNote, Btn } from "../gigs/shared";
import { useMyProjects } from "../../hooks/useProjects";

// ─── PROJECT STATUS CARD ────────────────────────────────────────────────────
function ProjectCard({ project, onNavigate, role }) {
  const [hovered, setHovered] = useState(false);
  
  const statusColors = {
    pending:   { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
    active:    { bg: "#DBEAFE", text: "#1E40AF", label: "In Progress" },
    completed: { bg: "#D1FAE5", text: "#065F46", label: "Completed" },
    cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
  };
  const st = statusColors[project.status] || statusColors.pending;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        transform: hovered ? "translateY(-1px)" : "none",
        cursor: "pointer"
      }}
      onClick={() => onNavigate("projectdetail", { id: project.id })}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 50, height: 50, background: "#F1F5F9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
          {project.type === 'gig' ? '💼' : '🛠️'}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
            {project.title || `Project #${project.id.substring(0, 8)}`}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>{role === 'client' ? 'Freelancer:' : 'Client:'} {project.partner_name || 'User'}</span>
            <span style={{ color: C.border }}>•</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.black }}>PKR {project.total_budget || project.amount || '0'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          background: st.bg, color: st.text, padding: "4px 12px", borderRadius: 20,
          fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          {st.label}
        </div>
        <Btn small variant="ghost">View Details →</Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// G03_ProjectStatus (Screen 21)
// ══════════════════════════════════════════════════════════════════════════════
export default function ProjectStatus({ onNavigate, role }) {
  const [activeTab, setActiveTab] = useState("all");
  const { projects, loading, error } = useMyProjects({ status: activeTab === 'all' ? null : activeTab });

  const tabs = [
    { id: "all", label: "All Projects" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Awaiting Start" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} role={role} />

      <main style={{ flex: 1, overflowY: "auto", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* Header */}
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.black, letterSpacing: "-1px" }}>
              My Projects
            </h1>
            <p style={{ margin: "4px 0 0", color: C.textSecondary, fontSize: 16 }}>
              Track progress, manage milestones, and communicate with your project partners.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, gap: 32 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: "none", border: "none", padding: "0 0 12px", cursor: "pointer",
                  fontSize: 15, fontWeight: activeTab === t.id ? 700 : 500,
                  color: activeTab === t.id ? C.black : C.textMuted,
                  borderBottom: activeTab === t.id ? `2px solid ${C.black}` : "2px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Project List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: C.textMuted }}>Loading projects...</div>
            ) : error ? (
              <div style={{ padding: 60, textAlign: "center", color: "red" }}>Error: {error}</div>
            ) : projects.length === 0 ? (
              <div style={{ padding: 80, textAlign: "center", background: C.white, border: `1px dashed ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 48 }}>📁</div>
                <h3 style={{ margin: 0, color: C.textPrimary }}>No projects found</h3>
                <p style={{ margin: 0, color: C.textMuted, maxWidth: 300 }}>You don't have any projects in this category yet. Start by browsing gigs or jobs.</p>
                <Btn onClick={() => onNavigate(role === 'client' ? 'browse' : 'browsejobs')} variant="outlined">
                  Explore Marketplace
                </Btn>
              </div>
            ) : (
              projects.map(p => <ProjectCard key={p.id} project={p} onNavigate={onNavigate} role={role} />)
            )}
          </div>

          <div style={{ marginTop: 20 }}>
            <StickyNote text="🔗 Project Card → G03_ProjectDetail · Status Management → Handled via StatusManagementService backend." />
          </div>

        </div>
      </main>
    </div>
  );
}
