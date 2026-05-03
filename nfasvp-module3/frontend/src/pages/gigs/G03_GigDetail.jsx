import { useState, useEffect } from "react";
import { C, Navbar, StickyNote, Stars, Btn } from "./shared";
import { useGig } from "../../hooks/useGigs";

// ══════════════════════════════════════════════════════════════════════════════
// G03_GigDetail
// ══════════════════════════════════════════════════════════════════════════════
export default function GigDetail({ onNavigate, params, role }) {
  const [tab, setTab] = useState("About This Gig");
  const [pricing, setPricing] = useState("Basic");

  const TABS = ["About This Gig", "Reviews", "FAQ"];

  const TIERS_FALLBACK = {
    Basic: {
      price: "PKR 5,000", delivery: "3 days", revisions: "1 revision",
      desc: "Perfect for startups. A single landing page with up to 5 sections.",
      deliverables: ["Fully responsive design", "Source files included"],
    },
    Standard: {
      price: "PKR 10,000", delivery: "5 days", revisions: "3 revisions",
      desc: "Ideal for growing businesses. Up to 10 pages and e-commerce.",
      deliverables: ["Everything in Basic", "E-commerce integration"],
    },
    Premium: {
      price: "PKR 18,000", delivery: "10 days", revisions: "Unlimited",
      desc: "Full-scale solution with custom features and admin dashboard.",
      deliverables: ["Everything in Standard", "Admin dashboard"],
    },
  };

  const { gig, loading, error } = useGig(params?.id);
  const realTiers = gig?.pricing_tiers || [];

  // Sync state with available tiers on load
  useEffect(() => {
    if (realTiers.length > 0) {
      const active = realTiers.find(t => t.tier === pricing.toLowerCase());
      if (!active) {
         const firstTier = realTiers[0].tier;
         setPricing(firstTier.charAt(0).toUpperCase() + firstTier.slice(1));
      }
    }
  }, [realTiers]);

  const activeTier = realTiers.find(t => t.tier === pricing.toLowerCase());
  
  // Map database tier to UI format
  const tier = activeTier ? {
    price: `PKR ${activeTier.price}`,
    delivery: `${activeTier.delivery_days} days`,
    revisions: "Included",
    desc: activeTier.desc || "No package description.",
    deliverables: activeTier.deliverables || [activeTier.desc || "Standard deliverable"]
  } : TIERS_FALLBACK[pricing];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} role={role} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: C.textPrimary, fontSize: 18 }}>
            Loading gig details...
          </div>
        ) : (error || !gig) ? (
          <div style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <h2 style={{ margin: 0, color: C.textPrimary }}>{error || "Gig Not Found"}</h2>
            <Btn onClick={() => onNavigate("browse")} style={{ marginTop: 12 }}>Browse Gigs</Btn>
          </div>
        ) : (
          <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[
              { label: "Browse Gigs", action: () => onNavigate("browse") },
              { label: "Gig Detail", action: null },
              { label: gig.title?.substring(0, 20) + "...", action: null },
            ].map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: C.textMuted, fontSize: 12 }}>›</span>}
                <span onClick={b.action} style={{
                  fontSize: 13, color: b.action ? C.textPrimary : C.textMuted,
                  cursor: b.action ? "pointer" : "default",
                  fontWeight: b.action ? 500 : 400, textDecoration: b.action ? "underline" : "none",
                }}>{b.label}</span>
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: C.textPrimary, lineHeight: 1.25 }}>
                {gig.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: C.navBg, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  {gig.freelancer_id?.substring(0, 2).toUpperCase() || "FR"}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>Freelancer {gig.freelancer_id?.substring(0, 4)}</span>
                    <span style={{ background: "#10B981", borderRadius: 10, padding: "2px 8px", fontSize: 9, fontWeight: 700, color: C.white }}>SKILL VERIFIED</span>
                  </div>
                  <Stars rating={gig.avg_rating || "0.0"} count={gig.review_count || "0"} />
                </div>
              </div>

              <div style={{ height: 300, background: "linear-gradient(135deg,#E8F4FD,#DBEAFE)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>💻</div>

              <div style={{ borderBottom: `1px solid ${C.border}`, display: "flex", gap: 28 }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    background: "none", border: "none", cursor: "pointer", paddingBottom: 10,
                    fontSize: 14, fontWeight: tab === t ? 700 : 400,
                    color: tab === t ? C.black : C.textMuted,
                    borderBottom: tab === t ? `2px solid ${C.black}` : "2px solid transparent",
                    marginBottom: -1,
                  }}>{t}</button>
                ))}
              </div>

              {tab === "About This Gig" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Description</h3>
                  <p style={{ margin: 0, fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
                    {gig.description}
                  </p>
                  <div>
                    <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600 }}>Skills Used</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(gig.required_skills || ["Service"]).map(s => (
                        <span key={s} style={{ background: C.chipBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "5px 12px", fontSize: 13 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 20 }}>
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
                  {["Basic", "Standard", "Premium"].map(p => (
                    <button key={p} onClick={() => setPricing(p)} style={{
                      flex: 1, padding: "14px 0", border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: pricing === p ? 700 : 400,
                      background: pricing === p ? C.white : C.chipBg,
                      color: pricing === p ? C.black : C.textMuted,
                      borderBottom: pricing === p ? `2px solid ${C.black}` : "none",
                    }}>{p}</button>
                  ))}
                </div>

                <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>{pricing} Package</span>
                    <span style={{ fontWeight: 800, fontSize: 22 }}>{tier.price}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: C.textSecondary }}>{tier.desc}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.textSecondary }}>
                    <span>⏱ {tier.delivery}</span>
                    <span>🔄 {tier.revisions}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                    {tier.deliverables.map(d => (
                      <div key={d} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                        <span style={{ fontWeight: 700 }}>✓</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                  <Btn style={{ width: "100%", justifyContent: "center", padding: "14px 0" }}>Order {pricing} Package</Btn>
                  <Btn variant="outlined" style={{ width: "100%", justifyContent: "center", padding: "13px 0" }}>Message Seller</Btn>
                </div>
              </div>
              
              <StickyNote text="🔗 Order button → Payment Module (G07)" />
              <StickyNote text="🔗 Message Seller → Communication Module (G06)" />
            </div>

          </div>
        </div>
        )}
      </div>
    </div>
  );
}
