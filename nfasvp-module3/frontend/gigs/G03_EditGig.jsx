import { useState } from "react";
import { C, Navbar, StickyNote, Btn } from "./shared";

// ══════════════════════════════════════════════════════════════════════════════
// G03_EditGig
// ══════════════════════════════════════════════════════════════════════════════
export default function EditGig({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("Basic");

  const fieldStyle = {
    width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`,
    borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white,
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: "#5E6367", letterSpacing: "0.8px",
    textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 6,
  };

  const PREFILLED = {
    title: "I will build your professional React website",
    category: "Web Development",
    skills: ["React", "Node.js", "CSS"],
    pricing: { Basic: "5000", Standard: "10000", Premium: "18000" },
    days:    { Basic: "3 Days", Standard: "5 Days", Premium: "10 Days" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Left Sidebar (side nav) ── */}
        <aside style={{ width: 230, flexShrink: 0, background: C.white, borderRight: "1px solid #E2E8F0", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, background: C.black, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 900, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>GM</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 14, color: "#0F172A", fontFamily: "'DM Sans', sans-serif" }}>GigMarket</div>
              <div style={{ fontSize: 9, color: "#64748B", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", textTransform: "uppercase" }}>Pro Freelancing</div>
            </div>
          </div>

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

          <div style={{ paddingTop: 12 }}>
            <Btn style={{ width: "100%", justifyContent: "center", fontSize: 13 }} onClick={() => onNavigate("create")}>+ New Gig</Btn>
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", cursor: "pointer", color: "#475569", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              <span>⚙️</span><span>Settings</span>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Header Area */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.8px" }}>Edit Gig</h1>
                {/* Live status badge */}
                <span style={{ background: C.greenBg, borderRadius: 12, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: C.greenDark, display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />LIVE
                </span>
              </div>
              <span style={{ fontSize: 13, color: "#5E6367", fontFamily: "'DM Sans', sans-serif" }}>Last updated: Apr 25, 2026</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outlined" onClick={() => onNavigate("mygigs")}>Discard Changes</Btn>
              <Btn onClick={() => onNavigate("mygigs")}>Save Changes</Btn>
            </div>
          </div>

          {/* Bento Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 256px", gap: 18, alignItems: "start" }}>

            {/* ── Main Form Sections ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Section — Title & Category */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>GIG TITLE</label>
                  <input defaultValue={PREFILLED.title} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select style={{ ...fieldStyle }}>
                    <option>{PREFILLED.category}</option>
                    {["Graphic Design", "Content Writing", "Mobile Apps"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Section — Thumbnail */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={labelStyle}>GIG THUMBNAIL</label>
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", position: "relative", height: 200 }}>
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#E8F4FD,#DBEAFE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>💻</div>
                  <button style={{ position: "absolute", bottom: 12, right: 12, background: C.white, border: `1px solid ${C.border}`, borderRadius: 4, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    ↑ Replace Image
                  </button>
                </div>
              </div>

              {/* Section — Portfolio Previews */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
                <label style={labelStyle}>PORTFOLIO PREVIEWS</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {["#E8F4FD","#FEF3C7","#F0FDF4"].map((bg, i) => (
                    <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 6, height: 120, position: "relative", overflow: "hidden", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                      🖼️
                      {/* Delete X button */}
                      <button style={{ position: "absolute", top: 5, right: 5, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 10, color: C.red, fontWeight: 700, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sidebar Form Sections ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Section — Skills */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={labelStyle}>REQUIRED SKILLS</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {PREFILLED.skills.map(tag => (
                    <span key={tag} style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 4, padding: "4px 8px", fontSize: 13, color: C.textPrimary, display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans', sans-serif" }}>
                      {tag}
                      <span style={{ cursor: "pointer", color: C.textPrimary, fontSize: 9, fontWeight: 700 }}>✕</span>
                    </span>
                  ))}
                </div>
                <input placeholder="Add skill..." style={{ padding: "6px 8px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: C.textPrimary }} />
              </div>

              {/* Section — Pricing */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={labelStyle}>PRICING (BASIC)</label>

                {/* Tab switcher */}
                <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 4, padding: 3 }}>
                  {["Basic", "Standard", "Premium"].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} style={{
                      flex: 1, padding: "6px 0", border: "none", cursor: "pointer", borderRadius: 3,
                      background: activeTab === t ? C.white : "transparent",
                      fontWeight: activeTab === t ? 700 : 500, fontSize: 11,
                      color: activeTab === t ? C.black : "#64748B",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{t}</button>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 4 }}>PRICE (PKR)</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>₨</span>
                      <input defaultValue={PREFILLED.pricing[activeTab]} style={{ ...fieldStyle, paddingLeft: 28 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 4 }}>DELIVERY TIME</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input defaultValue={activeTab === "Basic" ? "3" : activeTab === "Standard" ? "5" : "10"} style={{ width: 60, padding: "10px 10px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
                      <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section — Danger Zone */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "rgba(255,218,214,0.2)", borderLeft: `4px solid ${C.red}`, borderRadius: "0 4px 4px 0", padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, color: C.red, flexShrink: 0 }}>⚠</span>
                    <p style={{ margin: 0, fontSize: 12, color: C.redDark, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                      Deleting this gig will permanently remove it from the marketplace and all active orders may be affected.
                    </p>
                  </div>
                </div>
                <Btn variant="danger" style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}>
                  🗑 Delete Gig
                </Btn>
                <StickyNote text="🔗 Delete Gig → Removes listing from G03_BrowseGigs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
