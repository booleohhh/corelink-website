import { useState, useEffect, useRef } from 'react';

// Explicitly import the vector branding layout so Vite hooks it safely during cloud builds
import navbarLogo from './assets/White_logo_-_no_background.svg';

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

const STEPS = [
  {
    n: '01',
    tag: 'Read',
    title: 'Pulls the data out of your shipping documents',
    body: 'Commercial invoices, bills of lading and packing lists are read straight from PDFs and scans, so nobody has to retype them.',
  },
  {
    n: '02',
    tag: 'Cross-check',
    title: 'Compares the documents against each other',
    body: "The same shipment should say the same thing on every document. CoreLink lines the three up and flags anything that doesn't match, before it becomes a hold at the border.",
  },
  {
    n: '03',
    tag: 'Report',
    title: 'Hands back a clear report and the data',
    body: 'You get a one-page mismatch report for each batch, along with the extracted data, ready to use.',
  },
];

const CHECK_STEPS = [
  { title: 'Send about 10 past shipments', body: 'The commercial invoice, bill of lading and packing list for each. Anonymised is fine.' },
  { title: 'We run them through CoreLink', body: 'Read and cross-checked on our own hardware. Nothing goes to a cloud service.' },
  { title: 'You get the results', body: 'A one-page mismatch report and the extracted data. Free, and nothing is kept.' },
];

const EMAIL = 'contact@corelinkautomation.co.nz';
const PHONE_DISPLAY = '022 387 9945';
const PHONE_HREF = 'tel:0223879945';

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
  const chkR = useReveal(0.08);
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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "8c33c634-d1ea-4445-9e6d-967b7c1376d2",
          name: form.name,
          email: form.email,
          company: form.company,
          title: form.role,
          message: form.message,
          subject: `New CoreLink Lead Sub: ${form.company}`
        })
      });
      
      const resData = await response.json();
      if (resData.success) {
        setStatus('done');
        setForm({ name: '', email: '', company: '', role: '', message: '' });
      } else {
        throw new Error("Relay rejected packet submission transfer.");
      }
    } catch (err) {
      console.error(err);
      setStatus('fail');
    }
  };

  const navLinks: [string, string][] = [['what-it-does', 'What it does'], ['free-check', 'Free check'], ['security', 'Security'], ['contact', 'Contact']];

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
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center group">
            <img 
              src={navbarLogo} 
              alt="CoreLink Automation" 
              className="h-9 opacity-85 group-hover:opacity-100 transition-opacity duration-200" 
            />
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-10 whitespace-nowrap">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">← CoreLink AI</a>
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                {label}
              </button>
            ))}
            <button onClick={() => go('free-check')} className="btn-metallic text-sm font-medium px-5 py-2 rounded-lg backdrop-blur-sm whitespace-nowrap">
              Free check
            </button>
          </nav>

          <button className="md:hidden text-slate-400 hover:text-white text-lg" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden bg-[#0C0C0E]/95 border-b border-white/5 px-7 pb-5 flex flex-col gap-4 backdrop-blur-md">
            <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors text-left py-1">← CoreLink AI</a>
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-400 hover:text-white transition-colors text-left py-1">{label}</button>
            ))}
            <button onClick={() => go('free-check')} className="btn-metallic text-sm font-medium px-6 py-3 rounded-lg w-full text-center">Free check</button>
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
            Catch document mismatches
            <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">before they hold your cargo.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-lg mx-auto leading-[1.8] mb-12">
            CoreLink Automation reads your commercial invoices, bills of lading and packing lists, cross-checks them and flags anything that doesn't match. It runs on your own computers, so nothing leaves your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => go('contact')} className="btn-metallic group inline-flex items-center gap-2.5 font-medium px-8 py-4 rounded-lg text-[15px]">
              Get my free 10-shipment check →
            </button>
            <button onClick={() => go('what-it-does')} className="inline-flex items-center gap-2 text-slate-400 hover:text-white px-6 py-4 rounded-lg transition-colors duration-200 text-[15px] frame-silver frame-silver-hover bg-white/[0.01]">
              See what it does
            </button>
          </div>
        </div>
      </section>

      {/* What it does */}
      <section id="what-it-does" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div className="absolute inset-x-0 top-0 h-full ambience-blend-secondary" />
        <div ref={solR.ref} className="relative max-w-4xl mx-auto z-10" style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: solR.shown ? 1 : 0, transform: solR.shown ? 'translateY(0)' : 'translateY(28px)' }}>
          <div className="text-center mb-20">
            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase">What it does</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">Three documents in, one mismatch report out</h2>
            <p className="mt-5 text-slate-500 max-w-md mx-auto text-base leading-[1.8]">Built for freight forwarders and customs brokers. Everything runs on hardware you already own.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ n, tag, title, body }) => (
              <div key={n} className="bg-[#111115] border border-white/5 rounded-2xl p-8 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-orange-400 tabular-nums">{n}</span>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-white leading-snug">{title}</h3>
                <p className="text-sm text-slate-400 leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free check */}
      <section id="free-check" className="relative py-32 px-7 overflow-hidden border-t border-white/5 bg-[#0C0C0E]">
        <div ref={chkR.ref} className="relative max-w-4xl mx-auto z-10" style={{ transition: 'opacity .75s ease, transform .75s ease', opacity: chkR.shown ? 1 : 0, transform: chkR.shown ? 'translateY(0)' : 'translateY(28px)' }}>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">Free, no obligation</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">Try it on 10 of your past shipments</h2>
            <p className="mt-5 text-slate-500 max-w-md mx-auto text-base leading-[1.8]">See what it finds in documents you already know, before you decide anything.</p>
          </div>

          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {CHECK_STEPS.map(({ title, body }, i) => (
              <li key={title} className="text-center space-y-2">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full border border-white/10 text-sm text-slate-300 tabular-nums">{i + 1}</span>
                <h3 className="pt-2 text-base font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400 leading-[1.75] max-w-xs mx-auto">{body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => go('contact')} className="btn-metallic font-medium px-8 py-4 rounded-lg text-[15px] w-full sm:w-auto">
              Get my free check →
            </button>
            <a href={PHONE_HREF} className="inline-flex items-center justify-center text-slate-300 hover:text-white px-8 py-4 rounded-lg transition-colors duration-200 text-[15px] frame-silver frame-silver-hover bg-white/[0.01] w-full sm:w-auto">
              Call {PHONE_DISPLAY}
            </a>
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
            <h2 className="text-3xl font-bold text-white tracking-tight">Get your free check</h2>
            <p className="mt-5 text-slate-400 max-w-md mx-auto text-base leading-[1.8]">Tell us a little about your shipments, or ask for a walkthrough first. You'll hear back from Joshua Irwin, CoreLink's founder.</p>
          </div>

          {status === 'done' ? (
            <div className="bg-[#111115] border border-white/5 rounded-2xl p-12 text-center backdrop-blur-md">
              <h3 className="text-white font-semibold text-lg mb-2">Request received</h3>
              <p className="text-slate-400 text-sm">We'll be in touch within one business day.</p>
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
              
              {status === 'fail' && (
                <p className="text-xs text-red-400">That didn't send. Please try again, or email us directly at {EMAIL}.</p>
              )}

              <button type="submit" disabled={status === 'sending'} className="btn-metallic w-full font-medium py-4 rounded-lg text-[15px]">
                {status === 'sending' ? 'Sending...' : 'Send my request'}
              </button>
            </form>
          )}

          <dl className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Email</dt>
              <dd><a href={`mailto:${EMAIL}`} className="text-[15px] text-white hover:text-orange-400 transition-colors whitespace-nowrap">{EMAIL}</a></dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Phone</dt>
              <dd><a href={PHONE_HREF} className="text-[15px] text-white hover:text-orange-400 transition-colors whitespace-nowrap">{PHONE_DISPLAY}</a></dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">Your contact</dt>
              <dd className="text-[15px] text-white">Joshua Irwin, Founder</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-10 px-7 bg-[#0C0C0E] text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
        <img 
          src={navbarLogo} 
          alt="CoreLink Automation" 
          className="h-7 opacity-50" 
        />
        <p>© 2026 CoreLink Automation. All rights reserved. On-premise. Zero cloud exposure. · <a href="/" className="hover:text-slate-300 transition-colors">Part of CoreLink AI</a></p>
      </footer>
    </div>
  );
}