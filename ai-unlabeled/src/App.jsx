import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Download, Loader2, Tag, ShieldCheck, Flag, Users } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

const W = 1080, H = 1350;
const serif = "'DM Serif Display', serif";
const sans = "'Inter', sans-serif";
const mono = "'JetBrains Mono', monospace";
const C = {
  bg: '#0C0B0A', accent: '#E8503A', teal: '#2D8A6E', blue: '#2D5F8A',
  danger: '#C42B2B', cream: '#F0EDE8',
  c60: 'rgba(240,237,232,0.6)', c40: 'rgba(240,237,232,0.4)',
  c25: 'rgba(240,237,232,0.25)', c15: 'rgba(240,237,232,0.15)',
  c06: 'rgba(240,237,232,0.06)',
};

const Grain = () => (
  <div className="absolute inset-0 pointer-events-none z-50" style={{ mixBlendMode: 'overlay', opacity: 0.35 }}>
    <svg width="100%" height="100%"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#g)" /></svg>
  </div>
);
const SN = ({ n, dark }) => (
  <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0" style={{ background: dark ? 'rgba(0,0,0,0.25)' : C.accent, fontFamily: mono }}>
    <span className="text-[16px] font-bold text-white leading-none">{n}</span>
  </div>
);
const Waffle = ({ filled, total = 100, cols = 10 }) => (
  <div className="grid gap-[2.5px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{ width: '100%', aspectRatio: '1', background: i < filled ? C.accent : C.c06, borderRadius: 2 }} />
    ))}
  </div>
);
const MiniBar = ({ a, b, labelA, labelB }) => (
  <div className="flex items-end gap-1 h-[40px]">
    <div className="flex flex-col items-center justify-end h-full">
      <span className="text-[10px] font-bold mb-0.5" style={{ fontFamily: mono, color: 'rgba(255,255,255,0.5)' }}>{labelA}</span>
      <div className="w-[24px] rounded-t" style={{ height: `${a}%`, background: 'rgba(255,255,255,0.3)' }} />
    </div>
    <div className="flex flex-col items-center justify-end h-full">
      <span className="text-[10px] font-bold mb-0.5" style={{ fontFamily: mono, color: 'white' }}>{labelB}</span>
      <div className="w-[24px] rounded-t" style={{ height: `${b}%`, background: 'rgba(255,255,255,0.9)' }} />
    </div>
  </div>
);

function PosterContent() {
  return (
    <div style={{ width: W, height: H, fontFamily: sans }} className="relative overflow-hidden flex flex-col text-white">
      <div className="absolute inset-0" style={{ background: C.bg }} />
      <Grain />
      <div className="relative z-10 h-[3px] shrink-0" style={{ background: C.accent }} />

      {/* HERO */}
      <div className="relative z-10 shrink-0 overflow-hidden" style={{ height: 245 }}>
        <img src="/images/hero-ai-face.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'grayscale(30%) contrast(1.1)' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, ${C.bg}ee 20%, ${C.bg}77 50%, transparent)` }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${C.bg}bb 0%, transparent 55%)` }} />
        <div className="absolute bottom-0 left-0 right-0 px-10 pb-5 z-10">
          <span className="text-[14px] font-bold tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: mono, color: C.accent }}>Etika Profesi · Kelompok 4 · 2026</span>
          <h1 className="text-[4.2rem] leading-[0.82] tracking-[-0.03em] mb-2" style={{ fontFamily: serif, color: C.cream }}>
            Konten AI<br /><span style={{ color: C.accent }}>Tanpa Label.</span>
          </h1>
          <p className="text-[16px] font-light leading-snug max-w-[420px]" style={{ color: C.c40 }}>
            Konten buatan AI beredar <span style={{ color: C.accent }}>tanpa penanda</span>, publik tak bisa bedakan fakta dari fabrikasi.
          </p>
        </div>
      </div>

      {/* 01: STATS 2-col */}
      <div className="relative z-10 shrink-0 flex" style={{ borderBottom: `1px solid ${C.c06}` }}>
        <div className="flex-1 px-10 py-4" style={{ borderRight: `1px solid ${C.c06}` }}>
          <div className="flex gap-2.5 items-center mb-2">
            <SN n="1" />
            <span className="text-[1.5rem] font-bold" style={{ fontFamily: serif, color: C.cream }}>Seberapa banyak?</span>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-[100px] shrink-0"><Waffle filled={74} /></div>
            <div>
              <div className="text-[5rem] font-black leading-none" style={{ fontFamily: serif, color: C.cream }}>74<span className="text-[1.8rem]" style={{ color: C.c40 }}>%</span></div>
              <p className="text-[16px] font-light leading-snug mt-1" style={{ color: C.c40 }}>halaman web baru adalah konten AI, <span className="font-semibold" style={{ color: C.accent }}>tanpa label</span>.</p>
              <span className="text-[10px] mt-1 block" style={{ color: C.c25, fontFamily: mono }}>Ahrefs, 2025</span>
            </div>
          </div>
        </div>
        {/* RIGHT: ~50% + thumb on right edge */}
        <div className="flex-1 flex">
          <div className="flex-1 px-7 py-4">
            <span className="text-[12px] font-bold tracking-[0.2em] uppercase mb-2 block" style={{ fontFamily: mono, color: C.c25 }}>Akurasi deteksi manusia</span>
            <div className="flex items-center gap-4">
              <div className="relative w-[90px] h-[90px] shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <circle cx="40" cy="40" r="35" fill={C.c06} />
                  <path d="M 40 5 A 35 35 0 0 1 40 75" fill={C.accent} opacity="0.7" />
                  <line x1="40" y1="5" x2="40" y2="75" stroke={C.bg} strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div className="text-[4rem] font-black leading-none" style={{ fontFamily: serif, color: C.cream }}>~50<span className="text-[1.4rem]" style={{ color: C.c40 }}>%</span></div>
                <p className="text-[16px] font-light mt-0.5" style={{ color: C.c40 }}>Setara <span className="font-semibold" style={{ color: C.accent }}>lempar koin</span>.</p>
                <span className="text-[10px]" style={{ color: C.c25, fontFamily: mono }}>Conjointly / NIH, 2025</span>
              </div>
            </div>
          </div>
          <img src="/images/thumb-ai-content.png" alt="" className="w-[180px] h-full object-cover opacity-40 shrink-0" />
        </div>
      </div>

      {/* 02: ORANGE — Rp7.8T | 343rb | ↑1550% fraud | ↑40.8% KBGO */}
      <div className="relative z-10 shrink-0 px-10 py-4" style={{ background: C.accent }}>
        <div className="flex gap-2.5 items-center mb-2">
          <SN n="2" dark />
          <h2 className="text-[1.5rem] font-bold" style={{ fontFamily: serif }}>Dampak di Indonesia</h2>
          <span className="ml-auto text-[16px] uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: mono }}>OJK / SAFEnet / Komnas, 2025</span>
        </div>
        <div className="flex items-end gap-5">
          <div>
            <div className="text-[2.8rem] font-black leading-none" style={{ fontFamily: serif }}>Rp7,8T</div>
            <span className="text-[16px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Kerugian</span>
          </div>
          <div className="w-[1.5px] h-[34px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div>
            <div className="text-[2rem] font-black leading-none" style={{ fontFamily: serif }}>343rb</div>
            <span className="text-[16px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Laporan</span>
          </div>
          <div className="w-[1.5px] h-[34px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="flex items-end gap-1.5">
            <MiniBar a={6} b={90} labelA="'23" labelB="'24" />
            <div>
              <div className="text-[2rem] font-black leading-none" style={{ fontFamily: serif }}>↑1.550%</div>
              <span className="text-[16px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Penipuan AI</span>
            </div>
          </div>
          <div className="w-[1.5px] h-[34px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="flex items-end gap-1.5">
            <MiniBar a={60} b={85} labelA="'24" labelB="'25" />
            <div>
              <div className="text-[2rem] font-black leading-none" style={{ fontFamily: serif }}>↑40,8%</div>
              <span className="text-[16px]" style={{ color: 'rgba(255,255,255,0.6)' }}>KBGO</span>
            </div>
          </div>
        </div>
      </div>

      {/* CASES + REGULATION 2-col */}
      <div className="relative z-10 shrink-0 flex" style={{ borderBottom: `1px solid ${C.c06}` }}>
        <div className="flex-1 px-10 py-3.5" style={{ borderRight: `1px solid ${C.c06}` }}>
          <span className="text-[30px] font-bold tracking-[0.2em] uppercase mb-2 block" style={{ fontFamily: mono, color: C.accent }}>Kasus nyata</span>
          <div className="space-y-2">
            {[
              { y: '2026', tag: 'Fraud', text: 'Deepfake Prabowo promosikan "promo mobil listrik".', src: 'MAFINDO', tc: C.accent },
              { y: '2025', tag: 'Fraud', text: 'Deepfake Prabowo "menawarkan bantuan" merugikan 20+ provinsi.', src: 'Straits Times', tc: C.accent },
              { y: '2025', tag: 'KBGO', text: 'Konten eksplisit wajah siswa & guru SMA dibuat AI.', src: 'Kumparan', tc: C.danger },
              { y: '2024', tag: 'Politik', text: 'Deepfake & audio palsu memanipulasi pemilih Pemilu.', src: 'ISEAS', tc: C.blue },
            ].map((c, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="shrink-0 w-[46px] text-right">
                  <span className="text-[14px] font-bold block" style={{ fontFamily: mono, color: C.accent }}>{c.y}</span>
                  <span className="text-[10px] font-bold uppercase" style={{ fontFamily: mono, color: c.tc }}>{c.tag}</span>
                </div>
                <div className="w-[2px] shrink-0 self-stretch" style={{ background: C.c06 }} />
                <div className="flex-1">
                  <p className="text-[16px] font-light leading-snug" style={{ color: C.c40 }}>{c.text}</p>
                  <span className="text-[12px]" style={{ color: C.c25, fontFamily: mono }}>{c.src}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[420px] shrink-0 px-7 py-3.5">
          <div className="flex gap-2.5 items-center mb-2">
            <SN n="3" />
            <span className="text-[1.5rem] font-bold whitespace-nowrap" style={{ fontFamily: serif, color: C.cream }}>Regulasi label AI</span>
          </div>
          {[
            { label: 'Uni Eropa', v: 85, color: C.teal, reg: 'EU AI Act — wajib label Agt 2026' },
            { label: 'Tiongkok', v: 70, color: C.blue, reg: 'Deep Synthesis Provisions — wajib 2023' },
            { label: 'Indonesia', v: 10, color: C.danger, reg: 'Belum ada UU spesifik AI/deepfake' },
          ].map((r) => (
            <div key={r.label} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: C.cream }}>{r.label}</span>
                <span className="text-[13px] font-bold" style={{ color: r.color, fontFamily: mono }}>{r.v}%</span>
              </div>
              <div className="h-[12px] rounded-sm overflow-hidden" style={{ background: C.c06 }}>
                <div className="h-full rounded-sm" style={{ width: `${r.v}%`, background: r.color }} />
              </div>
              <span className="text-[12px] mt-0.5 block" style={{ color: C.c25, fontFamily: mono }}>{r.reg}</span>
            </div>
          ))}
          <div className="mt-2 pl-3 py-1.5" style={{ borderLeft: `3px solid ${C.accent}` }}>
            <p className="text-[14px] leading-snug" style={{ fontFamily: serif, color: C.c60 }}>"Belum ada UU yang menggunakan istilah <span style={{ color: C.accent }}>deepfake</span>."</p>
            <span className="text-[10px] mt-0.5 block" style={{ color: C.c25, fontFamily: mono }}>BPHN, 2025</span>
          </div>
        </div>
      </div>

      {/* PANDA */}
      <div className="relative z-10 shrink-0 px-10 py-4" style={{ borderBottom: `1px solid ${C.c06}` }}>
        <div className="flex gap-5 items-center">
          <div className="flex gap-2 shrink-0">
            <div className="w-[150px] rounded overflow-hidden relative">
              <img src="/images/panda.jpg" alt="" className="w-full h-[160px] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{ background: 'rgba(0,0,0,0.7)' }}>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: mono, color: C.teal }}>Asli</span>
              </div>
            </div>
            <div className="w-[150px] rounded overflow-hidden relative" style={{ border: `2px solid ${C.danger}` }}>
              <img src="/images/panda-ohim.jpg" alt="" className="w-full h-[160px] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{ background: 'rgba(0,0,0,0.7)' }}>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: mono, color: C.danger }}>Manipulasi</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-[14px] font-bold tracking-[0.2em] uppercase mb-1 block" style={{ fontFamily: mono, color: C.accent }}>Timpa teks · manipulasi wajah</span>
            <h3 className="text-[2rem] font-bold leading-tight tracking-tight mb-1.5" style={{ fontFamily: serif, color: C.cream }}>
              Lucu? <span style={{ color: C.accent }}>Bayangkan kalau itu kamu.</span>
            </h3>
            <p className="text-[16px] font-light leading-snug" style={{ color: C.c40 }}>
              Konten manipulasi ini viral sebagai "hiburan", tapi bisa merusak reputasi siapa saja. <br /> <span className="font-semibold" style={{ color: C.c60 }}>Termasuk orang yang kamu sayangi.</span>
            </p>
          </div>
        </div>
      </div>

      {/* WHAT TO DO */}
      <div className="relative z-10 px-10 py-3.5 shrink-0" style={{ borderBottom: `1px solid ${C.c06}` }}>
        <div className="flex gap-2.5 items-center mb-2">
          <SN n="4" />
          <h2 className="text-[1.5rem] font-bold" style={{ fontFamily: serif, color: C.cream }}>Apa yang bisa kamu lakukan?</h2>
        </div>
        <div className="flex gap-2.5">
          {[
            { icon: <Tag className="w-5 h-5" />, title: 'Label', desc: 'Tandai konten AI.', color: C.teal },
            { icon: <ShieldCheck className="w-5 h-5" />, title: 'Verifikasi', desc: 'Cek sumber dulu.', color: C.blue },
            { icon: <Flag className="w-5 h-5" />, title: 'Laporkan', desc: 'Report yang palsu.', color: C.accent },
            { icon: <Users className="w-5 h-5" />, title: 'Edukasi', desc: 'Ajarkan sekitar.', color: C.teal },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center py-2.5 px-2 rounded" style={{ background: C.c06 }}>
              <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center mb-1" style={{ background: item.color + '22', color: item.color }}>{item.icon}</div>
              <h4 className="text-[15px] font-bold" style={{ color: C.cream }}>{item.title}</h4>
              <p className="text-[12px] font-light mt-0.5" style={{ color: C.c40 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-auto px-10 pb-3 pt-2 shrink-0">
        <div className="flex justify-between items-end">
          <div className="flex gap-4">
            {[['[1] Ahrefs (2025)','[2] Conjointly / NIH (2025)','[3] OJK (2025)'],
              ['[4] SAFEnet (2025)', '[5] Komnas Perempuan (2025)','[6] MAFINDO (2026)'],
              ['[7] Straits Times (2025)', '[8] Kumparan (2025)','[9] ISEAS (2024)'],
              ['[10] BPHN (2025)']
            ].map((col, ci) => (
              <div key={ci} className="space-y-[1px]">
                {col.map((s, i) => <div key={i} className="text-[10px]" style={{ color: C.c15, fontFamily: mono }}>{s}</div>)}
              </div>
            ))}
          </div>
          <div className="text-right">
            <span className="text-[18px] font-black" style={{ fontFamily: serif, color: C.c25 }}>etika profesi.</span>
            <span className="text-[12px] block tracking-[0.15em] uppercase mt-0.5" style={{ fontFamily: mono, color: C.c15 }}>Kelompok 4 · 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef(null);
  const posterRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const ob = new ResizeObserver((e) => { const { width, height } = e[0].contentRect; setScale(Math.min(width / W, height / H) * 0.92); });
    if (containerRef.current) ob.observe(containerRef.current);
    return () => ob.disconnect();
  }, []);
  const handleExportPNG = useCallback(async () => {
    setIsExporting(true); await new Promise((r) => setTimeout(r, 300));
    try { const d = await domToPng(posterRef.current, { width: W, height: H, scale: 2, quality: 1, backgroundColor: C.bg }); const a = document.createElement('a'); a.download = 'konten-ai-tanpa-label.png'; a.href = d; a.click(); }
    catch (e) { console.error(e); } finally { setIsExporting(false); }
  }, []);
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ background: '#050505', fontFamily: sans }}>
      {isExporting && <div className="fixed inset-0 z-[9999] flex items-center justify-center gap-3" style={{ background: '#050505' }}><Loader2 className="w-5 h-5 animate-spin" style={{ color: C.accent }} /><span className="text-sm uppercase tracking-widest" style={{ color: C.accent, fontFamily: mono }}>Mengekspor…</span></div>}
      <div className="fixed top-0 left-0 z-[-1] opacity-0 pointer-events-none" style={{ width: W }}><div ref={posterRef}><PosterContent /></div></div>
      <div ref={containerRef} className="flex-1 overflow-hidden relative flex items-center justify-center">
        <div className="shadow-2xl shadow-black/60 overflow-hidden shrink-0" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center center' }}><PosterContent /></div>
      </div>
      <div className="h-12 flex items-center justify-between px-8 shrink-0" style={{ background: C.bg, borderTop: `1px solid ${C.c06}` }}>
        <span className="text-[10px] uppercase tracking-widest" style={{ color: C.c15, fontFamily: mono }}>{W}×{H} · 4:5</span>
        <button onClick={handleExportPNG} disabled={isExporting} className="flex items-center gap-2 transition-colors disabled:opacity-50" style={{ color: C.c15 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.accent)} onMouseLeave={(e) => (e.currentTarget.style.color = C.c15)}>
          <Download className="w-3.5 h-3.5" /><span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: mono }}>{isExporting ? 'Mengekspor…' : 'Ekspor PNG'}</span>
        </button>
      </div>
    </div>
  );
}
