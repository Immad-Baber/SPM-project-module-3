import { useState, useMemo } from "react";
import { C, Navbar, Sidebar, StatusBadge, Btn } from "./fbs_shared";
import { useMyProposals } from "../../hooks/useBids";

// ══════════════════════════════════════════════════════════════════════════════
// 10 - My Proposals
// ══════════════════════════════════════════════════════════════════════════════
export default function MyProposals({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("All");
  const TABS = ["All", "Pending", "Accepted", "Rejected", "Withdrawn"];

  const STATS = [
    { label: "Total Submitted", value: "12", color: C.navy },
    { label: "Pending Review", value: "5", color: "#D97706" },
    { label: "Accepted", value: "4", color: "#0D9488" },
    { label: "Rejected", value: "3", color: "#DC2626" },
  ];

  const apiStatusFilter = activeTab === "All" ? "" : activeTab.toLowerCase();
  const { bids, loading, error, meta } = useMyProposals(apiStatusFilter ? { status: apiStatusFilter } : {});

  const mappedProposals = useMemo(() => {
    if (!bids) return [];
    return bids.map(b => ({
      id: b.id,
      job: b.job?.title || "Unknown Job",
      client: `Client ${b.job?.client_id?.substring(0, 4) || ''}`,
      amount: `PKR ${b.bid_amount}`,
      date: new Date(b.submitted_at || b.created_at).toLocaleDateString(),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
    }));
  }, [bids]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter', sans-serif", background: C.white }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar activeLink="proposals" onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: 240, flexShrink: 0, background: C.bgSidebar, borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", padding: "32px 0", boxSizing: "border-box",
        }}>
          {/* Logo + CTA */}
          <div style={{ padding: "0 24px", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: C.tealText, fontSize: 18 }}>⚡</span>
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>Nexus Pro</div>
                <div style={{ fontSize: 11, color: "#747780", fontFamily: "'Inter', sans-serif" }}>Alex Sterling</div>
              </div>
            </div>
            <Btn style={{ width: "100%", height: 36, fontSize: 12, justifyContent: "center", borderRadius: 8 }} onClick={() => onNavigate("browse")}>
              + Browse Jobs
            </Btn>
          </div>

          {/* Nav Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {[
              { icon: "🏠", label: "Overview", key: "overview" },
              { icon: "🔍", label: "Browse Jobs", key: "browse" },
              { icon: "📋", label: "My Proposals", key: "proposals" },
              { icon: "💬", label: "Messages", key: "messages" },
              { icon: "📊", label: "Analytics", key: "analytics" },
              { icon: "⚙️", label: "Settings", key: "settings" },
            ].map(item => {
              const isActive = item.key === "proposals";
              return (
                <div key={item.key} onClick={() => onNavigate(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 24px", cursor: "pointer",
                    background: isActive ? C.white : "transparent",
                    borderLeft: isActive ? `4px solid ${C.tealDark}` : "4px solid transparent",
                    boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontWeight: isActive ? 700 : 500, fontSize: 13, color: isActive ? C.navy : "#747780", fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Header */}
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.8px" }}>My Proposals</h1>
            <p style={{ margin: 0, fontSize: 16, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>Review and track all your active submitted job bids</p>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
            {[
              { label: "Total Submitted", value: meta?.total || 0, color: C.navy },
              { label: "Pending Review", value: "-", color: "#D97706" }, // To get actual grouped counts, you'd need an aggregate endpoint
              { label: "Accepted", value: "-", color: "#0D9488" },
              { label: "Rejected", value: "-", color: "#DC2626" },
            ].map(s => (
              <div key={s.label} style={{
                background: C.bgSidebar, border: "1px solid rgba(196,198,208,0.4)",
                borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 8,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}>
                <span style={{ fontWeight: 600, fontSize: 16, color: "#747780", fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
                <span style={{ fontWeight: 600, fontSize: 36, color: s.color, fontFamily: "'Manrope', sans-serif", lineHeight: 1 }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}`, overflowX: "auto", paddingBottom: 1, flexShrink: 0 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "16px 32px", border: "none", cursor: "pointer",
                background: activeTab === tab ? "rgba(240,243,255,0.5)" : "transparent",
                fontFamily: "'Inter', sans-serif", fontSize: 16,
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? C.navy : "#747780",
                borderBottom: activeTab === tab ? `2px solid ${C.tealDark}` : "2px solid transparent",
                marginBottom: -1,
              }}>{tab}</button>
            ))}
          </div>

          {/* Proposals Table */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflowX: "auto", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", flexShrink: 0 }}>
            <div style={{ minWidth: 900 }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.3fr 1.3fr 1fr", background: "#EFEDF0" }}>
                {["JOB TITLE", "CLIENT", "BID AMOUNT", "SUBMITTED", "STATUS", "ACTION"].map((h, i) => (
                  <div key={h} style={{ padding: "27px 32px", fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: "1.1px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", textAlign: i === 5 ? "right" : "left" }}>{h}</div>
                ))}
              </div>

            {/* Rows */}
            {loading ? (
              <div style={{ padding: 40, textAlign: "center" }}>Loading proposals...</div>
            ) : error ? (
              <div style={{ padding: 40, textAlign: "center", color: "red" }}>Error: {error}</div>
            ) : (
              mappedProposals.map((p, idx) => (
                <div key={p.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1.3fr 1.3fr 1fr",
                  background: idx % 2 === 0 ? C.white : C.bgPage,
                  borderTop: `1px solid ${C.border}`,
                  alignItems: "center",
                }}>
                  <div style={{ padding: "24px 32px" }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: C.navy, fontFamily: "'Inter', sans-serif", display: "block", lineHeight: 1.3 }}>{p.job}</span>
                  </div>
                  <div style={{ padding: "24px 32px" }}>
                    <span style={{ fontWeight: 500, fontSize: 16, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>{p.client}</span>
                  </div>
                  <div style={{ padding: "24px 32px" }}>
                    <span style={{ fontWeight: 900, fontSize: 16, color: C.navy, fontFamily: "'Inter', sans-serif" }}>{p.amount}</span>
                  </div>
                  <div style={{ padding: "24px 32px" }}>
                    <span style={{ fontSize: 16, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>{p.date}</span>
                  </div>
                  <div style={{ padding: "24px 32px" }}>
                    <StatusBadge status={p.status} />
                  </div>
                  <div style={{ padding: "24px 32px", display: "flex", justifyContent: "flex-end" }}>
                    <Btn variant="outlined" small onClick={() => onNavigate("review")} style={{ height: 36, padding: "0 24px", fontSize: 12, borderWidth: 2 }}>View</Btn>
                  </div>
                </div>
              ))
            )}

            {!loading && !error && mappedProposals.length === 0 && (
              <div style={{ padding: 40, textAlign: "center", color: "#747780", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
                No proposals found for this filter.
              </div>
            )}
            </div>
          </div>

          {/* Footer CTA */}
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 64px" }}>
            <Btn style={{ height: 56, padding: "0 48px", fontSize: 16, borderRadius: 12, gap: 12 }} onClick={() => onNavigate("browse")}>
              🔍 Browse More Jobs
            </Btn>
          </div>
        </main>
      </div>
    </div>
  );
}
