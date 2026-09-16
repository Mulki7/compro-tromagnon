"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { TrackingEye } from "@/components/public/TrackingEye";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "News", href: "/news" },
    { name: "Artists", href: "/artists" },
    { name: "Releases", href: "/releases" },
    { name: "Live", href: "/live" },
  ];

  return (
    <header className="w-full pt-8 pb-4 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Logo flanked by tracking eyes */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
        <TrackingEye className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />

        <Link href="/" className="inline-block transition-transform hover:scale-[1.02] duration-200">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            <Image
              src="/assets/logo-tromagnon.png"
              alt="Tromagnon Records"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        <TrackingEye className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
      </div>

      {/* Navigation Row */}
      <div className="flex items-center justify-between border-b border-transparent pb-2">
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive
                    ? "bg-[#0A0A0A] text-white px-4 py-1.5 shadow-sm"
                    : "text-[#0A0A0A] hover:text-neutral-500 hover:bg-neutral-100/60 px-3 py-1.5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-black hover:bg-neutral-100 transition"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-[#0A0A0A]">
          <Link
            href="/#manifesto"
            className="hover:text-neutral-500 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs text-neutral-400">•</span>
            Label
          </Link>
          <button
            onClick={() => alert("Shop will be available in the next release.")}
            className="hover:text-neutral-500 transition-colors flex items-center gap-1.5"
          >
            <span className="text-xs text-neutral-400">•</span>
            Shop / Cart (0)
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-white border border-neutral-200 rounded-2xl shadow-lg space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-full transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
