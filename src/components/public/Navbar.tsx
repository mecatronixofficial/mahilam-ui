"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, ChevronDown, Menu, Phone } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type { Branding } from "@/lib/branding";
import type { PublicSite } from "@/lib/site";
import { telHref } from "@/lib/site";
import { KidsDrawer } from "./KidsZoneMenu";
import { ABOUT_GROUP, HOME, MAIN, isActive } from "./navLinks";
import styles from "./navbar.module.css";

export function Navbar({ siteDetails, branding }: { siteDetails: PublicSite; branding?: Branding }) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Release the drawer's focus trap when switching to the desktop layout.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  function handleNav(href: string) {
    if (href === pathname) {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    setOpen(false);
  }

  return (
    <>
      <header className={styles.header} data-compact={compact || undefined}>
        <div className={styles.bar}>
          <Link href="/" onClick={() => handleNav("/")} className={styles.logoLink} aria-label="Little Mahilam Pre-school home">
            <BrandLogo branding={branding} priority className={styles.logo} />
          </Link>

          <nav aria-label="Main" className={styles.desktopNav}>
            <NavItem href={HOME.href} label={HOME.label} pathname={pathname} onNavigate={handleNav} />
            <AboutMenu pathname={pathname} onNavigate={handleNav} />
            {MAIN.map((link) => <NavItem key={link.href} href={link.href} label={link.label} pathname={pathname} onNavigate={handleNav} />)}
          </nav>

          <div className={styles.actions}>
            {siteDetails.phone && (
              <a href={telHref(siteDetails.phone)} aria-label={`Call us on ${siteDetails.phone}`} title={siteDetails.phone} className={styles.phoneLink}>
                <Phone aria-hidden size={18} strokeWidth={1.8} />
              </a>
            )}
            <Link href="/admissions" onClick={() => handleNav("/admissions")} className={styles.enquire}>
              <span>Enquire now</span>
              <span className={styles.enquireArrow}><ArrowUpRight aria-hidden size={17} strokeWidth={2} /></span>
            </Link>
            <button ref={menuButton} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="kids-drawer" className={styles.menuButton}>
              <Menu aria-hidden size={23} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        <div aria-hidden className={styles.colourLine}><span /><span /><span /><span /><span /></div>
      </header>

      <KidsDrawer open={open} onClose={() => { setOpen(false); menuButton.current?.focus(); }} pathname={pathname} phone={siteDetails.phone} branding={branding} onNavigate={handleNav} />
    </>
  );
}

function NavItem({ href, label, pathname, onNavigate }: { href: string; label: string; pathname: string; onNavigate: (href: string) => void }) {
  return <Link href={href} onClick={() => onNavigate(href)} aria-current={isActive(pathname, href) ? "page" : undefined} className={styles.navLink}>{label}</Link>;
}

function AboutMenu({ pathname, onNavigate }: { pathname: string; onNavigate: (href: string) => void }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const panelId = useId();
  const active = ABOUT_GROUP.some((link) => isActive(pathname, link.href));

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => { if (!wrap.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const enter = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    timer.current = window.setTimeout(() => {
      if (!wrap.current?.contains(document.activeElement)) setOpen(false);
    }, 150);
  };

  return (
    <div ref={wrap} className={styles.aboutWrap} onPointerEnter={enter} onPointerLeave={leave} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={button} type="button" aria-expanded={open} aria-controls={panelId} data-active={active || undefined} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          window.clearTimeout(timer.current);
          setOpen(true);
          window.requestAnimationFrame(() => wrap.current?.querySelector<HTMLAnchorElement>("a")?.focus());
        }
      }} className={styles.navLink}>
        About <ChevronDown aria-hidden size={14} className={styles.chevron} data-open={open || undefined} />
      </button>
      <div id={panelId} inert={!open} aria-hidden={!open} className={styles.dropdown} data-open={open || undefined}>
        <div className={styles.dropdownPanel}>
          <p className={styles.menuEyebrow}>A little look inside</p>
          <ul className={styles.dropdownGrid}>
            {ABOUT_GROUP.map(({ href, label, note, icon: Icon, tile, ink }) => (
              <li key={href}>
                <Link href={href} onClick={() => { setOpen(false); onNavigate(href); }} aria-current={isActive(pathname, href) ? "page" : undefined} className={styles.dropdownLink}>
                  <span className={styles.linkIcon} style={{ "--tile": tile, "--icon-ink": ink } as CSSProperties}><Icon aria-hidden size={20} strokeWidth={1.8} /></span>
                  <span><span className={styles.linkLabel}>{label}</span><span className={styles.linkNote}>{note}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
