import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Server,
  Droplets,
  Zap,
  Leaf,
  AlertTriangle,
  Download,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { domToJpeg } from 'modern-screenshot';

const slides = [
  { id: 'title' },
  { id: 'problem_energy' },
  { id: 'problem_water' },
  { id: 'impact_community' },
  { id: 'solutions' },
  { id: 'sources' },
  { id: 'credits' },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const newScale = Math.min(width / 1200, height / 675);
        setScale(newScale * 0.95);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));

  const handleExportPDF = useCallback(async () => {
    if (!window.jspdf) {
      console.warn('jsPDF is still loading. Please try again in a moment.');
      return;
    }
    setIsExporting(true);
    setShowExport(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 675],
        hotfixes: ['px_scaling'],
      });

      const slideEls = document.querySelectorAll('.pdf-slide');

      for (let i = 0; i < slideEls.length; i++) {
        const dataUrl = await domToJpeg(slideEls[i], {
          width: 1200,
          height: 675,
          scale: 2,
          quality: 95,
          backgroundColor: '#fdfdfc',
        });

        if (i > 0) pdf.addPage([1200, 675], 'landscape');
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1200, 675);
      }

      pdf.save('datacenter-impact-presentation.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setShowExport(false);
      setIsExporting(false);
    }
  }, []);

  const renderSlideContent = (id) => {
    switch (id) {
      case 'title':
        return (
          <div className="relative flex flex-col h-full justify-between p-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="/images/datacenter-aerial.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/80 to-stone-950/40" />
            </div>
            <div className="relative z-10 flex items-center gap-4 shrink-0">
              <Server className="w-8 h-8 text-red-400" />
              <span className="font-mono text-sm tracking-widest text-red-400 uppercase leading-none mt-1">
                Studi Kasus IT & Lingkungan
              </span>
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl">
              <h1 className="text-[5.5rem] font-black text-white tracking-tighter leading-none mb-6">
                the hidden cost<br />of the cloud.
              </h1>
              <p className="text-2xl text-stone-300 font-light max-w-3xl leading-relaxed">
                Dampak negatif ekspansi masif pusat data (data center) di Amerika Serikat terhadap konsumsi energi, sumber daya air, dan komunitas lokal.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <div className="w-full h-px bg-white/20 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-400 uppercase tracking-widest leading-none">
                <span>Etika Profesi — Kelompok 19 Belas Juta Hektar Lapangan Bergizi Gratis</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        );

      case 'credits':
        return (
          <div className="flex flex-col h-full justify-center items-center p-12 bg-stone-900">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-16">
              anggota kelompok.
            </h2>
            <div className="grid grid-cols-2 max-w-4xl w-full gap-8">
              {[
                { id: "5054231013", name: "Faiz Muhammad Kautsar" },
                { id: "5054231011", name: "Muhammad Farhan Arya Wicaksono" },
                { id: "5054231018", name: "Imam Muhammad Diponegoro" },
                { id: "5054231010", name: "Muhammad Rasyad Lubis" },
              ].map((member) => (
                <div key={member.id} className="border border-stone-700 bg-stone-800 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-red-400 transition-all">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="font-mono text-sm tracking-widest text-red-400 mb-2">{member.id}</span>
                  <span className="text-xl font-bold text-stone-200">{member.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-16 flex items-center justify-center gap-3 opacity-50">
              <Server className="w-6 h-6 text-white" />
              <span className="font-black text-xl tracking-tighter text-white">etika profesi.</span>
            </div>
          </div>
        );

      case 'problem_energy':
        return (
          <div className="h-full flex bg-[#faf5f0]">
            <div className="w-[280px] shrink-0 relative overflow-hidden">
              <img src="/images/server-room.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#faf5f0]/30" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/80 to-transparent p-6">
                <Zap className="w-10 h-10 text-red-400 mb-2" />
                <div className="font-mono text-[10px] text-stone-300 uppercase tracking-widest">Slide 02</div>
              </div>
            </div>
            <div className="flex-1 flex flex-col p-10">
              <div className="flex items-start justify-between mb-6 shrink-0">
                <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                  lapar energi.
                </h2>
                <span
                  className="font-mono text-sm tracking-widest text-[#dc2626] uppercase border border-[#dc2626] px-3 py-1.5 shrink-0 whitespace-nowrap"
                  style={{ lineHeight: 1 }}
                >
                  Konsumsi Listrik
                </span>
              </div>

              <div className="flex flex-col flex-1 min-h-0 gap-6">
                <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
                  <div className="flex-1 border-t-2 border-stone-900 pt-4 flex flex-col">
                    <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2 shrink-0">
                      183 TWh per Tahun <sup className="text-[9px] text-[#dc2626] font-mono">[1]</sup>
                    </h3>
                    <p className="text-stone-600 text-sm font-light leading-relaxed mb-3">
                      Pada 2024, data center AS mengonsumsi 183 TWh listrik, lebih dari 4% total nasional.<sup className="text-[8px] text-[#dc2626] font-mono">[4]</sup> Diproyeksikan hingga ~426 TWh pada 2030.<sup className="text-[8px] text-[#dc2626] font-mono">[1]</sup>
                    </p>
                    <div className="flex-1 bg-stone-900 p-4 flex flex-col justify-end rounded">
                      <div className="flex items-end gap-4" style={{ height: 100 }}>
                        {[
                          { year: '2020', h: 23, projected: false, label: '~100' },
                          { year: '2024', h: 43, projected: false, label: '183' },
                          { year: '2026*', h: 59, projected: true, label: '~250' },
                          { year: '2030*', h: 100, projected: true, label: '~426' },
                        ].map((bar) => (
                          <div key={bar.year} className="flex-1 flex flex-col items-center justify-end h-full">
                            <span className="text-stone-300 font-mono text-[10px] mb-1.5">{bar.label}</span>
                            <div
                              className={`w-full rounded-t ${bar.projected ? 'bg-red-400/60 border border-dashed border-red-300' : 'bg-red-500'}`}
                              style={{ height: `${bar.h}%` }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-2">
                        {['2020', '2024', '2026*', '2030*'].map((y) => (
                          <span key={y} className="flex-1 text-center text-stone-400 font-mono text-[10px]">{y}</span>
                        ))}
                      </div>
                      <div className="text-stone-500 font-mono text-[9px] mt-2 text-right">TWh — *proyeksi, IEA/LBNL via Pew 2025</div>
                    </div>
                  </div>
                  <div className="flex-1 border-t-2 border-stone-900 pt-4 flex flex-col">
                    <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2 shrink-0">
                      Sumber Energi Kotor
                    </h3>
                    <p className="text-stone-600 text-sm font-light leading-relaxed mb-3">
                      40%+ dari gas alam, ~15% batu bara. Hanya 24% energi terbarukan.<sup className="text-[8px] text-[#dc2626] font-mono">[7]</sup> AI workloads memperburuk kebutuhan ini secara eksponensial.
                    </p>
                    <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col justify-center gap-2.5 rounded">
                      {[
                        { label: 'Gas Alam', pct: '40%+', width: '42%', color: 'bg-[#dc2626]' },
                        { label: 'Terbarukan', pct: '24%', width: '24%', color: 'bg-emerald-500' },
                        { label: 'Nuklir', pct: '~18%', width: '18%', color: 'bg-blue-500' },
                        { label: 'Batu Bara', pct: '~15%', width: '15%', color: 'bg-stone-700' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-0.5"><span>{item.label}</span><span>{item.pct}</span></div>
                          <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900 p-5 flex items-center justify-between shrink-0 rounded">
                  <span className="font-mono text-xs text-stone-400 uppercase tracking-widest leading-none">
                    Dampak Utama
                  </span>
                  <span className="text-lg text-stone-200 font-medium leading-none">
                    Rekor konsumsi listrik AS 2024: data center penyebab utama.<sup className="text-[8px] text-red-400 font-mono">[4]</sup>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'problem_water':
        return (
          <div className="h-full flex flex-col">
            <div className="h-[180px] shrink-0 relative overflow-hidden">
              <img src="/images/cooling-towers.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 to-stone-900/90" />
              <div className="absolute inset-0 p-10 flex items-end justify-between">
                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                  haus air.
                </h2>
                <span
                  className="font-mono text-sm tracking-widest text-sky-300 uppercase border border-sky-300/50 px-3 py-1.5 shrink-0 whitespace-nowrap bg-stone-900/40 backdrop-blur-sm"
                  style={{ lineHeight: 1 }}
                >
                  Konsumsi Air
                </span>
              </div>
            </div>

            <div className="flex gap-5 flex-1 min-h-0 p-8 pt-6">
              <div className="flex-1 border border-stone-300 p-5 flex flex-col bg-white rounded">
                <div className="text-[#0369a1] font-mono text-lg mb-4 border-b border-stone-200 pb-2 shrink-0">01.</div>
                <Droplets className="w-8 h-8 text-[#0369a1] mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-stone-900 tracking-tight mb-2 shrink-0">Pendinginan Langsung</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  Server menghasilkan panas luar biasa. Sistem pendinginan evaporatif menyedot jutaan liter air bersih setiap hari. Konsumsi air langsung diproyeksikan naik 2–4× antara 2023–2028.<sup className="text-[8px] text-[#0369a1] font-mono">[2]</sup>
                </p>
                <img src="/images/thumb-evaporative.png" alt="Evaporative cooling system" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-90" />
                <div className="mt-auto font-mono text-[10px] text-stone-400 bg-stone-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Sumber: U.S. Department of Energy, 2024
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-5 flex flex-col bg-[#f0f7ff] rounded">
                <div className="text-[#0369a1] font-mono text-lg mb-4 border-b border-blue-200 pb-2 shrink-0">02.</div>
                <Zap className="w-8 h-8 text-[#0369a1] mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-stone-900 tracking-tight mb-2 shrink-0">Konsumsi Air Tidak Langsung</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  75–80% jejak air data center bersifat tidak langsung, tetapi dalam pembangkitan listriknya.<sup className="text-[8px] text-[#0369a1] font-mono">[7]</sup> Pembangkit termoelektrik butuh air untuk menghasilkan energi yang dipakai data center.
                </p>
                <img src="/images/thumb-powerplant.png" alt="Thermoelectric power plant" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-90" />
                <div className="mt-auto font-mono text-[10px] text-[#0369a1] bg-blue-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Jejak air tersembunyi yang sering diabaikan.
                </div>
              </div>

              <div className="flex-1 border border-red-800 p-5 flex flex-col bg-red-800 text-stone-100 rounded">
                <div className="text-red-200 font-mono text-lg mb-4 border-b border-red-700 pb-2 shrink-0">03.</div>
                <AlertTriangle className="w-8 h-8 text-red-200 mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-white tracking-tight mb-2 shrink-0">AI Memperburuk Semua</h4>
                <p className="text-red-100 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  AI workloads membutuhkan densitas daya jauh lebih tinggi per rak. Estimasi: data center AI di AS bisa memerlukan hingga 32 miliar galon air per tahun pada 2028.<sup className="text-[8px] text-red-200 font-mono">[3]</sup>
                </p>
                <img src="/images/thumb-ai-servers.png" alt="AI GPU server racks" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-80" />
                <div className="mt-auto font-mono text-[10px] text-red-900 bg-red-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Sumber: World Resources Institute (WRI), 2024
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact_community':
        return (
          <div className="h-full flex bg-[#faf5f0]">
            <div className="w-[320px] shrink-0 relative overflow-hidden">
              <img src="/images/community-impact.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2.5">
                <div>
                  <div className="text-2xl font-black text-white mb-0.5">70%</div>
                  <div className="text-[10px] font-mono text-stone-300 uppercase tracking-widest leading-none mb-1">Trafik Internet Global</div>
                  <p className="text-[10px] text-stone-300/80 leading-snug">Lalu lintas internet dunia melewati Data Center Alley, Virginia.<sup className="text-[7px] text-stone-400 font-mono">[8]</sup></p>
                </div>
                <div className="h-px bg-white/20" />
                <div>
                  <div className="text-xl font-black text-red-400 mb-0.5">↑ Tarif</div>
                  <div className="text-[10px] font-mono text-stone-300 uppercase tracking-widest leading-none mb-1">Harga Listrik Naik</div>
                  <p className="text-[10px] text-stone-300/80 leading-snug">Komunitas menanggung biaya infrastruktur.<sup className="text-[7px] text-stone-400 font-mono">[8]</sup></p>
                </div>
                <div className="h-px bg-white/20" />
                <div>
                  <div className="text-xl font-black text-amber-400 mb-0.5">75–90+ dB</div>
                  <div className="text-[10px] font-mono text-stone-300 uppercase tracking-widest leading-none mb-1">Polusi Suara</div>
                  <p className="text-[10px] text-stone-300/80 leading-snug">Pendingin & generator berjalan 24/7, mengganggu warga sekitar.<sup className="text-[7px] text-stone-400 font-mono">[11]</sup></p>
                </div>
                <div className="h-px bg-white/20" />
                <div>
                  <div className="text-lg font-black text-amber-300 mb-0.5">Resistensi</div>
                  <div className="text-[10px] font-mono text-stone-300 uppercase tracking-widest leading-none mb-1">Penolakan Warga</div>
                  <p className="text-[10px] text-stone-300/80 leading-snug">Moratorium lokal di berbagai daerah; Maine berlakukan larangan negara bagian.<sup className="text-[7px] text-stone-400 font-mono">[5]</sup></p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-10">
              <div className="flex items-start justify-between mb-6 shrink-0">
                <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                  dampak komunitas.
                </h2>
                <span
                  className="font-mono text-sm tracking-widest text-[#b45309] uppercase border border-[#b45309] px-3 py-1.5 shrink-0 whitespace-nowrap"
                  style={{ lineHeight: 1 }}
                >
                  Studi Kasus
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-5">
                <h3 className="text-xl font-bold text-stone-900 tracking-tight border-t-2 border-stone-900 pt-4">
                  Persaingan Sumber Daya dengan Warga
                </h3>
                <div className="bg-white p-5 border-l-4 border-[#dc2626] rounded-r">
                  <p className="text-stone-600 italic text-base mb-3">
                    "The noise is just intolerable. Almost everybody in the neighborhood now has decibel readers on their phones. We hear it all the time inside our homes."
                  </p>
                  <div className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                    — Gregory Pirio, Loudoun County, Virginia (WUSA9, 2026)
                  </div>
                </div>

                <div className="bg-white p-5 border-l-4 border-[#b45309] rounded-r">
                  <p className="text-stone-600 italic text-base mb-3">
                    "We don't live out here to live near anything industrial, and I knew it was going to affect the health of my kids. I am just beside myself."
                  </p>
                  <div className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                    — Joanne Carcamo, Hood County, Texas (CBS News, 2025)
                  </div>
                </div>

                <div className="bg-stone-900 p-5 mt-auto flex items-center justify-between rounded">
                  <span className="text-lg font-medium text-white">Praktik Ini Harus Berubah</span>
                  <span className="text-2xl font-black text-red-400">Penting</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="h-full flex flex-col">
            <div className="h-[160px] shrink-0 relative overflow-hidden">
              <img src="/images/green-energy.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-emerald-900/80" />
              <div className="absolute inset-0 p-10 flex items-end justify-between">
                <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                  solusi & diskusi.
                </h2>
                <span
                  className="font-mono text-sm tracking-widest text-emerald-300 uppercase border border-emerald-300/50 px-3 py-1.5 shrink-0 whitespace-nowrap bg-emerald-900/40 backdrop-blur-sm"
                  style={{ lineHeight: 1 }}
                >
                  Rekomendasi
                </span>
              </div>
            </div>

            <div className="flex gap-5 flex-1 min-h-0 p-8 pt-6">
              <div className="flex-1 border border-stone-300 p-5 flex flex-col bg-white rounded">
                <div className="text-emerald-700 font-mono text-lg mb-4 border-b border-stone-200 pb-2 shrink-0">01.</div>
                <Leaf className="w-8 h-8 text-emerald-700 mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-stone-900 tracking-tight mb-2 shrink-0">
                  Energi Terbarukan & Nuklir
                </h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  Transisi ke 100% energi bersih melalui Power Purchase Agreements (PPAs) dengan solar, angin, dan Small Modular Reactors (SMR) nuklir untuk baseload 24/7.<sup className="text-[8px] text-emerald-600 font-mono">[6]</sup>
                </p>
                <img src="/images/thumb-renewable.png" alt="Solar panels and wind turbines" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-90" />
                <div className="mt-auto font-mono text-[10px] text-stone-400 bg-stone-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Target: 24/7 carbon-free energy matching.
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-5 flex flex-col bg-[#f0fdf4] rounded">
                <div className="text-emerald-700 font-mono text-lg mb-4 border-b border-emerald-200 pb-2 shrink-0">02.</div>
                <Droplets className="w-8 h-8 text-emerald-700 mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-stone-900 tracking-tight mb-2 shrink-0">
                  Liquid & Immersion Cooling
                </h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  Beralih dari pendinginan evaporatif ke direct-to-chip cooling dan immersion cooling untuk mengurangi konsumsi air secara drastis, terutama untuk rak AI berdensitas tinggi.<sup className="text-[8px] text-emerald-600 font-mono">[2]</sup>
                </p>
                <img src="/images/thumb-cooling.png" alt="Immersion cooling tanks" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-90" />
                <div className="mt-auto font-mono text-[10px] text-emerald-700 bg-emerald-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Hemat air hingga 90% dibanding evaporatif.
                </div>
              </div>

              <div className="flex-1 border border-emerald-700 p-5 flex flex-col bg-emerald-700 text-stone-100 rounded">
                <div className="text-emerald-200 font-mono text-lg mb-4 border-b border-emerald-500 pb-2 shrink-0">03.</div>
                <Server className="w-8 h-8 text-emerald-200 mb-3 shrink-0" />
                <h4 className="font-bold text-xl text-white tracking-tight mb-2 shrink-0">
                  Regulasi & Transparansi
                </h4>
                <p className="text-emerald-100 text-sm font-light leading-relaxed mb-1.5 flex-1 overflow-hidden">
                  Pemerintah perlu mewajibkan pelaporan konsumsi energi dan air, menetapkan standar efisiensi, serta melibatkan komunitas lokal dalam proses perizinan pembangunan data center.<sup className="text-[8px] text-emerald-200 font-mono">[7]</sup>
                </p>
                <img src="/images/thumb-regulation.png" alt="Policy documents" className="w-full h-[96px] object-cover rounded mb-3 shrink-0 opacity-80" />
                <div className="mt-auto font-mono text-[10px] text-emerald-800 bg-emerald-100 p-2.5 shrink-0 leading-relaxed rounded">
                  Waste heat recovery untuk pemanasan komunitas sekitar.
                </div>
              </div>
            </div>
          </div>
        );

      case 'sources':
        return (
          <div className="h-full flex flex-col p-10 bg-white">
            <div className="flex items-start justify-between mb-5 shrink-0">
              <h2 className="text-4xl font-black text-stone-900 tracking-tighter leading-none">
                sumber rujukan.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-stone-500 uppercase border border-stone-400 px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                <BookOpen className="w-4 h-4 inline -mt-0.5 mr-1" />
                Referensi
              </span>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-3 gap-2.5 h-full">
                {[
                  { num: "1", title: "Pew Research Center (2025)", desc: "Data centers now consume more than 4% of U.S. electricity; IEA projects ~426 TWh by 2030.", url: "pewresearch.org" },
                  { num: "2", title: "U.S. Dept. of Energy / LBNL (2024)", desc: "Data center energy report: 325–580 TWh projected by 2028; water use 2–4× growth.", url: "energy.gov" },
                  { num: "3", title: "World Resources Institute (2024)", desc: "AI data centers could require 32B gallons of water/year by 2028.", url: "wri.org" },
                  { num: "4", title: "Harvard Belfer Center (2025)", desc: "U.S. electricity hit record high in 2024 driven by data centers.", url: "belfercenter.org" },
                  { num: "5", title: "CBS News (2025)", desc: "Community opposition to data centers in Hood County, TX and Virginia.", url: "cbsnews.com" },
                  { num: "6", title: "Deloitte (2025)", desc: "Nuclear energy as strategic solution for 24/7 carbon-free DC power.", url: "deloitte.com" },
                  { num: "7", title: "EIA / EESI", desc: "U.S. grid mix 2024: gas 43%, renewables 24%, nuclear 18%, coal 15%.", url: "eia.gov / eesi.org" },
                  { num: "8", title: "Lincoln Institute of Land Policy", desc: "Resource competition between data centers and local communities.", url: "lincolninst.edu" },
                  { num: "9", title: "WUSA9 (2026)", desc: "Loudoun County residents report intolerable noise from data center cooling.", url: "wusa9.com" },
                  { num: "10", title: "Texas Tribune (2025)", desc: "Texas communities fight data center water use; strain on Ogallala Aquifer.", url: "texastribune.org" },
                  { num: "11", title: "Data Center Knowledge", desc: "Data center noise levels: 75–90+ dBA from cooling systems and generators.", url: "datacenterknowledge.com" },
                ].map((src) => (
                  <div key={src.num} className="bg-stone-50 border border-stone-200 p-3 flex gap-2.5 items-start rounded">
                    <div className="text-[#dc2626] font-mono text-sm font-black shrink-0 w-7 text-right leading-snug pt-px">{src.num}.</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 text-sm leading-snug">{src.title}</div>
                      <p className="text-stone-500 text-xs font-light mt-1 leading-snug">{src.desc}</p>
                      <div className="text-[#0369a1] font-mono text-[10px] mt-1.5">{src.url}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Slide missing</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1c1b1a] font-sans selection:bg-[#dc2626] selection:text-white overflow-hidden">
      {showExport && (
        <div className="fixed inset-0 z-[9999] bg-[#1c1b1a] flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
          <span className="text-red-400 font-mono text-sm uppercase tracking-widest">
            Menyiapkan PDF…
          </span>
        </div>
      )}

      {showExport && (
        <div
          id="pdf-export-container"
          className="fixed top-0 left-0 z-[9998]"
          style={{ width: 1200 }}
        >
          <style>{`#pdf-export-container * { animation: none !important; transition: none !important; }`}</style>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="pdf-slide"
              style={{
                width: 1200,
                height: 675,
                overflow: 'hidden',
                background: '#fdfdfc',
              }}
            >
              {renderSlideContent(slide.id)}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 w-full shadow-2xl relative flex flex-col bg-stone-900">
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#151413]"
        >
          <div
            className="bg-[#fdfdfc] shadow-2xl overflow-hidden shrink-0"
            style={{
              width: 1200,
              height: 675,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {renderSlideContent(slides[currentSlide].id)}
          </div>
        </div>

        <div className="h-16 bg-stone-900 border-t border-stone-800 flex items-center justify-between px-8 shrink-0">
          <div className="font-mono text-xs text-stone-400 uppercase tracking-widest flex items-center gap-4">
            <span>Data Center Impact</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[2px] transition-all duration-300 ${
                    idx === currentSlide
                      ? 'bg-red-400 w-8'
                      : 'bg-stone-700 w-4'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="font-mono text-xs text-stone-400 uppercase tracking-widest">
              {String(currentSlide + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors border-l border-stone-800 pl-6 disabled:opacity-50 disabled:hover:text-stone-400"
            >
              <Download className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-widest pt-1">
                {isExporting ? 'Mengekspor...' : 'Ekspor PDF'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
