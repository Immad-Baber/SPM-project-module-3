import { useState } from "react";
import { C, Navbar, Sidebar, SkillTag, StatusBadge, Btn, JOB_CARDS } from "./fbs_shared";

// ─── JOB CARD ────────────────────────────────────────────────────────────────
function JobCard({ job, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
        padding: 24, display: "flex", flexDirection: "column",
        justifyContent: "space-between", gap: 0,
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.1)" : "0 1px 2px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.2s", cursor: "pointer",
      }}>
      {/* Header */}
      <div style={{ paddingBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "#000", fontFamily: "'Manrope', sans-serif", lineHeight: 1.4 }}>{job.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#000", fontFamily: "'Inter', sans-serif" }}>{job.client}</span>
              {job.verified && <span style={{ fontSize: 12, color: C.tealDark }}>✓</span>}
              <span style={{ color: C.textMuted, fontSize: 14 }}>·</span>
              <span style={{ fontSize: 14, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>{job.posted}</span>
            </div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textMuted }}>🔖</button>
        </div>
      </div>

      {/* Budget + Type */}
      <div style={{ paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 14, color: "#000", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>💰 {job.budget}</span>
          </div>
          <span style={{
            background: job.type === "Fixed Price" ? C.skillTag : "#E3E2E5",
            color: job.type === "Fixed Price" ? C.skillTagText : C.textDark,
            borderRadius: 8, padding: "2px 8px", fontSize: 12, fontWeight: 700,
            letterSpacing: "0.3px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
          }}>{job.type}</span>
        </div>
      </div>

      {/* Description */}
      <div style={{ paddingBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 16, color: C.textBody, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>{job.desc}</p>
      </div>

      {/* Skills */}
      <div style={{ paddingBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {job.skills.map(s => (
            <span key={s} style={{
              background: "#F5F3F6", border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "4px 8px", fontSize: 12, fontWeight: 500,
              color: C.textBody, fontFamily: "'Inter', sans-serif",
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <Btn variant="outlined" style={{ flex: 1 }} onClick={() => onNavigate("jobdetail")}>View Details</Btn>
        <Btn style={{ width: 117 }} onClick={() => onNavigate("submit")}>Apply Now</Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 07 - Browse Jobs
// ══════════════════════════════════════════════════════════════════════════════
export default function BrowseJobs({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [projectType, setProjectType] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Inter', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar activeLink="browse" onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar activeItem="browse" onNavigate={onNavigate} />

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Page Header */}
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#000", fontFamily: "'Manrope', sans-serif" }}>Browse Jobs</h1>
            <p style={{ margin: 0, fontSize: 16, color: C.textBody, fontFamily: "'Inter', sans-serif" }}>Find your next project</p>
          </div>

          {/* Filter Bar */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "24px 24px 25px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Row 1: Search + Dropdowns + Button */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: 1, maxWidth: 336 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#74777F", fontSize: 14 }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search keywords..."
                  style={{ width: "100%", height: 44, padding: "0 16px 0 40px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.textBody, fontFamily: "'Inter', sans-serif", boxSizing: "border-box", outline: "none" }} />
              </div>
              {/* Dropdowns */}
              {[
                { label: "Category",     val: category,     set: setCategory,    opts: ["Web Dev","Design","Writing","Marketing","Data"] },
                { label: "Budget",       val: budget,       set: setBudget,      opts: ["< $500","$500-$2k","$2k-$5k","> $5k"] },
                { label: "Project Type", val: projectType,  set: setProjectType, opts: ["Fixed Price","Hourly"] },
              ].map(({ label, val, set, opts }) => (
                <select key={label} value={val} onChange={e => set(e.target.value)}
                  style={{ height: 44, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: val ? C.textBody : "#74777F", fontFamily: "'Inter', sans-serif", cursor: "pointer", minWidth: 160, background: C.white }}>
                  <option value="">{label}</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
              <Btn style={{ height: 44, padding: "0 32px", flexShrink: 0 }}>Search</Btn>
            </div>

            {/* Row 2: Quick filter chips */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#74777F", letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>FILTERS:</span>
              {["Remote", "Full-Time", "Part-Time"].map(chip => (
                <button key={chip} style={{
                  background: C.chipBg, borderRadius: 9999, padding: "4px 12px",
                  fontSize: 12, fontWeight: 500, color: C.chipText,
                  border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif",
                }}>{chip}</button>
              ))}
            </div>
          </div>

          {/* Results Count + Sort */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: C.textDark, fontFamily: "'Manrope', sans-serif" }}>124 jobs found</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, color: "#74777F", fontFamily: "'Inter', sans-serif" }}>Sort by:</span>
              <select style={{ height: 36, padding: "0 40px 0 12px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#000", fontFamily: "'Inter', sans-serif", cursor: "pointer", background: C.white }}>
                <option>Most Relevant</option>
                <option>Newest First</option>
                <option>Budget: High to Low</option>
                <option>Budget: Low to High</option>
              </select>
            </div>
          </div>

          {/* 2×2 Job Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {JOB_CARDS.map(job => <JobCard key={job.id} job={job} onNavigate={onNavigate} />)}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "32px 0" }}>
            <button style={{ width: 40, height: 40, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>‹</button>
            {[1, 2, 3, 4].map(p => (
              <button key={p} style={{
                width: 40, height: 40, border: `1px solid ${p === 1 ? C.navy : C.border}`,
                borderRadius: 8, background: p === 1 ? C.navy : C.white,
                color: p === 1 ? C.white : C.textDark, cursor: "pointer",
                fontSize: 16, fontWeight: p === 1 ? 700 : 400, fontFamily: "'Inter', sans-serif",
              }}>{p}</button>
            ))}
            <span style={{ color: "#74777F", fontSize: 16 }}>…</span>
            <button style={{ width: 40, height: 40, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, fontSize: 16, cursor: "pointer", color: C.textDark }}>10</button>
            <button style={{ width: 40, height: 40, border: `1px solid ${C.border}`, borderRadius: 8, background: C.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>›</button>
          </div>
        </main>
      </div>
    </div>
  );
}
