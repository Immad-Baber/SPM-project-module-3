import { C, Navbar, StickyNote, StatusBadge, Btn } from "./shared";
import { useMyGigs } from "../../hooks/useGigs";

// ══════════════════════════════════════════════════════════════════════════════
// G03_MyGigs
// ══════════════════════════════════════════════════════════════════════════════
export default function MyGigs({ onNavigate }) {
  const { gigs: apiGigs, loading, error, meta } = useMyGigs();

  // Map API response to table row format
  const MY_GIGS = apiGigs.map(g => {
    const tier = g.pricing_tiers?.[0] || {};
    return {
      id: g.id,
      title: g.title,
      category: g.category?.name || "General",
      status: g.is_active ? "Live" : "Draft",
      price: tier.price ? `PKR ${tier.price}` : "—",
      orders: 0, // order counts not in gig list endpoint
      rating: g.avg_rating ? `${g.avg_rating} ⭐` : "—",
      thumb: "💻",
    };
  });

  const STATS = [
    { label: "TOTAL GIGS",   value: meta?.total ?? MY_GIGS.length, color: C.textPrimary },
    { label: "LIVE",         value: MY_GIGS.filter(g => g.status === "Live").length, color: C.green, dot: true },
    { label: "TOTAL ORDERS", value: "—",     color: C.textPrimary },
    { label: "AVG RATING",   value: "—", color: C.textPrimary },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 232, flexShrink: 0, background: C.white, borderRight: "1px solid #E2E8F0", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0F172A", fontFamily: "'DM Sans', sans-serif" }}>GigMarket</div>
            <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Pro Freelancing</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { icon: "🏠", label: "Dashboard",  active: false },
              { icon: "📋", label: "My Gigs",    active: true  },
              { icon: "📦", label: "Orders",     active: false },
              { icon: "💬", label: "Messages",   active: false },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                borderRadius: 5, cursor: "pointer",
                background: item.active ? "#F1F5F9" : "transparent",
                fontWeight: item.active ? 700 : 400,
                color: item.active ? "#0F172A" : "#475569",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12, marginTop: 8 }}>
            <Btn style={{ width: "100%", justifyContent: "center", fontSize: 13 }} onClick={() => onNavigate("create")}>+ New Gig</Btn>
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", cursor: "pointer", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              <span>⚙️</span><span>Settings</span>
            </div>
          </div>
        </aside>

        {/* ── Main Canvas ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "#F6F3F5", display: "flex", flexDirection: "column", gap: 20 }}>

          <StickyNote text="🔗 Client column → Links to G01 – Profile Management · In Progress status → Links to G07 – Payment & Escrow" />

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 800, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.8px" }}>My Gigs</h1>
              <p style={{ margin: 0, fontSize: 13, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Manage your freelance service listings</p>
            </div>
            <Btn onClick={() => onNavigate("create")}>+ Create New Gig</Btn>
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: "'DM Sans', sans-serif" }}>{s.value}</span>
                  {s.dot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, display: "inline-block" }} />}
                </div>
              </div>
            ))}
          </div>

          {/* Filter + Gigs Table */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            {/* Filter Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(246,243,245,0.4)", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ position: "relative", width: 300 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 14 }}>🔍</span>
                <input placeholder="Search gigs..." style={{ width: "100%", padding: "8px 12px 8px 36px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <select style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <option>All Status</option><option>Live</option><option>Draft</option><option>Paused</option>
                </select>
                <select style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <option>Sort: Newest</option><option>Sort: Oldest</option><option>Sort: Top Rated</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(246,243,245,0.5)" }}>
                  {["Gig Title", "Category", "Status", "Price", "Orders", "Rating", "Actions"].map((h, i) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: i === 6 ? "right" : "left", fontSize: 11, fontWeight: 700, color: C.textPrimary, letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              {loading ? (
                <tbody><tr><td colSpan={7} style={{ padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>Loading gigs…</td></tr></tbody>
              ) : error ? (
                <tbody><tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "red", fontFamily: "'DM Sans', sans-serif" }}>Error: {error}</td></tr></tbody>
              ) : MY_GIGS.length === 0 ? (
                <tbody><tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>No gigs yet. Create your first gig!</td></tr></tbody>
              ) : (
              <tbody>
                {MY_GIGS.map((g, idx) => (
                  <tr key={g.id} style={{ background: idx % 2 === 1 ? "rgba(246,243,245,0.2)" : C.white, borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 4, background: "#F1F5F9", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{g.thumb}</div>
                        <span style={{ fontWeight: 600, fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{g.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{g.category}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={g.status} /></td>
                    <td style={{ padding: "14px 16px", fontWeight: 600, fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{g.price}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{g.orders}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{g.rating}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Btn small onClick={() => onNavigate("edit", { id: g.id })}>Edit</Btn>
                        <Btn small variant="outlined">{g.status === "Draft" ? "Publish" : "Pause"}</Btn>
                        <Btn small variant="ghost" onClick={() => onNavigate("detail", { id: g.id })}>View</Btn>
                        {g.status === "Draft" && <Btn small variant="danger">Delete</Btn>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              )}
            </table>
          </div>

          {/* Recent Orders */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Recent Orders</h2>
              <StickyNote text="🔗 In Progress → Links to G07 – Payment & Escrow · Client → Links to G01 – Profile Management" />
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(246,243,245,0.5)" }}>
                    {["Order ID", "Gig Title", "Client", "Package", "Status", "Date"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textPrimary, letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[].length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: C.textMuted, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                        No recent orders. Orders will appear here once clients purchase your gigs.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
