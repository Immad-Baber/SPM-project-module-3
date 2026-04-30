import { C, Navbar, StickyNote, StatusBadge, Btn } from "./shared";

const MY_GIGS = [
  { id: 1, title: "React Website Development",  category: "Web Dev", status: "Live",  price: "PKR 5,000",  orders: 12, rating: "4.9 ⭐", thumb: "💻" },
  { id: 2, title: "Professional Logo Design",    category: "Design",  status: "Live",  price: "PKR 3,000",  orders: 4,  rating: "4.7 ⭐", thumb: "🎨" },
  { id: 3, title: "SEO Blog Posts & Articles",   category: "Writing", status: "Draft", price: "PKR 2,000",  orders: 0,  rating: "—",      thumb: "✍️" },
];

const RECENT_ORDERS = [
  { id: "#ORD-001", gig: "React Website Development", client: "Sara Ahmed",  pkg: "Standard", status: "In Progress", date: "Apr 18, 2026" },
  { id: "#ORD-002", gig: "Professional Logo Design",   client: "Bilal Hassan", pkg: "Basic",    status: "Completed",  date: "Apr 12, 2026" },
];

// ══════════════════════════════════════════════════════════════════════════════
// G03_MyGigs
// ══════════════════════════════════════════════════════════════════════════════
export default function MyGigs({ onNavigate }) {
  const STATS = [
    { label: "TOTAL GIGS",   value: "5",      color: C.textPrimary },
    { label: "LIVE",         value: "3",      color: C.green, dot: true },
    { label: "TOTAL ORDERS", value: "18",     color: C.textPrimary },
    { label: "AVG RATING",   value: "4.8 ⭐", color: C.textPrimary },
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
                        <Btn small onClick={() => onNavigate("edit")}>Edit</Btn>
                        <Btn small variant="outlined">{g.status === "Draft" ? "Publish" : "Pause"}</Btn>
                        <Btn small variant="ghost" onClick={() => onNavigate("detail")}>View</Btn>
                        {g.status === "Draft" && <Btn small variant="danger">Delete</Btn>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
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
                  {RECENT_ORDERS.map((o, i) => (
                    <tr key={o.id} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, color: C.black, fontFamily: "'DM Sans', sans-serif" }}>{o.id}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{o.gig}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.badgeBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{o.client[0]}</div>
                          <span style={{ fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{o.client}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{o.pkg}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          background: o.status === "Completed" ? C.greenBg : C.badgeBg,
                          color: o.status === "Completed" ? C.greenDark : C.badgeText,
                          padding: "4px 10px", borderRadius: 3, fontSize: 11, fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.4px", fontFamily: "'DM Sans', sans-serif",
                        }}>{o.status}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
