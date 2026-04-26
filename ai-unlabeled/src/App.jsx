import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { domToPng } from 'modern-screenshot';

const W = 1080;
const H = 1350;
const serif = "'DM Serif Display', serif";
const sans = "'Inter', sans-serif";
const mono = "'JetBrains Mono', monospace";

/* ─── reusable mini components ─── */

/* waffle grid: filled vs empty out of total */
const Waffle = ({ filled, total = 100, filledColor = '#ff6b35', emptyColor = 'rgba(255,255,255,0.04)', cols = 20 }) => {
  const cells = [];
  for (let i = 0; i < total; i++) {
    cells.push(
      <div
        key={i}
        className="rounded-[1px]"
        style={{
          width: '100%',
          aspectRatio: '1',
          background: i < filled ? filledColor : emptyColor,
        }}
      />
    );
  }
  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cells}
    </div>
  );
};

/* horizontal comparison bar */
const CompBar = ({ value, max, label, sub, color = '#ff6b35', labelRight }) => (
  <div className="mb-1.5 last:mb-0">
    <div className="flex justify-between items-baseline mb-1">
      <span className="text-[13px] font-semibold text-white">{label}</span>
      {labelRight && <span className="text-[10px] text-white/20" style={{ fontFamily: mono }}>{labelRight}</span>}
    </div>
    <div className="h-[20px] bg-white/[0.04] relative overflow-hidden">
      <div className="h-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white/50"
        style={{ fontFamily: mono }}
      >
        {value}%
      </span>
    </div>
    {sub && <div className="text-[10px] text-white/20 mt-0.5" style={{ fontFamily: mono }}>{sub}</div>}
  </div>
);

function PosterContent() {
  return (
    <div
      style={{ width: W, height: H, fontFamily: sans }}
      className="relative overflow-hidden flex flex-col bg-[#0a0a0a] text-white"
    >
      <div className="h-[3px] bg-[#ff6b35] shrink-0" />

      {/* ─── HERO ─── */}
      <div className="relative h-[280px] shrink-0 overflow-hidden">
        <img src="/images/hero-ai-face.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-14 pb-6 z-10">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b35] block mb-2" style={{ fontFamily: mono }}>
            Etika Profesi · 2026
          </span>
          <h1 className="text-[3.2rem] leading-[0.88] tracking-[-0.03em]" style={{ fontFamily: serif }}>
            Konten AI <span className="text-[#ff6b35]">Tanpa Label.</span>
          </h1>
          <p className="text-[14px] text-white/40 font-light mt-2 max-w-[500px] leading-relaxed">
            Konten buatan AI yang beredar tanpa penanda — membuat publik tidak bisa membedakan fakta dari fabrikasi.
          </p>
        </div>
      </div>

      {/* ─── CHART 1: AI content prevalence (waffle) ─── */}
      <div className="px-14 pt-6 pb-5 shrink-0 border-b border-white/[0.06] flex gap-8 items-start">
        <div className="flex-1">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b35] block mb-2" style={{ fontFamily: mono }}>
            Prevalensi konten AI
          </span>
          <h2 className="text-[1.35rem] font-bold text-white tracking-tight leading-snug mb-2" style={{ fontFamily: serif }}>
            74 dari 100 halaman web baru mengandung konten AI
          </h2>
          <p className="text-[13px] text-white/30 leading-relaxed font-light mb-3">
            Analisis 900.000 halaman web baru — sebagian besar tanpa label.
          </p>
          <span className="text-[10px] text-white/15 tracking-wider uppercase" style={{ fontFamily: mono }}>Ahrefs, Apr 2025</span>
        </div>
        <div className="w-[280px] shrink-0">
          <Waffle filled={74} total={100} cols={20} filledColor="#ff6b35" emptyColor="rgba(255,255,255,0.04)" />
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] bg-[#ff6b35] rounded-[1px]" />
              <span className="text-[10px] text-white/30" style={{ fontFamily: mono }}>AI (74%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] bg-white/[0.04] rounded-[1px]" />
              <span className="text-[10px] text-white/30" style={{ fontFamily: mono }}>Non-AI (26%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CHART 2: Human detection accuracy ─── */}
      <div className="px-14 py-5 shrink-0 border-b border-white/[0.06] flex gap-8 items-start">
        <div className="w-[280px] shrink-0">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white/30 block mb-3" style={{ fontFamily: mono }}>
            Akurasi deteksi manusia
          </span>
          {/* side-by-side bar comparison */}
          <div className="flex gap-3 items-end h-[80px]">
            {[
              { label: 'Gambar', human: 52, color: '#ff6b35' },
              { label: 'Teks', human: 55, color: '#d62828' },
              { label: 'Audio', human: 62, color: '#ff6b35' },
              { label: 'Video', human: 48, color: '#d62828' },
            ].map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[10px] font-bold text-white/40 mb-1" style={{ fontFamily: mono }}>{d.human}%</span>
                <div className="w-full bg-white/[0.04] rounded-t-[2px] relative overflow-hidden" style={{ height: '100%' }}>
                  <div className="absolute bottom-0 w-full rounded-t-[2px]" style={{ height: `${d.human}%`, background: d.color }} />
                  <div className="absolute w-full border-t border-dashed border-white/10" style={{ bottom: '50%' }} />
                </div>
                <span className="text-[10px] text-white/20 mt-1.5" style={{ fontFamily: mono }}>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-full border-t border-dashed border-white/10" />
            <span className="text-[10px] text-white/15 whitespace-nowrap" style={{ fontFamily: mono }}>50% = tebak acak</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-[1.35rem] font-bold text-white tracking-tight leading-snug mb-2" style={{ fontFamily: serif }}>
            Manusia nyaris tidak bisa membedakan
          </h2>
          <p className="text-[13px] text-white/30 leading-relaxed font-light">
            Akurasi 48–62% — nyaris setara menebak acak. Kepercayaan diri jauh lebih tinggi dari kemampuan.
          </p>
          <span className="text-[10px] text-white/15 mt-2 block tracking-wider uppercase" style={{ fontFamily: mono }}>Conjointly / NIH, 2025</span>
        </div>
      </div>

      {/* ─── CHART 3: Indonesia fraud surge (dramatic bar) ─── */}
      <div className="bg-[#ff6b35] shrink-0 px-14 py-5 flex gap-8 items-center">
        <div className="flex-1">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/50 block mb-2" style={{ fontFamily: mono }}>
            Lonjakan penipuan AI · Indonesia
          </span>
          {/* before/after bars */}
          <div className="flex items-end gap-4 h-[70px] mb-3">
            <div className="flex flex-col items-center justify-end h-full" style={{ width: 60 }}>
              <span className="text-[12px] font-bold text-white/70 mb-1" style={{ fontFamily: mono }}>2023</span>
              <div className="w-full bg-white/30 rounded-t-[2px]" style={{ height: '6%' }} />
            </div>
            <div className="text-[1.5rem] font-black text-white/80 self-center">→</div>
            <div className="flex flex-col items-center justify-end h-full" style={{ width: 60 }}>
              <span className="text-[12px] font-bold text-white mb-1" style={{ fontFamily: mono }}>2024</span>
              <div className="w-full bg-white rounded-t-[2px]" style={{ height: '93%' }} />
            </div>
            <div className="self-center ml-2">
              <div className="text-[2.5rem] font-black text-white leading-none" style={{ fontFamily: serif }}>1.550%</div>
              <span className="text-[11px] text-white/50" style={{ fontFamily: mono }}>peningkatan</span>
            </div>
          </div>
        </div>

        <div className="w-[2px] h-[90px] bg-white/20 shrink-0" />

        <div className="w-[280px] shrink-0">
          <div className="flex items-end gap-6">
            <div>
              <div className="text-[2.5rem] font-black text-white leading-none" style={{ fontFamily: serif }}>Rp7,8T</div>
              <span className="text-[12px] text-white/60 font-medium block mt-1">Kerugian Nov '24 – Nov '25</span>
            </div>
            <div>
              <div className="text-[1.8rem] font-black text-white leading-none" style={{ fontFamily: serif }}>70rb+</div>
              <span className="text-[12px] text-white/60 font-medium block mt-1">Laporan ke OJK</span>
            </div>
          </div>
          <span className="text-[10px] text-white/30 mt-2 block tracking-wider uppercase" style={{ fontFamily: mono }}>OJK / Tech in Asia, 2025</span>
        </div>
      </div>

      {/* ─── CASES ─── */}
      <div className="px-14 py-4 shrink-0 border-b border-white/[0.06]">
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b35] block mb-3" style={{ fontFamily: mono }}>
          Kasus tanpa label di Indonesia
        </span>
        <div className="space-y-2.5">
          {[
            { y: '2025', t: 'Penipuan', text: 'Deepfake Presiden Prabowo "menawarkan bantuan" — menipu warga di 20+ provinsi.', s: 'Straits Times' },
            { y: '2025', t: 'NCII', text: 'Konten eksplisit dari wajah siswa & guru SMA dibuat dengan AI. Divonis 1 tahun.', s: 'Kumparan' },
            { y: '2024', t: 'Politik', text: 'Deepfake & audio palsu disebarkan tanpa label untuk memanipulasi pemilih.', s: 'ISEAS' },
          ].map((c, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-[60px] text-right pt-[1px]">
                <span className="text-[12px] font-bold text-[#ff6b35]" style={{ fontFamily: mono }}>{c.y}</span>
                <span className="text-[10px] text-white/20 block" style={{ fontFamily: mono }}>{c.t}</span>
              </div>
              <div className="w-[2px] bg-white/[0.06] shrink-0 self-stretch" />
              <p className="text-[13px] text-white/40 leading-relaxed font-light flex-1">
                {c.text} <span className="text-[10px] text-white/15" style={{ fontFamily: mono }}>— {c.s}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── REGULATION BARS ─── */}
      <div className="px-14 py-4 shrink-0 flex gap-8 items-start">
        <div className="flex-1">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#ff6b35] block mb-3" style={{ fontFamily: mono }}>
            Kesiapan regulasi label AI
          </span>
          <div className="space-y-2.5">
            <CompBar value={85} max={100} label="Uni Eropa" color="#2d6a4f" sub="EU AI Act Pasal 50 — wajib label + C2PA + watermark (2026)" />
            <CompBar value={70} max={100} label="Tiongkok" color="#1d3557" sub="Deep Synthesis Provisions — wajib label sejak 2023" />
            <CompBar value={10} max={100} label="Indonesia" color="#d62828" sub="Belum ada UU spesifik — hanya UU ITE & SE Etika AI" />
          </div>
        </div>
        <div className="w-[190px] shrink-0 border-l border-white/[0.06] pl-6 flex flex-col justify-center">
          {/* mini literacy donut-ish */}
          <div className="relative w-[80px] h-[80px] mx-auto mb-2">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="#d62828" strokeWidth="8"
                strokeDasharray={`${0.42 * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[20px] font-black text-white" style={{ fontFamily: serif }}>42%</span>
            </div>
          </div>
          <p className="text-[11px] text-white/30 text-center leading-snug font-light">
            Literasi digital Indonesia — <span className="text-white/60 font-medium">belum terlindungi</span>.
          </p>
        </div>
      </div>

      {/* ─── QUOTE ─── */}
      <div className="px-14 pb-3 shrink-0">
        <div className="border-l-[3px] border-[#ff6b35] pl-5 py-1">
          <p className="text-[15px] text-white/40 leading-snug" style={{ fontFamily: serif }}>
            "Belum ada UU spesifik di Indonesia yang menggunakan istilah <span className="text-[#ff6b35]">deepfake</span>."
          </p>
          <span className="text-[10px] text-white/15 mt-1.5 block tracking-wider uppercase" style={{ fontFamily: mono }}>BPHN, 2025</span>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="mt-auto px-14 pb-4 pt-2 shrink-0 border-t border-white/[0.06]">
        <div className="flex justify-between items-end">
          <div className="flex gap-5">
            {[[
              '[1] Straits Times (2025)',
              '[2] Kumparan (2025)',
              '[3] ISEAS Fulcrum (2024)',
              '[4] OJK / Tech in Asia (2025)',
            ], [
              '[5] BPHN / Kompas (2025)',
              '[6] Ahrefs (2025)',
              '[7] Conjointly / NIH (2025)',
              '[8] CNA (2024)',
            ]].map((col, ci) => (
              <div key={ci} className="space-y-[1px]">
                {col.map((s, i) => (
                  <div key={i} className="text-[8px] text-white/15" style={{ fontFamily: mono }}>{s}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="text-right">
            <span className="text-[15px] font-black text-white/50 tracking-tight" style={{ fontFamily: serif }}>etika profesi.</span>
            <span className="text-[9px] text-white/15 block tracking-[0.15em] uppercase" style={{ fontFamily: mono }}>Kelompok 19 · 2026</span>
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
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setScale(Math.min(width / W, height / H) * 0.92);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleExportPNG = useCallback(async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 300));
    try {
      const dataUrl = await domToPng(posterRef.current, {
        width: W, height: H, scale: 2, quality: 1, backgroundColor: '#0a0a0a',
      });
      const a = document.createElement('a');
      a.download = 'konten-ai-tanpa-label.png';
      a.href = dataUrl;
      a.click();
    } catch (err) { console.error(err); }
    finally { setIsExporting(false); }
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] overflow-hidden" style={{ fontFamily: sans }}>
      {isExporting && (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-[#ff6b35] animate-spin" />
          <span className="text-[#ff6b35] text-sm uppercase tracking-widest" style={{ fontFamily: mono }}>Mengekspor…</span>
        </div>
      )}
      <div className="fixed top-0 left-0 z-[-1] opacity-0 pointer-events-none" style={{ width: W }}>
        <div ref={posterRef}><PosterContent /></div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-hidden relative flex items-center justify-center">
        <div className="shadow-2xl shadow-black/60 overflow-hidden shrink-0"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center center' }}>
          <PosterContent />
        </div>
      </div>
      <div className="h-12 bg-[#0a0a0a] border-t border-white/[0.04] flex items-center justify-between px-8 shrink-0">
        <span className="text-[10px] text-white/15 uppercase tracking-widest" style={{ fontFamily: mono }}>{W}×{H}</span>
        <button onClick={handleExportPNG} disabled={isExporting}
          className="flex items-center gap-2 text-white/20 hover:text-[#ff6b35] transition-colors disabled:opacity-50">
          <Download className="w-3.5 h-3.5" />
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: mono }}>
            {isExporting ? 'Mengekspor...' : 'Ekspor PNG'}
          </span>
        </button>
      </div>
    </div>
  );
}
