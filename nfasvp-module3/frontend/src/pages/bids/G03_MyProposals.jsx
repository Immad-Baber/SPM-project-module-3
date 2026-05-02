import { useState, useMemo } from "react";
import { C, Navbar, Sidebar, StatusBadge, Btn } from "./fbs_shared";
import { useMyProposals } from "../../hooks/useBids";

// ══════════════════════════════════════════════════════════════════════════════
// 10 - My Proposals
// ══════════════════════════════════════════════════════════════════════════════
export default function MyProposals({ onNavigate, role }) {
  const [activeTab, setActiveTab] = useState("All");
  const TABS = ["All", "Pending", "Accepted", "Rejected", "Withdrawn"];

  const apiStatusFilter = activeTab === "All" ? "" : activeTab.toLowerCase();
  const { bids, loading, error, meta } = useMyProposals(apiStatusFilter ? { status: apiStatusFilter } : {});

  const mappedProposals = useMemo(() => {
    if (!bids) return [];
    return bids.map(b => ({
      id: b.id,
      job: b.job?.title || "Unknown Job",
      client: `Client ${b.job?.client_id?.substring(0,4) || ''}`,
      amount: `$${b.bid_amount}`,
      date: new Date(b.submitted_at || b.created_at).toLocaleDateString(),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
    }));
  }, [bids]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter', sans-serif", background: C.white }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar activeLink="proposals" onNavigate={onNavigate} role={role} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activeItem="myproposals" onNavigate={onNavigate} role={role} />

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Header */}
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 32, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.8px" }}>My Proposals</h1>
            <p style={{ margin: 0, fontSize: 16, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>Review and track all your active submitted job bids</p>
          </div>

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {[
              { label: "Total Submitted", value: meta?.total || 0, color: C.navy },
              { label: "Pending Review",  value: "-",  color: "#D97706" },
              { label: "Accepted",        value: "-",  color: "#0D9488" },
              { label: "Rejected",        value: "-",  color: "#DC2626" },
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
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.border}` }}>
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
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
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
                    <Btn variant="outlined" small onClick={() => onNavigate("review", { bidId: p.id })} style={{ height: 36, padding: "0 24px", fontSize: 12, borderWidth: 2 }}>View</Btn>
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

          {/* Footer CTA */}
          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 64px" }}>
            <Btn style={{ height: 56, padding: "0 48px", fontSize: 16, borderRadius: 12, gap: 12 }} onClick={() => onNavigate("browsejobs")}>
              🔍 Browse More Jobs
            </Btn>
          </div>
        </main>
      </div>
    </div>
  );
}
