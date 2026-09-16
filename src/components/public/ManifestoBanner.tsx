"use client";

import React, { useState } from "react";
import { Mail, Check } from "lucide-react";

export function ManifestoBanner() {
  const [copied, setCopied] = useState(false);

  const handleDemoClick = () => {
    navigator.clipboard.writeText("demos@tromagnon.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="manifesto" className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12">
      <div className="bg-[#0D0D0D] text-white p-8 sm:p-12 border border-neutral-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Tag, Quote & Guidelines */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-mono tracking-widest text-[#D93829] uppercase font-bold block">
              MANIFESTO & OPEN DEMOS
            </span>

            <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
              “Independent music publisher, vinyl pressing curator, and artist collective founded in 2019. We believe in physical formats, careful mastering, and sonic honesty.”
            </blockquote>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              We welcome unreleased, original compositions in the realms of post-rock, minimalism, avant-pop, and mechanical ambient. Please respect our listening guidelines.
            </p>
          </div>

          {/* Right Side: Demo Action Button */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="w-full max-w-xs space-y-2 text-center lg:text-right">
              <a
                href="mailto:demos@tromagnon.com?subject=Tromagnon%20Records%20Demo%20Submission"
                className="w-full inline-block bg-white hover:bg-neutral-200 text-black font-mono text-xs sm:text-sm font-bold tracking-wider uppercase px-6 py-4 transition-all shadow-md active:scale-95 text-center"
              >
                SEND DEMOS (SOUNDCLOUD LINK ONLY)
              </a>

              <p className="text-[11px] font-mono text-neutral-500 tracking-wider uppercase">
                NO ATTACHMENTS · PRIVATE STREAMS ONLY
              </p>

              <div className="pt-2">
                <button
                  onClick={handleDemoClick}
                  className="text-[11px] font-mono text-neutral-400 hover:text-white transition flex items-center justify-center lg:justify-end gap-1.5 w-full"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied demos@tromagnon.com!</span>
                    </>
                  ) : (
                    <>
                      <Mail size={12} />
                      <span>Copy email: demos@tromagnon.com</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
