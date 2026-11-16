import { useState, useEffect, useRef } from 'react';

import logo from './assets/White_logo_-_no_background.svg';

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

const reveal = (shown: boolean) => ({
  transition: 'opacity .8s ease, transform .8s ease',
  opacity: shown ? 1 : 0,
  transform: shown ? 'translateY(0)' : 'translateY(26px)',
});

const PAIN_AREAS = [
  'Customer enquiries & admin',
  'Document processing & paperwork',
  'Scheduling & logistics',
  'Reporting & data entry',
  'Quoting & invoicing',
  'Inventory & stock tracking',
  'Marketing & content',
  'Compliance & record-keeping',
];

const BUILDS = [
  {
    title: 'AI assistants',
    body: 'Assistants trained on your own business that answer enquiries, draft replies and quotes, and hand over to a person when it matters.',
  },
  {
    title: 'Workflow automation',
    body: 'The repetitive steps between your inbox, spreadsheets and accounting system, done automatically instead of by hand.',
  },
  {
    title: 'Document processing',
    body: 'Invoices, forms and paperwork read, checked and entered for you, with anything unusual flagged for a person to review.',
  },
  {
    title: 'Custom software',
    body: 'Small tools, dashboards and apps built around how your business actually runs, when nothing off the shelf fits.',
  },
];

const STAGES = [
  {
    num: '01',
    name: 'Scan',
    title: 'Opportunity scan',
    terms: 'Free · about 30 minutes',
    body: "A live, honest look at your workflows. You walk away with a short, tailored list of what's actually worth automating, ranked by impact and effort.",
  },
  {
    num: '02',
    name: 'Build',
    title: 'Scoped build',
    terms: 'Fixed fee · agreed upfront',
    body: "One workflow, automated and handed over working. Priced upfront and scoped tightly, so you know exactly what you're getting and when.",
  },
  {
    num: '03',
    name: 'Maintain',
    title: 'Ongoing support',
    terms: 'Small monthly retainer',
    body: "Once something's live, things change. A light retainer keeps it working and growing instead of quietly breaking.",
  },
];

const CREDENTIALS = [
  "Registered NZ company, GST-registered. CoreLink Automation, our AI document-extraction product, already serves freight forwarders and customs brokers — this isn't theoretical.",
  'Hands-on manufacturing and logistics background, not just software — we understand the floor as well as the code.',
  "Auckland based. We'd rather tell you something isn't worth automating than sell you a project that doesn't pay for itself.",
];

const EMAIL = 'contact@corelink.co.nz';
const PHONE_DISPLAY = '022 387 9945';
const PHONE_HREF = 'tel:0223879945';

// The two interlocking shapes of the CoreLink mark, taken from the logo file
const MARK_A = '2.179,1.009 0.989,2.171 1.872,3.302 2.465,3.292 3.062,2.759 2.767,2.428 2.292,2.852 2.085,2.856 1.583,2.211 2.358,1.453 3.225,1.453 4.014,2.49 4.014,1.759 3.443,1.009';
const MARK_B = '2.544,1.708 1.947,2.242 2.242,2.571 2.717,2.148 2.923,2.145 3.426,2.79 2.649,3.547 1.784,3.547 0.985,2.499 0.985,3.23 1.565,3.991 2.83,3.991 4.014,2.833 4.014,2.824 3.137,1.697';
const MARK_LAYERS = 18;

/** The logo mark built from stacked layers so it reads as a solid, extruded object. */
function Mark3D() {
  return (
    <div className="mark-scene" aria-hidden="true">
      <div className="mark-scroll">
        <div className="mark-spin">
          {/* Wireframe echo sitting behind the solid mark */}
          <svg viewBox="0.5 0.5 4 4" className="mark-layer" style={{ transform: 'translateZ(-120px) scale(1.22)' }}>
            <g fill="none" stroke="rgba(237,237,240,0.32)" strokeWidth="0.012">
              <polygon points={MARK_A} />
              <polygon points={MARK_B} />
            </g>
          </svg>
          {Array.from({ length: MARK_LAYERS }).map((_, i) => {
            const face = i === 0 || i === MARK_LAYERS - 1;
            const shade = 105 + Math.round((i / MARK_LAYERS) * 60);
            return (
              <svg key={i} viewBox="0.5 0.5 4 4" className="mark-layer" style={{ transform: `translateZ(${(i - MARK_LAYERS / 2) * 4}px)` }}>
                <g fill={face ? '#ECECEA' : `rgb(${shade},${shade},${shade + 6})`}>
                  <polygon points={MARK_A} />
                  <polygon points={MARK_B} />
                </g>
              </svg>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useAucklandTime() {
  const fmt = () => new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 20000);
    return () => clearInterval(id);
  }, []);
  return time;
}

type FormStatus = 'idle' | 'sending' | 'done' | 'fail';

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const rootRef = useRef<HTMLDivElement>(null);
  const time = useAucklandTime();

  const heroR = useReveal(0.05);
  const painR = useReveal(0.08);
  const buildR = useReveal(0.08);
  const stageR = useReveal(0.08);
  const indR = useReveal(0.08);
  const whyR = useReveal(0.08);
  const ctaR = useReveal(0.1);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 12);
      // Turn the hero mark as the page scrolls
      rootRef.current?.style.setProperty('--turn', String(Math.min(window.scrollY, 1200) * 0.12));
    };
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
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '8c33c634-d1ea-4445-9e6d-967b7c1376d2',
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          subject: `New CoreLink AI scan request: ${form.company}`,
        }),
      });
      const resData = await response.json();
      if (resData.success) {
        setStatus('done');
        setForm({ name: '', email: '', company: '', message: '' });
      } else {
        throw new Error('Form relay rejected the submission.');
      }
    } catch (err) {
      console.error(err);
      setStatus('fail');
    }
  };

  const navLinks: [string, string][] = [['services', 'What we build'], ['how', 'How it works'], ['industries', 'Logistics'], ['contact', 'Contact']];

  const meta = 'text-xs text-slate-400';
  const label = 'text-xs text-slate-500';
  const heading = 'text-[2rem] sm:text-5xl font-normal text-white leading-[1.08] tracking-tight';
  const head = 'text-center max-w-2xl mx-auto';
  const sub = 'mt-6 max-w-lg mx-auto leading-[1.7]';
  const section = 'relative py-24 sm:py-32 px-5 sm:px-8 border-t border-white/[0.07]';
  const input = 'w-full bg-transparent border-b border-white/15 px-0 py-3 text-[15px] text-white placeholder-slate-600 outline-none focus:border-white/60 transition-colors';

  return (
    <div ref={rootRef} className="relative min-h-screen text-slate-400 antialiased bg-[#0C0C0E]">

      {/* Header */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(12,12,14,.7)' : 'rgba(12,12,14,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(237,237,240,0.06)' : '1px solid transparent',
        }}
      >
        <div className="px-5 sm:px-8 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center group" aria-label="CoreLink, back to top">
            <img src={logo} alt="CoreLink" className="h-8 opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <nav className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(([id, text]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-300 hover:text-white transition-colors duration-200">
                {text}
              </button>
            ))}
          </nav>

          <button onClick={() => go('contact')} className="hidden md:inline-flex btn-pill btn-pill-line text-sm px-5 py-2">
            Book a scan <span aria-hidden="true">↗</span>
          </button>

          <button className="md:hidden text-slate-300 hover:text-white text-lg" aria-label="Menu" onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>

        {mobileNav && (
          <div className="md:hidden bg-[#0C0C0E]/95 border-b border-white/5 px-5 pb-5 flex flex-col gap-4 backdrop-blur-md">
            {navLinks.map(([id, text]) => (
              <button key={id} onClick={() => go(id)} className="text-sm text-slate-300 hover:text-white transition-colors text-left py-1">{text}</button>
            ))}
            <button onClick={() => go('contact')} className="btn-pill btn-pill-solid text-sm px-6 py-3 w-full">Book a scan</button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-screen px-5 sm:px-8 pt-20 pb-8 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={meta}>Custom AI &amp; software</span>
          <span className={meta}>Auckland, NZ · {time}</span>
        </div>

        <div ref={heroR.ref} style={reveal(heroR.shown)} className="relative flex-1 flex flex-col lg:block mt-10 lg:mt-0">
          <h1 className="contents">
            <span className="block lg:absolute lg:left-0 lg:top-[24%] text-[2.6rem] sm:text-6xl lg:text-[4.2vw] font-normal text-white leading-[1.02] tracking-tight z-10">
              We find where<br />AI saves time.
            </span>
            <span className="block lg:absolute lg:right-0 lg:bottom-[30%] lg:text-right text-[2.6rem] sm:text-6xl lg:text-[4.2vw] font-normal text-slate-500 lg:text-white leading-[1.02] tracking-tight z-10 mt-1 lg:mt-0">
              Then we build it.
            </span>
          </h1>

          <div className="flex-1 flex items-center justify-center py-14 lg:py-0 lg:absolute lg:inset-0">
            <Mark3D />
          </div>

          <div className="mt-8 lg:mt-0 lg:absolute lg:inset-x-0 lg:bottom-0 flex flex-col sm:flex-row justify-center gap-3 z-10">
            <a href={PHONE_HREF} className="btn-pill btn-pill-line text-sm py-3 w-full sm:w-64">Call {PHONE_DISPLAY}</a>
            <button onClick={() => go('contact')} className="btn-pill btn-pill-solid text-sm py-3 w-full sm:w-64">
              Book my opportunity scan <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* Where the time goes */}
      <section className={section}>
        <div ref={painR.ref} style={reveal(painR.shown)} className="max-w-4xl mx-auto">
          <div className={head}>
            <div className={`${label} mb-5`}>01 · Where it shows up</div>
            <h2 className={heading}>Where the time actually goes.</h2>
            <p className={sub}>If any of this sounds familiar, there's a good chance something here can be automated without a big project or a big bill.</p>
          </div>
          <ul className="mt-14 grid sm:grid-cols-2 gap-x-12 border-t border-white/[0.07]">
            {PAIN_AREAS.map((p, i) => (
              <li key={p} className="flex items-baseline gap-4 py-4 border-b border-white/[0.07] text-[15px] text-slate-200">
                <span className="text-xs text-orange-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we build */}
      <section id="services" className={section}>
        <div ref={buildR.ref} style={reveal(buildR.shown)} className="max-w-4xl mx-auto">
          <div className={head}>
            <div className={`${label} mb-5`}>02 · What we build</div>
            <h2 className={heading}>Custom solutions, sized for your business.</h2>
            <p className={sub}>Every business runs differently, so nothing here is a template. We build the piece that removes the most work for you, and make it fit the tools you already use.</p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 gap-px bg-white/[0.07] border border-white/[0.07] rounded-2xl overflow-hidden">
            {BUILDS.map(({ title, body }) => (
              <div key={title} className="bg-[#0C0C0E] p-7 sm:p-9 hover:bg-[#121215] transition-colors duration-300">
                <h3 className="text-xl font-normal text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-sm leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={section}>
        <div ref={stageR.ref} style={reveal(stageR.shown)} className="max-w-4xl mx-auto">
          <div className={head}>
            <div className={`${label} mb-5`}>03 · How it works</div>
            <h2 className={heading}>Three stages, no obligation past the first.</h2>
            <p className={sub}>Each stands on its own — you can stop after a scan with zero commitment.</p>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-x-10 gap-y-12">
            {STAGES.map(({ num, name, title, terms, body }) => (
              <div key={num} className="border-t border-white/15 pt-6">
                <div className="flex items-baseline justify-between mb-8">
                  <span className="text-6xl font-light text-orange-400 tracking-tight leading-none">{num}</span>
                  <span className={label}>{name}</span>
                </div>
                <h3 className="text-xl font-normal text-white tracking-tight">{title}</h3>
                <div className="text-sm text-slate-300 mt-1 mb-4">{terms}</div>
                <p className="text-sm leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry solutions: logistics */}
      <section id="industries" className={section}>
        <div ref={indR.ref} style={reveal(indR.shown)} className="max-w-4xl mx-auto">
          <div className={head}>
            <div className={`${label} mb-5`}>04 · Industry solutions</div>
            <h2 className={heading}>Already built for freight and customs.</h2>
            <p className={sub}>Alongside custom work, we make a ready-built product for one industry we know from the inside.</p>
          </div>
          <a href="/logistics/" className="group mt-14 block rounded-2xl border border-white/10 bg-[#111115] p-8 sm:p-12 text-center transition-colors duration-300 hover:border-white/25">
            <span className="text-[11px] font-semibold text-orange-400 tracking-wider uppercase">B2B Logistics &amp; Customs Brokerage</span>
            <h3 className="mt-4 text-3xl sm:text-4xl font-normal text-white tracking-tight">CoreLink Automation</h3>
            <p className="mt-4 leading-[1.7] max-w-xl mx-auto">
              Secure, air-gapped document extraction for freight forwarders and customs brokers. Commercial invoices, bills of lading and packing lists parsed entirely on your own hardware, with zero cloud exposure.
            </p>
            <span className="mt-8 btn-pill btn-pill-line text-sm px-6 py-3 group-hover:border-white/70">
              Explore the logistics platform <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </span>
          </a>
        </div>
      </section>

      {/* Why CoreLink */}
      <section className={section}>
        <div ref={whyR.ref} style={reveal(whyR.shown)} className="max-w-3xl mx-auto">
          <div className={head}>
            <div className={`${label} mb-5`}>05 · Why CoreLink</div>
            <h2 className={heading}>Built by people who've done the work.</h2>
          </div>
          <ul className="mt-14 border-t border-white/[0.07]">
            {CREDENTIALS.map((c, i) => (
              <li key={c} className="flex items-baseline gap-5 py-6 border-b border-white/[0.07] text-[15px] leading-[1.7] text-slate-300">
                <span className="text-xs text-orange-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <p>{c}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={section}>
        <div ref={ctaR.ref} style={reveal(ctaR.shown)} className="max-w-xl mx-auto">
          <div className="text-center">
            <div className={`${label} mb-5`}>06 · Get in touch</div>
            <h2 className="text-[2.6rem] sm:text-6xl font-normal text-white leading-[1.02] tracking-tight">Let's find your first win.</h2>
            <p className={sub}>Tell us a bit about the business and where the time goes — we'll get back to you to book a scan.</p>
          </div>

          <div className="mt-14">
            {status === 'done' ? (
              <div className="border border-white/10 rounded-2xl p-10 text-center">
                <h3 className="text-white text-xl font-normal mb-2">Request received</h3>
                <p className="text-sm">We will reach out within one business day to book your opportunity scan.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
                  <div>
                    <label htmlFor="h-name" className={label}>Full name *</label>
                    <input id="h-name" required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                  </div>
                  <div>
                    <label htmlFor="h-email" className={label}>Email *</label>
                    <input id="h-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                  </div>
                </div>
                <div>
                  <label htmlFor="h-company" className={label}>Business *</label>
                  <input id="h-company" required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={input} />
                </div>
                <div>
                  <label htmlFor="h-message" className={label}>Where does the time go?</label>
                  <textarea id="h-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} resize-none`} />
                </div>

                {status === 'fail' && (
                  <p className="text-xs text-red-400">That didn't send. Please try again, or email us directly at {EMAIL}.</p>
                )}

                <button type="submit" disabled={status === 'sending'} className="btn-pill btn-pill-solid w-full py-4 text-[15px]">
                  {status === 'sending' ? 'Sending...' : <>Book my opportunity scan <span aria-hidden="true">↗</span></>}
                </button>
              </form>
            )}
          </div>

          <dl className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
            <div>
              <dt className={`${label} mb-1`}>Email</dt>
              <dd><a href={`mailto:${EMAIL}`} className="text-[15px] text-white hover:text-orange-400 transition-colors break-words">{EMAIL}</a></dd>
            </div>
            <div>
              <dt className={`${label} mb-1`}>Phone</dt>
              <dd><a href={PHONE_HREF} className="text-[15px] text-white hover:text-orange-400 transition-colors">{PHONE_DISPLAY}</a></dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className={`${label} mb-1`}>Based in</dt>
              <dd className="text-[15px] text-white">Auckland, NZ</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07] py-8 px-5 sm:px-8 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={logo} alt="CoreLink" className="h-6 opacity-50" />
        <p>© 2026 CoreLink. All rights reserved. · <a href="/logistics/" className="hover:text-slate-300 transition-colors">CoreLink Automation for logistics</a></p>
      </footer>
    </div>
  );
}
