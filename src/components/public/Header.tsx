"use client";

import React from "react";
import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Releases", href: "/releases" },
  { name: "Artists", href: "/artists" },
  { name: "News", href: "/news" },
  { name: "Live", href: "/live" },
];

export function Header() {
  return (
    <header className="border-b border-neutral-200 p-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Tromagnon Records
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
