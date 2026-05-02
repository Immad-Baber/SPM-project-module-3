import { useState, useMemo } from "react";
import { C, Navbar, StickyNote, VerifiedBadge, Stars, Btn, Toast, GIG_CARDS } from "./shared";

// Extended gig data for multiple pages
const ALL_GIGS = [
  ...GIG_CARDS,
  { id:7,  name:"Omar Farooq",   rating:"4.8", reviews:"55",  title:"I will create a stunning WordPress website with custom theme",           tags:["WordPress","PHP"],    price:"PKR 4,500",  priceNum:4500,  delivery:"4 days",  category:"Web Dev", color:"#F0FDF4", icon:"🌐" },
  { id:8,  name:"Hina Malik",    rating:"4.9", reviews:"141", title:"I will design professional UI/UX for your mobile or web application",    tags:["Figma","UI/UX"],     price:"PKR 7,000",  priceNum:7000,  delivery:"6 days",  category:"Design",  color:"#FDF4FF", icon:"🖌️" },
  { id:9,  name:"Kamran Shah",   rating:"4.5", reviews:"29",  title:"I will write compelling copy for your website landing page",             tags:["Copywriting","SEO"], price:"PKR 1,800",  priceNum:1800,  delivery:"2 days",  category:"Writing", color:"#FFF7ED", icon:"📝" },
  { id:10, name:"Sana Butt",     rating:"4.7", reviews:"88",  title:"I will build a full e-commerce store with payment gateway integration",  tags:["Next.js","Stripe"],  price:"PKR 15,000", priceNum:15000, delivery:"14 days", category:"Web Dev", color:"#EFF6FF", icon:"🛒" },
  { id:11, name:"Adeel Rauf",    rating:"4.6", reviews:"43",  title:"I will create motion graphics and explainer videos for your brand",       tags:["After Effects","AE"],price:"PKR 9,000",  priceNum:9000,  delivery:"5 days",  category:"Video",   color:"#FEF2F2", icon:"🎞️" },
  { id:12, name:"Maryam Javed",  rating:"4.9", reviews:"177", title:"I will develop a cross-platform mobile app with Flutter and Firebase",   tags:["Flutter","Firebase"],price:"PKR 20,000", priceNum:20000, delivery:"15 days", category:"Web Dev", color:"#F0FDF4", icon:"📲" },
  { id:13, name:"Faisal Qureshi", rating:"4.7",reviews:"62",  title:"I will design a modern logo and complete brand identity package",        tags:["Illustrator","Logo"],price:"PKR 5,500",  priceNum:5500,  delivery:"3 days",  category:"Design",  color:"#FEFCE8", icon:"✏️" },
  { id:14, name:"Ayesha Tariq",  rating:"4.8", reviews:"99",  title:"I will do keyword research and on-page SEO optimization for your site",  tags:["SEO","Analytics"],   price:"PKR 3,000",  priceNum:3000,  delivery:"3 days",  category:"Writing", color:"#F0F9FF", icon:"📈" },
  { id:15, name:"Noman Ashraf",  rating:"4.5", reviews:"37",  title:"I will create a Python machine learning model for your data needs",      tags:["Python","ML"],       price:"PKR 11,000", priceNum:11000, delivery:"8 days",  category:"Data",    color:"#FDF2F8", icon:"🤖" },
  { id:16, name:"Rabia Khalid",  rating:"4.9", reviews:"210", title:"I will produce a professional podcast intro, outro and background music", tags:["Audio","Music"],     price:"PKR 2,500",  priceNum:2500,  delivery:"2 days",  category:"Video",   color:"#F0FDF4", icon:"🎙️" },
  { id:17, name:"Zubair Ahmed",  rating:"4.6", reviews:"51",  title:"I will build a REST API with Node.js, Express and MongoDB",             tags:["Node.js","MongoDB"], price:"PKR 6,000",  priceNum:6000,  delivery:"5 days",  category:"Web Dev", color:"#EFF6FF", icon:"⚙️" },
  { id:18, name:"Iqra Nawaz",    rating:"4.8", reviews:"73",  title:"I will create infographics and data visualization designs for you",      tags:["Canva","PowerBI"],   price:"PKR 2,200",  priceNum:2200,  delivery:"2 days",  category:"Data",    color:"#FFF7ED", icon:"📉" },
];

const ITEMS_PER_PAGE = 6;
const FILTERS   = ["All","Web Dev","Design","Writing","Marketing","Data","Video"];
const SORT_OPTS = ["Most Relevant","Lowest Price","Highest Rated","Newest"];
const DEL_OPTS  = ["Any","Up to 1 day","Up to 3 days","Up to 7 days"];

function GigCard({ gig, onNavigate, saved, onSave }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ background:C.white, border:`1px solid ${hov?"#9CA3AF":C.border}`, borderRadius:6,
        overflow:"hidden", cursor:"pointer", transition:"box-shadow 0.2s,transform 0.2s",
        boxShadow:hov?"0 8px 28px rgba(0,0,0,0.12)":"0 1px 4px rgba(0,0,0,0.05)",
        transform:hov?"translateY(-3px)":"none", display:"flex", flexDirection:"column" }}>
      <div onClick={()=>onNavigate("detail")}
        style={{ height:140, background:gig.color, display:"flex", alignItems:"center",
          justifyContent:"center", position:"relative" }}>
        <span style={{ fontSize:44 }}>{gig.icon}</span>
        <button onClick={e=>{ e.stopPropagation(); onSave(gig.id); }}
          style={{ position:"absolute", top:10, right:10,
            background:saved?"#FEF2F2":"rgba(255,255,255,0.95)",
            border:"none", borderRadius:"50%", width:32, height:32,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", fontSize:14, boxShadow:"0 2px 6px rgba(0,0,0,0.1)" }}>
          {saved?"❤️":"🤍"}
        </button>
      </div>
      <div onClick={()=>onNavigate("detail")}
        style={{ padding:14, display:"flex", flexDirection:"column", gap:8, flex:1 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:34, height:34, borderRadius:8, background:C.navBg, color:C.white,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}>
            {gig.name.split(" ").map(w=>w[0]).join("")}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>{gig.name}</div>
            <Stars rating={gig.rating} count={gig.reviews}/>
          </div>
        </div>
        <p style={{ fontSize:13, fontWeight:500, color:C.textPrimary, margin:0,
          lineHeight:1.5, fontFamily:"'DM Sans',sans-serif" }}>{gig.title}</p>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {gig.tags.map(t=>(
            <span key={t} style={{ background:C.badgeBg, borderRadius:3, padding:"2px 7px",
              fontSize:9, fontWeight:700, color:C.badgeText, textTransform:"uppercase",
              letterSpacing:"0.3px", fontFamily:"'DM Sans',sans-serif" }}>{t}</span>
          ))}
          <VerifiedBadge/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          borderTop:`1px solid ${C.border}`, paddingTop:10, marginTop:4 }}>
          <span style={{ fontSize:11, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>⏱ {gig.delivery}</span>
          <span style={{ fontWeight:700, fontSize:14, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>{gig.price}</span>
        </div>
      </div>
    </div>
  );
}

export default function BrowseGigs({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]       = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [delivery, setDelivery]   = useState("Any");
  const [rating, setRating]       = useState(0);
  const [sort, setSort]           = useState("Most Relevant");
  const [category, setCategory]   = useState("");
  const [page, setPage]           = useState(1);
  const [saved, setSaved]         = useState([]);
  const [toast, setToast]         = useState(null);

  const show = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleSave = (id) => {
    const isSaved = saved.includes(id);
    setSaved(s => isSaved ? s.filter(x=>x!==id) : [...s,id]);
    show(isSaved ? "Removed from saved gigs" : "Gig saved! ❤️");
  };

  const clearAll = () => {
    setActiveFilter("All"); setSearch(""); setBudgetMin(""); setBudgetMax("");
    setDelivery("Any"); setRating(0); setSort("Most Relevant"); setCategory(""); setPage(1);
    show("All filters cleared","info");
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let r = [...ALL_GIGS];
    if (activeFilter !== "All") r = r.filter(g => g.category === activeFilter);
    if (search.trim()) r = r.filter(g =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
    if (budgetMin) r = r.filter(g => g.priceNum >= parseInt(budgetMin));
    if (budgetMax) r = r.filter(g => g.priceNum <= parseInt(budgetMax));
    if (sort === "Lowest Price")   r.sort((a,b) => a.priceNum - b.priceNum);
    if (sort === "Highest Rated")  r.sort((a,b) => parseFloat(b.rating) - parseFloat(a.rating));
    if (sort === "Newest")         r.sort((a,b) => b.id - a.id);
    return r;
  }, [activeFilter, search, budgetMin, budgetMax, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentGigs = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  const goToPage = (p) => {
    const np = Math.max(1, Math.min(totalPages, p));
    setPage(np);
    show(`Page ${np} of ${totalPages}`,"info");
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const inp = { width:"100%", padding:"10px 12px", border:`1px solid ${C.border}`,
    borderRadius:4, fontSize:13, color:C.textPrimary, background:C.white,
    fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none" };

  // Page numbers to show
  const pageNums = [];
  for (let i=1; i<=totalPages; i++) pageNums.push(i);

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh",
      fontFamily:"'DM Sans',sans-serif", background:C.bgPage }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Navbar onNavigate={onNavigate} currentScreen="browse"/>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* ── Sidebar ── */}
        <aside style={{ width:240, flexShrink:0, background:C.white,
          borderRight:`1px solid ${C.border}`, padding:"24px 16px",
          overflowY:"auto", display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <h3 style={{ margin:"0 0 4px", fontSize:18, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>Filters</h3>
            <p style={{ margin:0, fontSize:12, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Refine your results</p>
          </div>

          <div>
            <label style={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:"0.8px",
              textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", display:"block", marginBottom:6 }}>CATEGORY</label>
            <select value={category} onChange={e=>{ setCategory(e.target.value); setPage(1); }} style={inp}>
              <option value="">All Categories</option>
              {["Web Development","Graphic Design","Content Writing","Mobile Apps","Data & Analytics","Video & Animation"].map(c=>(
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:"0.8px",
              textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", display:"block", marginBottom:6 }}>BUDGET (PKR)</label>
            <div style={{ display:"flex", gap:8 }}>
              <input placeholder="Min" value={budgetMin} onChange={e=>{ setBudgetMin(e.target.value); setPage(1); }}
                type="number" style={{...inp, flex:1}}/>
              <input placeholder="Max" value={budgetMax} onChange={e=>{ setBudgetMax(e.target.value); setPage(1); }}
                type="number" style={{...inp, flex:1}}/>
            </div>
          </div>

          <div>
            <label style={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:"0.8px",
              textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", display:"block", marginBottom:8 }}>DELIVERY TIME</label>
            {DEL_OPTS.map(d=>(
              <label key={d} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                <input type="radio" name="delivery" checked={delivery===d}
                  onChange={()=>{ setDelivery(d); setPage(1); }} style={{ accentColor:C.black }}/>
                <span style={{ fontSize:13, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>{d}</span>
              </label>
            ))}
          </div>

          <div>
            <label style={{ fontSize:10, fontWeight:700, color:C.textSecondary, letterSpacing:"0.8px",
              textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif", display:"block", marginBottom:8 }}>SELLER RATING</label>
            <div style={{ display:"flex", gap:2 }}>
              {[1,2,3,4,5].map(s=>(
                <span key={s} onClick={()=>{ setRating(s===rating?0:s); setPage(1); }}
                  style={{ fontSize:24, cursor:"pointer", color:s<=rating?C.yellow:"#D1D5DB", transition:"color 0.15s" }}>★</span>
              ))}
            </div>
            {rating>0 && <p style={{ margin:"4px 0 0", fontSize:11, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>{rating}+ stars</p>}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
            <Btn style={{ width:"100%", justifyContent:"center" }} onClick={()=>show("Filters applied! ✓")}>Apply Filters</Btn>
            <Btn variant="outlined" onClick={clearAll} style={{ width:"100%", justifyContent:"center" }}>Clear All</Btn>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex:1, overflowY:"auto", padding:28, display:"flex", flexDirection:"column", gap:20 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <h1 style={{ margin:0, fontSize:34, fontWeight:800, color:C.black, fontFamily:"'DM Sans',sans-serif", letterSpacing:"-1px" }}>Browse Gigs</h1>

            {/* Search */}
            <div style={{ position:"relative", maxWidth:660 }}>
              <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.textMuted, fontSize:16 }}>🔍</span>
              <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
                placeholder="Search gigs by skill or keyword..."
                style={{ width:"100%", padding:"13px 16px 13px 42px", border:`1px solid ${C.border}`,
                  borderRadius:6, fontSize:14, color:C.textPrimary, background:C.white,
                  fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none" }}
                onFocus={e=>e.target.style.borderColor=C.black}
                onBlur={e=>e.target.style.borderColor=C.border}/>
              {search && (
                <button onClick={()=>{ setSearch(""); setPage(1); }}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.textMuted }}>×</button>
              )}
            </div>

            {/* Filter Chips */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {FILTERS.map(f=>(
                <button key={f} onClick={()=>{ setActiveFilter(f); setPage(1); if(f!=="All") onNavigate("categories"); }}
                  style={{ padding:"7px 16px", borderRadius:20, fontSize:13, fontWeight:600,
                    cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s",
                    background:activeFilter===f ? C.black : C.white,
                    color:activeFilter===f ? C.white : C.textPrimary,
                    border:activeFilter===f ? `1.5px solid ${C.black}` : `1.5px solid ${C.border}` }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Sort Bar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            borderBottom:`1px solid ${C.border}`, paddingBottom:12 }}>
            <span style={{ fontSize:13, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>
              Showing <strong>{(page-1)*ITEMS_PER_PAGE+1}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> gigs
              {saved.length>0 && <span style={{ marginLeft:12, fontSize:12, color:C.textMuted }}>❤️ {saved.length} saved</span>}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Sort:</span>
              <select value={sort} onChange={e=>{ setSort(e.target.value); setPage(1); }}
                style={{ padding:"6px 12px", border:`1px solid ${C.border}`, borderRadius:4,
                  fontSize:13, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", outline:"none" }}>
                {SORT_OPTS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Grid or Empty */}
          {currentGigs.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", display:"flex",
              flexDirection:"column", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:48 }}>🔍</span>
              <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:C.textPrimary, fontFamily:"'DM Sans',sans-serif" }}>No gigs found</h3>
              <p style={{ margin:0, fontSize:14, color:C.textMuted, fontFamily:"'DM Sans',sans-serif" }}>Try adjusting your filters or search</p>
              <Btn onClick={clearAll} style={{ marginTop:8 }}>Clear All Filters</Btn>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
              {currentGigs.map(g=>(
                <GigCard key={g.id} gig={g} onNavigate={onNavigate}
                  saved={saved.includes(g.id)} onSave={handleSave}/>
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
              gap:6, paddingTop:12 }}>

              {/* Prev */}
              <button onClick={()=>goToPage(page-1)} disabled={page===1}
                style={{ padding:"9px 16px", border:`1px solid ${C.border}`, borderRadius:4,
                  fontSize:13, fontWeight:700, cursor:page===1?"not-allowed":"pointer",
                  opacity:page===1?0.4:1, background:C.white, fontFamily:"'DM Sans',sans-serif",
                  display:"flex", alignItems:"center", gap:4, transition:"all 0.15s" }}
                onMouseOver={e=>{ if(page!==1) e.currentTarget.style.background=C.bgAlt; }}
                onMouseOut={e=>{ e.currentTarget.style.background=C.white; }}>
                ← Prev
              </button>

              {/* Page Numbers */}
              {pageNums.map(p=>(
                <button key={p} onClick={()=>goToPage(p)}
                  style={{ width:40, height:40, border:`1.5px solid ${p===page?C.black:C.border}`,
                    borderRadius:4, fontSize:13, fontWeight:700, cursor:"pointer",
                    background:p===page?C.black:C.white,
                    color:p===page?C.white:C.textPrimary,
                    fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s",
                    boxShadow:p===page?"0 2px 8px rgba(0,0,0,0.15)":"none" }}
                  onMouseOver={e=>{ if(p!==page){ e.currentTarget.style.background=C.bgAlt; } }}
                  onMouseOut={e=>{ if(p!==page){ e.currentTarget.style.background=C.white; } }}>
                  {p}
                </button>
              ))}

              {/* Next */}
              <button onClick={()=>goToPage(page+1)} disabled={page===totalPages}
                style={{ padding:"9px 16px", border:`1px solid ${C.border}`, borderRadius:4,
                  fontSize:13, fontWeight:700, cursor:page===totalPages?"not-allowed":"pointer",
                  opacity:page===totalPages?0.4:1, background:C.white, fontFamily:"'DM Sans',sans-serif",
                  display:"flex", alignItems:"center", gap:4, transition:"all 0.15s" }}
                onMouseOver={e=>{ if(page!==totalPages) e.currentTarget.style.background=C.bgAlt; }}
                onMouseOut={e=>{ e.currentTarget.style.background=C.white; }}>
                Next →
              </button>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p style={{ textAlign:"center", margin:0, fontSize:12, color:C.textMuted,
              fontFamily:"'DM Sans',sans-serif" }}>
              Page {page} of {totalPages} · {filtered.length} total gigs
            </p>
          )}

          <StickyNote text="🔗 Clicking a gig card → G03_GigDetail · Category chip → G03_CategorySelection · Freelancer name → G01 Profile Management"/>
        </main>
      </div>
    </div>
  );
}
-
