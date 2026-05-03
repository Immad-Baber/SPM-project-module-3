import { useState } from "react";
import { C, Navbar, Sidebar, Btn, MilestoneBadge, MILESTONES } from "./fbs_shared";
import { useAcceptBid, useRejectBid, useWithdrawBid, useBid } from "../../hooks/useBids";

// ══════════════════════════════════════════════════════════════════════════════
// 11 - Accept / Reject Proposal
// ══════════════════════════════════════════════════════════════════════════════
export default function AcceptRejectProposal({ onNavigate, params, role }) {
  const [showFullLetter, setShowFullLetter] = useState(false);
  const [decision, setDecision] = useState(null); // "accepted" | "rejected" | null

  const bidId = params?.bidId;
  const jobId = params?.jobId;

  const { bid, loading: bidLoading, error: bidError } = useBid(bidId);
  const { acceptBid, loading: accepting, error: acceptError } = useAcceptBid();
  const { rejectBid, loading: rejecting, error: rejectError } = useRejectBid();
  const { withdrawBid, loading: withdrawing } = useWithdrawBid();

  if (bidLoading) return <div style={{ padding: 60, textAlign: "center" }}>Loading proposal...</div>;
  if (bidError || !bid) return <div style={{ padding: 60, textAlign: "center", color: "red" }}>Error: {bidError || "Proposal not found"}</div>;

  const TIMELINE = [
    { event: "Proposal submitted",  date: new Date(bid.submitted_at).toLocaleDateString(),  active: false },
    { event: "Client viewed",       date: "Recent",  active: false },
    { event: "Awaiting decision",   date: "Today",   active: bid.status === 'pending'  },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter', sans-serif", background: "#FBF9FC" }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar activeLink="proposals" onNavigate={onNavigate} role={role} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activeItem="proposals" onNavigate={onNavigate} role={role} />

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          <div style={{ maxWidth: 1100, display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Breadcrumb + Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span onClick={() => onNavigate("jobproposals", { jobId })} style={{ fontSize: 11, color: "#747780", cursor: "pointer", textDecoration: "underline" }}>Proposals List</span>
                  <span style={{ color: "#747780", fontSize: 11 }}>›</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy }}>Proposal Review</span>
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Proposal Review</h1>
              </div>

              {/* Proposal Summary Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { label: "Job",            value: bid.job?.title || "Project Proposal" },
                    { label: "Bid Amount",     value: `$${bid.bid_amount}`, highlight: true },
                    { label: "Submitted",      value: new Date(bid.submitted_at).toLocaleDateString() },
                    { label: "Current Status", value: decision || bid.status },
                  ].map(({ label, value, highlight }) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: "#747780", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{label}</div>
                      {label === "Current Status" ? (
                        <span style={{ 
                          background: value === 'accepted' ? "#E1F5EE" : value === 'rejected' ? "#FCEBEB" : "#FAEEDA", 
                          color: value === 'accepted' ? "#085041" : value === 'rejected' ? "#A32D2D" : "#633806", 
                          padding: "4px 12px", borderRadius: 4, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "'Inter', sans-serif" 
                        }}>
                          {value}
                        </span>
                      ) : (
                        <div style={{ fontSize: highlight ? 20 : 14, fontWeight: highlight ? 700 : 500, color: highlight ? C.tealDark : C.navy, fontFamily: "'Inter', sans-serif" }}>{value}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Breakdown */}
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Milestone Breakdown</h3>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#F9FAFB", borderBottom: `1px solid ${C.border}` }}>
                    {["Milestone", "Due Date", "Amount", "Status"].map(h => (
                      <div key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: "0.6px", fontFamily: "'Inter', sans-serif" }}>{h}</div>
                    ))}
                  </div>
                  {(Array.isArray(bid.milestones) && bid.milestones.length > 0 ? bid.milestones : MILESTONES).map((m, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderTop: i > 0 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
                      <div style={{ padding: "12px 16px", fontWeight: 600, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>{m.title}</div>
                      <div style={{ padding: "12px 16px", fontSize: 13, color: "#747780", fontFamily: "'Inter', sans-serif" }}>{m.due}</div>
                      <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14, color: C.navy, fontFamily: "'Inter', sans-serif" }}>{m.budget}</div>
                      <div style={{ padding: "12px 16px" }}><MilestoneBadge status={m.status} /></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Freelancer's Cover Letter</h3>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                  <p style={{ margin: "0 0 10px", fontSize: 14, color: C.textBody, lineHeight: 1.65, fontFamily: "'Inter', sans-serif", whiteSpace: "pre-wrap" }}>
                    {bid.cover_letter}
                  </p>
                </div>
              </div>

              {/* Back link */}
              <div>
                <Btn variant="ghost" onClick={() => onNavigate("jobproposals", { jobId })} style={{ fontSize: 14, color: "#747780" }}>← Back to Proposals List</Btn>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 20 }}>

              {/* Action Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: 20, borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Decision</h3>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: 8 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: (decision || bid.status) === "accepted" ? "#E1F5EE" : (decision || bid.status) === "rejected" ? "#FCEBEB" : "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                      {(decision || bid.status) === "accepted" ? "✅" : (decision || bid.status) === "rejected" ? "❌" : "⏳"}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: (decision || bid.status) === "accepted" ? "#085041" : (decision || bid.status) === "rejected" ? "#A32D2D" : "#633806", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>
                      {decision || bid.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "#747780", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Available Actions:</p>

                  <button
                    onClick={async () => {
                      const ok = await acceptBid(bidId, jobId);
                      if (ok) setDecision("accepted");
                    }}
                    disabled={accepting || rejecting || (decision || bid.status) !== "pending"}
                    style={{
                      width: "100%", height: 44, background: C.teal,
                      border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      color: C.navy, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      opacity: ((decision || bid.status) !== "pending" || rejecting) ? 0.5 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {accepting ? "Accepting…" : "✓ Accept Proposal"}
                  </button>

                  <button
                    onClick={async () => {
                      const ok = await rejectBid(bidId);
                      if (ok) setDecision("rejected");
                    }}
                    disabled={accepting || rejecting || (decision || bid.status) !== "pending"}
                    style={{
                      width: "100%", height: 44, background: "transparent",
                      border: "2px solid #DC2626", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      color: "#DC2626", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      opacity: ((decision || bid.status) !== "pending" || accepting) ? 0.5 : 1,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {rejecting ? "Rejecting…" : "✕ Reject Proposal"}
                  </button>

                  {(acceptError || rejectError) && (
                    <div style={{ marginTop: 8, fontSize: 11, color: "#DC2626", fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
                      {acceptError || rejectError}
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div style={{ background: "#F9F9FF", border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: "'Manrope', sans-serif" }}>Activity Log</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {TIMELINE.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, position: "relative", paddingBottom: i < TIMELINE.length - 1 ? 16 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.active ? C.tealDark : C.border, border: item.active ? `2px solid ${C.tealDark}` : `2px solid ${C.border}`, flexShrink: 0, marginTop: 4 }} />
                        {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, minHeight: 20 }} />}
                      </div>
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
