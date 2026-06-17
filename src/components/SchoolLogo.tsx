/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SchoolLogoProps {
  className?: string;
  height?: number; // Height in pixels for scaling
  iconOnly?: boolean;
  isDark?: boolean;
}

export default function SchoolLogo({ className = '', height = 44, iconOnly = false, isDark = false }: SchoolLogoProps) {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`} style={{ height: `${height}px` }}>
      {/* 
         High-fidelity vector silhouette precisely matching the official 
         Agrupamento de Escolas de Carnaxide logo.
      */}
      <svg
        viewBox="0 0 160 260"
        className="h-full w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Main Steeple Body - Single unified grey fill with black high-contrast outline */}
        <path
          d="
            M 16,250
            L 16,175
            H 26
            C 36,145 48,125 56,115
            H 51
            V 110
            H 56
            V 49
            H 51
            V 44
            L 80,26
            L 109,44
            V 49
            H 104
            V 110
            H 109
            V 115
            H 104
            C 112,125 124,145 134,175
            H 144
            V 250
            Z
          "
          fill="#8e8e8e"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom flat base border accent within the outline */}
        <path
          d="M 13,250 H 147"
          stroke="#1e293b"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* 
           The elegant solid-black finial (needle & bulb ornament) 
           standing prominently at the roof peak.
        */}
        <path
          d="
            M 79.5,26
            V 20
            H 80.5
            V 26
            Z
          "
          fill="#1e293b"
        />
        {/* The decorative diamond-shaped bulb */}
        <path
          d="
            M 80,8
            C 83.5,13 83.5,15 80,20
            C 76.5,15 76.5,13 80,8
            Z
          "
          fill="#1e293b"
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* The sharp needle top */}
        <path
          d="M 80,8 V 2"
          stroke="#1e293b"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          {/* Main heading "Carnaxide" in the beautiful brand sea-green/teal color */}
          <span 
            className="font-sans font-extrabold tracking-tight text-[#1ba68f]" 
            style={{ fontSize: `${height * 0.46}px`, lineHeight: 1 }}
          >
            Carnaxide
          </span>
          {/* Subtext "Agrupamento de Escolas" styled elegantly in thin charcoal/neutral with tracking */}
          <span 
            className={`font-sans font-light tracking-[0.16em] -mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`} 
            style={{ fontSize: `${height * 0.17}px`, lineHeight: 1.25, fontWeight: 300 }}
          >
            Agrupamento de Escolas
          </span>
        </div>
      )}
    </div>
  );
}
