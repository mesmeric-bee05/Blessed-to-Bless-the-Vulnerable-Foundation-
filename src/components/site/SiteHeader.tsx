"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav, site } from "@/content/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { ArrowRight, ChevronDown, Close, Menu } from "@/components/ui/icons";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", mobileOpen);
    return () => document.body.classList.remove("no-scroll");
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {site.status === "prelaunch" && (
        <div className="bg-ink px-4 py-2 text-center text-[0.68rem] font-medium tracking-[0.08em] text-bone/80">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-ochre align-middle" />
          Preview build — content, contact details and payment rails are pending
          BBVF verification. Nothing here is a solicitation of funds.
        </div>
      )}

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-500 ${
          scrolled
            ? "border-ink/10 bg-bone/90 backdrop-blur-xl"
            : "border-transparent bg-bone/70 backdrop-blur-md"
        }`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4 md:h-[5.25rem]">
          <Wordmark />

          <nav
            ref={navRef}
            aria-label="Primary"
            className="hidden items-center gap-0.5 xl:flex"
          >
            {primaryNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const open = openMenu === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenu(item.label)}
                  onMouseLeave={() => hasChildren && setOpenMenu(null)}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => setOpenMenu(open ? null : item.label)}
                      className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-clay"
                          : "text-ink/75 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-clay"
                          : "text-ink/75 hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasChildren && open && (
                    <div className="absolute left-1/2 top-full z-50 w-[19rem] -translate-x-1/2 pt-3">
                      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper p-2 shadow-[var(--shadow-lift)]">
                        {item.description && (
                          <p className="px-3 pb-2 pt-2 text-[0.7rem] leading-relaxed text-ink/65">
                            {item.description}
                          </p>
                        )}
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-bone hover:text-ink"
                          >
                            {child.label}
                            <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/donate"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-4 py-2.5 text-[0.78rem] font-semibold text-paper transition-all duration-300 hover:bg-clay-dark hover:shadow-[0_10px_30px_-12px_rgba(169,74,46,0.8)] sm:px-5 sm:text-[0.82rem]"
            >
              Donate
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="shrink-0 rounded-full border border-ink/15 p-2.5 text-ink xl:hidden"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 h-full w-full bg-ink/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-bone shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <Wordmark />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-ink/15 p-2.5"
              >
                <span className="sr-only">Close menu</span>
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 px-4 py-4">
              {primaryNav.map((item) => (
                <div key={item.label} className="border-b border-ink/10 py-1">
                  <Link
                    href={item.href}
                    className="block px-2 py-3 font-display text-2xl text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-2 space-y-0.5 pl-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-2 text-sm text-ink/65"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <Link
                href="/contact"
                className="block px-2 py-4 font-display text-2xl text-ink"
              >
                Contact
              </Link>
            </nav>

            <div className="border-t border-ink/10 p-5">
              <Link
                href="/donate"
                className="flex items-center justify-center gap-2 rounded-full bg-clay px-5 py-3.5 text-sm font-semibold text-paper"
              >
                Donate or pledge support
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-[0.68rem] leading-relaxed text-ink/65">
                We will never ask for your M-Pesa PIN, card number or ID by
                phone, WhatsApp or social media.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
