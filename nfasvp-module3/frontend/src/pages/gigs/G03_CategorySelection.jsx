import { useState } from "react";
import { C, Navbar, StickyNote, Btn } from "./shared";
import { useCategories } from "../../hooks/useCategories";

const CATEGORIES = [
  { icon: "💻", name: "Web Development",   count: 124 },
  { icon: "🎨", name: "Graphic Design",    count: 89  },
  { icon: "✍️", name: "Content Writing",   count: 67  },
  { icon: "📱", name: "Mobile Apps",       count: 54  },
  { icon: "📊", name: "Data & Analytics",  count: 43  },
  { icon: "🎬", name: "Video & Animation", count: 38  },
  { icon: "📣", name: "Digital Marketing", count: 72  },
  { icon: "🎵", name: "Music & Audio",     count: 21  },
  { icon: "🌍", name: "Translation",       count: 19  },
];

const TRENDING_TAGS = ["React", "Figma", "Python", "WordPress", "SEO", "Logo Design", "Video Editing", "Copywriting", "Excel"];

// ══════════════════════════════════════════════════════════════════════════════
// G03_CategorySelection
// ══════════════════════════════════════════════════════════════════════════════
export default function CategorySelection({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const [tagHovered, setTagHovered] = useState(null);
  const { categories, loading, error } = useCategories();

  // If no backend categories, fallback to mock data
  const catsToRender = categories?.length > 0 ? categories.map(c => ({
    icon: "💻", // backend might not store emojis, fallback
    name: c.name,
    count: Math.floor(Math.random() * 100) + 10 // mock count
  })) : CATEGORIES;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.8px" }}>
            Browse Gigs by Category
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: C.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
            Select a category to explore verified services
          </p>

          {/* Search Bar */}
          <div style={{ position: "relative", width: "100%", maxWidth: 560, marginTop: 12 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: C.textMuted }}>🔍</span>
            <input
              placeholder="What service are you looking for today?"
              style={{
                width: "100%", padding: "14px 18px 14px 46px", border: `1px solid ${C.border}`,
                borderRadius: 6, fontSize: 15, color: C.textPrimary, background: C.white,
                fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            />
          </div>
        </div>

        {/* ── 3×3 Category Grid ── */}
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>Loading categories...</div>
        ) : error ? (
          <div style={{ padding: 40, textAlign: "center", color: "red", fontFamily: "'DM Sans', sans-serif" }}>Error: {error}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {catsToRender.map((cat, i) => (
              <div
                key={i}
                onClick={() => onNavigate("browse")}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: C.white, border: `1px solid ${hovered === i ? C.textMuted : C.border}`,
                  borderRadius: 8, padding: "20px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
                  boxShadow: hovered === i ? "0 6px 20px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.04)",
                  transform: hovered === i ? "translateY(-2px)" : "none",
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 8, background: C.chipBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{cat.count} gigs available</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Trending Skill Tags ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Trending Skill Tags</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TRENDING_TAGS.map((tag, i) => (
              <button
                key={tag}
                onClick={() => onNavigate("browse")}
                onMouseEnter={() => setTagHovered(i)}
                onMouseLeave={() => setTagHovered(null)}
                style={{
                  padding: "7px 16px", borderRadius: 20,
                  border: `1.5px solid ${C.border}`,
                  background: tagHovered === i ? C.black : C.white,
                  color: tagHovered === i ? C.white : C.textPrimary,
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.4px",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Admin Section (grey background box) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          <div style={{ background: C.badgeBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 22, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>⚙️</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#5E6367", letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>ADMIN PANEL</span>
            </div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
              Category Taxonomy
            </h4>
            <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              Category taxonomy managed by administrator. Manage the hierarchical structure of marketplace categories and associated skill metadata.
            </p>
            <Btn variant="outlined" small style={{ alignSelf: "flex-start", marginTop: 4 }}>
              Manage Categories
            </Btn>
          </div>

          <StickyNote text="🔗 Manage Categories → Links to G08 – Dispute & Admin Module · Category card / skill chip clicks → G03_BrowseGigs" />
        </div>

      </div>
    </div>
  );
}
