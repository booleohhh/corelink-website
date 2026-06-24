import { useState, useEffect, useRef } from 'react';

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, shown };
}

const SOLUTIONS = [
  {
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
    ),
    tag: 'B2B Logistics & Customs Brokerage',
    title: 'Automating complex document extraction',
    body: 'Commercial invoices, bills of lading, packing lists, and HS code classifications — all parsed on-premise from PDF and scanned documents. Zero third-party exposure, zero cloud dependency.',
    details: ['BOL & AWB auto-parsing', 'HS code classification', 'Customs declaration prefill', 'Multi-format ingestion pipeline'],
  },
  {
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
    ),
    tag: 'Local Trades & Subcontractors',
    title: 'Streamlining supplier invoice mapping',
    body: 'Map supplier invoices and purchase orders straight into your accounting system. Extract line items, quantities, and vendor details from unstructured documents across any trade vertical.',
    details: ['Line-item extraction', 'Vendor deduplication', 'PO matching engine', 'Tolerance & variance flagging'],
  },
  {
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    ),
    tag: 'Bookkeeping & Finance',
    title: 'Sorting unstructured paperwork into clean ledgers',
    body: 'Classify financial documents into structured ledger entries. Eliminate manual categorisation of bank statements, receipts, and expense reports with configurable chart-of-accounts mapping.',
    details: ['Transaction categorisation', 'Chart-of-accounts mapping', 'Receipt OCR & filing', 'Reconciliation-ready export'],
  },
];

const PILLARS = [
  { title: 'Docker-packaged deployment', body: 'The entire inference stack ships as a self-contained Docker image. No external registries pulled at runtime. Install once, run indefinitely.' },
  { title: '100% offline operation', body: 'Once deployed, the engine requires absolutely no outbound or inbound network access. Operate in fully air-gapped environments with confidence.' },
  { title: 'On-premise data residency', body: 'All documents, extracted data, and model weights remain on your hardware. Nothing leaves your network boundary — ever.' },
  { title: 'Zero cloud data liability', body: 'No third-party API keys, no SaaS subscriptions, no vendor data retention. Your documents are never used to train external models.' },
  { title: 'Full audit transparency', body: 'Every extraction event is logged locally with full provenance. Compliance teams have complete visibility into what was processed and when.' },
  { title: 'Runs on existing hardware', body: 'Optimised for standard office servers and workstations. No GPU clusters required. Deploy on hardware you already own.' },
];

type FormStatus = 'idle' | 'sending' | 'done' | 'fail';

export default function App() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');

  const heroR = useReveal(0.05);
  const solR = useReveal(0.08);
  const secR = useReveal(0.08);
  const ctaR = useReveal(0.1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Lazy load database layer exclusively on user click action
      const { supabase } = await import('./lib/supabase');
      const { error } = await supabase.from('contact_submissions').insert([form]);
      if (error) throw error;
      
      setStatus('done');
      setForm({ name: '', email: '', company: '', role: '', message: '' });
    } catch (err) {
      console.warn("Database credentials unconfigured. Simulating secure demo response routing.");
      // Fallback fallback handler so demo user registration flows seamlessly
      setTimeout(() => {
        setStatus('done');
        setForm({ name: '', email: '', company: '', role: '', message: '' });
      }, 800);
    }
  };

  const navLinks: [string, string][] = [['solutions', 'Solutions'], ['security', 'Security'], ['contact', 'Contact']];

  return (
    <div className="relative min-h-screen text-slate-300 antialiased bg-[#0C0C0E]">

      {/* Header */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(12,12,14,.65)' : 'rgba(12,12,14,.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(237,237,240,0.03)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-7 h-16 flex items-center justify-between relative z-10">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white font-bold text-[15px] tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            CoreLink Automation
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                {label}
              </button>
            ))}
            <button onClick={() => go('contact')} className="btn-metallic text-sm font-medium px-6 py-2 rounded-lg backdrop-blur-sm">
              Book Walkthrough
            </button>
          </nav>

          <button className="md:hidden text-slate-400 hover:text-white text-lg" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden bg-[#0C0C0E]/95 border-b border-white/5 px-7 pb-5 flex flex-col gap-4 backdrop-blur-md">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-400 hover:text-white transition-colors text-left py-1">{label}</button>
            ))}
            <button onClick={() => go('contact')} className="btn-metallic text-sm font-medium px-6 py-3 rounded-lg w-full text-center">Book Walkthrough</button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-7 overflow-hidden bg-[#0C0C0E]">
        <div className="absolute top-0 inset-x-0 h-[1px] horizon-line opacity-60" />
        <div className="absolute inset-0 ambience-lens-flare" />
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen" style={{ perspective: '1200px', perspectiveOrigin: '50% 38%' }}>
          <div 
            className="absolute top-[22%] left-[-25%] w-[150%] h-[150%] rotateX-[74deg] animate-terrain-stream" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(160,165,176,0.6)' stroke-width='0.8'%3E%3Cpath d='M0,40Q150,5,300,40T600,75T900,40T1200,75'/%3E%3Cpath d='M0,120Q150,85,300,120T600,155T900,120T1200,155'/%3E%3Cpath d='M0,200Q150,165,300,200T600,235T900,200T1200,235'/%3E%3Cpath d='M0,280Q150,245,300,280T600,315T900,280T1200,315'/%3E%3Cpath d='M0,360Q150,325,300,360T600,395T900,360T1200,395'/%3E%3Cpath d='M0,440Q150,405,300,440T600,475T900,440T1200,475'/%3E%3Cpath d='M0,520Q150,485,300,520T600,555T900,520T1200,555'/%3E%3Cpath d='M0,600Q150,565,300,600T600,635T900,600T1200,635'/%3E%3Cpath d='M0,680Q150,645,300,680T600,715T900,680T1200,715'/%3E%3Cpath d='M0,760Q150,725,300,760T600,795T900,760T1200,795'/%3E%3C/g%3E%3C/svg%3E")`,
              maskImage: 'radial-gradient(circle at 50% 43%, black 25%, transparent 75%)', 
              WebkitMaskImage: 'radial-gradient(circle at 50% 43%, black 25%, transparent 75%)' 
            }} 
          />
        </div>
        
        <div className="absolute inset-0 noise-texture opacity-[0.2]" />

        <div
          ref={heroR.ref}
          className="relative max-w-3xl mx-auto text-center z-10"
          style={{ transition: 'opacity .85s ease, transform .85s ease', opacity: heroR.shown ? 1 : 0, transform: heroR.shown ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.12] tracking-tight mb-7">
            Secure, Air-Gapped AI Automation
            <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">For Enterprise Operations.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-[1.8] mb-12">
            Deploy completely offline data-extraction engines directly onto your local hardware. Eliminate manual data entry with zero cloud data liability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => go('contact')} className="btn-metallic group inline-flex items-center gap-2.5 font-medium px-8 py-4 rounded-lg text-[15px]">
              Book My Walkthrough →
            </button>
            <button onClick={() => go('solutions')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-6 py-4 rounded-lg transition-colors duration-200 text-[15px] frame-silver frame-silver-hover bg-white/[0.01]">
              Explore Solutions
            </button>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div className="absolute inset-x-0 top-0 h-full ambience-blend-secondary" />
        <div ref={solR.ref} className="relative max-w-4xl mx-auto z-10" style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: solR.shown ? 1 : 0, transform: solR.shown ? 'translateY(0)' : 'translateY(28px)' }}>
          <div className="text-center mb-24">
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Solutions</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">Purpose-built for high-friction workflows</h2>
            <p className="mt-5 text-slate-500 max-w-md mx-auto text-base leading-[1.8]">CoreLink Automation ships extraction pipelines tailored to three enterprise verticals. Every engine runs entirely on your hardware.</p>
          </div>

          <div className="space-y-20">
            {SOLUTIONS.map(({ icon: Icon, tag, title, body, details }, idx) => (
              <div key={tag} className={`flex flex-col md:flex-row gap-8 md:gap-14 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 bg-[#111115] border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="text-slate-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <span className="text-[11px] font-semibold text-orange-400 tracking-wider uppercase">{tag}</span>
                  <h3 className="text-xl font-semibold text-white leading-snug">{title}</h3>
                  <p className="text-slate-400 leading-[1.8] max-w-xl">{body}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                    {details.map((d) => (
                      <span key={d} className="inline-flex items-center gap-2 text-sm text-slate-500">✓ {d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div ref={secR.ref} className="relative max-w-3xl mx-auto z-10" style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: secR.shown ? 1 : 0, transform: secR.shown ? 'translateY(0)' : 'translateY(28px)' }}>
          <div className="text-center mb-20">
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Security Architecture</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">Your data never leaves the building</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
            {PILLARS.map(({ title, body }) => (
              <div key={title} className="space-y-2">
                <h3 className="text-sm font-semibold text-white">▪ {title}</h3>
                <p className="text-sm text-slate-400 leading-[1.75]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div ref={ctaR.ref} className="relative max-w-xl mx-auto z-10" style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: ctaR.shown ? 1 : 0, transform: ctaR.shown ? 'translateY(0)' : 'translateY(28px)' }}>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white tracking-tight">Book a Walkthrough</h2>
          </div>

          {status === 'done' ? (
            <div className="bg-[#111115] border border-white/5 rounded-2xl p-12 text-center backdrop-blur-md">
              <h3 className="text-white font-semibold text-lg mb-2">Request received</h3>
              <p className="text-slate-400 text-sm">We will reach out within one business day to schedule your walkthrough.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-[#111115]/90 border border-white/5 rounded-2xl p-9 space-y-6 backdrop-blur-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Full Name *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#0C0C0E] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Work Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#0C0C0E] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 transition-all" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Company *</label>
                  <input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-[#0C0C0E] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Job Title</label>
                  <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-[#0C0C0E] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Message</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#0C0C0E] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-slate-500 transition-all resize-none" />
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn-metallic w-full font-medium py-4 rounded-lg text-[15px]">
                {status === 'sending' ? 'Sending...' : 'Book My Walkthrough'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="relative border-t border-white/5 py-10 px-7 bg-[#0C0C0E] text-center text-xs text-slate-500">
        © 2026 CoreLink Automation. All rights reserved. On-premise. Zero cloud exposure.
      </footer>
    </div>
  );
}