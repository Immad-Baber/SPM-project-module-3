import { useState, useRef } from "react";
import { C, Navbar, Btn, Toast } from "./shared";

const STEPS = ["Overview","Pricing","Description","Publish"];
const CATS  = ["Select Category","Web Development","Graphic Design","Content Writing","Mobile Apps","Data & Analytics","Video & Animation","Digital Marketing"];
const ALL_SKILLS = ["React","Node.js","Python","Figma","CSS","TypeScript","Flutter","WordPress","SEO","MongoDB","Next.js","Vue.js","PHP","Laravel","Swift","Kotlin"];

const CATEGORY_ICONS = {
  "Web Development":"💻","Graphic Design":"🎨","Content Writing":"✍️",
  "Mobile Apps":"📱","Data & Analytics":"📊","Video & Animation":"🎬",
  "Digital Marketing":"📣","Select Category":"📋",
};

export default function CreateGig({ onNavigate, onGigSaved }) {
  const [step, setStep]             = useState(1);
  const [pricingTab, setPricingTab] = useState("Basic");
  const [toast, setToast]           = useState(null);
  const [isDrag, setIsDrag]         = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showSug, setShowSug]       = useState(false);
  const [errors, setErrors]         = useState({});

  const [thumb, setThumb]           = useState(null);
  const thumbRef                    = useRef(null);
  const [samples, setSamples]       = useState([null, null, null]);
  const sampleRefs                  = [useRef(null), useRef(null), useRef(null)];

  const [form, setForm] = useState({
    title:"", category:"Select Category", skills:[], description:"",
    pricing:{
      Basic:    { name:"Basic Package",    price:"", days:"", revisions:"1",        notes:"" },
      Standard: { name:"Standard Package", price:"", days:"", revisions:"3",        notes:"" },
      Premium:  { name:"Premium Package",  price:"", days:"", revisions:"Unlimited", notes:"" },
    },
  });

  const show = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };
  const set  = (field, val) => { setForm(f=>({...f,[field]:val})); setErrors(e=>({...e,[field]:undefined})); };
  const setP = (t,f,v) => setForm(x=>({...x,pricing:{...x.pricing,[t]:{...x.pricing[t],[f]:v}}}));

  const addSkill = (sk) => {
    if (!sk.trim()) return;
    if (form.skills.includes(sk)) { show("Already added","warning"); return; }
    if (form.skills.length >= 8)  { show("Max 8 skills","warning"); return; }
    set("skills",[...form.skills,sk]);
    setSkillInput(""); setShowSug(false);
    show(`"${sk}" added`);
  };
  const removeSkill = (sk) => set("skills", form.skills.filter(s=>s!==sk));
  const suggestions = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(skillInput.toLowerCase()) && !form.skills.includes(s)
  );

  const handleThumbFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { show("Please upload an image file","error"); return; }
    if (file.size > 10*1024*1024) { show("File too large. Max 10MB","error"); return; }
    const url = URL.createObjectURL(file);
    setThumb({ url, name:file.name, size:(file.size/1024).toFixed(1)+"KB" });
    show(`Thumbnail uploaded: ${file.name} ✓`);
  };

  const handleThumbDrop = (e) => {
    e.preventDefault(); setIsDrag(false);
    handleThumbFile(e.dataTransfer.files[0]);
  };

  const removeThumb = () => {
    if (thumb) URL.revokeObjectURL(thumb.url);
    setThumb(null);
    if (thumbRef.current) thumbRef.current.value = "";
    show("Thumbnail removed","info");
  };

  const handleSampleFile = (index, file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isPdf   = file.type === "application/pdf";
    if (!isImage && !isPdf) { show("Upload an image or PDF","error"); return; }
    if (file.size > 10*1024*1024) { show("File too large. Max 10MB","error"); return; }
    const url = isImage ? URL.createObjectURL(file) : null;
    const newSamples = [...samples];
    newSamples[index] = { url, name:file.name, size:(file.size/1024).toFixed(1)+"KB", isImage };
    setSamples(newSamples);
    show(`Sample ${index+1} uploaded: ${file.name} ✓`);
  };

  const removeSample = (index) => {
    if (samples[index]?.url) URL.revokeObjectURL(samples[index].url);
    const newSamples = [...samples];
    newSamples[index] = null;
    setSamples(newSamples);
    if (sampleRefs[index].current) sampleRefs[index].current.value = "";
    show(`Sample ${index+1} removed`,"info");
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())               e.title       = "Title is required";
    else if (form.title.length < 20)      e.title       = "Minimum 20 characters";
    if (form.category==="Select Category") e.category   = "Please select a category";
    if (form.skills.length === 0)         e.skills      = "Add at least one skill";
    if (!form.description.trim())         e.description = "Description is required";
    else if (form.description.length<100) e.description = "Minimum 100 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build the gig object and send it to App.js ──
  const buildGig = (status) => ({
    id: Date.now(),
    title: form.title,
    category: form.category.replace(" & "," & "),
    status: status,
    price: form.pricing.Basic.price
      ? `PKR ${parseInt(form.pricing.Basic.price).toLocaleString()}`
      : "PKR —",
    orders: 0,
    rating: "—",
    thumb: CATEGORY_ICONS[form.category] || "📋",
    views: 0,
    clicks: 0,
  });

  const handlePublish = () => {
    if (!validate()) { show("Fix errors before publishing","error"); return; }
    const newGig = buildGig("Live");
    onGigSaved && onGigSaved(newGig);
    show("Gig published successfully! 🎉 Redirecting to My Gigs...");
    setTimeout(()=>onNavigate("mygigs"), 1500);
  };

  const handleDraft = () => {
    if (!form.title.trim()) { show("Add a title before saving draft","error"); return; }
    const newGig = buildGig("Draft");
    onGigSaved && onGigSaved(newGig);
    show("Draft saved! Redirecting to My Gigs...","info");
    setTimeout(()=>onNavigate("mygigs"), 1200);
  };

  const inp = { width:"100%", padding:"11px 14px", border:`1px solid ${C.border}`, borderRadius:4,
    fontSize:14, color:C.textPrimary, background:C.white, fontFamily:"'DM Sans',sans-serif",
    boxSizing:"border-box", outline:"none" };
  const lbl = { fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:"0.8px",
    textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", display:"block", marginBottom:6 };
  const errStyle = { fontSize:11, color:C.red, fontFamily:"'DM Sans',sans-serif", marginTop:4 };
  const chars = form.description.length;

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh",
      fontFamily:"'DM Sans',sans-serif", background:C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Navbar onNavigate={onNavigate} currentScreen="create"/>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* Hidden file inputs */}
      <input ref={thumbRef} type="file" accept="image/*" style={{ display:"none" }}
        onChange={e=>handleThumbFile(e.target.files[0])}/>
      {sampleRefs.map((ref,i)=>(
        <input key={i} ref={ref} type="file" accept="image/*,.pdf" style={{ display:"none" }}
          onChange={e=>handleSampleFile(i, e.target.files[0])}/>
      ))}

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* ── Main Form ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"28px 32px",
          display:"flex", flexDirection:"column", gap:20, maxWidth:760 }}>

          <div>
            <h1 style={{ margin:"0 0 6px", fontSize:30, fontWeight:800, color:C.black,
              fontFamily:"'DM Sans',sans-serif", letterSpacing:"-0.8px" }}>Create a New Gig</h1>
            <p style={{ margin:0, fontSize:14, color:C.textSecondary, fontFamily:"'DM Sans',sans-serif" }}>
              Fill in the details below to publish your listing on GigMarket
            </p>
          </div>

          {/* Stepper */}
          <div style={{ display:"flex", alignItems:"center" }}>
            {STEPS.map((s,i)=>(
              <div key={s} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
                  onClick={()=>setStep(i+1)}>
                  <div style={{ width:30, height:30, borderRadius:15,
                    background:step===i+1?C.black:step>i+1?C.green:"#F1F5F9",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:step>=i+1?C.white:"#94A3B8", fontWeight:700, fontSize:12,
                    fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                    {step>i+1?"✓":i+1}
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.6px", textTransform:"uppercase",
                    color:step===i+1?C.black:"#94A3B8", fontFamily:"'DM Sans',sans-serif" }}>{s}</span>
                </div>
                {i<STEPS.length-1&&<div style={{ flex:1, height:1, background:step>i+1?C.green:"#E2E8F0", margin:"0 12px", transition:"background 0.2s" }}/>}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:6,
            padding:"22px 24px", display:"flex", flexDirection:"column", gap:24 }}>

            <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:8 }}>
              <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>Basic Details</h3>
            </div>

            {/* Title */}
            <div>
              <label style={lbl}>GIG TITLE <span style={{ color:C.red }}>*</span></label>
              <input value={form.title} onChange={e=>set("title",e.target.value)}
                placeholder="e.g. I will design a modern brand identity for your startup"
                style={{...inp, borderColor:errors.title?C.red:C.border}}
                onFocus={e=>e.target.style.borderColor=errors.title?C.red:C.black}
                onBlur={e=>e.target.style.borderColor=errors.title?C.red:C.border}/>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                {errors.title
                  ? <span style={errStyle}>{errors.title}</span>
                  : <span style={{ fontSize:11, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Min 20 characters</span>}
                <span style={{ fontSize:11, color:form.title.length>70?"#F59E0B":C.textMuted,
                  fontFamily:"'DM Sans',sans-serif" }}>{form.title.length}/80</span>
              </div>
            </div>

            {/* Category + Skills */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <label style={lbl}>CATEGORY <span style={{ color:C.red }}>*</span></label>
                <select value={form.category} onChange={e=>set("category",e.target.value)}
                  style={{...inp, borderColor:errors.category?C.red:C.border, cursor:"pointer"}}>
                  {CATS.map(c=><option key={c}>{c}</option>)}
                </select>
                {errors.category&&<span style={errStyle}>{errors.category}</span>}
              </div>

              <div>
                <label style={lbl}>SKILL TAGS <span style={{ color:C.red }}>*</span></label>
                <div style={{ position:"relative" }}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, padding:8,
                    border:`1px solid ${errors.skills?C.red:C.border}`, borderRadius:4,
                    background:C.chipBg, minHeight:46 }}>
                    {form.skills.map(tag=>(
                      <span key={tag} style={{ background:C.badgeBg, borderRadius:12, padding:"4px 10px",
                        fontSize:12, fontWeight:600, color:C.textPrimary,
                        display:"flex", alignItems:"center", gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                        {tag}
                        <button onClick={()=>removeSkill(tag)} style={{ background:"none", border:"none",
                          cursor:"pointer", color:C.textMuted, fontSize:14, padding:0, lineHeight:1, fontWeight:700 }}>×</button>
                      </span>
                    ))}
                    <input value={skillInput}
                      onChange={e=>{ setSkillInput(e.target.value); setShowSug(true); }}
                      onKeyDown={e=>{ if(e.key==="Enter"&&skillInput) addSkill(skillInput); if(e.key==="Escape") setShowSug(false); }}
                      placeholder={form.skills.length===0?"Type to search...":""}
                      style={{ border:"none", background:"transparent", fontSize:13,
                        color:C.textPrimary, outline:"none", fontFamily:"'DM Sans',sans-serif", minWidth:80 }}/>
                  </div>
                  {showSug&&skillInput&&suggestions.length>0&&(
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.white,
                      border:`1px solid ${C.border}`, borderRadius:4,
                      boxShadow:"0 4px 12px rgba(0,0,0,0.1)", zIndex:50, maxHeight:180, overflowY:"auto" }}>
                      {suggestions.slice(0,6).map(s=>(
                        <div key={s} onMouseDown={()=>addSkill(s)}
                          style={{ padding:"8px 12px", cursor:"pointer", fontSize:13,
                            color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}
                          onMouseOver={e=>e.currentTarget.style.background=C.bgAlt}
                          onMouseOut={e=>e.currentTarget.style.background=C.white}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.skills&&<span style={errStyle}>{errors.skills}</span>}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
              <h3 style={{ margin:"0 0 6px", fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>Gig Thumbnail</h3>
              <p style={{ margin:"0 0 14px", fontSize:13, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Upload a high-quality image (PNG, JPG up to 10MB)</p>

              {thumb ? (
                <div style={{ border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden", position:"relative" }}>
                  <img src={thumb.url} alt="thumbnail" style={{ width:"100%", height:200, objectFit:"cover", display:"block" }}/>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.6)",
                    padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.white, fontFamily:"'DM Sans',sans-serif" }}>{thumb.name}</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontFamily:"'DM Sans',sans-serif" }}>{thumb.size}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>thumbRef.current.click()} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:4, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:C.white }}>↑ Replace</button>
                      <button onClick={removeThumb} style={{ background:"rgba(186,26,26,0.8)", border:"none", borderRadius:4, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:C.white }}>✕ Remove</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div onClick={()=>thumbRef.current.click()}
                  onDragOver={e=>{ e.preventDefault(); setIsDrag(true); }}
                  onDragLeave={()=>setIsDrag(false)}
                  onDrop={handleThumbDrop}
                  style={{ border:`2px dashed ${isDrag?C.black:C.border}`, borderRadius:8,
                    background:isDrag?"#EFF6FF":C.chipBg, height:160,
                    display:"flex", flexDirection:"column", alignItems:"center",
                    justifyContent:"center", gap:10, cursor:"pointer", transition:"all 0.15s" }}>
                  <span style={{ fontSize:36 }}>🖼️</span>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ margin:0, fontSize:14, fontWeight:600, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
                      {isDrag?"Drop it here!":"Click to upload or drag & drop"}
                    </p>
                    <p style={{ margin:"4px 0 0", fontSize:12, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
              <h3 style={{ margin:"0 0 14px", fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>Description</h3>
              <label style={lbl}>GIG DESCRIPTION <span style={{ color:C.red }}>*</span></label>
              <div style={{ position:"relative" }}>
                <textarea value={form.description} onChange={e=>set("description",e.target.value)}
                  placeholder="Describe your gig in detail. What makes you unique? What will buyers receive?"
                  rows={6}
                  style={{...inp, resize:"vertical", borderColor:errors.description?C.red:C.border}}
                  onFocus={e=>e.target.style.borderColor=errors.description?C.red:C.black}
                  onBlur={e=>e.target.style.borderColor=errors.description?C.red:C.border}/>
                <span style={{ position:"absolute", bottom:10, right:12, fontSize:11,
                  color:chars<100?C.red:chars>1800?"#F59E0B":C.green,
                  fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>{chars}/2000</span>
              </div>
              {errors.description
                ? <span style={errStyle}>{errors.description}</span>
                : <span style={{ fontSize:11, color:C.textMuted, fontFamily:"'DM Sans',sans-serif", marginTop:4, display:"block" }}>Minimum 100 characters</span>}
            </div>

            {/* Portfolio Samples */}
            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
              <div style={{ marginBottom:14 }}>
                <h3 style={{ margin:"0 0 4px", fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
                  Portfolio Samples <span style={{ fontSize:13, fontWeight:400, color:C.textMuted }}>(Optional)</span>
                </h3>
                <p style={{ margin:0, fontSize:13, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>
                  Upload up to 3 samples of your previous work (images or PDFs, max 10MB each)
                </p>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                {samples.map((sample, i)=>(
                  <div key={i}>
                    {sample ? (
                      <div style={{ border:`1px solid ${C.border}`, borderRadius:8,
                        overflow:"hidden", position:"relative", height:120 }}>
                        {sample.isImage ? (
                          <img src={sample.url} alt={`sample ${i+1}`}
                            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                        ) : (
                          <div style={{ width:"100%", height:"100%", background:C.bgAlt,
                            display:"flex", flexDirection:"column", alignItems:"center",
                            justifyContent:"center", gap:4 }}>
                            <span style={{ fontSize:28 }}>📄</span>
                            <span style={{ fontSize:10, color:C.textMuted, fontFamily:"'DM Sans',sans-serif",
                              textAlign:"center", padding:"0 8px", wordBreak:"break-all" }}>
                              {sample.name.length>16?sample.name.slice(0,16)+"...":sample.name}
                            </span>
                          </div>
                        )}
                        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0)",
                          display:"flex", alignItems:"flex-end", justifyContent:"center",
                          paddingBottom:8, gap:6, transition:"all 0.2s" }}
                          onMouseOver={e=>{ e.currentTarget.style.background="rgba(0,0,0,0.45)"; }}
                          onMouseOut={e=>{ e.currentTarget.style.background="rgba(0,0,0,0)"; }}>
                          <button onClick={()=>sampleRefs[i].current.click()} style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:4, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Replace</button>
                          <button onClick={()=>removeSample(i)} style={{ background:"rgba(186,26,26,0.9)", border:"none", borderRadius:4, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:C.white }}>Remove</button>
                        </div>
                        <div style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.6)",
                          borderRadius:3, padding:"2px 6px", fontSize:9, color:C.white, fontFamily:"'DM Sans',sans-serif" }}>
                          {sample.size}
                        </div>
                      </div>
                    ) : (
                      <div onClick={()=>sampleRefs[i].current.click()}
                        style={{ border:`2px dashed ${C.border}`, borderRadius:8, height:120,
                          display:"flex", flexDirection:"column", alignItems:"center",
                          justifyContent:"center", background:C.chipBg, cursor:"pointer",
                          gap:6, transition:"all 0.15s" }}
                        onMouseOver={e=>{ e.currentTarget.style.borderColor=C.black; e.currentTarget.style.background="#EFF6FF"; }}
                        onMouseOut={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.chipBg; }}>
                        <span style={{ fontSize:26, color:C.textMuted }}>📁</span>
                        <div style={{ textAlign:"center" }}>
                          <p style={{ margin:0, fontSize:12, fontWeight:600, color:C.textSecondary, fontFamily:"'DM Sans',sans-serif" }}>Sample {i+1}</p>
                          <p style={{ margin:"2px 0 0", fontSize:10, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Click to upload</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8 }}>
                {samples.map((s,i)=>(
                  <div key={i} style={{ width:8, height:8, borderRadius:"50%",
                    background:s?C.green:C.border, transition:"background 0.2s" }}/>
                ))}
                <span style={{ fontSize:11, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>
                  {samples.filter(Boolean).length}/3 samples uploaded
                </span>
              </div>
            </div>

            <div style={{ background:"rgba(255,218,214,0.2)", borderLeft:`4px solid ${C.red}`,
              borderRadius:"0 4px 4px 0", padding:"12px 16px" }}>
              <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.redDark,
                lineHeight:1.5, fontFamily:"'DM Sans',sans-serif" }}>
                ⚠ Ensure all uploaded assets are original or properly licensed.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
            <Btn variant="ghost" onClick={()=>onNavigate("browse")}>Cancel</Btn>
            <div style={{ display:"flex", gap:12 }}>
              <Btn variant="outlined" onClick={handleDraft}>Save as Draft</Btn>
              <Btn onClick={handlePublish}>Publish Gig →</Btn>
            </div>
          </div>
        </div>

        {/* ── Pricing Panel ── */}
        <div style={{ width:340, flexShrink:0, background:C.white, borderLeft:`1px solid ${C.border}`,
          padding:28, overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>Pricing Tiers</h3>

          <div style={{ display:"flex", background:"#F1F5F9", borderRadius:4, padding:4 }}>
            {["Basic","Standard","Premium"].map(t=>(
              <button key={t} onClick={()=>setPricingTab(t)}
                style={{ flex:1, padding:"8px 0", border:"none", cursor:"pointer", borderRadius:3,
                  background:pricingTab===t?C.white:"transparent",
                  boxShadow:pricingTab===t?"0 1px 2px rgba(0,0,0,0.06)":"none",
                  fontWeight:pricingTab===t?700:500, fontSize:13,
                  color:pricingTab===t?C.black:"#64748B", fontFamily:"'DM Sans',sans-serif" }}>{t}</button>
            ))}
          </div>

          <div style={{ border:"1px solid #E2E8F0", borderRadius:4, padding:16,
            display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{...lbl, color:C.textSecondary}}>PACKAGE NAME</label>
              <input value={form.pricing[pricingTab].name}
                onChange={e=>setP(pricingTab,"name",e.target.value)}
                style={{...inp, padding:"10px 12px", border:"1px solid #E2E8F0"}}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={{...lbl, color:C.textSecondary}}>PRICE (PKR)</label>
                <input value={form.pricing[pricingTab].price}
                  onChange={e=>setP(pricingTab,"price",e.target.value)}
                  placeholder="5000" type="number"
                  style={{...inp, padding:"10px 12px", border:"1px solid #E2E8F0"}}/>
              </div>
              <div>
                <label style={{...lbl, color:C.textSecondary}}>DELIVERY (DAYS)</label>
                <select value={form.pricing[pricingTab].days}
                  onChange={e=>setP(pricingTab,"days",e.target.value)}
                  style={{...inp, padding:"10px 12px", border:"1px solid #E2E8F0", cursor:"pointer"}}>
                  <option value="">Select</option>
                  {[1,2,3,5,7,10,14,21,30].map(d=><option key={d} value={d}>{d} Days</option>)}
                </select>
              </div>
              <div>
                <label style={{...lbl, color:C.textSecondary}}>REVISIONS</label>
                <select value={form.pricing[pricingTab].revisions}
                  onChange={e=>setP(pricingTab,"revisions",e.target.value)}
                  style={{...inp, padding:"10px 12px", border:"1px solid #E2E8F0", cursor:"pointer"}}>
                  {["1","2","3","5","Unlimited"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{...lbl, color:C.textSecondary}}>NOTES</label>
                <input value={form.pricing[pricingTab].notes}
                  onChange={e=>setP(pricingTab,"notes",e.target.value)}
                  placeholder="Source files, etc."
                  style={{...inp, padding:"10px 12px", border:"1px solid #E2E8F0"}}/>
              </div>
            </div>
          </div>

          {(form.pricing[pricingTab].price||form.pricing[pricingTab].days)&&(
            <div style={{ background:C.bgAlt, borderRadius:6, padding:14 }}>
              <p style={{ margin:"0 0 8px", fontSize:11, fontWeight:700, color:C.textMuted,
                textTransform:"uppercase", letterSpacing:"0.6px", fontFamily:"'DM Sans',sans-serif" }}>LIVE PREVIEW</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>{pricingTab}</span>
                <span style={{ fontSize:18, fontWeight:800, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
                  {form.pricing[pricingTab].price?`PKR ${parseInt(form.pricing[pricingTab].price).toLocaleString()}`:"—"}
                </span>
              </div>
              {form.pricing[pricingTab].days&&(
                <p style={{ margin:"4px 0 0", fontSize:12, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>
                  ⏱ {form.pricing[pricingTab].days} Days · 🔄 {form.pricing[pricingTab].revisions} Rev.
                </p>
              )}
            </div>
          )}

          <div style={{ background:"#EFF6FF", borderLeft:`4px solid ${C.black}`, borderRadius:2, padding:"14px 16px" }}>
            <p style={{ margin:0, fontSize:12, color:"#131B2E", lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>
              ℹ️ Only verified skills from <strong>Module 2 – Skill Assessment</strong> appear in suggestions.
            </p>
          </div>

          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, display:"flex", flexDirection:"column", gap:10 }}>
            <Btn style={{ width:"100%", justifyContent:"center" }} onClick={handlePublish}>Publish Gig →</Btn>
            <Btn variant="outlined" style={{ width:"100%", justifyContent:"center" }} onClick={handleDraft}>Save as Draft</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
