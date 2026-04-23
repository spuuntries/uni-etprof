import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Server,
  Droplets,
  Zap,
  Thermometer,
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
          <div className="flex flex-col h-full justify-between p-12">
            <div className="flex items-center gap-4 shrink-0">
              <Server className="w-8 h-8 text-[#dc2626]" />
              <span className="font-mono text-sm tracking-widest text-[#dc2626] uppercase leading-none mt-1">
                Studi Kasus IT & Lingkungan
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-5xl">
              <h1 className="text-[5.5rem] font-black text-stone-900 tracking-tighter leading-none mb-6">
                the hidden cost<br />of the cloud.
              </h1>
              <p className="text-3xl text-stone-600 font-light max-w-4xl leading-snug">
                Dampak negatif ekspansi masif pusat data (data center) di Amerika Serikat terhadap konsumsi energi, sumber daya air, dan komunitas lokal.
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-full h-px bg-stone-300 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-500 uppercase tracking-widest leading-none">
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
                // { id: "XXXXXXXXXX", name: "Nama Anggota 4" },
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
          <div className="h-full flex flex-col p-12 bg-[#faf5f0]">
            <div className="flex items-start justify-between mb-8 shrink-0">
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

            <div className="flex flex-col flex-1 min-h-0 gap-8">
              <div className="flex gap-12 flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 border-t-2 border-stone-900 pt-4 flex flex-col">
                  <div className="text-[#dc2626] mb-2">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2 shrink-0">
                    183 TWh per Tahun
                  </h3>
                  <p className="text-stone-600 text-base font-light leading-relaxed mb-3">
                    Pada 2024, data center AS mengonsumsi 183 TWh listrik, lebih dari 4% total nasional. Diproyeksikan hingga 580 TWh pada 2030.
                  </p>
                  <div className="flex-1 bg-stone-900 p-4 flex flex-col justify-end">
                    <div className="flex items-end gap-6" style={{ height: 110 }}>
                      {[
                        { year: '2020', h: 17, projected: false, label: '~100' },
                        { year: '2024', h: 32, projected: false, label: '183' },
                        { year: '2028*', h: 66, projected: true, label: '~380' },
                        { year: '2030*', h: 100, projected: true, label: '~580' },
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
                    <div className="flex gap-6 mt-2">
                      {['2020', '2024', '2028*', '2030*'].map((y) => (
                        <span key={y} className="flex-1 text-center text-stone-400 font-mono text-[10px]">{y}</span>
                      ))}
                    </div>
                    <div className="text-stone-500 font-mono text-[9px] mt-2 text-right">TWh — *proyeksi, Pew Research 2025</div>
                  </div>
                </div>
                <div className="flex-1 border-t-2 border-stone-900 pt-4 flex flex-col">
                  <div className="text-[#b45309] mb-2">
                    <Thermometer className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2 shrink-0">
                    Sumber Energi Kotor
                  </h3>
                  <p className="text-stone-600 text-base font-light leading-relaxed mb-3">
                    40%+ dari gas alam, ~15% batu bara. Hanya 24% energi terbarukan. AI workloads memperburuk kebutuhan ini secara eksponensial.
                  </p>
                  <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col justify-center gap-2.5">
                    {[
                      { label: 'Gas Alam', pct: '40%+', width: '42%', color: 'bg-[#dc2626]' },
                      { label: 'Terbarukan', pct: '24%', width: '24%', color: 'bg-emerald-500' },
                      { label: 'Nuklir', pct: '~20%', width: '20%', color: 'bg-blue-500' },
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

              <div className="bg-[#e8e0d5] p-6 border border-stone-300 flex items-center justify-between shrink-0">
                <span className="font-mono text-base text-stone-500 uppercase tracking-widest leading-none">
                  Dampak Utama
                </span>
                <span className="text-2xl text-stone-800 font-medium leading-none">
                  Rekor konsumsi listrik AS 2024: data center penyebab utama.
                </span>
              </div>
            </div>
          </div>
        );

      case 'problem_water':
        return (
          <div className="h-full flex flex-col p-12">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                haus air.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#0369a1] uppercase border border-[#0369a1] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Konsumsi Air
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-[#0369a1] font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">
                  01.
                </div>
                <Droplets className="w-10 h-10 text-[#0369a1] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  Pendinginan Langsung
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Server menghasilkan panas luar biasa. Sistem pendinginan evaporatif menyedot jutaan liter air bersih setiap hari. Konsumsi air langsung diproyeksikan naik 2–4 kali lipat antara 2023–2028.
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  Sumber: U.S. Department of Energy, 2024
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f0f7ff]">
                <div className="text-[#0369a1] font-mono text-xl mb-6 border-b border-blue-200 pb-3 shrink-0">
                  02.
                </div>
                <Zap className="w-10 h-10 text-[#0369a1] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  Konsumsi Air Tidak Langsung
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  75–80% jejak air data center sebenarnya bersifat tidak langsung, tetapi dalam dalam pembangkitan listriknya. Pembangkit termoelektrik butuh air untuk menghasilkan energi yang dipakai data center.
                </p>
                <div className="mt-auto font-mono text-xs text-[#0369a1] bg-blue-100 p-3 shrink-0 leading-relaxed">
                  Jejak air tersembunyi yang sering diabaikan.
                </div>
              </div>

              <div className="flex-1 border border-red-800 p-6 flex flex-col bg-red-800 text-stone-100">
                <div className="text-red-200 font-mono text-xl mb-6 border-b border-red-700 pb-3 shrink-0">
                  03.
                </div>
                <AlertTriangle className="w-10 h-10 text-red-200 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  AI Memperburuk Semua
                </h4>
                <p className="text-red-100 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  AI workloads membutuhkan densitas daya jauh lebih tinggi per rak. Estimasi: data center AI di AS bisa memerlukan hingga 32 miliar galon air per tahun pada 2028.
                </p>
                <div className="mt-auto font-mono text-xs text-red-900 bg-red-100 p-3 shrink-0 leading-relaxed">
                  Sumber: World Resources Institute (WRI), 2024
                </div>
              </div>
            </div>
          </div>
        );

      case 'impact_community':
        return (
          <div className="h-full flex flex-col p-12 bg-[#faf5f0]">
            <div className="flex items-start justify-between mb-8 shrink-0">
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

            <div className="flex gap-8 flex-1 min-h-0">
              <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 border border-stone-300 flex-1">
                  <div className="text-3xl font-black text-[#dc2626] mb-1">70%+</div>
                  <div className="text-xs font-mono text-stone-500 uppercase tracking-widest leading-none mb-2">
                    Konsentrasi di Virginia
                  </div>
                  <p className="text-stone-600 font-light text-xs leading-snug">
                    Northern Virginia menampung lebih dari 70% lalu lintas internet dunia. "Data Center Alley" membebani grid listrik dan air lokal.
                  </p>
                </div>

                <div className="bg-white p-4 border border-stone-300 flex-1">
                  <div className="text-3xl font-black text-[#b45309] mb-1">↑ Tarif</div>
                  <div className="text-xs font-mono text-stone-500 uppercase tracking-widest leading-none mb-2">
                    Harga Listrik Naik
                  </div>
                  <p className="text-stone-600 font-light text-xs leading-snug">
                    Beban besar pada grid lokal menyebabkan kenaikan tarif listrik untuk penduduk. Komunitas menanggung biaya infrastruktur.
                  </p>
                </div>

                <div className="bg-stone-900 text-white p-4 border border-stone-800 flex-1">
                  <div className="text-3xl font-black text-red-400 mb-1">Moratorium</div>
                  <div className="text-xs font-mono text-red-300 uppercase tracking-widest leading-none mb-2">
                    Penolakan Warga
                  </div>
                  <p className="text-stone-300 font-light text-xs leading-snug">
                    Beberapa daerah di Virginia dan Texas memberlakukan moratorium pembangunan data center baru karena tekanan masyarakat.
                  </p>
                </div>
              </div>

              <div className="w-2/3 flex flex-col gap-6">
                <div className="border-t-2 border-stone-900 pt-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-6">
                    Persaingan Sumber Daya dengan Warga
                  </h3>
                  <div className="space-y-6 flex-1">
                    <div className="bg-white p-6 border-l-4 border-[#dc2626]">
                      <p className="text-stone-600 italic text-lg mb-4">
                        "Data centers are consuming so much power that there isn't enough left for the residents who were here first. Our electricity bills keep climbing."
                      </p>
                      <div className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                        — Warga Loudoun County, Virginia (CBS News, 2025)
                      </div>
                    </div>

                    <div className="bg-white p-6 border-l-4 border-[#b45309]">
                      <p className="text-stone-600 italic text-lg mb-4">
                        "The noise, the construction, the strain on our water supply — we didn't sign up for this. These facilities benefit tech companies, not us."
                      </p>
                      <div className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                        — Komunitas di Texas (Project Censored, 2025)
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-900 p-6 text-center mt-auto flex items-center justify-between">
                    <span className="text-xl font-medium text-white">Stabilitas Grid Terancam</span>
                    <span className="text-3xl font-black text-red-400">Kritis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solutions':
        return (
          <div className="h-full flex flex-col p-12">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                solusi & diskusi.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-emerald-700 uppercase border border-emerald-700 px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Rekomendasi
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-emerald-700 font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">01.</div>
                <Leaf className="w-10 h-10 text-emerald-700 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  Energi Terbarukan & Nuklir
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Transisi ke 100% energi bersih melalui Power Purchase Agreements (PPAs) dengan solar, angin, dan Small Modular Reactors (SMR) nuklir untuk baseload 24/7.
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  Target: 24/7 carbon-free energy matching.
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f0fdf4]">
                <div className="text-emerald-700 font-mono text-xl mb-6 border-b border-emerald-200 pb-3 shrink-0">02.</div>
                <Droplets className="w-10 h-10 text-emerald-700 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  Liquid & Immersion Cooling
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Beralih dari pendinginan evaporatif ke direct-to-chip cooling dan immersion cooling untuk mengurangi konsumsi air secara drastis, terutama untuk rak AI berdensitas tinggi.
                </p>
                <div className="mt-auto font-mono text-xs text-emerald-700 bg-emerald-100 p-3 shrink-0 leading-relaxed">
                  Hemat air hingga 90% dibanding evaporatif.
                </div>
              </div>

              <div className="flex-1 border border-emerald-700 p-6 flex flex-col bg-emerald-700 text-stone-100">
                <div className="text-emerald-200 font-mono text-xl mb-6 border-b border-emerald-500 pb-3 shrink-0">03.</div>
                <Server className="w-10 h-10 text-emerald-200 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  Regulasi & Transparansi
                </h4>
                <p className="text-emerald-100 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Pemerintah perlu mewajibkan pelaporan konsumsi energi dan air, menetapkan standar efisiensi, serta melibatkan komunitas lokal dalam proses perizinan pembangunan data center.
                </p>
                <div className="mt-auto font-mono text-xs text-emerald-800 bg-emerald-100 p-3 shrink-0 leading-relaxed">
                  Waste heat recovery untuk pemanasan komunitas sekitar.
                </div>
              </div>
            </div>
          </div>
        );

      case 'sources':
        return (
          <div className="h-full flex flex-col p-12 bg-white">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
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

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="grid grid-cols-2 gap-4 flex-1">
                {[
                  { num: "1", title: "Pew Research Center (2025)", desc: "Data centers now consume more than 4% of U.S. electricity.", url: "pewresearch.org" },
                  { num: "2", title: "U.S. Dept. of Energy (2024)", desc: "Report on data center onsite water use projections 2023–2028.", url: "energy.gov" },
                  { num: "3", title: "World Resources Institute (2024)", desc: "AI-related data centers could require 32B gallons of water annually by 2028.", url: "wri.org" },
                  { num: "4", title: "Harvard Belfer Center (2025)", desc: "U.S. electricity consumption hit record high in 2024 driven by data centers.", url: "belfercenter.org" },
                  { num: "5", title: "CBS News (2025)", desc: "Community opposition to data center expansion in Virginia.", url: "cbsnews.com" },
                  { num: "6", title: "Deloitte (2025)", desc: "Nuclear energy as strategic solution for 24/7 carbon-free data center power.", url: "deloitte.com" },
                  { num: "7", title: "EESI — Environmental & Energy Study Institute", desc: "Environmental impact assessment of data center water and energy usage.", url: "eesi.org" },
                  { num: "8", title: "Lincoln Institute of Land Policy", desc: "Resource competition between data centers and local communities.", url: "lincolninst.edu" },
                ].map((src) => (
                  <div key={src.num} className="bg-stone-50 border border-stone-200 p-4 flex gap-4">
                    <div className="text-[#dc2626] font-mono text-lg font-black shrink-0 w-8 text-right">{src.num}.</div>
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
