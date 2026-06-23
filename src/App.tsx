import { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import {
  Shield,
  Zap,
  FileText,
  Package,
  BookOpen,
  Lock,
  WifiOff,
  Container,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Server,
  Eye,
  Database,
  ArrowDown,
} from 'lucide-react';

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
    icon: Package,
    tag: 'B2B Logistics & Customs Brokerage',
    title: 'Automating complex document extraction',
    body: 'Commercial invoices, bills of lading, packing lists, and HS code classifications — all parsed on-premise from PDF and scanned documents. Zero third-party exposure, zero cloud dependency.',
    details: ['BOL & AWB auto-parsing', 'HS code classification', 'Customs declaration prefill', 'Multi-format ingestion pipeline'],
  },
  {
    icon: FileText,
    tag: 'Local Trades & Subcontractors',
    title: 'Streamlining supplier invoice mapping',
    body: 'Map supplier invoices and purchase orders straight into your accounting system. Extract line items, quantities, and vendor details from unstructured documents across any trade vertical.',
    details: ['Line-item extraction', 'Vendor deduplication', 'PO matching engine', 'Tolerance & variance flagging'],
  },
  {
    icon: BookOpen,
    tag: 'Bookkeeping & Finance',
    title: 'Sorting unstructured paperwork into clean ledgers',
    body: 'Classify financial documents into structured ledger entries. Eliminate manual categorisation of bank statements, receipts, and expense reports with configurable chart-of-accounts mapping.',
    details: ['Transaction categorisation', 'Chart-of-accounts mapping', 'Receipt OCR & filing', 'Reconciliation-ready export'],
  },
];

const PILLARS = [
  { icon: Container, title: 'Docker-packaged deployment', body: 'The entire inference stack ships as a self-contained Docker image. No external registries pulled at runtime. Install once, run indefinitely.' },
  { icon: WifiOff, title: '100% offline operation', body: 'Once deployed, the engine requires absolutely no outbound or inbound network access. Operate in fully air-gapped environments with confidence.' },
  { icon: Database, title: 'On-premise data residency', body: 'All documents, extracted data, and model weights remain on your hardware. Nothing leaves your network boundary — ever.' },
  { icon: Lock, title: 'Zero cloud data liability', body: 'No third-party API keys, no SaaS subscriptions, no vendor data retention. Your documents are never used to train external models.' },
  { icon: Eye, title: 'Full audit transparency', body: 'Every extraction event is logged locally with full provenance. Compliance teams have complete visibility into what was processed and when.' },
  { icon: Server, title: 'Runs on existing hardware', body: 'Optimised for standard office servers and workstations. No GPU clusters required. Deploy on hardware you already own.' },
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
    const { error } = await supabase.from('contact_submissions').insert([form]);
    if (error) { setStatus('fail'); } else { setStatus('done'); setForm({ name: '', email: '', company: '', role: '', message: '' }); }
  };

  const navLinks: [string, string][] = [['solutions', 'Solutions'], ['security', 'Security'], ['contact', 'Contact']];

  return (
    <div className="relative min-h-screen text-metal-300 antialiased bg-[#0C0C0E]">

      {/* ═══════════════ NAV (unAbyss Transparency Layout) ═══════════════ */}
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
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center group">
            <img src="/src/assets/White_logo_-_no_background.svg" alt="CoreLink Automation" className="h-10 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-metal-400 hover:text-silver-bright transition-colors duration-200">
                {label}
              </button>
            ))}
            <button onClick={() => go('contact')} className="btn-metallic text-sm font-medium px-6 py-2 rounded-lg backdrop-blur-sm">
              Book Walkthrough
            </button>
          </nav>

          <button className="md:hidden text-silver-muted hover:text-silver-bright transition-colors" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden bg-[#0C0C0E]/95 border-b border-white/5 px-7 pb-5 flex flex-col gap-4 backdrop-blur-md">
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-metal-400 hover:text-silver-bright transition-colors text-left py-1">{label}</button>
            ))}
            <button onClick={() => go('contact')} className="btn-metallic text-sm font-medium px-6 py-3 rounded-lg w-full text-center">Book Walkthrough</button>
          </div>
        )}
      </header>

      {/* ═══════════════ HERO (Clean Typographic Canvas + Wavy Topology Mesh) ═══════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-7 overflow-hidden bg-[#0C0C0E]">
        {/* Top unbanded laser horizon track line */}
        <div className="absolute top-0 inset-x-0 h-[1px] horizon-line opacity-60" />

        {/* Seamless Soft Muted Ambient Glow Layout */}
        <div className="absolute inset-0 ambience-lens-flare" />
        
        {/* ── High-Definition Dynamic Wavy Grid Terrain (Peaks and Valleys) ── */}
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
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-silver-bright leading-[1.12] tracking-tightest mb-7">
            Secure, Air-Gapped AI Automation
            <br />
            <span className="bg-gradient-to-r from-white via-silver-bright to-metal-400 bg-clip-text text-transparent">For Enterprise Operations.</span>
          </h1>

          <p className="text-lg text-metal-400 max-w-lg mx-auto leading-[1.8] mb-12">
            Deploy completely offline data-extraction engines directly onto your local hardware. Eliminate manual data entry with zero cloud data liability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => go('contact')}
              className="btn-metallic group inline-flex items-center gap-2.5 font-medium px-8 py-4 rounded-lg text-[15px]"
            >
              Book My Walkthrough
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => go('solutions')}
              className="inline-flex items-center gap-2 text-metal-400 hover:text-silver-light px-6 py-4 rounded-lg transition-colors duration-200 text-[15px] frame-silver frame-silver-hover bg-white/[0.01]"
            >
              Explore Solutions <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20 z-10">
          <ArrowDown size={16} className="text-metal-300 animate-bounce" />
        </div>
      </section>

      {/* ═══════════════ SOLUTIONS ═══════════════ */}
      <section id="solutions" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        {/* Ambient Blend Transition Area - Seamless to Deep space */}
        <div className="absolute inset-x-0 top-0 h-full ambience-blend-secondary" />

        {/* Dynamic unAbyss style terrain lines continue underneath text modules */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-screen" style={{ perspective: '1200px', perspectiveOrigin: '50% 10%' }}>
          <div 
            className="absolute inset-0 animate-terrain-stream" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(160,165,176,0.5)' stroke-width='0.6'%3E%3Cpath d='M0,35Q150,65,300,35T600,5T900,70T1200,35'/%3E%3Cpath d='M0,115Q150,145,300,115T600,85T900,150T1200,115'/%3E%3Cpath d='M0,195Q150,225,300,195T600,165T900,230T1200,195'/%3E%3Cpath d='M0,275Q150,305,300,275T600,245T900,310T1200,275'/%3E%3C/g%3E%3C/svg%3E")`
            }} 
          />
        </div>

        <div
          ref={solR.ref}
          className="relative max-w-4xl mx-auto z-10"
          style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: solR.shown ? 1 : 0, transform: solR.shown ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <div className="text-center mb-24">
            <span className="text-xs font-semibold tracking-widest text-metal-400 uppercase">Solutions</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-silver-bright tracking-tight">
              Purpose-built for high-friction workflows
            </h2>
            <p className="mt-5 text-metal-500 max-w-md mx-auto text-base leading-[1.8]">
              CoreLink Automation ships extraction pipelines tailored to three enterprise verticals. Every engine runs entirely on your hardware.
            </p>
          </div>

          <div className="space-y-20">
            {SOLUTIONS.map(({ icon: Icon, tag, title, body, details }, idx) => (
              <div
                key={tag}
                className={`flex flex-col md:flex-row gap-8 md:gap-14 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex flex-col items-center md:items-start gap-3 pt-1 shrink-0 ${idx % 2 === 1 ? 'md:items-end md:text-right' : ''}`}>
                  <div className="w-12 h-12 bg-[#0C0C0E] frame-silver rounded-xl flex items-center justify-center">
                    <Icon size={22} className="text-metal-200" />
                  </div>
                  <span className="text-[11px] font-semibold text-metal-400 tracking-wider uppercase">{tag}</span>
                </div>

                <div className={`flex-1 space-y-5 ${idx % 2 === 1 ? 'md:text-right' : ''}`}>
                  <h3 className="text-xl font-semibold text-silver-bright leading-snug">{title}</h3>
                  <p className="text-metal-500 leading-[1.8] max-w-xl">{body}</p>
                  <div className={`flex flex-wrap gap-x-6 gap-y-3 pt-2 ${idx % 2 === 1 ? 'md:justify-end' : ''}`}>
                    {details.map((d) => (
                      <span key={d} className="inline-flex items-center gap-2 text-sm text-metal-500">
                        <Check size={13} className="text-metal-300 shrink-0" strokeWidth={2.5} />
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECURITY ═══════════════ */}
      <section id="security" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div className="absolute inset-0 ambience-blend opacity-60" />

        <div
          ref={secR.ref}
          className="relative max-w-5xl mx-auto z-10"
          style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: secR.shown ? 1 : 0, transform: secR.shown ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <div className="text-center mb-20">
            <span className="text-xs font-semibold tracking-widest text-metal-400 uppercase">Security Architecture</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-silver-bright tracking-tight">
              Your data never leaves the building
            </h2>
            <p className="mt-5 text-metal-500 max-w-md mx-auto text-base leading-[1.8]">
              Every component of CoreLink Automation is engineered around a single constraint: your documents remain exclusively on hardware you control.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-20">
            {[
              { l: 'Your Hardware', s: 'Office server' },
              null,
              { l: 'Docker Container', s: 'Self-contained' },
              null,
              { l: 'CoreLink Engine', s: 'On-premise AI' },
              null,
              { l: 'Structured Output', s: 'Local storage' },
            ].map((item, i) =>
              item === null ? (
                <ChevronRight key={i} size={16} className="text-metal-500 mx-1" />
              ) : (
                <div key={i} className="bg-[#111115] frame-silver rounded-lg px-5 py-3 text-center min-w-[120px] backdrop-blur-md">
                  <div className="text-sm font-semibold text-silver-bright">{item.l}</div>
                  <div className="text-[11px] text-metal-500 mt-0.5">{item.s}</div>
                </div>
              ),
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-16 gap-y-14 max-w-3xl mx-auto">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#111115] frame-silver rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:border-metal-400/30 transition-colors duration-200">
                    <Icon size={18} className="text-metal-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-silver-bright mb-2">{title}</h3>
                    <p className="text-sm text-metal-500 leading-[1.75]">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 bg-[#111115]/80 frame-silver rounded-2xl p-10 flex flex-col sm:flex-row items-start sm:items-center gap-7 max-w-3xl mx-auto backdrop-blur-md">
            <div className="w-12 h-12 bg-[#0C0C0E] frame-silver rounded-xl flex items-center justify-center shrink-0">
              <Shield size={22} className="text-metal-200" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-sm font-semibold text-silver-bright">Compliance-ready from day one</div>
              <div className="text-sm text-metal-500 leading-[1.75]">
                CoreLink Automation' architecture is compatible with GDPR, HIPAA, and ISO 27001 data residency requirements. All processing occurs within your defined network boundary.
              </div>
            </div>
            <button onClick={() => go('contact')} className="btn-metallic text-sm font-medium px-6 py-3 rounded-lg shrink-0 w-full sm:w-auto">
              Request Security Brief
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        {/* Seamless Blend - desaturated Atmosphere continue and blend infinite */}
        <div className="absolute inset-x-0 bottom-0 h-full ambience-blend-secondary opacity-60" />
        {/* Soft center form backlight */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle 500px at 50% 60%, rgba(160, 165, 176, 0.02) 0%, transparent 75%)' }} />

        <div
          ref={ctaR.ref}
          className="relative max-w-xl mx-auto z-10"
          style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: ctaR.shown ? 1 : 0, transform: ctaR.shown ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-metal-400 uppercase">Get in Touch</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-silver-bright tracking-tight">Book a Walkthrough</h2>
            <p className="mt-5 text-metal-500 text-base leading-[1.8] max-w-sm mx-auto">
              See the engine running live on a document set from your industry. No slides, no sales pitch — just the product working.
            </p>
          </div>

          {status === 'done' ? (
            <div className="bg-[#111115] frame-silver rounded-2xl p-12 text-center backdrop-blur-md">
              <div className="w-12 h-12 bg-[#0C0C0E] frame-silver rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={22} className="text-metal-200" strokeWidth={2.5} />
              </div>
              <h3 className="text-silver-bright font-semibold text-lg mb-2">Request received</h3>
              <p className="text-metal-500 text-sm">We will reach out within one business day to schedule your walkthrough.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-[#111115]/90 frame-silver rounded-2xl p-9 space-y-6 backdrop-blur-sm">
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { key: 'name', label: 'Full Name', type: 'text', ph: 'Jane Smith', req: true },
                  { key: 'email', label: 'Work Email', type: 'email', ph: 'jane@company.com', req: true },
                ].map(({ key, label, type, ph, req }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-metal-400 mb-2">{label} {req && '*'}</label>
                    <input
                      required={req}
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={ph}
                      className="w-full bg-[#0A0A0C] frame-silver rounded-lg px-4 py-3 text-sm text-silver-bright placeholder-metal-500 outline-none focus:border-white/5 focus:ring-1 focus:ring-white/5 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { key: 'company', label: 'Company', type: 'text', ph: 'Acme Logistics Ltd.', req: true },
                  { key: 'role', label: 'Job Title', type: 'text', ph: 'Head of Operations', req: false },
                ].map(({ key, label, type, ph, req }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-metal-400 mb-2">{label} {req && '*'}</label>
                    <input
                      required={req}
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={ph}
                      className="w-full bg-[#0A0A0C] frame-silver rounded-lg px-4 py-3 text-sm text-silver-bright placeholder-metal-500 outline-none focus:border-white/5 focus:ring-1 focus:ring-white/5 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-metal-400 mb-2">Tell us about your use case</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Briefly describe your current document workflows or the problem you are trying to solve..."
                  className="w-full bg-[#0A0A0C] frame-silver rounded-lg px-4 py-3 text-sm text-silver-bright placeholder-metal-500 outline-none focus:border-white/5 focus:ring-1 focus:ring-white/5 transition-all duration-200 resize-none"
                />
              </div>

              {status === 'fail' && (
                <p className="text-xs text-red-400">Something went wrong. Please try again or email us directly.</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-metallic w-full disabled:opacity-50 font-medium py-4 rounded-lg text-[15px] flex items-center justify-center gap-2.5 backdrop-blur-sm"
              >
                {status === 'sending' ? (
                  <span className="w-4 h-4 border-2 rounded-full animate-spin border-obsidian-950/30 border-t-obsidian-950" />
                ) : (
                  <>Book My Walkthrough <ArrowRight size={16} /></>
                )}
              </button>

              <p className="text-xs text-metal-500 text-center">No commitment required. Response within one business day.</p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative border-t border-white/5 py-10 px-7 overflow-hidden bg-[#0C0C0E]">
        <div className="absolute inset-0 ambience-blend opacity-30" />
        <div className="relative max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 z-10">
          <img src="/src/assets/White_logo_-_no_background.svg" alt="CoreLink Automation" className="h-8 opacity-60" />
          <p className="text-xs text-metal-500">&copy; 2026 CoreLink Automation. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-metal-500">
            <Lock size={11} className="text-metal-400/60" /> On-premise. Zero cloud exposure.
          </div>
        </div>
      </footer>
    </div>
  );
}