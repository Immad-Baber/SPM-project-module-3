import { useState } from "react";
import { C, Navbar, Sidebar, Btn, MilestoneBadge, MILESTONES } from "./fbs_shared";
import { useAcceptBid, useRejectBid, useWithdrawBid } from "../../hooks/useBids";

// ══════════════════════════════════════════════════════════════════════════════
// 11 - Accept / Reject Proposal
// ══════════════════════════════════════════════════════════════════════════════
export default function AcceptRejectProposal({ onNavigate }) {
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [decision, setDecision] = useState(null); // "accepted" | "rejected" | null
  // API hooks — demo IDs (in real flow come from navigation/context)
  const DEMO_BID_ID = "demo-bid-001";
  const DEMO_JOB_ID = "demo-job-001";
  const { acceptBid, loading: accepting, error: acceptError } = useAcceptBid();
  const { rejectBid, loading: rejecting, error: rejectError } = useRejectBid();
  const { withdrawBid, loading: withdrawing } = useWithdrawBid();

  const COVER_LETTER = "I am excited to apply for the Senior React Developer position at TechCorp Inc. With over 7 years of experience building enterprise-grade SaaS dashboards, I bring deep expertise in React, TypeScript, and complex data visualization using D3.js and Recharts.\n\nIn my most recent role at DataViz Corp, I led the front-end architecture of a real-time analytics platform serving 50,000+ daily users. I am confident I can deliver a world-class dashboard that exceeds your expectations.\n\nI am available to start immediately and would love to discuss your project in detail.";

  const TIMELINE = [
    { event: "Proposal submitted",  date: "Apr 20",  active: false },
    { event: "Client viewed",       date: "Apr 21",  active: false },
    { event: "Awaiting decision",   date: "Today",   active: true  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#FBF9FC" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar activeLink="proposals" onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activeItem="proposals" onNavigate={onNavigate} />

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <div style={{ maxWidth: 1100, display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Breadcrumb + Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span onClick={() => onNavigate("proposals")} style={{ fontSize: 11, color: "#747780", cursor: "pointer", textDecoration: "underline" }}>My Proposals</span>
                  <span style={{ color: "#747780", fontSize: 11 }}>›</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>Proposal Detail</span>
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Proposal Review</h1>
              </div>

              {/* Proposal Summary Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Job",            value: "Senior React Developer for SaaS Dashboard" },
                    { label: "Your Bid",       value: "$2,000", highlight: true },
                    { label: "Submitted",      value: "April 20, 2025" },
                    { label: "Current Status", value: "pending" },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: "#747780", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{label}</div>
                      {label === "Current Status" ? (
                        <span style={{ background: "#FAEEDA", color: "#633806", padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "'Inter', sans-serif" }}>Pending</span>
                      ) : (
                        <div style={{ fontSize: highlight ? 20 : 14, fontWeight: highlight ? 700 : 500, color: highlight ? C.tealDark : C.navy, fontFamily: "'Inter', sans-serif" }}>{value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Message */}
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Client Message</h3>
                <div style={{ background: C.bgSidebar, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 24, color: C.navy, flexShrink: 0, marginTop: -4 }}>"</span>
                  <p style={{ margin: 0, fontSize: 14, color: C.textBody, lineHeight: 1.65, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
                    Thank you for your proposal. We are currently reviewing all candidates and will make a decision by end of week. Your portfolio looks impressive — could you share more about your experience with real-time data streaming architectures?
                  </p>
                </div>
              </div>

              {/* Milestone Breakdown */}
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Milestone Breakdown</h3>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  {/* Header */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#F9FAFB", borderBottom: `1px solid ${C.border}` }}>
                    {["Milestone", "Due Date", "Amount", "Status"].map(h => (
                      <div key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif" }}>{h}</div>
                    ))}
                  </div>
                  {MILESTONES.map((m, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderTop: i > 0 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                      <div style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>{m.title}</div>
                      <div style={{ padding: "12px 16px", fontSize: 13, color: "#747780", fontFamily: "'Inter', sans-serif" }}>{m.due}</div>
                      <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>{m.budget}</div>
                      <div style={{ padding: "12px 16px" }}><MilestoneBadge status={m.status} /></div>
                    </div>
                  ))}
                  {/* Total */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderTop: `1px solid ${C.border}`, background: "#F9FAFB" }}>
                    <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>Total</div>
                    <div />
                    <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>$2,000</div>
                    <div />
                  </div>
                </div>
              </div>

              {/* Cover Letter Preview */}
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Your Cover Letter</h3>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <p style={{ margin: "0 0 10px", fontSize: 14, color: C.textBody, lineHeight: 1.65, fontFamily: "'Inter', sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: showFullLetter ? "unset" : 3, WebkitBoxOrient: "vertical" }}>
                    {COVER_LETTER}
                  </p>
                  <button onClick={() => setShowFullLetter(!showFullLetter)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.tealDark, fontFamily: "'Inter', sans-serif", padding: 0 }}>
                    {showFullLetter ? "Show less ↑" : "Show more ↓"}
                  </button>
                </div>
              </div>

              {/* Back link */}
              <div>
                <Btn variant="ghost" onClick={() => onNavigate("proposals")} style={{ fontSize: 14, color: "#747780" }}>← Back to My Proposals</Btn>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 20 }}>

              {/* Action Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: 20, borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Client Decision</h3>

                  {/* Status indicator */}
                  {!decision ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 8 }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⏳</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#633806", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>AWAITING REVIEW</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 8 }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: decision === "accepted" ? "#E1F5EE" : "#FCEBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                        {decision === "accepted" ? "✅" : "❌"}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: decision === "accepted" ? "#085041" : "#A32D2D", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                        {decision === "accepted" ? "PROPOSAL ACCEPTED" : "PROPOSAL REJECTED"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#747780", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Client Actions Available:</p>

                  <button
                    onClick={async () => {
                      const ok = await acceptBid(DEMO_BID_ID, DEMO_JOB_ID);
                      if (ok) setDecision("accepted");
                    }}
                    disabled={accepting || rejecting || decision === "rejected"}
                    style={{
                      width: "100%", height: 44, background: C.teal,
                      border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      color: C.navy, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      opacity: (decision === "rejected" || rejecting) ? 0.5 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {accepting ? "Accepting…" : "✓ Accept Proposal"}
                  </button>

                  <button
                    onClick={async () => {
                      const ok = await rejectBid(DEMO_BID_ID);
                      if (ok) setDecision("rejected");
                    }}
                    disabled={accepting || rejecting || decision === "accepted"}
                    style={{
                      width: "100%", height: 44, background: "transparent",
                      border: "2px solid #DC2626", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      color: "#DC2626", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      opacity: (decision === "accepted" || accepting) ? 0.5 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {rejecting ? "Rejecting…" : "✕ Reject Proposal"}
                  </button>

                  <button style={{
                    width: "100%", height: 40, background: "transparent",
                    border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500,
                    color: "#747780", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  }}>
                    ↩ Request Revision
                  </button>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {(acceptError || rejectError) && (
                      <span style={{ fontSize: 11, color: "#DC2626", fontFamily: "'Inter', sans-serif" }}>
                        {acceptError || rejectError}
                      </span>
                    )}
                    <button
                      onClick={async () => {
                        await withdrawBid(DEMO_BID_ID);
                        onNavigate("myproposals");
                      }}
                      disabled={withdrawing}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#DC2626", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
                    >
                      {withdrawing ? "Withdrawing…" : "Withdraw Proposal"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div style={{ background: "#F9F9FF", border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Activity Log</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {TIMELINE.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < TIMELINE.length - 1 ? 16 : 0 }}>
                      {/* Dot */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.active ? C.tealDark : C.border, border: item.active ? `2px solid ${C.tealDark}` : `2px solid ${C.border}`, flexShrink: 0, marginTop: 4 }} />
                        {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 20 }} />}
                      </div>
                      {/* Content */}
                      <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 4 : 0 }}>
                        <div style={{ fontSize: 13, fontWeight: item.active ? 700 : 500, color: item.active ? C.navy : C.textBody, fontFamily: "'Inter', sans-serif" }}>{item.event}</div>
                        <div style={{ fontSize: 11, color: "#747780", fontFamily: "'Inter', sans-serif", marginTop: 2 }}>{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
