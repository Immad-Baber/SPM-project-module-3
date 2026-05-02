import { useState } from "react";
import { C, Navbar, Btn, Toast } from "./shared";

const CATS=[
  {icon:"💻",name:"Web Development",   count:124,tags:["React","Node.js","Next.js","WordPress","PHP"],  color:"#EFF6FF",accent:"#3B82F6"},
  {icon:"🎨",name:"Graphic Design",    count:89, tags:["Logo","Branding","Figma","Illustration","UI"],  color:"#FDF4FF",accent:"#A855F7"},
  {icon:"✍️",name:"Content Writing",   count:67, tags:["Blog","SEO","Copywriting","Articles","Editing"],color:"#F0FDF4",accent:"#22C55E"},
  {icon:"📱",name:"Mobile Apps",       count:54, tags:["Flutter","React Native","iOS","Android","Swift"],color:"#FFF7ED",accent:"#F97316"},
  {icon:"📊",name:"Data & Analytics",  count:43, tags:["Python","PowerBI","Tableau","SQL","Excel"],     color:"#F0F9FF",accent:"#0EA5E9"},
  {icon:"🎬",name:"Video & Animation", count:38, tags:["Premiere","After Effects","Animation","Reel"],  color:"#FEF2F2",accent:"#EF4444"},
  {icon:"📣",name:"Digital Marketing", count:72, tags:["SEO","Social Media","Google Ads","Email"],      color:"#FEFCE8",accent:"#EAB308"},
  {icon:"🎵",name:"Music & Audio",     count:21, tags:["Mixing","Voiceover","Podcast","Jingle"],        color:"#F0FDF4",accent:"#10B981"},
  {icon:"🌍",name:"Translation",       count:19, tags:["English","Urdu","Arabic","French","Chinese"],   color:"#EFF6FF",accent:"#6366F1"},
];

const POPULAR_TAGS=["React","Figma","SEO","Python","WordPress","Logo Design","Video Editing","Content Writing","Flutter","Node.js","Branding","Data Analysis"];

const ADMIN_STATS=[
  {label:"Total Categories",    value:"9",   icon:"📂"},
  {label:"Active Freelancers",  value:"423", icon:"👥"},
  {label:"Total Gigs Listed",   value:"527", icon:"📋"},
  {label:"Pending Approvals",   value:"14",  icon:"⏳"},
];

export default function CategorySelection({onNavigate}){
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [hovTag,setHovTag]=useState(null);
  const [toast,setToast]=useState(null);
  const [adminTab,setAdminTab]=useState("Overview");
  const [newCatName,setNewCatName]=useState("");

  const show=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const filtered=CATS.filter(c=>!search.trim()||c.name.toLowerCase().includes(search.toLowerCase())||c.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())));

  const handleCatClick=(cat)=>{
    setSelected(cat.name);
    show(`Browsing "${cat.name}" gigs →`,"info");
    setTimeout(()=>onNavigate("browse"),800);
  };

  const handleTagClick=(tag)=>{
    show(`Filtering by tag: "${tag}"`,"info");
    setTimeout(()=>onNavigate("browse"),600);
  };

  const handleAddCategory=()=>{
    if(!newCatName.trim()){show("Enter a category name","error");return;}
    show(`Category "${newCatName}" submitted for review!`);
    setNewCatName("");
  };

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",background:C.bgPage}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <Navbar onNavigate={onNavigate} currentScreen="categories"/>
      {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div style={{flex:1,overflowY:"auto",padding:"28px 32px",display:"flex",flexDirection:"column",gap:28}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h1 style={{margin:"0 0 6px",fontSize:34,fontWeight:800,color:C.black,fontFamily:"'DM Sans',sans-serif",letterSpacing:"-1px"}}>Browse by Category</h1>
            <p style={{margin:0,fontSize:14,color:C.textSecondary,fontFamily:"'DM Sans',sans-serif"}}>Find the perfect freelancer for every project type</p>
          </div>
          <Btn onClick={()=>onNavigate("browse")}>← All Gigs</Btn>
        </div>

        {/* Search */}
        <div style={{position:"relative",maxWidth:540}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,color:C.textMuted}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search categories or skills..." style={{width:"100%",padding:"13px 16px 13px 44px",border:`1px solid ${C.border}`,borderRadius:6,fontSize:14,color:C.textPrimary,background:C.white,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none",boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}} onFocus={e=>e.target.style.borderColor=C.black} onBlur={e=>e.target.style.borderColor=C.border}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.textMuted}}>×</button>}
        </div>

        {/* Categories Grid */}
        <div>
          <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700,color:C.textPrimary,fontFamily:"'DM Sans',sans-serif"}}>
            All Categories
            {search&&<span style={{fontSize:14,fontWeight:400,color:C.textMuted,marginLeft:8}}>({filtered.length} results)</span>}
          </h2>

          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"48px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <span style={{fontSize:40}}>🔍</span>
              <h3 style={{margin:0,fontSize:18,fontWeight:700,color:C.textPrimary,fontFamily:"'DM Sans',sans-serif"}}>No categories found</h3>
              <p style={{margin:0,fontSize:13,color:C.textMuted,fontFamily:"'DM Sans',sans-serif"}}>Try a different search term</p>
              <Btn onClick={()=>setSearch("")} style={{marginTop:8}}>Clear Search</Btn>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {filtered.map(cat=>{
                const isSelected=selected===cat.name;
                return (
                  <div key={cat.name}
                    onClick={()=>handleCatClick(cat)}
                    style={{background:cat.color,border:`2px solid ${isSelected?cat.accent:C.border}`,borderRadius:10,padding:20,cursor:"pointer",transition:"all 0.2s",boxShadow:isSelected?`0 0 0 3px ${cat.accent}22`:"0 1px 3px rgba(0,0,0,0.06)",transform:isSelected?"scale(1.02)":"none"}}
                    onMouseOver={e=>{e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.1)`;e.currentTarget.style.transform="translateY(-2px)";}}
                    onMouseOut={e=>{e.currentTarget.style.boxShadow=isSelected?`0 0 0 3px ${cat.accent}22`:"0 1px 3px rgba(0,0,0,0.06)";e.currentTarget.style.transform=isSelected?"scale(1.02)":"none";}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <span style={{fontSize:32}}>{cat.icon}</span>
                      <span style={{background:cat.accent,color:C.white,borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>{cat.count} gigs</span>
                    </div>
                    <h3 style={{margin:"0 0 10px",fontSize:16,fontWeight:700,color:C.textPrimary,fontFamily:"'DM Sans',sans-serif"}}>{cat.name}</h3>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {cat.tags.slice(0,3).map(tag=>(
                        <span key={tag}
                          onClick={e=>{e.stopPropagation();handleTagClick(tag);}}
                          onMouseEnter={()=>setHovTag(tag)}
                          onMouseLeave={()=>setHovTag(null)}
                          style={{background:hovTag===tag?cat.accent:"rgba(255,255,255,0.7)",color:hovTag===tag?C.white:C.textSecondary,borderRadius:12,padding:"3px 10px",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.15s"}}>
                          {tag}
                        </span>
                      ))}
                      {cat.tags.length>3&&<span style={{fontSize:11,color:C.textMuted,fontFamily:"'DM Sans',sans-serif",padding:"3px 6px"}}>+{cat.tags.length-3} more</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px"}}>
          <h2 style={{margin:"0 0 14px",fontSize:18,fontWeight:700,color:C.textPrimary,fontFamily:"'DM Sans',sans-serif"}}>🔥 Popular Skills</h2>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {POPULAR_TAGS.map(tag=>(
              <button key={tag} onClick={()=>handleTagClick(tag)}
                onMouseOver={e=>{e.currentTarget.style.background=C.black;e.currentTarget.style.color=C.white;e.currentTarget.style.borderColor=C.black;}}
                onMouseOut={e=>{e.currentTarget.style.background=C.white;e.currentTarget.style.color=C.textPrimary;e.currentTarget.style.borderColor=C.border;}}
                style={{padding:"8px 18px",border:`1.5px solid ${C.border}`,borderRadius:20,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:C.white,color:C.textPrimary,transition:"all 0.15s"}}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Panel */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{background:C.navBg,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <h2 style={{margin:"0 0 2px",fontSize:18,fontWeight:700,color:C.white,fontFamily:"'DM Sans',sans-serif"}}>Admin Panel</h2>
              <p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.6)",fontFamily:"'DM Sans',sans-serif"}}>Category management for administrators</p>
            </div>
            <span style={{background:"rgba(128,245,231,0.15)",border:"1px solid rgba(128,245,231,0.3)",borderRadius:4,padding:"4px 10px",fontSize:11,fontWeight:700,color:C.teal,fontFamily:"'DM Sans',sans-serif"}}>ADMIN ONLY</span>
          </div>

          {/* Admin Tabs */}
          <div style={{borderBottom:`1px solid ${C.border}`,display:"flex",padding:"0 24px"}}>
            {["Overview","Add Category","Manage Tags"].map(t=>(
              <button key={t} onClick={()=>setAdminTab(t)} style={{background:"none",border:"none",cursor:"pointer",padding:"12px 0",marginRight:24,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:adminTab===t?700:400,color:adminTab===t?C.black:C.textMuted,borderBottom:adminTab===t?`2px solid ${C.black}`:"2px solid transparent",marginBottom:-1,transition:"all 0.15s"}}>{t}</button>
            ))}
          </div>

          <div style={{padding:24}}>
            {/* Overview */}
            {adminTab==="Overview"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
                {ADMIN_STATS.map(s=>(
                  <div key={s.label} style={{background:C.bgAlt,borderRadius:8,padding:16,textAlign:"center"}}>
                    <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                    <div style={{fontSize:24,fontWeight:800,color:C.textPrimary,fontFamily:"'DM Sans',sans-serif"}}>{s.value}</div>
                    <div style={{fontSize:11,color:C.textMuted,fontFamily:"'DM Sans',sans-serif",marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Category */}
            {adminTab==="Add Category"&&(
              <div style={{maxWidth:480,display:"flex",flexDirection:"column",gap:16}}>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:"0.8px",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",display:"block",marginBottom:6}}>CATEGORY NAME</label>
                  <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="e.g. 3D Modeling" style={{width:"100%",padding:"11px 14px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:14,color:C.textPrimary,background:C.white,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"}} onFocus={e=>e.target.style.borderColor=C.black} onBlur={e=>e.target.style.borderColor=C.border} onKeyDown={e=>{if(e.key==="Enter")handleAddCategory();}}/>
                </div>
                <div>
                  <label style={{fontSize:10,fontWeight:700,color:C.textSecondary,letterSpacing:"0.8px",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",display:"block",marginBottom:6}}>ICON (EMOJI)</label>
                  <input placeholder="e.g. 🖼️" style={{width:"100%",padding:"11px 14px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:20,color:C.textPrimary,background:C.white,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",outline:"none"}}/>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <Btn onClick={handleAddCategory} style={{flex:1,justifyContent:"center"}}>Submit for Review</Btn>
                  <Btn variant="outlined" onClick={()=>setNewCatName("")} style={{flex:1,justifyContent:"center"}}>Clear</Btn>
                </div>
              </div>
            )}

            {/* Manage Tags */}
            {adminTab==="Manage Tags"&&(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <p style={{margin:0,fontSize:13,color:C.textSecondary,fontFamily:"'DM Sans',sans-serif"}}>Click any tag to remove it or add new ones below.</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {POPULAR_TAGS.map(tag=>(
                    <span key={tag} style={{background:C.badgeBg,borderRadius:12,padding:"5px 12px",fontSize:12,fontWeight:600,color:C.textPrimary,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}}>
                      {tag}
                      <button onClick={()=>show(`Tag "${tag}" removed`,"warning")} style={{background:"none",border:"none",cursor:"pointer",color:C.red,fontSize:14,padding:0,lineHeight:1,fontWeight:700}}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{display:"flex",gap:10}}>
                  <input placeholder="Add new tag..." style={{flex:1,padding:"10px 14px",border:`1px solid ${C.border}`,borderRadius:4,fontSize:13,color:C.textPrimary,background:C.white,fontFamily:"'DM Sans',sans-serif",outline:"none"}} onKeyDown={e=>{if(e.key==="Enter"){show("Tag added!");e.target.value="";}}} onFocus={e=>e.target.style.borderColor=C.black} onBlur={e=>e.target.style.borderColor=C.border}/>
                  <Btn onClick={()=>show("Tag added!")}>Add Tag</Btn>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
