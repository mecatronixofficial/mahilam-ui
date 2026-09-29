"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Globe2, LogOut, Menu, RotateCw, Search, UserCog, X } from "lucide-react";
import { api, ApiError, markSessionActive, SESSION_EXPIRED_EVENT } from "@/lib/api";
import { isAdminRole, useAuth, type AuthUser } from "@/store/auth";
import { StateView } from "@/components/states/StateView";
import { CommandPalette } from "./CommandPalette";
import { SessionExpiredDialog } from "./SessionExpiredDialog";
import { currentItem, NAV, WORKSPACE, type WorkspaceMode } from "./nav";

const collapseKey = (mode: WorkspaceMode) => `${mode}-sidebar-collapsed`;

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export function DashboardShell({ mode, children }: { mode: WorkspaceMode; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();
  const [status, setStatus] = useState<"checking" | "ready" | "unreachable">("checking");
  const [expired, setExpired] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const checkSession = useCallback(() => {
    setStatus("checking");
    api<{ data: AuthUser }>("/auth/me")
      .then((response) => { setUser(response.data); markSessionActive(true); setStatus("ready"); })
      .catch((error) => {
        // Only a real 401 means "signed out"; a network blip must not kick staff to the login page.
        if (error instanceof ApiError && error.status === 401) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        else setStatus("unreachable");
      });
    // pathname intentionally excluded: the session is checked once per workspace mount.
  }, [router, setUser]);

  useEffect(() => { checkSession(); }, [checkSession]);

  useEffect(() => {
    const onExpired = () => setExpired(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    try { if (localStorage.getItem(collapseKey(mode)) === "1") setCollapsed(true); } catch { /* storage unavailable */ }
  }, [mode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen((open) => !open); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleCollapsed() {
    setCollapsed((value) => {
      try { localStorage.setItem(collapseKey(mode), value ? "0" : "1"); } catch { /* storage unavailable */ }
      return !value;
    });
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try { await api("/auth/logout", { method: "POST" }); } catch { /* signing out locally regardless */ }
    markSessionActive(false);
    setUser(null);
    queryClient.clear();
    router.replace("/login");
  }

  const workspace = WORKSPACE[mode];
  const isAdmin = isAdminRole(user?.role);
  const items = NAV[mode].filter((item) => !item.adminOnly || isAdmin);
  const current = currentItem(mode, pathname);
  const initials = user?.name?.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "LM";
  const forbidden = status === "ready" && mode === "admin" && !isAdmin;

  if (status === "checking") return <ShellSkeleton mode={mode} />;

  if (status === "unreachable") {
    return (
      <div className="dash grid min-h-screen place-items-center p-4" data-mode={mode}>
        <div className="dash-bg" />
        <StateView
          variant={typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "error"}
          title={typeof navigator !== "undefined" && !navigator.onLine ? "You're offline" : "Can't reach the school server"}
          description="We couldn't confirm your session. Check your connection and try again."
          action={{ label: "Try again", onClick: checkSession, icon: RotateCw }}
          secondaryAction={{ label: "Go to website", href: "/" }}
          className="w-full max-w-lg"
        />
      </div>
    );
  }

  function renderSidebar(compact: boolean) {
    let lastGroup = "";
    const WorkspaceIcon = workspace.icon;
    return (
      <>
        <div className={`flex h-20 items-center gap-3 border-b border-white/10 px-5 ${compact ? "justify-center !px-0" : ""}`}>
          <span className="flex h-11 w-11 shrink-0 rotate-3 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f7c85b] to-[#ef9e8a] text-slate-900 shadow-lg shadow-black/25"><WorkspaceIcon className="h-5 w-5" /></span>
          {!compact && <div className="min-w-0"><div className="truncate font-black tracking-tight text-white">Little Mahilam</div><div className="truncate text-[10px] font-black uppercase tracking-[.18em] text-[#f7c85b]">{workspace.name}</div></div>}
        </div>
        <nav className="hide-scrollbar flex-1 overflow-y-auto px-3 py-4" aria-label={`${workspace.label} navigation`}>
          {items.map((item) => {
            const active = item.href === current.href;
            const Icon = item.icon;
            const showGroup = !compact && item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <Fragment key={item.href}>
                {showGroup && <div className="mb-2 mt-4 px-3 text-[10px] font-black uppercase tracking-[.2em] text-white/30 first:mt-0">{item.group}</div>}
                <Link
                  href={item.href}
                  title={compact ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`group mb-1 flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all ${compact ? "justify-center !px-0" : ""} ${active ? "dash-nav-active" : "text-white/60 hover:bg-white/[.07] hover:text-white"}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/20" : "bg-white/[.06] group-hover:bg-white/10"}`}><Icon className="h-[18px] w-[18px]" /></span>
                  {!compact && <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{item.label}</span><span className={`block truncate text-[11px] ${active ? "text-white/70" : "text-white/30"}`}>{item.helper}</span></span>}
                </Link>
              </Fragment>
            );
          })}
        </nav>
        <div className="grid gap-2 border-t border-white/10 p-3">
          {(mode === "admin" || isAdmin) && (
            <Link href={workspace.switchHref} title={compact ? workspace.switchLabel : undefined} className={`flex items-center justify-center gap-2 rounded-2xl bg-white/[.06] px-4 py-2.5 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white ${compact ? "!px-0" : ""}`}>
              <ArrowLeftRight className="h-4 w-4 shrink-0" />{!compact && workspace.switchLabel}
            </Link>
          )}
          <Link href="/" target="_blank" title={compact ? "View website" : undefined} className={`flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-bold text-white/60 hover:bg-white/5 hover:text-white ${compact ? "!px-0" : ""}`}>
            <Globe2 className="h-4 w-4 shrink-0" />{!compact && "View website"}
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="dash" data-mode={mode}>
      <div className="dash-bg" />

      <aside className={`dash-sidebar fixed inset-y-0 left-0 z-50 hidden flex-col transition-[width] duration-200 lg:flex ${collapsed ? "w-20" : "w-72"}`}>
        {renderSidebar(collapsed)}
        <button type="button" onClick={toggleCollapsed} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-white/70 shadow-lg hover:text-white">
          {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
          <aside className="dash-sidebar relative flex h-full w-[min(86vw,300px)] animate-fade-up flex-col shadow-2xl">{renderSidebar(false)}</aside>
          <button onClick={() => setMenuOpen(false)} aria-label="Close navigation" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900"><X className="h-5 w-5" /></button>
        </div>
      )}

      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <header className="dash-header sticky top-0 z-40">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3 px-4 sm:px-6 xl:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMenuOpen(true)} aria-label="Open navigation" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white lg:hidden"><Menu className="h-5 w-5" /></button>
              <div className="min-w-0">
                <p className="accent-text text-[10px] font-black uppercase tracking-[.18em]">{workspace.label}</p>
                <h1 className="truncate text-lg font-extrabold sm:text-xl">{current.label}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => setPaletteOpen(true)} className="hidden items-center gap-3 rounded-2xl border bg-white/70 px-3.5 py-2 text-sm font-semibold text-slate-400 hover:bg-white md:flex">
                <Search className="h-4 w-4" /> Jump to… <span className="kbd">Ctrl K</span>
              </button>
              <button type="button" onClick={() => setPaletteOpen(true)} aria-label="Quick navigation" className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 text-slate-500 md:hidden"><Search className="h-4 w-4" /></button>
              <div className="hidden text-right lg:block">
                <div className="text-sm font-extrabold">{greeting()}, {user?.name?.split(" ")[0]}</div>
                <div className="text-[11px] font-bold text-slate-400">{user?.role?.replace("_", " ")}</div>
              </div>
              <Link href="/crm/account" title="My account" className="accent-bg flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black" aria-label="My account">{initials}</Link>
              <button onClick={logout} disabled={loggingOut} aria-label="Sign out" title="Sign out" className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white/70 text-slate-500 hover:text-rose-600 disabled:opacity-50">
                <LogOut className={`h-4 w-4 ${loggingOut ? "animate-pulse" : ""}`} />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-[1500px] p-4 sm:p-6 xl:p-10">
          {forbidden ? (
            <StateView
              variant="forbidden"
              title="The Website CMS is for administrators"
              description="Your staff account can use the School CRM. Ask an administrator if you need to publish website content."
              action={{ label: "Open School CRM", href: "/crm" }}
              secondaryAction={{ label: "My account", href: "/crm/account", icon: UserCog }}
            />
          ) : children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} canUseCms={isAdmin} />
      {expired && <SessionExpiredDialog next={pathname} />}
    </div>
  );
}

function ShellSkeleton({ mode }: { mode: WorkspaceMode }) {
  return (
    <div className="dash" data-mode={mode} aria-busy="true" aria-label="Loading workspace">
      <div className="dash-bg" />
      <aside className="dash-sidebar fixed inset-y-0 left-0 hidden w-72 flex-col gap-3 p-5 lg:flex">
        <div className="flex items-center gap-3"><div className="h-11 w-11 animate-pulse rounded-2xl bg-white/15" /><div className="h-4 w-28 animate-pulse rounded bg-white/15" /></div>
        {Array.from({ length: 7 }).map((_, index) => <div key={index} className="mt-3 h-10 animate-pulse rounded-2xl bg-white/[.07]" />)}
      </aside>
      <div className="lg:pl-72">
        <div className="dash-header flex h-[4.5rem] items-center px-6"><div className="skeleton h-6 w-40" /></div>
        <div className="grid gap-4 p-6 xl:p-10">
          <div className="skeleton h-10 w-72" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="panel h-32 p-6"><div className="skeleton h-10 w-10" /><div className="skeleton mt-5 h-6 w-16" /></div>)}</div>
          <div className="panel h-64" />
        </div>
      </div>
    </div>
  );
}
