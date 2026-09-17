import { useState, useEffect, useRef } from "react";
import evolieLogo from "@/imports/ChatGPT_Image_Sep_2__2026__10_41_23_AM.png";
import foxMascot from "@/imports/green_screen_mascot_1.png";
import emailjs from "@/emailjs/browser";

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function EvolieLogo({ size = 40 }: { white?: boolean; size?: number }) {
  return (
    <img
      src={evolieLogo}
      alt="Evolie logo"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", borderRadius: "50%" }}
    />
  );
}

// ─── SVG: Fox Mascot ─────────────────────────────────────────────────────────
function FoxMascot() {
  return (
    <div className="w-full max-w-sm mx-auto relative">
      {/* SVG filter: removes green (high G, low B) → transparent, keeps white/navy/cyan intact */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id="chroma-green" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            {/* Step 1: key out green — pixels where G > B become transparent */}
            <feColorMatrix
              type="matrix"
              values="1  0  0  0  0
                      0  1  0  0  0
                      0  0  1  0  0
                      0 -3  3  0  1"
            />
            {/* Step 2: harden alpha edges — crush semi-transparent fringe to fully transparent */}
            <feComponentTransfer>
              <feFuncA type="linear" slope="8" intercept="-1.5" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <img
        src={foxMascot}
        alt="Evolie fox mascot"
        className="w-full"
        style={{ filter: "url(#chroma-green) drop-shadow(0 24px 48px rgba(18,184,242,0.35))" }}
      />
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    //{ label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Fiverr", href: "#fiverr" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,6,107,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(18,184,242,0.15)" : "none",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.25)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-18">
        <a href="#home" aria-label="Evolie home">
          <EvolieLogo size={40} />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/90 hover:text-white text-sm font-medium tracking-wide"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #2521C7, #12B8F2)" }}
          >
            Start a Project
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-white rounded transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-white rounded transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-white rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: "rgba(8,6,107,0.98)" }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-white text-base font-medium py-1 border-b border-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white text-center"
            style={{ background: "linear-gradient(135deg, #2521C7, #12B8F2)" }}
          >
            Start a Project
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden dot-pattern"
      style={{ background: "linear-gradient(160deg, #08066B 0%, #0e0b8a 50%, #08066B 100%)" }}
    >
      {/* Glow blobs */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(18,184,242,0.12)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgba(37,33,199,0.2)" }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 md:order-1">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(18,184,242,0.12)",
                border: "1px solid rgba(18,184,242,0.3)",
                color: "#12B8F2",
                fontFamily: "Manrope",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Available for new projects
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "Sora, sans-serif", letterSpacing: "-0.02em" }}
            >
              Ideas evolve.{" "}
              <span className="gradient-text-light">Digital experiences</span>{" "}
              begin.
            </h1>

            <p
              className="text-white/85 text-lg leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: "Manrope" }}
            >
              We turn ideas into modern digital experiences — from UI/UX design
              and web development to graphic design and brand identity.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-7 py-3.5 rounded-full font-semibold text-white text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, #2521C7 0%, #12B8F2 100%)" }}
              >
                Start a Project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {/*<a
                href="#work"
                className="px-7 py-3.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 hover:bg-white/15 transition-colors"
                style={{
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "white",
                }}
              >
                View Our Work
              </a>*/}
            </div>

            {/* Stats */}
            {/*<div className="flex gap-8 mt-12">
              {[
                { n: "50+", l: "Projects Delivered" },
                { n: "100%", l: "Client Satisfaction" },
                { n: "6", l: "Services Offered" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "Sora" }}
                  >
                    {s.n}
                  </div>
                  <div className="text-white/75 text-xs mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>*/}
          </div>

          {/* Fox illustration */}
          <div className="order-1 md:order-2 flex items-center justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl blur-2xl"
                style={{ background: "rgba(18,184,242,0.08)" }}
              />
              <FoxMascot />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/70 text-xs" style={{ fontFamily: "Manrope" }}>Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <div
            className="w-1 h-2 rounded-full bg-cyan-400"
            style={{ animation: "bounce 2s infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const imgRef = useReveal() as React.RefObject<HTMLDivElement>;
  const textRef = useReveal() as React.RefObject<HTMLDivElement>;
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div ref={imgRef} className="relative reveal reveal-left">
            <div
              className="rounded-3xl overflow-hidden aspect-square max-w-md"
              style={{ background: "linear-gradient(135deg, #08066B, #2521C7)" }}
            >
              <div className="w-full h-full flex items-center justify-center p-10">
                <div className="text-center">
                  {/* Abstract grid of service icons */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {["✦", "◈", "⬡", "◇", "✧", "⬟"].map((sym, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl"
                        style={{
                          background: i % 2 === 0 ? "rgba(18,184,242,0.2)" : "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: i % 2 === 0 ? "#12B8F2" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {sym}
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-white/60 text-sm"
                    style={{ fontFamily: "Manrope" }}
                  >
                    Crafting digital experiences
                  </p>
                </div>
              </div>
            </div>
            {/* Badge */}
            <div
              className="absolute -bottom-4 -right-4 px-5 py-3 rounded-2xl shadow-xl"
              style={{ background: "#F4F8FF", border: "1.5px solid rgba(37,33,199,0.1)" }}
            >
              <div className="text-2xl font-bold" style={{ fontFamily: "Sora", color: "#2521C7" }}>New agency,</div>
              <div className="text-sm text-gray-500" style={{ fontFamily: "Manrope" }}>big ideas.</div>
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="reveal reveal-right">
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: "#12B8F2", fontFamily: "Manrope" }}
            >
              About Evolie
            </span>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Sora", color: "#08066B", letterSpacing: "-0.02em" }}
            >
              A new creative team, driven by design.
            </h2>
            <p
              className="text-gray-600 text-base leading-relaxed mb-5"
              style={{ fontFamily: "Manrope" }}
            >
              Evolie is a young, passionate creative digital agency built by designers
              and developers who love what they do. We believe great digital products
              start with thoughtful design — and we obsess over every pixel, interaction,
              and line of code to make that happen.
            </p>
            <p
              className="text-gray-600 text-base leading-relaxed mb-8"
              style={{ fontFamily: "Manrope" }}
            >
              From startups to small businesses, we partner closely with our clients
              to transform their vision into polished, high-performing digital experiences
              that leave a lasting impression.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, label: "Design-first approach" },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, label: "Close collaboration" },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, label: "Fast turnaround" },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>, label: "Creative solutions" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "#F4F8FF" }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "Manrope", color: "#08066B" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="2" width="24" height="18" rx="4" stroke="#12B8F2" strokeWidth="1.8" />
        <path d="M8 14l4-4 4 4 4-4" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22h14" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 20v2" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "UI/UX Design",
    desc: "User-centred interfaces and experiences that are beautiful, intuitive, and conversion-focused.",
    color: "rgba(18,184,242,0.1)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="16" rx="3" stroke="#2521C7" strokeWidth="1.8" />
        <path d="M3 9h22" stroke="#2521C7" strokeWidth="1.8" />
        <circle cx="6.5" cy="7" r="1" fill="#12B8F2" />
        <circle cx="10" cy="7" r="1" fill="#12B8F2" />
        <rect x="7" y="13" width="14" height="2" rx="1" fill="#12B8F2" opacity="0.6" />
        <rect x="7" y="17" width="8" height="1.5" rx="0.75" fill="#2521C7" opacity="0.4" />
      </svg>
    ),
    title: "Web Design",
    desc: "Stunning, responsive websites designed to represent your brand and engage your audience.",
    color: "rgba(37,33,199,0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M8 10l-4 4 4 4" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 10l4 4-4 4" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7l-6 14" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Web Development",
    desc: "Clean, performant, scalable code that brings designs to life with precision and care.",
    color: "rgba(18,184,242,0.1)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L14 6l10 14H4z" stroke="#2521C7" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 6v14" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 20h20" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Website Redesign",
    desc: "Transform your outdated website into a modern, high-performing digital experience.",
    color: "rgba(37,33,199,0.08)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#12B8F2" strokeWidth="1.8" />
        <circle cx="14" cy="14" r="5" fill="rgba(37,33,199,0.2)" stroke="#2521C7" strokeWidth="1.5" />
        <line x1="14" y1="3" x2="14" y2="7" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="21" x2="14" y2="25" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="14" x2="7" y2="14" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="21" y1="14" x2="25" y2="14" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Graphic Design",
    desc: "Logos, branding, social media assets and print materials that capture your brand identity.",
    color: "rgba(18,184,242,0.1)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="7" width="22" height="16" rx="3" stroke="#2521C7" strokeWidth="1.8" />
        <path d="M9 7V5a2 2 0 014 0v2M15 7V5a2 2 0 014 0v2" stroke="#12B8F2" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 16h12M8 12h7" stroke="#2521C7" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    title: "Custom Web Solutions",
    desc: "Bespoke web applications, e-commerce stores, and integrations tailored to your exact needs.",
    color: "rgba(37,33,199,0.08)",
  },
];

function Services() {
  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const gridRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;
  return (
    <section id="services" className="py-24" style={{ background: "#F4F8FF" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headRef} className="text-center mb-16 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#12B8F2", fontFamily: "Manrope" }}
          >
            What We Offer
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "Sora", color: "#08066B", letterSpacing: "-0.02em" }}
          >
            Services built for{" "}
            <span className="gradient-text">modern brands</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto" style={{ fontFamily: "Manrope" }}>
            Every service we offer is crafted with care, precision, and a deep
            understanding of what makes digital products succeed.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger reveal">
          {services.map((s) => (
            <div
              key={s.title}
              className="card-hover rounded-3xl p-7 bg-white"
              style={{ border: "1.5px solid rgba(37,33,199,0.08)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: s.color }}
              >
                {s.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "Sora", color: "#08066B" }}
              >
                {s.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: "Manrope" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// WORK / GALLERY ______________________________________________________

const SHOW_WORK = false;

const projects = [
  {
    title: "Lumière Bistro",
    category: "Restaurant Website",
    tags: ["Web Design", "Development"],
    color: "#1a1a2e",
    accent: "#f0c040",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
  },
  {
    title: "Bloom & Co.",
    category: "E-Commerce Store",
    tags: ["Web Design", "Development"],
    color: "#1b4332",
    accent: "#52b788",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    title: "BrewHaven Café",
    category: "Café Website",
    tags: ["UI/UX Design", "Web Design"],
    color: "#3d1a00",
    accent: "#c8956c",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    title: "Marco Rossi",
    category: "Portfolio Site",
    tags: ["Web Design", "Graphic Design"],
    color: "#0a0a1a",
    accent: "#a78bfa",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "Voltex Electronics",
    category: "E-Commerce Store",
    tags: ["Development", "Custom Solutions"],
    color: "#001233",
    accent: "#12B8F2",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Verdana Spa",
    category: "Wellness Website",
    tags: ["UI/UX Design", "Web Design"],
    color: "#1a2e1a",
    accent: "#84cc16",
    icon: (c: string) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22V12" />
        <path d="M5 12c0-4 3-7 7-7s7 3 7 7" />
        <path d="M5 12c2-2 5-3 7-3s5 1 7 3" />
      </svg>
    ),
  },
];

function Work() {
  if (!SHOW_WORK) return null;

  const [active, setActive] = useState<string | null>(null);
  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const gridRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;

  return (
    <section id="work" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div ref={headRef} className="text-center mb-16 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{
              color: "#12B8F2",
              fontFamily: "Manrope",
            }}
          >
            Our Work
          </span>

          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: "Sora",
              color: "#08066B",
              letterSpacing: "-0.02em",
            }}
          >
            Projects we're proud of
          </h2>

          <p
            className="text-gray-500 max-w-lg mx-auto"
            style={{
              fontFamily: "Manrope",
            }}
          >
            A snapshot of our recent work across industries — each project
            built with purpose, detail, and heart.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger reveal"
        >
          {projects.map((p) => (
            <div
              key={p.title}
              className="card-hover rounded-3xl overflow-hidden cursor-pointer"
              style={{
                border: "1.5px solid rgba(37,33,199,0.08)",
              }}
              onMouseEnter={() => setActive(p.title)}
              onMouseLeave={() => setActive(null)}
            >

              {/* Project visual */}
              <div
                className="h-52 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: p.color,
                }}
              >

                {/* Abstract browser chrome */}
                <div
                  className="absolute inset-4 rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div
                    className="h-7 flex items-center gap-1.5 px-3"
                    style={{
                      borderBottom:
                        "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 opacity-70" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70" />
                    <div className="w-2 h-2 rounded-full bg-green-400 opacity-70" />

                    <div
                      className="flex-1 mx-3 h-3.5 rounded-full"
                      style={{
                        background:
                          "rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <div
                      className="h-6 rounded-lg"
                      style={{
                        background: p.accent,
                        opacity: 0.2,
                        width: "60%",
                      }}
                    />

                    <div className="h-2.5 rounded-full bg-white opacity-10 w-full" />
                    <div className="h-2.5 rounded-full bg-white opacity-10 w-4/5" />
                    <div className="h-2.5 rounded-full bg-white opacity-10 w-3/5" />

                    <div
                      className="mt-2 w-24 h-7 rounded-full"
                      style={{
                        background: p.accent,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>

                {/* Category icon */}
                <div
                  className="absolute top-5 right-6 transition-transform duration-300"
                  style={{
                    transform:
                      active === p.title
                        ? "scale(1.2)"
                        : "scale(1)",
                  }}
                >
                  {p.icon(p.accent)}
                </div>
              </div>

              <div className="p-5">

                <div
                  className="text-xs font-semibold mb-1 tracking-wide"
                  style={{
                    fontFamily: "Manrope",
                    color: "#12B8F2",
                  }}
                >
                  {p.category}
                </div>

                <h3
                  className="text-base font-bold mb-3"
                  style={{
                    fontFamily: "Sora",
                    color: "#08066B",
                  }}
                >
                  {p.title}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{
                        background:
                          "rgba(37,33,199,0.06)",
                        color: "#2521C7",
                        fontFamily: "Manrope",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── PROCESS ──────────────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Discover",
    desc: "We listen first. A deep-dive into your goals, audience, and vision sets the foundation for everything.",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
  {
    num: "02",
    title: "Design",
    desc: "Wireframes, moodboards, and high-fidelity mockups crafted to bring your brand story to life.",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
  {
    num: "03",
    title: "Approve",
    desc: "You review and give feedback. We refine until the design is exactly right — no compromises.",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
  {
    num: "04",
    title: "Build",
    desc: "Clean, performant code turns approved designs into pixel-perfect, responsive websites.",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  },
  {
    num: "05",
    title: "Launch",
    desc: "We handle deployment, final checks, and handover — making sure launch day is smooth and exciting.",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B8F2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  },
];

function Process() {
  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const stepsRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;
  return (
    <section
      id="process"
      className="py-24 section-navy dot-pattern relative overflow-hidden"
    >
      <div
        className="absolute right-0 top-0 w-96 h-96 blur-3xl pointer-events-none"
        style={{ background: "rgba(18,184,242,0.08)" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div ref={headRef} className="text-center mb-16 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#12B8F2", fontFamily: "Manrope" }}
          >
            How We Work
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Sora", letterSpacing: "-0.02em" }}
          >
            Our creative process
          </h2>
          <p
            className="text-white/80 max-w-lg mx-auto"
            style={{ fontFamily: "Manrope" }}
          >
            A clear, collaborative process that keeps you informed, in control,
            and confident at every step.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(18,184,242,0.3), rgba(18,184,242,0.3), transparent)" }}
          />

          <div ref={stepsRef} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 stagger reveal">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="text-center group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl relative z-10 transition-transform group-hover:scale-110 duration-300"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1.5px solid rgba(18,184,242,0.25)",
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
                <div
                  className="text-xs font-bold mb-1 tracking-widest"
                  style={{ fontFamily: "Sora", color: "#12B8F2" }}
                >
                  {s.num}
                </div>
                <h3
                  className="text-white font-bold text-base mb-2"
                  style={{ fontFamily: "Sora" }}
                >
                  {s.title}
                </h3>
                <p
                  className="text-white/80 text-xs leading-relaxed"
                  style={{ fontFamily: "Manrope" }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WHY EVOLIE ───────────────────────────────────────────────────────────────
const reasons = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: "Design-First Mindset",
    desc: "Every project starts with design thinking. We craft experiences that look amazing and feel effortless.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    title: "Custom Solutions",
    desc: "No templates, no shortcuts. Every website we build is unique and tailored to your exact needs.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    title: "Fully Responsive",
    desc: "Your site will look and perform perfectly on every device — desktop, tablet, and mobile.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: "True Collaboration",
    desc: "We work with you, not just for you. Open communication and your feedback shape every decision.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: "Client-Focused Service",
    desc: "You're never left in the dark. Fast responses, clear timelines, and a friendly team throughout.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2521C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: "Results-Driven",
    desc: "Beautiful design that converts. We care about your website's performance, not just its appearance.",
  },
];

function WhyEvolie() {
  const textRef = useReveal() as React.RefObject<HTMLDivElement>;
  const gridRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={textRef} className="reveal reveal-left">
            <span
              className="text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ color: "#12B8F2", fontFamily: "Manrope" }}
            >
              Why Choose Us
            </span>
            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Sora", color: "#08066B", letterSpacing: "-0.02em" }}
            >
              We're not just another{" "}
              <span className="gradient-text">design agency.</span>
            </h2>
            <p
              className="text-gray-500 text-base leading-relaxed mb-8"
              style={{ fontFamily: "Manrope" }}
            >
              Evolie is a studio built on genuine passion for design and
              technology. We're small enough to care deeply and skilled enough
              to deliver work that truly stands out.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #2521C7, #12B8F2)" }}
            >
              Let's Work Together
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div ref={gridRef} className="grid sm:grid-cols-2 gap-4 stagger reveal reveal-right">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="card-hover p-5 rounded-2xl"
                style={{
                  background: "#F4F8FF",
                  border: "1.5px solid rgba(37,33,199,0.07)",
                }}
              >
                <div className="text-2xl mb-3">{r.icon}</div>
                <h3
                  className="text-sm font-bold mb-1.5"
                  style={{ fontFamily: "Sora", color: "#08066B" }}
                >
                  {r.title}
                </h3>
                <p
                  className="text-gray-500 text-xs leading-relaxed"
                  style={{ fontFamily: "Manrope" }}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FIVERR ───────────────────────────────────────────────────────────────────
const fiverr = [
  {
    title: "Web Design",
    desc: "A stunning, custom-designed website that captures your brand and converts visitors into customers.",
    tags: ["Figma", "Responsive", "Modern"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    gradient: "linear-gradient(135deg, #08066B, #2521C7)",
    link: "https://www.fiverr.com/s/BbR2wmW",
  },
  {
    title: "Web Development",
    desc: "Clean, fast, and scalable code that turns designs into fully functional websites and web apps.",
    tags: ["React", "Next.js", "Vite"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    gradient: "linear-gradient(135deg, #0d0a8a, #12B8F2)",
    link: "https://www.fiverr.com/s/qbDqjxg",
  },
  {
    title: "Web Design & Development",
    desc: "The full package — design and development together for a seamless, professional result.",
    tags: ["Full Stack", "Custom", "Launch-Ready"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>,
    gradient: "linear-gradient(135deg, #2521C7, #12B8F2)",
    link: "https://www.fiverr.com/s/432Zb7R",
  },
  {
    title: "Graphic Design",
    desc: "Logos, brand identity, social media kits, and print materials crafted with precision.",
    tags: ["Branding", "Logo", "Print"],
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22c4.97 0 9-2.69 9-6s-4.03-6-9-6-9 2.69-9 6 4.03 6 9 6z"/></svg>,
    gradient: "linear-gradient(135deg, #08066B, #2521C7)",
    link: "https://www.fiverr.com/s/kXLb27b",
  },
];

function Fiverr() {
  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const gridRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;
  return (
    <section id="fiverr" className="py-24" style={{ background: "#F4F8FF" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headRef} className="text-center mb-16 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#12B8F2", fontFamily: "Manrope" }}
          >
            Hire Us on Fiverr
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "Sora", color: "#08066B", letterSpacing: "-0.02em" }}
          >
            Find us on{" "}
            <span className="gradient-text">Fiverr</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto" style={{ fontFamily: "Manrope" }}>
            Browse our Fiverr gigs for structured packages with clear deliverables, fast turnaround, and guaranteed quality.
          </p>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger reveal">
          {fiverr.map((g) => (
            <div
              key={g.title}
              className="card-hover rounded-3xl overflow-hidden bg-white"
              style={{ border: "1.5px solid rgba(37,33,199,0.08)" }}
            >
              <div
                className="h-28 flex items-center justify-center"
                style={{ background: g.gradient }}
              >
                {g.icon}
              </div>
              <div className="p-5">
                <h3
                  className="font-bold text-base mb-1.5"
                  style={{ fontFamily: "Sora", color: "#08066B" }}
                >
                  {g.title}
                </h3>
                <p
                  className="text-gray-500 text-xs leading-relaxed mb-3"
                  style={{ fontFamily: "Manrope" }}
                >
                  {g.desc}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {g.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(37,33,199,0.06)",
                        color: "#2521C7",
                        fontFamily: "Manrope",
                        fontWeight: 500,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "Sora", color: "#08066B" }}
                  >
                  </span>
                  <a
                    href={g.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #2521C7, #12B8F2)" }}
                  >
                    View Gig
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business: "",
    service: "",
    budget: "",
    details: "",
  });

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const formRef = useReveal(0.1) as React.RefObject<HTMLFormElement>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sending) return;

    setSending(true);

    try {
      await emailjs.send(
        "service_q1ymmrw",
        "template_kcx6ybt",
        {
          name: form.name,
          email: form.email,
          business: form.business || "Not provided",
          service: form.service,
          budget: form.budget
            ? `$${form.budget}`
            : "Not provided",
          details: form.details,
        },
        {
          publicKey: "gprEx2sLnjKWKsivz",
        }
      );

      setSent(true);

      setForm({
        name: "",
        email: "",
        business: "",
        service: "",
        budget: "",
        details: "",
      });
    } catch (error) {
      console.error("EmailJS error:", error);

      alert(
        "We couldn't send your message. Please try again or contact us directly."
      );
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm bg-white/5 text-white placeholder-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#12B8F2]/40";

  const inputStyle = {
    fontFamily: "Manrope",
    borderColor: "rgba(255,255,255,0.12)",
    border: "1.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
  };

  return (
    <section
      id="contact"
      className="py-24 section-navy relative overflow-hidden dot-pattern"
    >
      {/* Background glow */}
      <div
        className="absolute left-1/4 bottom-0 w-96 h-96 blur-3xl pointer-events-none"
        style={{ background: "rgba(18,184,242,0.08)" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative">

        {/* Header */}
        <div ref={headRef} className="text-center mb-14 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{
              color: "#12B8F2",
              fontFamily: "Manrope",
            }}
          >
            Get In Touch
          </span>

          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily: "Sora",
              letterSpacing: "-0.02em",
            }}
          >
            Have an idea?{" "}
            <span className="gradient-text-light">
              Let's evolve it.
            </span>
          </h2>

          <p
            className="text-white/80 max-w-md mx-auto"
            style={{ fontFamily: "Manrope" }}
          >
            Tell us about your project and we'll get back to you within 24
            hours.
          </p>
        </div>

        {/* Success Message */}
        {sent ? (
          <div className="text-center py-16">

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(18,184,242,0.15)",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#12B8F2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "Sora" }}
            >
              Message received!
            </h3>

            <p
              className="text-white/80"
              style={{ fontFamily: "Manrope" }}
            >
              Thanks for reaching out. We'll be in touch within 24 hours.
            </p>
          </div>
        ) : (

          /* Contact Form */
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-3xl p-8 md:p-10 reveal reveal-scale"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >

            {/* Name / Email / Business / Service */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5">

              {/* Name */}
              <div>
                <label
                  className="text-xs text-white/80 font-medium mb-1.5 block"
                  style={{ fontFamily: "Manrope" }}
                >
                  Your Name *
                </label>

                <input
                  required
                  type="text"
                  placeholder="Alex Johnson"
                  className={inputClass}
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="text-xs text-white/80 font-medium mb-1.5 block"
                  style={{ fontFamily: "Manrope" }}
                >
                  Email Address *
                </label>

                <input
                  required
                  type="email"
                  placeholder="alex@company.com"
                  className={inputClass}
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* Business */}
              <div>
                <label
                  className="text-xs text-white/80 font-medium mb-1.5 block"
                  style={{ fontFamily: "Manrope" }}
                >
                  Business / Brand Name
                </label>

                <input
                  type="text"
                  placeholder="Your Company"
                  className={inputClass}
                  style={inputStyle}
                  value={form.business}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: e.target.value,
                    })
                  }
                />
              </div>

              {/* Service */}
              <div>
                <label
                  className="text-xs text-white/80 font-medium mb-1.5 block"
                  style={{ fontFamily: "Manrope" }}
                >
                  Service Needed *
                </label>

                <select
                  required
                  className={inputClass}
                  style={{
                    ...inputStyle,
                    appearance: "none",
                  }}
                  value={form.service}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      service: e.target.value,
                    })
                  }
                >
                  <option
                    value=""
                    style={{ background: "#08066B" }}
                  >
                    Select a service...
                  </option>

                  <option
                    value="UI/UX Design"
                    style={{ background: "#08066B" }}
                  >
                    UI/UX Design
                  </option>

                  <option
                    value="Web Design"
                    style={{ background: "#08066B" }}
                  >
                    Web Design
                  </option>

                  <option
                    value="Web Development"
                    style={{ background: "#08066B" }}
                  >
                    Web Development
                  </option>

                  <option
                    value="Website Redesign"
                    style={{ background: "#08066B" }}
                  >
                    Website Redesign
                  </option>

                  <option
                    value="Graphic Design"
                    style={{ background: "#08066B" }}
                  >
                    Graphic Design
                  </option>

                  <option
                    value="Custom Web Solution"
                    style={{ background: "#08066B" }}
                  >
                    Custom Web Solution
                  </option>
                </select>
              </div>

              {/* Approximate Budget in USD */}
              <div className="sm:col-span-2">
                <label
                  className="text-xs text-white/80 font-medium mb-1.5 block"
                  style={{ fontFamily: "Manrope" }}
                >
                  Approximate Budget in USD
                </label>

                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm pointer-events-none"
                    style={{ fontFamily: "Manrope" }}
                  >
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="500"
                    className={`${inputClass} pl-8`}
                    style={inputStyle}
                    value={form.budget}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        budget: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-6">
              <label
                className="text-xs text-white/80 font-medium mb-1.5 block"
                style={{ fontFamily: "Manrope" }}
              >
                Project Details *
              </label>

              <textarea
                required
                rows={4}
                placeholder="Tell us about your project, your goals, your timeline, and anything else we should know..."
                className={inputClass}
                style={{
                  ...inputStyle,
                  resize: "none",
                }}
                value={form.details}
                onChange={(e) =>
                  setForm({
                    ...form,
                    details: e.target.value,
                  })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all ${
                sending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, #2521C7, #12B8F2)",
                fontFamily: "Manrope",
              }}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}


// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "How much does a website cost?",
    a: "Every project is unique. We'll give you a clear, fixed quote after understanding your project requirements — no surprises.",
  },
  {
    q: "What does your design process look like?",
    a: "We follow five clear steps: Discover → Design → Approve → Build → Launch. We keep you involved at every stage and won't move forward without your approval.",
  },
  {
    q: "How many revisions do I get?",
    a: "Our standard packages include up to 3 rounds of revisions. We find that's more than enough to get things exactly right, but we're always happy to discuss additional revisions if needed.",
  },
  {
    q: "Can I approve the design before you start development?",
    a: "Absolutely — this is built into our process. You'll see and approve the full design in Figma before a single line of code is written. No surprises.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes! Website redesigns are one of our specialties. We'll audit your current site, understand what's working and what's not, and create a fresh new design that better serves your goals.",
  },
  {
    q: "Do you offer website maintenance after launch?",
    a: "Yes, we offer ongoing support and maintenance packages. We can handle content updates, security patches, performance optimisation, and any new features you need.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const headRef = useReveal() as React.RefObject<HTMLDivElement>;
  const listRef = useReveal(0.08) as React.RefObject<HTMLDivElement>;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={headRef} className="text-center mb-14 reveal">
          <span
            className="text-xs font-semibold tracking-widest uppercase mb-4 block"
            style={{ color: "#12B8F2", fontFamily: "Manrope" }}
          >
            FAQ
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "Sora", color: "#08066B", letterSpacing: "-0.02em" }}
          >
            Questions? We've got{" "}
            <span className="gradient-text">answers.</span>
          </h2>
        </div>

        <div ref={listRef} className="flex flex-col gap-3 stagger reveal">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: `1.5px solid ${open === i ? "rgba(18,184,242,0.3)" : "rgba(37,33,199,0.08)"}`,
                background: open === i ? "rgba(244,248,255,0.8)" : "white",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-semibold text-sm pr-4"
                  style={{ fontFamily: "Sora", color: "#08066B" }}
                >
                  {f.q}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: open === i ? "linear-gradient(135deg, #2521C7, #12B8F2)" : "rgba(37,33,199,0.08)",
                    color: open === i ? "white" : "#2521C7",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: open === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p
                    className="text-gray-500 text-sm leading-relaxed"
                    style={{ fontFamily: "Manrope" }}
                  >
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const innerRef = useReveal() as React.RefObject<HTMLDivElement>;
  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    //{ label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Fiverr", href: "#fiverr" },
    { label: "Contact", href: "#contact" },
  ];

  const socials = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/evolie.lk?igsi=dTdpMDZxbTNuMHBp",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@evolie.lk?is_from_webapp=1&sender_device=pc",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.69a8.16 8.16 0 004.77 1.52V7.74a4.85 4.85 0 01-1-.05z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/evolie-tech-71700a436",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "Fiverr",
      href: "https://www.fiverr.com/s/BbR2wmW",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 9.5H22V8.5C22 5.46 19.54 3 16.5 3c-1.63 0-3.09.7-4.11 1.82A5.5 5.5 0 001 9.5v.5H0v4.5h1V22h22v-7.5h1V9.5zM16.5 5C18.43 5 20 6.57 20 8.5v1H13V8.5C13 6.57 14.57 5 16.5 5zM3 9.5A3.5 3.5 0 016.5 6 3.5 3.5 0 0110 9.5v.5H3v-.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="section-navy pt-16 pb-8 relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-64 h-64 blur-3xl pointer-events-none"
        style={{ background: "rgba(18,184,242,0.06)" }}
      />

      <div ref={innerRef} className="max-w-7xl mx-auto px-6 relative reveal">
        {/* Top row */}
        <div className="grid md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <EvolieLogo size={48} />
            <p
              className="text-white/80 text-sm leading-relaxed mt-4 max-w-xs"
              style={{ fontFamily: "Manrope" }}
            >
              A creative digital agency crafting modern digital experiences for brands that want to stand out.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-all"
                  style={{ border: "1.5px solid rgba(255,255,255,0.12)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-white text-sm font-semibold mb-4"
              style={{ fontFamily: "Sora" }}
            >
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-white/75 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: "Manrope" }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h4
              className="text-white text-sm font-semibold mb-4"
              style={{ fontFamily: "Sora" }}
            >
              Start a Project
            </h4>
            <p
              className="text-white/80 text-sm mb-4"
              style={{ fontFamily: "Manrope" }}
            >
              Ready to build something great? We'd love to hear from you.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2521C7, #12B8F2)" }}
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p
            className="text-white/60 text-xs"
            style={{ fontFamily: "Manrope" }}
          >
            © {new Date().getFullYear()} Evolie. All rights reserved.
          </p>
          <p
            className="text-white/60 text-xs"
            style={{ fontFamily: "Manrope" }}
          >
            Made with <svg width="12" height="12" viewBox="0 0 24 24" fill="#12B8F2" stroke="#12B8F2" strokeWidth="1" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> by Evolie
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <About />
      <Services />
      <Work />
      <Process />
      <WhyEvolie />
      <Fiverr />
      <Contact />
      <FAQ />
      <Footer />
    </div>
  );
}
