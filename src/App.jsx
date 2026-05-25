import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, Database, FolderOpen, Brain, Settings, Cpu,
  Search, Plus, Send, Wifi, WifiOff, Zap, FileText, Code,
  Download, Trash2, Clock, ChevronRight, Globe, Lock,
  HardDrive, Activity, Tag, X, Check, RefreshCw, Server,
  BookOpen, Layers, Archive, Filter, Eye, AlertTriangle,
  ExternalLink, Menu, MoreHorizontal, Sparkles, Network,
  Shield, Bolt, Bot, Mic, Paperclip, BarChart3, Circle
} from "lucide-react";

// ── Theme ─────────────────────────────────────────────────────────────────
const C = {
  bg:         "#090912",
  surface:    "#0f0f1c",
  card:       "#141425",
  hover:      "#1b1b2e",
  border:     "rgba(100,100,180,0.10)",
  borderMed:  "rgba(100,100,200,0.18)",
  borderHi:   "rgba(99,102,241,0.45)",
  text:       "#ddddf0",
  muted:      "#686882",
  dim:        "#3a3a58",
  accent:     "#6366f1",
  accentBr:   "#a5b4fc",
  accentGlow: "rgba(99,102,241,0.12)",
  green:      "#22c55e",
  greenDim:   "rgba(34,197,94,0.12)",
  yellow:     "#f59e0b",
  yellowDim:  "rgba(245,158,11,0.12)",
  red:        "#f87171",
  redDim:     "rgba(248,113,113,0.12)",
  cyan:       "#22d3ee",
};

// ── Static Data ────────────────────────────────────────────────────────────
const LOCAL_MODELS = [
  { id:"llama3-8b",  name:"Llama 3.2",  size:"8B",   gb:4.7, fmt:"Q4_K_M", status:"ready",     speed:"Fast",      quality:"★★★★" },
  { id:"mistral-7b", name:"Mistral 7B", size:"7B",   gb:4.1, fmt:"Q4_K_M", status:"ready",     speed:"Fast",      quality:"★★★★" },
  { id:"phi35-mini", name:"Phi 3.5",    size:"3.8B", gb:2.2, fmt:"Q8_0",   status:"ready",     speed:"Very Fast", quality:"★★★" },
  { id:"gemma2-9b",  name:"Gemma 2",    size:"9B",   gb:6.5, fmt:"Q5_K_M", status:"available", speed:"Medium",    quality:"★★★★" },
  { id:"llama3-70b", name:"Llama 3.3",  size:"70B",  gb:26,  fmt:"Q2_K",   status:"available", speed:"Slow",      quality:"★★★★★" },
];
const CLOUD_MODELS = [
  { id:"claude-sonnet-4-20250514", name:"Claude Sonnet 4",  provider:"Anthropic", quality:"★★★★★", status:"active" },
  { id:"gpt-4o",                   name:"GPT-4o",           provider:"OpenAI",    quality:"★★★★★", status:"no-key" },
  { id:"gemini-1.5-pro",           name:"Gemini 1.5 Pro",   provider:"Google",    quality:"★★★★★", status:"no-key" },
  { id:"gpt-4o-mini",              name:"GPT-4o Mini",      provider:"OpenAI",    quality:"★★★★",  status:"no-key" },
];
const SAMPLE_FILES = [
  { id:1, name:"research_paper.pdf",     type:"pdf",   size:"2.4 MB", indexed:true,  tags:["research","AI"],      ago:"2 hours ago" },
  { id:2, name:"project_notes.md",       type:"md",    size:"45 KB",  indexed:true,  tags:["notes","project"],    ago:"Yesterday" },
  { id:3, name:"data_analysis.csv",      type:"csv",   size:"1.2 MB", indexed:true,  tags:["data"],               ago:"3 days ago" },
  { id:4, name:"architecture_diagram.png",type:"img",  size:"890 KB", indexed:true,  tags:["diagram"],            ago:"Last week" },
  { id:5, name:"api_reference.json",     type:"json",  size:"234 KB", indexed:true,  tags:["api","docs"],         ago:"2 weeks ago" },
  { id:6, name:"meeting_transcript.docx",type:"docx",  size:"156 KB", indexed:false, tags:["meeting"],            ago:"1 month ago" },
  { id:7, name:"financial_model.xlsx",   type:"xlsx",  size:"3.1 MB", indexed:true,  tags:["finance"],            ago:"1 month ago" },
  { id:8, name:"codebase_review.txt",    type:"txt",   size:"67 KB",  indexed:true,  tags:["code","review"],      ago:"2 months ago" },
];
const SAMPLE_MEMORIES = [
  { id:1, kind:"preference", text:"Prefers concise technical answers with code examples", conf:0.95, ago:"2 days ago" },
  { id:2, kind:"fact",       text:"Working on a machine learning project using PyTorch",  conf:0.88, ago:"3 days ago" },
  { id:3, kind:"context",    text:"Primarily uses Python and TypeScript",                conf:0.92, ago:"1 week ago" },
  { id:4, kind:"preference", text:"Prefers dark themes and minimal interfaces",          conf:0.79, ago:"1 week ago" },
  { id:5, kind:"fact",       text:"Team of 5 devs building a SaaS product",             conf:0.85, ago:"2 weeks ago" },
  { id:6, kind:"context",    text:"Interested in offline-first architecture patterns",   conf:0.90, ago:"3 weeks ago" },
];

// ── Utilities ───────────────────────────────────────────────────────────────
function fileIcon(type) {
  const m = { pdf:<FileText size={16}/>, md:<FileText size={16}/>, txt:<FileText size={16}/>, csv:<BarChart3 size={16}/>, json:<Code size={16}/>, img:<Eye size={16}/>, docx:<BookOpen size={16}/>, xlsx:<BarChart3 size={16}/>};
  return m[type] || <FileText size={16}/>;
}

function Pill({ children, color="accent", small=false }) {
  const cm = {
    accent: { bg:C.accentGlow, text:C.accentBr,  border:"rgba(99,102,241,0.3)" },
    green:  { bg:C.greenDim,   text:C.green,      border:"rgba(34,197,94,0.3)" },
    yellow: { bg:C.yellowDim,  text:C.yellow,     border:"rgba(245,158,11,0.3)" },
    red:    { bg:C.redDim,     text:C.red,        border:"rgba(248,113,113,0.3)" },
    gray:   { bg:"rgba(80,80,120,0.15)", text:C.muted, border:C.border },
  };
  const c = cm[color]||cm.accent;
  return (
    <span style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`,
      borderRadius:6, padding: small ? "1px 6px" : "2px 9px", fontSize: small ? 10 : 11, fontWeight:500, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"2px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:C.accent,
          animation:`nexusPulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
      <style>{`@keyframes nexusPulse{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

function MarkdownMsg({ text, streaming }) {
  const lines = text.split("\n");
  const renderLine = (line, i) => {
    if (!line) return <div key={i} style={{height:6}}/>;
    const isBullet = /^[•\-\*] /.test(line);
    const isH2 = line.startsWith("## ");
    const isH3 = line.startsWith("### ");
    const raw = isBullet ? line.slice(2) : isH2 ? line.slice(3) : isH3 ? line.slice(4) : line;
    const inline = raw.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p,j) => {
      if (p.startsWith("**")&&p.endsWith("**")) return <strong key={j} style={{color:C.text,fontWeight:600}}>{p.slice(2,-2)}</strong>;
      if (p.startsWith("`")&&p.endsWith("`")) return <code key={j} style={{background:"rgba(99,102,241,0.15)",color:C.accentBr,padding:"1px 5px",borderRadius:4,fontSize:"0.88em",fontFamily:"monospace"}}>{p.slice(1,-1)}</code>;
      return p;
    });
    if (isH2) return <div key={i} style={{fontWeight:600,fontSize:14,color:C.text,margin:"10px 0 3px"}}>{inline}</div>;
    if (isH3) return <div key={i} style={{fontWeight:500,fontSize:13,color:C.accentBr,margin:"7px 0 2px"}}>{inline}</div>;
    if (isBullet) return (
      <div key={i} style={{display:"flex",gap:7,margin:"2px 0",paddingLeft:4}}>
        <span style={{color:C.accent,marginTop:3,flexShrink:0}}>▸</span>
        <span>{inline}</span>
      </div>
    );
    return <div key={i} style={{lineHeight:1.65}}>{inline}</div>;
  };
  return (
    <div style={{fontSize:13.5,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {lines.map(renderLine)}
      {streaming && <span style={{display:"inline-block",width:7,height:14,background:C.accent,borderRadius:2,marginLeft:2,animation:"nexusBlink .7s step-end infinite"}}/>}
      <style>{`@keyframes nexusBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"chat",      icon:<MessageSquare size={18}/>, label:"Chat" },
  { id:"knowledge", icon:<Database size={18}/>,      label:"Knowledge" },
  { id:"memory",    icon:<Brain size={18}/>,          label:"Memory" },
  { id:"models",    icon:<Cpu size={18}/>,            label:"Models" },
  { id:"settings",  icon:<Settings size={18}/>,       label:"Settings" },
];
const MODES = [
  { id:"offline", label:"Offline", color:C.yellow, icon:<WifiOff size={12}/> },
  { id:"hybrid",  label:"Hybrid",  color:C.green,  icon:<Zap size={12}/> },
  { id:"online",  label:"Online",  color:C.cyan,   icon:<Globe size={12}/> },
];

function Sidebar({ page, setPage, mode, setMode }) {
  const activeMode = MODES.find(m => m.id === mode);
  return (
    <div style={{ width:220, flexShrink:0, background:C.surface, borderRight:`1px solid ${C.border}`,
      display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden" }}>
      {/* Logo */}
      <div style={{padding:"20px 18px 14px", borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${C.accent},#a855f7)`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Network size={16} color="#fff"/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.text,letterSpacing:"-0.3px"}}>NexusAI</div>
            <div style={{fontSize:10,color:C.muted,marginTop:1}}>v2.4.1 · Hybrid</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"10px 8px",overflow:"auto"}}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
              borderRadius:8, border:"none", cursor:"pointer", textAlign:"left", marginBottom:2,
              background: active ? C.accentGlow : "transparent",
              color: active ? C.accentBr : C.muted,
              transition:"all 0.15s",
              outline: active ? `1px solid rgba(99,102,241,0.25)` : "none"
            }}>
              <span style={{opacity: active ? 1 : 0.7}}>{n.icon}</span>
              <span style={{fontSize:13, fontWeight: active ? 500 : 400}}>{n.label}</span>
              {active && <ChevronRight size={12} style={{marginLeft:"auto", opacity:0.6}}/>}
            </button>
          );
        })}
      </nav>

      {/* Mode Selector */}
      <div style={{padding:"12px 8px", borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:10, color:C.dim, padding:"0 8px", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.8px"}}>Mode</div>
        <div style={{display:"flex", flexDirection:"column", gap:2}}>
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                borderRadius:7, border: active ? `1px solid ${m.color}30` : "1px solid transparent",
                background: active ? `${m.color}10` : "transparent",
                cursor:"pointer", color: active ? m.color : C.muted, width:"100%",
              }}>
                {m.icon}
                <span style={{fontSize:12, fontWeight: active ? 500 : 400}}>{m.label}</span>
                {active && <div style={{marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:m.color}}/>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{padding:"10px 16px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:6}}>
        <div style={{width:7, height:7, borderRadius:"50%", background: activeMode.color, boxShadow:`0 0 6px ${activeMode.color}`}}/>
        <span style={{fontSize:11, color:C.muted}}>{activeMode.label} Mode Active</span>
      </div>
    </div>
  );
}

// ── Chat Page ────────────────────────────────────────────────────────────────
function ChatPage({ conversations, activeConvId, setActiveConvId, activeConv, input, setInput,
  isLoading, streamingText, handleSend, newConv, messagesEndRef, inputRef, mode, selectedModel }) {
  const msgs = activeConv?.messages || [];
  const handleKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const modeColor = { offline:C.yellow, hybrid:C.green, online:C.cyan }[mode] || C.green;

  return (
    <div style={{display:"flex", height:"100vh", overflow:"hidden"}}>
      {/* Conversation List */}
      <div style={{width:220, flexShrink:0, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", background:C.bg}}>
        <div style={{padding:"14px 12px 10px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <span style={{fontSize:12, color:C.muted, fontWeight:500}}>Conversations</span>
          <button onClick={newConv} style={{background:C.accentGlow, border:`1px solid rgba(99,102,241,0.3)`,
            borderRadius:6, padding:"4px 8px", cursor:"pointer", color:C.accentBr, display:"flex", gap:4, alignItems:"center"}}>
            <Plus size={12}/><span style={{fontSize:11}}>New</span>
          </button>
        </div>
        <div style={{flex:1, overflow:"auto", padding:"8px 6px"}}>
          {conversations.map(c => {
            const active = c.id === activeConvId;
            return (
              <button key={c.id} onClick={() => setActiveConvId(c.id)} style={{
                width:"100%", padding:"9px 10px", borderRadius:7, border:"none", cursor:"pointer",
                textAlign:"left", marginBottom:2,
                background: active ? C.accentGlow : "transparent",
                outline: active ? `1px solid rgba(99,102,241,0.2)` : "none"
              }}>
                <div style={{fontSize:12, fontWeight:500, color: active ? C.accentBr : C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                  {c.title}
                </div>
                <div style={{fontSize:11, color:C.muted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                  {c.preview || "Start chatting..."}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
        {/* Header */}
        <div style={{padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, flexShrink:0}}>
          <Bot size={16} style={{color:C.accentBr}}/>
          <span style={{fontSize:13, fontWeight:500, color:C.text, flex:1}}>{activeConv?.title || "New Chat"}</span>
          <div style={{display:"flex", alignItems:"center", gap:6}}>
            <div style={{width:6, height:6, borderRadius:"50%", background:modeColor}}/>
            <span style={{fontSize:11, color:C.muted}}>{selectedModel.split("-").slice(0,2).join(" ")}</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{flex:1, overflow:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:16}}>
          {msgs.length === 0 && (
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:12, opacity:0.6}}>
              <Network size={40} color={C.accent}/>
              <div style={{fontSize:14, color:C.muted}}>Start a conversation</div>
            </div>
          )}
          {msgs.map((msg, i) => (
            <div key={i} style={{ display:"flex", gap:10, flexDirection: msg.role==="user" ? "row-reverse" : "row" }}>
              <div style={{
                width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                background: msg.role==="user" ? C.accentGlow : "rgba(168,85,247,0.12)",
                border: `1px solid ${msg.role==="user" ? C.borderHi : "rgba(168,85,247,0.3)"}`,
                color: msg.role==="user" ? C.accentBr : "#c084fc", fontSize:11, fontWeight:700
              }}>
                {msg.role==="user" ? "U" : <Bot size={13}/>}
              </div>
              <div style={{
                maxWidth:"72%", padding:"11px 14px", borderRadius: msg.role==="user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                background: msg.role==="user" ? "rgba(99,102,241,0.18)" : C.card,
                border: `1px solid ${msg.role==="user" ? C.borderHi : C.border}`,
              }}>
                {msg.role==="assistant" ? <MarkdownMsg text={msg.content} streaming={false}/> :
                  <div style={{fontSize:13.5, color:C.text, lineHeight:1.6, fontFamily:"system-ui,sans-serif"}}>{msg.content}</div>
                }
                <div style={{display:"flex", gap:8, alignItems:"center", marginTop:7, flexDirection: msg.role==="user" ? "row-reverse" : "row"}}>
                  <span style={{fontSize:10, color:C.dim}}>{msg.time}</span>
                  {msg.model && <Pill color="gray" small>{msg.model.includes("claude") ? "Claude" : "Local"}</Pill>}
                  {msg.mode && <Pill color={msg.mode==="offline"?"yellow":msg.mode==="online"?"accent":"green"} small>{msg.mode}</Pill>}
                </div>
              </div>
            </div>
          ))}
          {/* Streaming message */}
          {(isLoading || streamingText) && (
            <div style={{display:"flex", gap:10}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.3)",color:"#c084fc"}}>
                <Bot size={13}/>
              </div>
              <div style={{maxWidth:"72%",padding:"11px 14px",borderRadius:"4px 14px 14px 14px",background:C.card,border:`1px solid ${C.border}`}}>
                {streamingText ? <MarkdownMsg text={streamingText} streaming={true}/> : <Spinner/>}
              </div>
            </div>
          )}
          <div ref={messagesEndRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"14px 20px", borderTop:`1px solid ${C.border}`, flexShrink:0}}>
          <div style={{display:"flex", gap:10, alignItems:"flex-end"}}>
            <div style={{flex:1, background:C.card, border:`1px solid ${C.borderMed}`, borderRadius:12, padding:"10px 14px",
              display:"flex", alignItems:"flex-end", gap:8, transition:"border-color 0.15s"}}>
              <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
                placeholder="Message NexusAI..." rows={1}
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:C.text,
                  fontSize:13.5, fontFamily:"system-ui,sans-serif", resize:"none", lineHeight:1.5,
                  maxHeight:120, overflow:"auto" }}/>
              <div style={{display:"flex", gap:6, flexShrink:0}}>
                <button style={{background:"transparent",border:"none",cursor:"pointer",color:C.muted,padding:3,borderRadius:5}} title="Attach file">
                  <Paperclip size={15}/>
                </button>
                <button style={{background:"transparent",border:"none",cursor:"pointer",color:C.muted,padding:3,borderRadius:5}} title="Voice input">
                  <Mic size={15}/>
                </button>
              </div>
            </div>
            <button onClick={handleSend} disabled={!input.trim()||isLoading} style={{
              width:42, height:42, borderRadius:12, background: input.trim()&&!isLoading ? C.accent : C.card,
              border:`1px solid ${input.trim()&&!isLoading ? C.accent : C.border}`,
              cursor: input.trim()&&!isLoading ? "pointer" : "default",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0,
              transition:"all 0.15s"
            }}>
              <Send size={16}/>
            </button>
          </div>
          <div style={{display:"flex", gap:12, marginTop:8, paddingLeft:2}}>
            <span style={{fontSize:10, color:C.dim}}>Enter to send · Shift+Enter for newline</span>
            <span style={{fontSize:10, color:C.dim,marginLeft:"auto"}}>Context: 4,096 tokens</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Knowledge Page ─────────────────────────────────────────────────────────
function KnowledgePage({ files, setFiles }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = files.filter(f =>
    (filter === "all" || (filter === "indexed" ? f.indexed : !f.indexed)) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const indexed = files.filter(f => f.indexed).length;
  const totalMB = 13.2;

  return (
    <div style={{flex:1,overflow:"auto",padding:28}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:600,color:C.text,margin:0}}>Knowledge Base</h2>
          <p style={{fontSize:13,color:C.muted,margin:"4px 0 0"}}>Indexed local documents for AI retrieval</p>
        </div>
        <button style={{display:"flex",alignItems:"center",gap:7,padding:"8px 14px",background:C.accent,
          border:"none",borderRadius:9,cursor:"pointer",color:"#fff",fontSize:13,fontWeight:500}}>
          <Plus size={14}/> Add Files
        </button>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:22}}>
        {[
          { label:"Total Files", value:files.length, icon:<Archive size={16}/>, color:C.accentBr },
          { label:"Indexed",     value:indexed,       icon:<Check size={16}/>,  color:C.green },
          { label:"Pending",     value:files.length-indexed, icon:<Clock size={16}/>, color:C.yellow },
          { label:"Index Size",  value:`${totalMB} MB`, icon:<HardDrive size={16}/>, color:C.muted },
        ].map((s,i) => (
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{color:s.color}}>{s.icon}</span>
              <span style={{fontSize:11,color:C.muted}}>{s.label}</span>
            </div>
            <div style={{fontSize:20,fontWeight:600,color:C.text}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,background:C.card,
          border:`1px solid ${C.borderMed}`,borderRadius:9,padding:"8px 12px"}}>
          <Search size={14} color={C.muted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files..."
            style={{flex:1,background:"transparent",border:"none",outline:"none",color:C.text,fontSize:13}}/>
        </div>
        {["all","indexed","pending"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"8px 14px",borderRadius:9,border:`1px solid ${filter===f?C.accent:C.border}`,
            background: filter===f ? C.accentGlow : "transparent",
            color: filter===f ? C.accentBr : C.muted,cursor:"pointer",fontSize:12,fontWeight:500,
            textTransform:"capitalize"
          }}>{f}</button>
        ))}
      </div>

      {/* File Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
        {filtered.map(f => (
          <div key={f.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",
            transition:"border-color 0.15s", cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
              <div style={{width:34,height:34,borderRadius:8,background:C.accentGlow,
                border:`1px solid ${C.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.accentBr,flexShrink:0}}>
                {fileIcon(f.type)}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {f.name}
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{f.size} · {f.ago}</div>
              </div>
              <Pill color={f.indexed?"green":"yellow"} small>{f.indexed?"Indexed":"Pending"}</Pill>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {f.tags.map(tag => <Pill key={tag} color="gray" small>#{tag}</Pill>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Memory Page ───────────────────────────────────────────────────────────
function MemoryPage({ memories, conversations }) {
  const kindColor = { preference:"accent", fact:"green", context:"yellow" };
  const stats = [
    { label:"Stored Memories", val: memories.length },
    { label:"Conversations",   val: conversations.length },
    { label:"Facts Learned",   val: memories.filter(m=>m.kind==="fact").length },
    { label:"Preferences",     val: memories.filter(m=>m.kind==="preference").length },
  ];
  return (
    <div style={{flex:1,overflow:"auto",padding:28}}>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:18,fontWeight:600,color:C.text,margin:0}}>AI Memory</h2>
        <p style={{fontSize:13,color:C.muted,margin:"4px 0 0"}}>Semantic & episodic memory extracted from conversations</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {stats.map((s,i) => (
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:600,color:C.text}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Memory Items */}
        <div>
          <div style={{fontSize:12,color:C.muted,fontWeight:500,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.6px"}}>Extracted Memories</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {memories.map(m => (
              <div key={m.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
                  <Pill color={kindColor[m.kind]||"accent"} small>{m.kind}</Pill>
                  <span style={{fontSize:10,color:C.dim}}>{m.ago}</span>
                </div>
                <div style={{fontSize:12.5,color:C.text,lineHeight:1.5,marginBottom:6}}>{m.text}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{flex:1,height:3,background:C.hover,borderRadius:4}}>
                    <div style={{height:"100%",borderRadius:4,width:`${m.conf*100}%`,
                      background:`linear-gradient(90deg,${C.accent},${C.accentBr})`}}/>
                  </div>
                  <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{Math.round(m.conf*100)}% conf.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        <div>
          <div style={{fontSize:12,color:C.muted,fontWeight:500,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.6px"}}>Conversation Log</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {conversations.map(c => (
              <div key={c.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontSize:12.5,fontWeight:500,color:C.text}}>{c.title}</div>
                  <Pill color="gray" small>{c.messages.length} msgs</Pill>
                </div>
                <div style={{fontSize:11.5,color:C.muted}}>{c.preview || "No messages yet"}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:"12px 14px",background:C.accentGlow,border:`1px solid ${C.borderHi}`,borderRadius:10}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <Brain size={14} color={C.accentBr}/>
              <span style={{fontSize:12,fontWeight:500,color:C.accentBr}}>Memory System</span>
            </div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>
              NexusAI uses a multi-tier memory architecture: short-term context window, 
              long-term semantic embeddings, and episodic conversation summaries — all stored locally.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Models Page ────────────────────────────────────────────────────────────
function ModelsPage({ models, setModels, selectedModel, setSelectedModel }) {
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState({});

  const startDownload = async (id) => {
    setDownloading(id);
    for (let p = 0; p <= 100; p += 5) {
      await new Promise(r => setTimeout(r, 120));
      setProgress(prev => ({ ...prev, [id]: p }));
    }
    setDownloading(null);
    setModels(prev => ({
      ...prev,
      local: prev.local.map(m => m.id === id ? { ...m, status:"ready" } : m)
    }));
    setProgress(prev => { const n={...prev}; delete n[id]; return n; });
  };

  return (
    <div style={{flex:1,overflow:"auto",padding:28}}>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:18,fontWeight:600,color:C.text,margin:0}}>Model Manager</h2>
        <p style={{fontSize:13,color:C.muted,margin:"4px 0 0"}}>Local & cloud AI model management</p>
      </div>

      {/* Local Models */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <HardDrive size={14} color={C.accentBr}/>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>Local Models</span>
          <Pill color="green" small>Offline-capable</Pill>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {models.local.map(m => {
            const isActive = selectedModel === m.id;
            const isPending = downloading === m.id;
            const prog = progress[m.id];
            return (
              <div key={m.id} style={{background:C.card,border:`1px solid ${isActive?C.borderHi:C.border}`,
                borderRadius:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:38,height:38,borderRadius:9,background: m.status==="ready"?C.accentGlow:"rgba(80,80,120,0.15)",
                  border:`1px solid ${m.status==="ready"?C.borderHi:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Cpu size={16} color={m.status==="ready"?C.accentBr:C.dim}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:500,color:C.text}}>{m.name} {m.size}</span>
                    <Pill color="gray" small>{m.fmt}</Pill>
                    {isActive && <Pill color="accent" small>Active</Pill>}
                  </div>
                  <div style={{fontSize:11,color:C.muted}}>{m.gb} GB · {m.speed} · {m.quality}</div>
                  {isPending && (
                    <div style={{marginTop:6}}>
                      <div style={{height:3,background:C.hover,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",background:`linear-gradient(90deg,${C.accent},${C.accentBr})`,
                          width:`${prog||0}%`,transition:"width 0.1s",borderRadius:4}}/>
                      </div>
                      <div style={{fontSize:10,color:C.muted,marginTop:3}}>Downloading... {prog||0}%</div>
                    </div>
                  )}
                </div>
                <div style={{display:"flex",gap:7}}>
                  {m.status === "ready" ? (
                    <button onClick={() => setSelectedModel(m.id)} style={{
                      padding:"6px 12px",borderRadius:7,border:`1px solid ${isActive?C.accent:C.border}`,
                      background: isActive ? C.accent : "transparent",
                      color: isActive ? "#fff" : C.muted, cursor:"pointer",fontSize:12,fontWeight:500
                    }}>{isActive?"Selected":"Select"}</button>
                  ) : (
                    <button onClick={() => !isPending && startDownload(m.id)} disabled={!!isPending} style={{
                      padding:"6px 12px",borderRadius:7,border:`1px solid ${C.border}`,
                      background:"transparent",color: isPending?C.dim:C.accentBr,cursor: isPending?"default":"pointer",fontSize:12,
                      display:"flex",alignItems:"center",gap:5
                    }}><Download size={12}/>{isPending?"Downloading...":"Download"}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cloud Models */}
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <Globe size={14} color={C.cyan}/>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>Cloud Models</span>
          <Pill color="accent" small>Requires internet</Pill>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {models.cloud.map(m => {
            const isActive = selectedModel === m.id;
            return (
              <div key={m.id} style={{background:C.card,border:`1px solid ${isActive?C.borderHi:C.border}`,
                borderRadius:10,padding:"14px 16px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:38,height:38,borderRadius:9,
                  background: m.status==="active"?"rgba(34,211,238,0.1)":"rgba(80,80,120,0.1)",
                  border:`1px solid ${m.status==="active"?"rgba(34,211,238,0.3)":C.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Server size={16} color={m.status==="active"?C.cyan:C.dim}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:500,color:C.text}}>{m.name}</span>
                    <span style={{fontSize:11,color:C.muted}}>{m.provider}</span>
                    {isActive && <Pill color="accent" small>Active</Pill>}
                  </div>
                  <div style={{fontSize:11,color:C.muted}}>{m.quality}</div>
                </div>
                <div>
                  {m.status === "active" ? (
                    <button onClick={() => setSelectedModel(m.id)} style={{
                      padding:"6px 12px",borderRadius:7,border:`1px solid ${isActive?C.accent:C.border}`,
                      background: isActive ? C.accent : "transparent",
                      color: isActive ? "#fff" : C.muted, cursor:"pointer",fontSize:12,fontWeight:500
                    }}>{isActive?"Selected":"Select"}</button>
                  ) : (
                    <Pill color="gray">API Key Required</Pill>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────────────────
function SettingsPage({ settings, setSettings }) {
  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const sections = [
    {
      title: "AI Inference",
      items: [
        { key:"streamResponses", label:"Stream responses", desc:"Show responses as they generate" },
        { key:"autoIndex",       label:"Auto-index files", desc:"Automatically index new documents" },
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        { key:"zeroTelemetry",  label:"Zero telemetry mode",    desc:"Disable all usage analytics" },
        { key:"encryptLocal",   label:"Encrypt local database", desc:"AES-256 encryption at rest" },
      ]
    },
  ];

  return (
    <div style={{flex:1,overflow:"auto",padding:28,maxWidth:600}}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:18,fontWeight:600,color:C.text,margin:0}}>Settings</h2>
        <p style={{fontSize:13,color:C.muted,margin:"4px 0 0"}}>Configure your NexusAI experience</p>
      </div>

      {sections.map(sec => (
        <div key={sec.title} style={{marginBottom:20}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:10}}>{sec.title}</div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            {sec.items.map((item, idx) => (
              <div key={item.key} style={{
                display:"flex",alignItems:"center",padding:"14px 16px",
                borderBottom: idx < sec.items.length-1 ? `1px solid ${C.border}` : "none"
              }}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,color:C.text}}>{item.label}</div>
                  <div style={{fontSize:11.5,color:C.muted,marginTop:2}}>{item.desc}</div>
                </div>
                <button onClick={() => toggle(item.key)} style={{
                  width:44, height:24, borderRadius:12, border:"none", cursor:"pointer", padding:0,
                  background: settings[item.key] ? C.accent : C.hover, position:"relative", transition:"background 0.2s",
                  flexShrink:0
                }}>
                  <div style={{
                    width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute",
                    top:3, left: settings[item.key] ? 23 : 3, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.3)"
                  }}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Context window slider */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:10}}>Context Window</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:500,color:C.text}}>Max tokens</span>
            <span style={{fontSize:13,fontWeight:600,color:C.accentBr}}>{settings.contextWindow.toLocaleString()}</span>
          </div>
          <input type="range" min={1024} max={32768} step={1024} value={settings.contextWindow}
            onChange={e => setSettings(p => ({...p, contextWindow: +e.target.value}))}
            style={{width:"100%",accentColor:C.accent}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
            <span style={{fontSize:10,color:C.dim}}>1K</span>
            <span style={{fontSize:10,color:C.dim}}>32K</span>
          </div>
        </div>
      </div>

      {/* Security info */}
      <div style={{padding:"14px 16px",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:10,display:"flex",gap:10}}>
        <Shield size={16} color={C.green} style={{flexShrink:0,marginTop:1}}/>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>
          All data is stored locally on your device. NexusAI never sends your conversations or files to external servers without your explicit permission.
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function NexusAI() {
  const [page, setPage] = useState("chat");
  const [mode, setMode] = useState("hybrid");
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-4-20250514");
  const [models, setModels] = useState({ local: LOCAL_MODELS, cloud: CLOUD_MODELS });
  const [files, setFiles] = useState(SAMPLE_FILES);
  const [memories, setMemories] = useState(SAMPLE_MEMORIES);
  const [settings, setSettings] = useState({ streamResponses:true, zeroTelemetry:true, autoIndex:true, encryptLocal:true, contextWindow:4096 });
  const [conversations, setConversations] = useState([
    { id:1, title:"Getting started", preview:"Hello! I'm NexusAI...",
      messages:[{ role:"assistant",
        content:"Hello! I'm **NexusAI**, your hybrid AI assistant.\n\nI seamlessly combine local offline models with cloud intelligence. Here's what I can do:\n\n• **Chat** using local or cloud AI models\n• **Search** your indexed documents with RAG\n• **Remember** past conversations semantically\n• **Browse** the web when connected\n• **Analyze** your files — PDFs, code, CSVs, images\n\nI'm currently running in **Hybrid Mode**. How can I help you today?",
        time:"Now", model:"claude-sonnet-4-20250514", mode:"hybrid" }]
    }
  ]);
  const [activeConvId, setActiveConvId] = useState(1);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamingRef = useRef(false);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const newConv = () => {
    const id = Date.now();
    setConversations(prev => [...prev, { id, title:"New chat", preview:"", messages:[] }]);
    setActiveConvId(id);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");

    const userMsg = { role:"user", content:text, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    const updatedConvs = conversations.map(c =>
      c.id === activeConvId
        ? { ...c, messages:[...c.messages, userMsg], preview:text,
            title: c.title==="New chat" ? text.slice(0,32)+(text.length>32?"…":"") : c.title }
        : c
    );
    setConversations(updatedConvs);
    setIsLoading(true);
    setStreamingText("");
    streamingRef.current = true;

    try {
      const conv = updatedConvs.find(c => c.id === activeConvId);
      const apiMsgs = conv.messages.map(m => ({ role:m.role, content:m.content }));
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are NexusAI, an advanced hybrid AI assistant that combines local offline models with cloud intelligence. You have access to a local vector database of documents, semantic memory from past conversations, and web search when online.\n\nCurrent operating mode: ${mode}. Available features: local RAG, semantic memory, ${mode!=="offline"?"web search, ":""}multi-modal understanding.\n\nBe helpful and intelligent. Reference your hybrid architecture naturally when relevant. Format responses with markdown — use **bold**, bullet points (•), headers (##) where it helps readability.`,
          messages: apiMsgs,
        })
      });
      const data = await res.json();
      const content = data.content?.[0]?.text || "I encountered an issue. Please try again.";

      let displayed = "";
      for (let i = 0; i < content.length; i++) {
        if (!streamingRef.current) break;
        displayed += content[i];
        setStreamingText(displayed);
        await new Promise(r => setTimeout(r, 5));
      }

      if (streamingRef.current) {
        const assistantMsg = { role:"assistant", content, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), model:selectedModel, mode };
        setConversations(prev => prev.map(c =>
          c.id === activeConvId ? { ...c, messages:[...c.messages, assistantMsg] } : c
        ));
        setStreamingText("");
      }
    } catch {
      const errMsg = { role:"assistant", content:"⚠ Connection issue detected. Switching to local inference fallback mode.", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), isError:true };
      setConversations(prev => prev.map(c =>
        c.id === activeConvId ? { ...c, messages:[...c.messages, errMsg] } : c
      ));
      setStreamingText("");
    }

    streamingRef.current = false;
    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{display:"flex", height:"100vh", background:C.bg, color:C.text, overflow:"hidden",
      fontFamily:"system-ui,-apple-system,'Segoe UI',sans-serif"}}>
      <Sidebar page={page} setPage={setPage} mode={mode} setMode={setMode}/>
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0}}>
        {page === "chat" && (
          <ChatPage conversations={conversations} activeConvId={activeConvId} setActiveConvId={setActiveConvId}
            activeConv={activeConv} input={input} setInput={setInput} isLoading={isLoading}
            streamingText={streamingText} handleSend={handleSend} newConv={newConv}
            messagesEndRef={messagesEndRef} inputRef={inputRef} mode={mode} selectedModel={selectedModel}/>
        )}
        {page === "knowledge" && <KnowledgePage files={files} setFiles={setFiles}/>}
        {page === "memory"    && <MemoryPage memories={memories} conversations={conversations}/>}
        {page === "models"    && <ModelsPage models={models} setModels={setModels} selectedModel={selectedModel} setSelectedModel={setSelectedModel}/>}
        {page === "settings"  && <SettingsPage settings={settings} setSettings={setSettings}/>}
      </div>
    </div>
  );
}