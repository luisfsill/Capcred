"use client";

import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const COMPANY = {
  legalName: "CAPCRED AGRONEGOCIOS LTDA",
  brandName: "CAPCRED Agro Business",
  cnpj: "43.371.729/0003-49",
  email: "contato@capcredagrobusiness.com",
  phoneDisplay: "(47) 98888-4161",
  phoneE164: "5547988884161",
  instagramUrl: "https://www.instagram.com/capcred/",
  instagramHandle: "@capcred",
  address: {
    street: "Rua Avertano Rocha, 192, Sala 02",
    district: "Campina",
    city: "Belém",
    state: "PA",
    cep: "66.023-120",
  },
} as const;

const WHATSAPP_URL =
  `https://wa.me/${COMPANY.phoneE164}?text=` +
  encodeURIComponent(
    `Olá, gostaria de falar com um consultor da ${COMPANY.brandName}.`,
  );

const NAV_LINKS = [
  { href: "#topo", label: "Home" },
  { href: "#atuacao", label: "Atuação" },
  { href: "#impacto", label: "Impacto" },
  { href: "#contato", label: "Contato" },
] as const;

const SERVICES = [
  {
    id: "trading",
    title: "Agro Trading & Barter",
    description:
      "Compra e venda de grãos e operações financeiras de troca, com estrutura comercial ágil e segurança nas negociações.",
    image: "/Compra e venda de grãos e operações financeiras de troca.png",
  },
  {
    id: "maquinas",
    title: "Locação de Máquinas",
    description:
      "Frota moderna disponível para locação e operação, com suporte técnico para maximizar a produtividade na safra.",
    image: "/Frota moderna disponível para locação e operação.png",
  },
  {
    id: "assessoria",
    title: "Assessoria Inteligente",
    description:
      "Consultoria técnica, engenharia agronômica e documentação de imóveis para decisões mais seguras no campo.",
    image:
      "/Consultoria técnica, engenharia agronômica e documentação de imóveis.png",
  },
] as const;

const METRICS = [
  { value: 50, prefix: "+", suffix: "k", label: "Hectares atendidos" },
  { value: 180, prefix: "+", suffix: "", label: "Máquinas alugadas" },
  { value: 100, prefix: "R$ ", suffix: "M+", label: "Volume de grãos negociados" },
] as const;

const springSoft = { type: "spring" as const, stiffness: 260, damping: 28 };
const springTap = { type: "spring" as const, stiffness: 400, damping: 30 };

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: springSoft },
};

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.4-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21.1a9.1 9.1 0 0 1-4.6-1.3l-.33-.2-3.2.67.68-3.12-.21-.33A9.1 9.1 0 1 1 12 21.1zm5-6.8c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46h-.52c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.21 1.25.18 1.72.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
    </svg>
  );
}

/**
 * CTA WhatsApp — Liquid Glass dourado (cor da marca).
 * tone="ghost": só borda + transparente, com salto no hover (navbar / mobile).
 */
function WhatsAppCta({
  size = "md",
  fullWidth = false,
  className = "",
  onClick,
  tone = "default",
}: {
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  tone?: "default" | "ghost";
}) {
  const liquidSize = size === "sm" ? "sm" : size === "lg" ? "xl" : "lg";

  if (tone === "ghost") {
    const sizeClass =
      size === "sm"
        ? "h-8 gap-1.5 px-4 text-xs"
        : size === "lg"
          ? "h-12 gap-2 px-8 text-sm"
          : "h-10 gap-2 px-6 text-sm";

    return (
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full border border-white/40",
          "bg-transparent font-semibold tracking-tight text-white",
          "shadow-none outline-none transition-transform duration-300 ease-out",
          "hover:scale-105 hover:bg-transparent active:scale-95",
          "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
          sizeClass,
          fullWidth && "w-full max-w-xs sm:max-w-none",
          className,
        )}
        style={{
          backgroundColor: "transparent",
          backgroundImage: "none",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }}
      >
        <WhatsAppIcon className="size-4" />
        Falar com Consultor
      </a>
    );
  }

  return (
    <LiquidButton
      asChild
      size={liquidSize}
      tone="default"
      className={cn(
        "font-semibold tracking-tight text-white",
        fullWidth && "w-full max-w-xs sm:max-w-none",
        className,
      )}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        <WhatsAppIcon className="size-4" />
        Falar com Consultor
      </a>
    </LiquidButton>
  );
}

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.5.6.2 1 .5 1.5 1 .4.4.7.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.5 2.4-.2.6-.5 1-1 1.5-.4.4-.9.7-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.5-.6-.2-1-.5-1.5-1-.4-.4-.7-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.5-2.4.2-.6.5-1 1-1.5.4-.4.9-.7 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.2 0-3.5 0-4.8.1-1.1 0-1.7.2-2.1.4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.2.4-.3 1-.4 2.1 0 1.3-.1 1.6-.1 4.8s0 3.5.1 4.8c0 1.1.2 1.7.4 2.1.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.2 1 .3 2.1.4 1.3 0 1.6.1 4.8.1s3.5 0 4.8-.1c1.1 0 1.7-.2 2.1-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.2-.4.3-1 .4-2.1 0-1.3.1-1.6.1-4.8s0-3.5-.1-4.8c0-1.1-.2-1.7-.4-2.1-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.2-1-.3-2.1-.4-1.3 0-1.6-.1-4.8-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.4-8.4a1.2 1.2 0 1 1-2.3 0 1.2 1.2 0 0 1 2.3 0z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Cabeçalho editorial: rótulo com filete dourado, título grande à esquerda e
 * subtítulo em coluna secundária separada por hairline, sem badge/pílula.
 */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <motion.header
      className="mb-14 grid gap-7 border-b border-white/10 pb-10 md:mb-20 md:grid-cols-12 md:gap-12 md:pb-12"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div variants={fadeUp} className="md:col-span-7">
        <span className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300/90 sm:text-[11px] sm:tracking-[0.32em]">
          <span className="h-px w-10 bg-gradient-to-r from-gold to-gold/0" />
          {eyebrow}
        </span>
        <h2 className="mt-5 font-display text-balance text-[1.65rem] font-bold leading-[1.12] tracking-tight text-white sm:text-[1.9rem] md:text-[2.6rem] md:leading-[1.08] lg:text-5xl">
          {title}
        </h2>
      </motion.div>

      <motion.div variants={fadeUp} className="md:col-span-5 md:justify-self-end">
        <p className="max-w-sm text-base leading-relaxed text-zinc-400 md:border-l md:border-white/10 md:pl-8 md:pt-3">
          {subtitle}
        </p>
      </motion.div>
    </motion.header>
  );
}

function AnimatedCounter({
  value,
  prefix,
  suffix,
}: {
  value: number;
  prefix: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 22 });
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (reduce && inView) setDisplay(value);
  }, [reduce, inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Navbar                                                                     */
/* -------------------------------------------------------------------------- */

function useActiveSection() {
  const [active, setActive] = useState<(typeof NAV_LINKS)[number]["href"]>(
    NAV_LINKS[0].href,
  );

  useEffect(() => {
    const updateActive = () => {
      const lastHref = NAV_LINKS[NAV_LINKS.length - 1].href;
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Rodapé curto: no fim da página, força o último item (Contato)
      if (scrollBottom >= docHeight - 120) {
        setActive(lastHref);
        return;
      }

      const offset = 110; // altura aproximada da navbar
      let current: (typeof NAV_LINKS)[number]["href"] = NAV_LINKS[0].href;

      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.href.slice(1));
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
          current = link.href;
        }
      }

      setActive(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return [active, setActive] as const;
}

function scrollToNavTarget(href: (typeof NAV_LINKS)[number]["href"]) {
  // Contato fica no rodapé curto: ir até o fim da página
  if (href === "#contato") {
    const top = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo({ top, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(href.slice(1));
  if (!el) return;
  const navOffset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top, behavior: "smooth" });
}

function NavUnderlineLink({
  href,
  label,
  active,
  onNavigate,
  className = "",
}: {
  href: (typeof NAV_LINKS)[number]["href"];
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
      }}
      className={cn(
        "group relative inline-flex cursor-pointer items-center py-1 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
        active ? "text-gold" : "text-zinc-200 hover:text-gold",
        className,
      )}
    >
      <span className="relative inline-block">
        {label}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 -bottom-0.5 h-[2px] origin-center rounded-full bg-gold transition-transform duration-300 ease-out",
            active
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100",
          )}
        />
      </span>
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useActiveSection();

  const handleNavClick = (
    href: (typeof NAV_LINKS)[number]["href"],
    closeMenu = false,
  ) => {
    setActive(href);
    if (closeMenu) setOpen(false);
    // Espera o menu mobile fechar antes de rolar (senão o Contato para no meio)
    const delay = closeMenu ? 320 : 0;
    window.setTimeout(() => {
      scrollToNavTarget(href);
      window.history.pushState(null, "", href);
    }, delay);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B1E13]/80 backdrop-blur-md">
      <nav
        className="relative mx-auto flex h-[3.5rem] max-w-7xl items-center justify-between px-5 md:h-[3.75rem] md:px-8"
        aria-label="Principal"
      >
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavUnderlineLink
                href={link.href}
                label={link.label}
                active={active === link.href}
                onNavigate={() => handleNavClick(link.href)}
              />
            </li>
          ))}
        </ul>

        <div className="hidden md:ml-auto md:block">
          <WhatsAppCta size="sm" tone="ghost" />
        </div>

        <button
          type="button"
          className="ml-auto cursor-pointer rounded-lg p-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <MenuIcon open={open} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-white/10 bg-transparent transition-[max-height,opacity] duration-300 md:hidden ${
          open
            ? "max-h-96 opacity-100"
            : "pointer-events-none invisible max-h-0 border-t-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavUnderlineLink
                href={link.href}
                label={link.label}
                active={active === link.href}
                onNavigate={() => handleNavClick(link.href, true)}
                className="min-h-11 w-full px-3 py-3"
              />
            </li>
          ))}
          <li className="pb-2 pt-1">
            <WhatsAppCta
              size="md"
              fullWidth
              tone="ghost"
              className="max-w-none"
              onClick={() => setOpen(false)}
            />
          </li>
        </ul>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero: vídeo em loop + texto/botões somem no scroll; depois a página desce  */
/* -------------------------------------------------------------------------- */

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Texto/botões somem no início da rolagem (0 → ~65%).
  // Só depois disso (~65% → 100%) o sticky solta e a página desce.
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.65],
    [1, 1, 0],
  );
  const contentY = useTransform(scrollYProgress, [0, 0.65], [0, -40]);
  const contentScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.96]);
  const contentPointerEvents = useTransform(
    scrollYProgress,
    [0, 0.62, 0.65],
    ["auto", "auto", "none"],
  );
  const hintOpacity = useTransform(scrollYProgress, [0, 0.35, 0.55], [1, 0.4, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = true;
    video.muted = true;
    const play = () => {
      void video.play().catch(() => undefined);
    };
    play();
    video.addEventListener("canplay", play);
    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <div id="topo" ref={containerRef} className="relative h-[200svh] bg-ink">
      {/* Sticky: o vídeo fica fixo enquanto o texto some; depois a página desce */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/video-campo.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#08130D] via-[#08130D]/50 to-black/60" />

        <motion.div
          style={
            reduce
              ? undefined
              : {
                  opacity: contentOpacity,
                  y: contentY,
                  scale: contentScale,
                  pointerEvents: contentPointerEvents,
                }
          }
          className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-5 pb-24 pt-20 text-center md:pb-28 md:pt-24"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            src="/logo.png"
            alt={COMPANY.brandName}
            className="mb-3 h-28 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:h-36 md:mb-4 md:h-56"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.15 }}
          />

          <motion.h1
            className="mb-4 font-display text-balance text-[1.7rem] font-extrabold leading-[1.15] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.75),0_1px_3px_rgba(0,0,0,0.9)] sm:text-3xl md:mb-6 md:text-5xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.28 }}
          >
            Tecnologia, Soluções Financeiras e Assessoria Inteligente do Campo
            à Colheita
          </motion.h1>

          <motion.p
            className="mb-7 max-w-2xl text-[0.95rem] leading-relaxed text-zinc-200 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] sm:text-lg md:mb-8 md:text-xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.42 }}
          >
            Agro Trading & Barter, locação de máquinas agrícolas e consultoria
            especializada do campo à colheita.
          </motion.p>

          <motion.div
            className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.55 }}
          >
            <WhatsAppCta
              size="lg"
              fullWidth
              className="sm:w-auto"
            />
            <a
              href="#atuacao"
              className="inline-flex w-full max-w-xs cursor-pointer items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white shadow-[0_8px_24px_rgba(19,147,57,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl transition-transform duration-300 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-light/60 sm:w-auto sm:py-3"
              style={{
                backgroundColor: "rgba(19, 147, 57, 0.36)",
                backgroundImage:
                  "linear-gradient(180deg, rgba(62,202,104,0.25) 0%, rgba(19,147,57,0.08) 48%, rgba(1,99,24,0.28) 100%)",
              }}
            >
              Conhecer Atuação
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-200 [text-shadow:0_2px_10px_rgba(0,0,0,0.8)] [@media(max-height:640px)]:hidden md:bottom-8"
          style={reduce ? undefined : { opacity: hintOpacity }}
          aria-hidden
        >
          <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.28em] md:text-[10px] md:tracking-[0.3em]">
            Role para explorar
          </span>
          <motion.span
            className="h-6 w-px bg-gradient-to-b from-emerald-400 to-transparent md:h-8"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.8, 0.3, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Áreas de atuação                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Linha editorial: imagem e texto alternam de lado a cada frente, com filete
 * que cresce ao entrar na viewport.
 */
function ServiceRow({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      variants={fadeUp}
      className="group grid items-center gap-7 border-t border-white/10 py-10 md:grid-cols-12 md:gap-14 md:py-16"
    >
      <div
        className={`relative md:col-span-6 lg:col-span-5 ${
          flipped ? "md:order-2 md:col-start-7 lg:col-start-8" : ""
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI(service.image)}
            alt={service.title}
            className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] md:aspect-[5/4]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        </div>
      </div>

      <div
        className={`md:col-span-6 lg:col-span-6 ${
          flipped ? "md:order-1 md:col-start-1 lg:col-start-2" : "lg:col-start-7"
        }`}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300/80 sm:text-[11px] sm:tracking-[0.3em]">
          Frente {number}
        </span>

        <h3 className="mt-3 font-display text-[1.4rem] font-bold leading-tight text-white sm:text-2xl md:mt-4 md:text-[1.75rem]">
          {service.title}
        </h3>

        <motion.span
          aria-hidden
          className="mt-5 block h-px origin-left bg-gradient-to-r from-gold via-emerald-500/60 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-zinc-400">
          {service.description}
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-emerald-300 outline-none transition-colors hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400 md:mt-7"
        >
          Falar sobre esta frente
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </motion.article>
  );
}

function ServicesSection() {
  return (
    <section
      id="atuacao"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-24 md:py-32"
    >
      {/* colunas verticais discretas: dá estrutura de grid editorial ao fundo */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:96px_100%] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Nossas Frentes"
          title={
            <>
              Três frentes.{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-gold bg-clip-text text-transparent">
                Uma operação integrada.
              </span>
            </>
          }
          subtitle="Do grão à máquina, da documentação à estratégia financeira, a CAPCRED acompanha o produtor em cada etapa do ciclo."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Métricas                                                                   */
/* -------------------------------------------------------------------------- */

function MetricsSection() {
  return (
    <section
      id="impacto"
      className="relative scroll-mt-20 overflow-hidden bg-ink-nav py-24 md:py-32"
      aria-label="Números de impacto"
    >
      {/* marca d'água tipográfica */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-6 select-none font-display text-[22vw] font-extrabold leading-none tracking-tight text-white/[0.025]"
      >
        CAPCRED
      </span>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Impacto"
          title={
            <>
              Números que{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-gold bg-clip-text text-transparent">
                sustentam a confiança.
              </span>
            </>
          }
          subtitle="Indicadores de escala e compromisso com o resultado do produtor."
        />

        <motion.dl
          className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              variants={fadeUp}
              className={`group py-8 md:py-4 ${
                i === 0 ? "md:pr-10" : i === METRICS.length - 1 ? "md:pl-10" : "md:px-10"
              }`}
            >
              <dt className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-[11px] md:tracking-[0.28em]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70 transition-colors duration-300 group-hover:bg-gold" />
                {metric.label}
              </dt>

              <dd className="mt-3 font-display text-[2.75rem] font-extrabold leading-none tracking-tight sm:text-[3.25rem] md:mt-4 md:text-6xl">
                <span className="bg-gradient-to-br from-emerald-200 via-emerald-400 to-gold bg-clip-text text-transparent">
                  <AnimatedCounter
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </span>
              </dd>

              <motion.span
                aria-hidden
                className="mt-6 block h-px origin-left bg-gradient-to-r from-emerald-400/70 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 1.1,
                  delay: 0.15 * i,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer
      id="contato"
      className="relative scroll-mt-20 border-t border-white/10 bg-ink pt-14 pb-10 text-zinc-300 md:pt-16 md:pb-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-4 md:gap-12 md:px-8">
        <div className="sm:col-span-2">
          <a
            href="#topo"
            className="inline-flex cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={COMPANY.brandName}
              className="h-14 w-auto object-contain sm:h-16 md:h-[4.5rem]"
            />
          </a>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 md:mt-5">
            Tecnologia, soluções financeiras e assessoria inteligente do campo
            à colheita. Conectamos produtores a operações de grãos, maquinário
            e consultoria especializada.
          </p>
          <p className="mt-3 text-[0.8rem] leading-relaxed text-zinc-500">
            {COMPANY.legalName}
            <br />
            CNPJ {COMPANY.cnpj}
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Navegação
          </h3>
          <ul className="mt-3 space-y-1 md:mt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-9 cursor-pointer items-center text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Contato
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-zinc-400 md:mt-4">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 cursor-pointer items-center gap-2 transition-colors hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={COMPANY.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 cursor-pointer items-center gap-2 transition-colors hover:text-white"
              >
                <InstagramIcon className="h-4 w-4 shrink-0" />
                {COMPANY.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex min-h-9 cursor-pointer items-center break-all transition-colors hover:text-white"
              >
                {COMPANY.email}
              </a>
            </li>
            <li className="pt-2 text-[0.8rem] leading-relaxed text-zinc-500">
              {COMPANY.address.street}
              <br />
              {COMPANY.address.district} — {COMPANY.address.city}/
              {COMPANY.address.state}
              <br />
              CEP {COMPANY.address.cep}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 px-5 pt-6 text-center text-[0.7rem] text-zinc-500 sm:text-xs md:mt-12 md:flex-row md:gap-3 md:px-8 md:text-left">
        <p>
          © {new Date().getFullYear()} {COMPANY.brandName}. Todos os direitos
          reservados.
        </p>
        <p className="tracking-wide">Do campo à colheita.</p>
        <p>
          Desenvolvido por{" "}
          <a
            href="https://www.instagram.com/lf_system/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-medium text-zinc-400 transition-colors hover:text-gold"
          >
            LF_SYSTEM
          </a>
        </p>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function CapcreLanding() {
  return (
    <main className="relative overflow-x-clip bg-ink text-zinc-100">
      <Navbar />
      <Hero />
      <ServicesSection />
      <MetricsSection />
      <Footer />
    </main>
  );
}
