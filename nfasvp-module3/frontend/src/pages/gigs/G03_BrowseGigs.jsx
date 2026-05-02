import { useState, useMemo } from "react";
import { C, Navbar, StickyNote, VerifiedBadge, Stars, Btn } from "./shared";
import { useGigs } from "../../hooks/useGigs";

// ─── GIG CARD ────────────────────────────────────────────────────────────────
function GigCard({ gig, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onNavigate("detail", { id: gig.id })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 6,
        overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 140, background: gig.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 44 }}>{gig.icon}</span>
      </div>

      {/* Body */}
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {/* Freelancer row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: C.navBg, color: C.white,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0,
          }}>
            {gig.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{gig.name}</div>
            <Stars rating={gig.rating} count={gig.reviews} />
          </div>
        </div>

        {/* Title */}
        <p style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
          {gig.title}
        </p>

        {/* Tags + Badge */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {gig.tags.map(t => (
            <span key={t} style={{
              background: C.badgeBg, borderRadius: 3, padding: "2px 7px",
              fontSize: 9, fontWeight: 700, color: C.badgeText,
              textTransform: "uppercase", letterSpacing: "0.3px", fontFamily: "'DM Sans', sans-serif",
            }}>{t}</span>
          ))}
          <VerifiedBadge />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 4 }}>
          <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>⏱ {gig.delivery}</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{gig.price}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// G03_BrowseGigs
// ══════════════════════════════════════════════════════════════════════════════
export default function BrowseGigs({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [delivery, setDelivery] = useState("");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => {
    const f = {};
    if (activeFilter !== "All") f.category_id = activeFilter; // Not real category ID, but just for demo
    if (budgetMin) f.min_price = budgetMin;
    if (budgetMax) f.max_price = budgetMax;
    return f;
  }, [activeFilter, budgetMin, budgetMax]);

  const { gigs, loading, error, meta } = useGigs(filters);

  const FILTERS = ["All", "Web Dev", "Design", "Writing", "Marketing", "Data", "Video"];

  // Map API gig format to the UI card format
  const mappedGigs = useMemo(() => {
    if (!gigs) return [];
    return gigs.map(g => {
      const basicTier = g.pricing_tiers?.[0] || {};
      return {
        id: g.id,
        name: `Freelancer ${g.freelancer_id?.substring(0, 4) || ''}`, // Mocks name since we don't fetch users
        rating: g.avg_rating || "0.0",
        reviews: g.review_count || "0",
        title: g.title,
        tags: Array.isArray(g.required_skills) ? g.required_skills.map(s => {
          if (typeof s === 'string') return s;
          if (s && typeof s.name === 'string') return s.name;
          if (s && typeof s.tag === 'string') return s.tag;
          return 'Skill';
        }).slice(0, 2) : ["Skill"],
        price: `PKR ${basicTier.price || 'N/A'}`,
        delivery: `${basicTier.delivery_days || '?'} days`,
        color: "#E8F4FD", 
        icon: "💻"
      };
    });
  }, [gigs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: 240, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.border}`,
          padding: "24px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20,
        }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Filters</h3>
            <p style={{ margin: 0, fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Refine your search</p>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 6 }}>CATEGORY</label>
            <select style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
              <option>Select Category</option>
              {["Web Development", "Graphic Design", "Content Writing", "Mobile Apps", "Data & Analytics"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 6 }}>BUDGET RANGE (PKR)</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ ph: "Min", val: budgetMin, set: setBudgetMin }, { ph: "Max", val: budgetMax, set: setBudgetMax }].map(({ ph, val, set }) => (
                <input key={ph} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                  style={{ flex: 1, padding: "10px 8px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif" }} />
              ))}
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>DELIVERY TIME</label>
            {["Any", "Up to 1 day", "Up to 3 days", "Up to 7 days"].map(d => (
              <label key={d} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                <input type="radio" name="delivery" value={d} checked={delivery === d} onChange={() => setDelivery(d)} style={{ accentColor: C.black }} />
                <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
              </label>
            ))}
          </div>

          {/* Seller Rating */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 8 }}>SELLER RATING</label>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 20, cursor: "pointer", color: C.yellow }}>★</span>)}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            <Btn style={{ width: "100%", justifyContent: "center" }}>Apply Filters</Btn>
            <Btn variant="outlined" style={{ width: "100%", justifyContent: "center" }}>Clear Filters</Btn>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title + Search */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: C.black, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-1px" }}>Browse Gigs</h1>

            <div style={{ position: "relative", maxWidth: 660 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: 16 }}>🔍</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search gigs by skill or keyword..."
                style={{ width: "100%", padding: "13px 16px 13px 42px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              />
            </div>

            {/* Filter Chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button key={f}
                  onClick={() => { setActiveFilter(f); if (f !== "All") onNavigate("categories"); }}
                  style={{
                    padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    background: activeFilter === f ? C.black : C.white,
                    color: activeFilter === f ? C.white : C.textPrimary,
                    border: activeFilter === f ? `1.5px solid ${C.black}` : `1.5px solid ${C.border}`,
                  }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Sort Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
            <span style={{ fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Showing latest <strong>{meta?.total || 0} gigs</strong></span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Sort by:</span>
              <select style={{ padding: "6px 12px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                <option>Most Relevant</option>
                <option>Lowest Price</option>
                <option>Highest Rated</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* 3×2 Gig Grid */}
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>Loading gigs...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: "center", color: "red", fontFamily: "'DM Sans', sans-serif" }}>Error: {error}</div>
          ) : mappedGigs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>No gigs found matching filters.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {mappedGigs.map(g => <GigCard key={g.id} gig={g} onNavigate={onNavigate} />)}
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, paddingTop: 8 }}>
            {["← Prev", "1", "2", "3", "Next →"].map((p, i) => (
              <button key={i} style={{
                padding: p === "1" ? "0" : "8px 14px",
                width: p === "1" ? 38 : "auto", height: p === "1" ? 38 : "auto",
                background: p === "1" ? C.black : C.white,
                color: p === "1" ? C.white : C.textPrimary,
                border: `1px solid ${C.border}`, borderRadius: 3,
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>{p}</button>
            ))}
          </div>

          <StickyNote text="🔗 Links to G01 – Profile Management · Clicking freelancer names/avatars navigates to their profile. · Clicking a gig card → G03_GigDetail · Clicking category chip → G03_CategorySelection" />
        </main>
      </div>
    </div>
  );
}
