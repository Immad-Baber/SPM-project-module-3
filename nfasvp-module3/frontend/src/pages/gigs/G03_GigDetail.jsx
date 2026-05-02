import { useState } from "react";
import { C, Navbar, StickyNote, Stars, Btn } from "./shared";
import { useGig } from "../../hooks/useGigs";

// ══════════════════════════════════════════════════════════════════════════════
// G03_GigDetail
// ══════════════════════════════════════════════════════════════════════════════
export default function GigDetail({ onNavigate, params }) {
  const [tab, setTab] = useState("About This Gig");
  const [pricing, setPricing] = useState("Basic");

  const TABS = ["About This Gig", "Reviews", "FAQ"];

  const TIERS = {
    Basic: {
      price: "PKR 5,000", delivery: "3 days", revisions: "1 revision",
      desc: "Perfect for startups. A single landing page with up to 5 sections and contact form integration.",
      deliverables: ["Fully responsive design", "Source files included", "1 round of revisions", "Basic SEO setup"],
    },
    Standard: {
      price: "PKR 10,000", delivery: "5 days", revisions: "3 revisions",
      desc: "Ideal for growing businesses. Up to 10 pages, e-commerce integration, and performance optimization.",
      deliverables: ["Everything in Basic", "E-commerce integration", "3 rounds of revisions", "Performance optimization"],
    },
    Premium: {
      price: "PKR 18,000", delivery: "10 days", revisions: "Unlimited",
      desc: "Full-scale solution with custom features, admin dashboard, and priority support.",
      deliverables: ["Everything in Standard", "Admin dashboard", "Unlimited revisions", "Priority support"],
    },
  };

  const { gig, loading, error } = useGig(params?.id);

  const realTiers = gig?.pricing_tiers || [];
  const tier = realTiers.find(t => t.name === pricing) || TIERS[pricing]; // Fallback to mock if not matching name
  if (realTiers.length > 0 && !realTiers.find(t => t.name === pricing)) {
      // If we have real tiers but none matches 'Basic', just pick the first one.
      setPricing(realTiers[0].name);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: C.textPrimary, fontSize: 18, fontFamily: "'DM Sans', sans-serif" }}>
            Loading gig details...
          </div>
        ) : (error || !gig) ? (
          <div style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <h2 style={{ margin: 0, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{error || "Gig Not Found"}</h2>
            <p style={{ color: C.textMuted, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>Please select a gig from the Browse Gigs page.</p>
            <Btn onClick={() => onNavigate("browse")} style={{ marginTop: 12 }}>Browse Gigs</Btn>
          </div>
        ) : (
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { label: "Browse Gigs", action: () => onNavigate("browse") },
              { label: "Web Development", action: null },
              { label: "Gig Detail", action: null },
            ].map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: C.textMuted, fontSize: 12 }}>›</span>}
                <span onClick={b.action} style={{
                  fontSize: 13, color: b.action ? C.textPrimary : C.textMuted,
                  cursor: b.action ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: b.action ? 500 : 400, textDecoration: b.action ? "underline" : "none",
                }}>{b.label}</span>
              </span>
            ))}
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

            {/* ── LEFT COLUMN (65%) ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.8px", lineHeight: 1.25 }}>
                {gig.title}
              </h1>

              {/* Freelancer Row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: C.navBg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", border: `1px solid ${C.border}` }}>
                  {gig.freelancer_id ? "FR" : "AR"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                      Freelancer {gig.freelancer_id?.substring(0, 4) || 'Ahmed Raza'}
                    </span>
                    <span style={{ background: "#10B981", borderRadius: 10, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: C.white, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>SKILL VERIFIED</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <Stars rating={gig.avg_rating || "0.0"} count={gig.review_count || "0"} />
                    <span style={{ color: C.textMuted, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>·</span>
                    <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{gig.review_count || "0"} orders completed</span>
                  </div>
                </div>
              </div>

              {/* Banner image placeholder */}
              <div style={{ height: 220, background: "linear-gradient(135deg,#E8F4FD,#DBEAFE)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>💻</div>

              {/* Tabs */}
              <div style={{ borderBottom: `1px solid ${C.border}`, display: "flex", gap: 28 }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    background: "none", border: "none", cursor: "pointer", paddingBottom: 10,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: tab === t ? 700 : 400,
                    color: tab === t ? C.black : C.textMuted,
                    borderBottom: tab === t ? `2px solid ${C.black}` : "2px solid transparent",
                    marginBottom: -1,
                  }}>{t}</button>
                ))}
              </div>

              {/* Tab Content */}
              {tab === "About This Gig" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Description */}
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Description</h3>
                    <p style={{ margin: 0, fontSize: 14, color: C.textSecondary, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                      {gig.description || "No description provided."}
                    </p>
                  </div>

                  {/* Skills Used */}
                  <div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Skills Used</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(Array.isArray(gig.required_skills) ? gig.required_skills.map(s => typeof s === 'string' ? s : s.name || s.tag) : ["Skill"]).map(s => (
                        <span key={s} style={{ background: C.chipBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "5px 12px", fontSize: 13, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 700 }}>✓</span>{s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* What You Get */}
                  <div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>What You Get</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        "Fully responsive, mobile-first design optimized for all devices",
                        "Source files and full ownership of the final product",
                        "SEO-optimized codebase for better search engine visibility",
                        "Deployment assistance and post-delivery support included",
                      ].map(item => (
                        <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ marginTop: 2, fontSize: 13, color: C.black, fontWeight: 700 }}>✓</span>
                          <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {tab === "Reviews" && (
                <div style={{ padding: "20px 0", color: C.textMuted, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  ⭐ 4.9 average from 124 reviews. Detailed reviews would appear here.
                </div>
              )}
              {tab === "FAQ" && (
                <div style={{ padding: "20px 0", color: C.textMuted, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                  Frequently asked questions about this gig would appear here.
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN (35%) — Sticky Card ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 20 }}>

              {/* Pricing Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                {/* Pricing Tabs */}
                <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
                  {["Basic", "Standard", "Premium"].map(p => (
                    <button key={p} onClick={() => setPricing(p)} style={{
                      flex: 1, padding: "14px 0", border: "none", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: pricing === p ? 700 : 400,
                      background: pricing === p ? C.white : C.chipBg,
                      color: pricing === p ? C.black : C.textMuted,
                      borderBottom: pricing === p ? `2px solid ${C.black}` : "none",
                    }}>{p}</button>
                  ))}
                </div>

                {/* Tier Content */}
                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{pricing} Package</span>
                    <span style={{ fontWeight: 800, fontSize: 22, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{tier.price}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: C.textSecondary, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{tier.desc}</p>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 13, color: C.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>⏱ {tier.delivery}</span>
                    <span style={{ fontSize: 13, color: C.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>🔄 {tier.revisions}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                    {tier.deliverables.map(d => (
                      <div key={d} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.black }}>✓</span>
                        <span style={{ fontSize: 13, color: C.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                    <Btn style={{ width: "100%", justifyContent: "center", padding: "14px 0", fontSize: 14 }}>
                      Order {pricing} – {tier.price}
                    </Btn>
                    <Btn variant="outlined" style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 14 }}>
                      Message Seller
                    </Btn>
                  </div>
                </div>
              </div>

              {/* Seller Info Card */}
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 6, background: C.navBg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>AR</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Ahmed Raza</div>
                    <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Full-Stack Developer</div>
                  </div>
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 8px" }}>
                  {[["FROM", "Pakistan"], ["MEMBER SINCE", "Jan 2022"], ["AVG. RESPONSE", "1 hour"], ["LAST DELIVERY", "2 days ago"]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <Btn variant="ghost" style={{ fontSize: 13, fontWeight: 600 }}>View Full Profile →</Btn>
              </div>

              {/* Sticky Notes */}
              <StickyNote text="🔗 Order button → Links to G07 – Payment & Escrow Module" />
              <StickyNote text="🔗 Message Seller → Links to G06 – Communication Module" />
              <StickyNote text="🔗 Seller card → Links to G01 – Profile Management" />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
