import { useState } from "react";
import { C, Navbar, StickyNote, Btn } from "./shared";
import { useCreateGig } from "../../hooks/useGigs";
import { useCategories } from "../../hooks/useCategories";

// ══════════════════════════════════════════════════════════════════════════════
// G03_CreateGig
// ══════════════════════════════════════════════════════════════════════════════
export default function CreateGig({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Basic");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("3");

  const { createGig, loading } = useCreateGig();
  const { categories } = useCategories();

  const handlePublish = async () => {
    const parsedPrice = Number(price);
    const parsedDeliveryDays = Number(deliveryDays);

    if (!title || !price || !category) {
      alert("Please fill in Title, Category, and Price.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }
    
    // Map activeTab ("Basic", "Standard", "Premium") to tier enum expected by backend
    const tierName = activeTab.toLowerCase();
    
    const res = await createGig({
      title,
      description: description || "No description provided.",
      category_id: category,
      status: "live",
      pricing_tiers: [
        {
          tier: tierName,
          package_name: `${activeTab} Package`,
          description: description || "Standard service package.",
          price: parsedPrice,
          delivery_days: Number.isFinite(parsedDeliveryDays) ? parsedDeliveryDays : 3,
          revisions: "1",
          deliverables: ["Standard deliverable"]
        }
      ]
    });
    if (res) {
      onNavigate("mygigs");
    } else {
      alert("Failed to create gig. Please check your inputs or try again.");
    }
  };

  const STEPS = ["Overview", "Pricing", "Description", "Publish"];

  const fieldStyle = {
    width: "100%", padding: "11px 14px", border: `1px solid ${C.border}`,
    borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white,
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  };
  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.8px",
    textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", display: "block", marginBottom: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <Navbar onNavigate={onNavigate} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Left Form Panel ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 760 }}>

          {/* Header */}
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: 30, fontWeight: 800, color: C.black, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.8px" }}>
              Create a New Gig
            </h1>
            <p style={{ margin: 0, fontSize: 15, color: C.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
              Fill in the details below to publish your listing
            </p>
          </div>

          {/* Progress Stepper */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setStep(i + 1)}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 15,
                    background: step === i + 1 ? C.black : step > i + 1 ? "#10B981" : "#F1F5F9",
                    border: step >= i + 1 ? "none" : `1px solid ${C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: step >= i + 1 ? C.white : "#94A3B8",
                    fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: step === i + 1 ? C.black : "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: "#E2E8F0", margin: "0 12px" }} />}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Section — Basic Details */}
            <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 4 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Basic Details</h3>
            </div>

            {/* Gig Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={labelStyle}>GIG TITLE</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder='e.g. I will design a modern minimalist brand identity' style={fieldStyle} />
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Keep it clear and professional. Max 80 characters.</span>
            </div>

            {/* Category + Skill Tags */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>CATEGORY</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...fieldStyle }}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>SKILL TAGS <span style={{ fontSize: 9, color: C.textMuted, textTransform: "none", letterSpacing: 0 }}>(Verified skills only)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 8, border: `1px solid ${C.border}`, borderRadius: 4, background: C.chipBg, minHeight: 46 }}>
                  {["React", "Node.js"].map(tag => (
                    <span key={tag} style={{ background: C.badgeBg, borderRadius: 12, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: C.textPrimary, display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans', sans-serif" }}>
                      {tag} <span style={{ cursor: "pointer", opacity: 0.5, fontSize: 10 }}>✕</span>
                    </span>
                  ))}
                  <input placeholder="Add skills..." style={{ border: "none", background: "transparent", fontSize: 13, color: C.textPrimary, outline: "none", fontFamily: "'DM Sans', sans-serif", minWidth: 80 }} />
                </div>
              </div>
            </div>

            {/* Section — Media */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Media</h3>
              <label style={labelStyle}>GIG THUMBNAIL</label>
              <div style={{ border: `2px dashed ${C.border}`, borderRadius: 8, background: C.chipBg, height: 152, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 28, color: C.textMuted }}>📁</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Click to upload or drag and drop</span>
                <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>PNG, JPG up to 10MB</span>
              </div>
            </div>

            {/* Section — Description */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Description</h3>
              <label style={labelStyle}>GIG DESCRIPTION</label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe your gig to potential buyers. Highlight what makes your service unique and why they should choose you."
                rows={4}
                style={{ ...fieldStyle, resize: "vertical" }}
              />
            </div>

            {/* Portfolio Samples */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Portfolio Samples</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ border: `2px dashed ${C.border}`, borderRadius: 6, height: 100, display: "flex", alignItems: "center", justifyContent: "center", background: C.chipBg, cursor: "pointer" }}>
                    <span style={{ fontSize: 22, color: C.textMuted }}>+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright Warning */}
            <div style={{ background: "rgba(255,218,214,0.2)", borderLeft: `4px solid ${C.red}`, borderRadius: "0 4px 4px 0", padding: "12px 16px" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.redDark, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                ⚠ Note: Please ensure all uploaded assets are original or you have the necessary licenses. MarketPlace maintains a zero-tolerance policy for copyright infringement.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
            <Btn variant="ghost" onClick={() => onNavigate("browse")}>Cancel</Btn>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="outlined" onClick={() => onNavigate("mygigs")}>Save as Draft</Btn>
              <Btn onClick={handlePublish} disabled={loading}>{loading ? "Publishing..." : "Publish Gig →"}</Btn>
            </div>
          </div>
        </div>

        {/* ── Right Panel — Pricing Tiers ── */}
        <div style={{ width: 340, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, padding: 28, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>Pricing Tiers</h3>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 4, padding: 4 }}>
            {["Basic", "Standard", "Premium"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 3,
                background: activeTab === t ? C.white : "transparent",
                boxShadow: activeTab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                fontWeight: activeTab === t ? 700 : 500, fontSize: 13,
                color: activeTab === t ? C.black : "#64748B",
                fontFamily: "'DM Sans', sans-serif",
              }}>{t}</button>
            ))}
          </div>

          {/* Tier Form Fields */}
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 4, padding: 18, background: "rgba(248,250,252,0.4)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ ...labelStyle, color: C.textSecondary }}>PACKAGE NAME</label>
              <input placeholder="e.g. Bronze Package" style={{ ...{ width: "100%", padding: "11px 14px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" } }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ ...labelStyle, color: C.textSecondary }}>PRICE PKR</label>
                <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="e.g. 5000" style={{ width: "100%", padding: "11px 12px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ ...labelStyle, color: C.textSecondary }}>DELIVERY DAYS</label>
                <select value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} style={{ width: "100%", padding: "11px 12px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  {[1, 2, 3, 5, 7, 10, 14].map(d => <option key={d} value={d}>{d} Days</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: C.textSecondary }}>REVISIONS</label>
                <select style={{ width: "100%", padding: "11px 12px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  {["1 Revision", "2 Revisions", "3 Revisions", "Unlimited"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...labelStyle, color: C.textSecondary }}>DELIVERABLES</label>
                <input placeholder="Source files, etc." style={{ width: "100%", padding: "11px 12px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 14, color: C.textPrimary, background: C.white, fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div style={{ background: "#EFF6FF", borderLeft: `4px solid ${C.black}`, borderRadius: 2, padding: "14px 16px", display: "flex", gap: 12 }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: 12, color: "#131B2E", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              Only verified skills from <strong>Module 2 – Skill Assessment</strong> will be shown in the skill tags dropdown.
            </p>
          </div>

          {/* Footer links */}
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Btn variant="ghost" onClick={() => onNavigate("browse")}>Cancel</Btn>
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outlined" small onClick={() => onNavigate("mygigs")}>Save as Draft</Btn>
              <Btn small onClick={handlePublish} disabled={loading}>Publish Gig</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
