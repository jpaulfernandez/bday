"use client";

import React, { useState, useEffect } from "react";
import { Utensils, Smile, ArrowRight, Heart } from "lucide-react";
import { soundManager } from "@/lib/sound";
import confetti from "canvas-confetti";

interface DanaRamenFeastProps {
  onFinish?: () => void;
  initialMode?: "slurping" | "peace";
  readOnly?: boolean;
}

export default function DanaRamenFeast({
  onFinish,
  initialMode = "slurping",
  readOnly = false,
}: DanaRamenFeastProps) {
  const [mode, setMode] = useState<"slurping" | "peace">(initialMode);
  const [slurpCount, setSlurpCount] = useState(0);

  // Automatically transition from slurping to peace after ~3.8 seconds
  useEffect(() => {
    if (mode === "slurping") {
      soundManager.playSlurp();
      const timer = setTimeout(() => {
        setMode("peace");
      }, 3800);
      return () => clearTimeout(timer);
    } else if (mode === "peace") {
      soundManager.playSparkle();
      if (!readOnly) {
        try {
          confetti({
            particleCount: 45,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FFD700", "#FFB7C5", "#FFAEC9", "#FFF"],
          });
        } catch {}
      }
    }
  }, [mode, slurpCount, readOnly]);

  const handleSlurp = () => {
    soundManager.playSlurp();
    setMode("slurping");
    setSlurpCount((c) => c + 1);
  };

  const handlePeace = () => {
    soundManager.playSparkle();
    setMode("peace");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4 animate-fadeIn select-none">
      
      {/* SVG Illustration: Dana Eating / Smiling at Peace */}
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 360"
          className="w-full h-auto drop-shadow-2xl overflow-visible"
        >
          <defs>
            <clipPath id="feastCircle">
              <circle cx="150" cy="170" r="142" />
            </clipPath>
            <linearGradient id="bgGradFeast" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8ED" />
              <stop offset="100%" stopColor="#F5E6CE" />
            </linearGradient>
            <linearGradient id="jacketGradFeast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8DF72" />
              <stop offset="100%" stopColor="#ECD053" />
            </linearGradient>
            <linearGradient id="ramenGradFeast" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C2D20" />
              <stop offset="100%" stopColor="#5E1810" />
            </linearGradient>
            <linearGradient id="soupGradFeast" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E5A93C" />
              <stop offset="100%" stopColor="#C87D2B" />
            </linearGradient>
            <filter id="softShadowFeast" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4E3524" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Backdrop Circle */}
          <circle cx="150" cy="170" r="142" fill="url(#bgGradFeast)" stroke="#EBDDBE" strokeWidth="6" />
          <circle cx="150" cy="170" r="145" fill="none" stroke="#E2D2AC" strokeWidth="1.5" />

          {/* Floating decorative ramen steam & lanterns in background */}
          <g clipPath="url(#feastCircle)" opacity="0.45">
            <path d="M 50 100 Q 58 95 62 103 Q 56 112 48 106 Q 44 98 50 100 Z" fill="#FFAEC9" className="animate-float" />
            <path d="M 240 80 Q 250 78 252 88 Q 244 96 236 90 Q 234 82 240 80 Z" fill="#FFAEC9" className="animate-float" style={{ animationDelay: "1s" }} />
            <path d="M 40 220 Q 50 216 52 226 Q 44 236 36 228 Q 34 220 40 220 Z" fill="#FFAEC9" />
            <path d="M 250 240 Q 258 234 262 244 Q 254 254 246 246 Q 244 238 250 240 Z" fill="#FFAEC9" />
            <circle cx="80" cy="140" r="3" fill="#FFAEC9" />
            <circle cx="220" cy="180" r="2.5" fill="#FFAEC9" />
          </g>

          {/* MAIN PORTRAIT CONTENT (CLIPPED TO CIRCLE) */}
          <g clipPath="url(#feastCircle)">
            {/* Back hair behind neck */}
            <path d="M 120 180 Q 110 210 115 235 L 185 235 Q 190 210 180 180 Z" fill="#5E3F28" />

            {/* Blouse Base */}
            <path d="M 80 344 Q 85 250 120 236 L 180 236 Q 215 250 220 344 Z" fill="#FAF6EC" stroke="#4E3524" strokeWidth="2" />
            <path d="M 150 268 L 150 344" stroke="#DCD2C0" strokeWidth="1.8" strokeDasharray="8,4" />
            <path d="M 120 236 L 150 272 L 180 236 Z" fill="#EAE0D0" />

            {/* Blouse Lapels */}
            <path d="M 120 236 L 150 270 L 130 278 L 105 250 Z" fill="#FAF6EC" stroke="#4E3524" strokeWidth="1.8" strokeLinejoin="round" filter="url(#softShadowFeast)" />
            <path d="M 180 236 L 150 270 L 170 278 L 195 250 Z" fill="#FAF6EC" stroke="#4E3524" strokeWidth="1.8" strokeLinejoin="round" filter="url(#softShadowFeast)" />

            {/* Open Yellow Festival Jacket */}
            <path d="M 50 344 Q 54 260 105 245 L 122 255 Q 112 285 110 344 Z" fill="url(#jacketGradFeast)" stroke="#4E3524" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 250 344 Q 246 260 195 245 L 178 255 Q 188 285 190 344 Z" fill="url(#jacketGradFeast)" stroke="#4E3524" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 105 245 L 122 255 L 114 275 Z" fill="#D8BE3D" />
            <path d="M 195 245 L 178 255 L 186 275 Z" fill="#D8BE3D" />

            {/* Naruto (Fish Cake) Swirl Pin on Jacket */}
            <g transform="translate(100, 275) scale(0.9)">
              <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#4E3524" strokeWidth="1.5" />
              <path d="M -4 0 A 4 4 0 1 0 4 0 A 2 2 0 1 1 0 0" fill="none" stroke="#FF577F" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Neck */}
            <path d="M 136 190 L 136 240 Q 150 245 164 240 L 164 190 Z" fill="#F3CBA5" />
            <path d="M 136 202 Q 150 214 164 202 L 164 190 L 136 190 Z" fill="#E0AF83" opacity="0.65" />

            {/* Face & Head Base */}
            <path
              d="M 104 130 C 104 85 124 65 150 65 C 176 65 196 85 196 130 C 196 160 188 182 172 196 C 164 203 156 207 150 207 C 144 207 136 203 128 196 C 112 182 104 160 104 130 Z"
              fill="#F3CBA5"
              stroke="#4E3524"
              strokeWidth="2"
            />

            {/* Ears & Earrings */}
            <ellipse cx="101" cy="146" rx="7.5" ry="12" fill="#F3CBA5" stroke="#4E3524" strokeWidth="1.8" />
            <ellipse cx="199" cy="146" rx="7.5" ry="12" fill="#F3CBA5" stroke="#4E3524" strokeWidth="1.8" />
            <circle cx="101" cy="158" r="3.5" fill="#FAF6EC" stroke="#C9BDA4" strokeWidth="1" />
            <circle cx="199" cy="158" r="3.5" fill="#FAF6EC" stroke="#C9BDA4" strokeWidth="1" />

            {/* Jawline Shadow */}
            <path d="M 128 195 Q 150 208 172 195 Q 160 202 150 202 Q 140 202 128 195 Z" fill="#E0AF83" opacity="0.5" />

            {/* Cheeks Blush (Intensity varies by mode) */}
            <ellipse cx="118" cy="164" rx="13" ry="7" fill="#F2967C" opacity={mode === "peace" ? 0.85 : 0.6} className="animate-pulse" />
            <ellipse cx="182" cy="164" rx="13" ry="7" fill="#F2967C" opacity={mode === "peace" ? 0.85 : 0.6} className="animate-pulse" />
            {mode === "peace" && (
              <g fill="#FFF" opacity="0.9">
                <circle cx="114" cy="162" r="1.5" />
                <circle cx="186" cy="162" r="1.5" />
              </g>
            )}

            {/* Nose */}
            <path d="M 148 156 Q 146 166 150 169 Q 153 171 156 168" fill="none" stroke="#C88E68" strokeWidth="2.2" strokeLinecap="round" />

            {/* Hair: Base & Tendrils */}
            <path
              d="M 100 135 C 92 85 116 56 150 54 C 184 56 208 85 200 135 C 194 105 180 88 160 84 C 140 88 126 105 100 135 Z"
              fill="#6E4B2F"
              stroke="#4E3524"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M 155 56 Q 130 70 112 110 Q 125 90 145 80 Q 150 78 155 56 Z" fill="#7B5638" />
            <path d="M 160 58 Q 175 75 188 108 Q 178 88 165 76 Q 162 72 160 58 Z" fill="#7B5638" />
            <path d="M 135 68 Q 120 85 110 115 Q 116 95 130 78 Z" fill="#B08350" opacity="0.7" />

            <path
              d="M 102 115 C 94 135 98 155 95 172 C 94 178 98 180 102 175 C 105 168 103 150 108 125 Z"
              fill="#7B5638"
              stroke="#4E3524"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 99 130 Q 97 155 99 170" stroke="#B08350" strokeWidth="1.4" fill="none" />

            <path
              d="M 198 115 C 206 135 202 155 205 172 C 206 178 202 180 198 175 C 195 168 197 150 192 125 Z"
              fill="#7B5638"
              stroke="#4E3524"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 201 130 Q 203 155 201 170" stroke="#B08350" strokeWidth="1.4" fill="none" />

            {/* Glasses: Sleek Gold Wireframe */}
            <g fill="none" stroke="#C8966E" strokeWidth="2.6" strokeLinejoin="round">
              <path d="M 106 136 Q 106 125 116 125 L 134 125 Q 144 125 144 136 L 142 154 Q 140 163 132 163 L 116 163 Q 108 163 106 154 Z" />
              <path d="M 156 136 Q 156 125 166 125 L 184 125 Q 194 125 194 136 L 194 154 Q 192 163 184 163 L 168 163 Q 160 163 158 154 Z" />
              <path d="M 144 134 Q 150 130 156 134" strokeWidth="2.4" />
              <path d="M 106 134 L 98 131" strokeWidth="2.2" />
              <path d="M 194 134 L 202 131" strokeWidth="2.2" />
            </g>
            <g fill="#FFFFFF" opacity="0.15">
              <path d="M 108 136 Q 108 127 116 127 L 134 127 Q 142 127 142 136 L 140 154 Q 138 161 132 161 L 116 161 Q 110 161 108 154 Z" />
              <path d="M 158 136 Q 158 127 166 127 L 184 127 Q 192 127 192 136 L 192 154 Q 190 161 184 161 L 168 161 Q 160 161 158 154 Z" />
            </g>
            <path d="M 112 135 L 126 158" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
            <path d="M 162 135 L 176 158" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />

            {/* ============ MODE: SLURPING ============ */}
            {mode === "slurping" && (
              <g>
                {/* Excited Eyebrows */}
                <path d="M 110 121 Q 123 112 137 119" fill="none" stroke="#5B3E28" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 190 121 Q 177 112 163 119" fill="none" stroke="#5B3E28" strokeWidth="3.6" strokeLinecap="round" />

                {/* Wide Excited Eyes */}
                <path d="M 112 142 Q 125 131 138 141 Q 137 155 125 156 Q 114 155 112 142 Z" fill="#FFFFFF" />
                <circle cx="126" cy="145" r="7.5" fill="#4A2E18" />
                <circle cx="126" cy="145" r="4" fill="#1A1008" />
                {/* Star pupil highlight */}
                <path d="M 128 140 L 129 143 L 132 144 L 129 145 L 128 148 L 127 145 L 124 144 L 127 143 Z" fill="#FFF" />
                <path d="M 110 141 Q 124 130 140 139" fill="none" stroke="#2D1A0C" strokeWidth="3" strokeLinecap="round" />

                <path d="M 188 142 Q 175 131 162 141 Q 163 155 175 156 Q 186 155 188 142 Z" fill="#FFFFFF" />
                <circle cx="174" cy="145" r="7.5" fill="#4A2E18" />
                <circle cx="174" cy="145" r="4" fill="#1A1008" />
                {/* Star pupil highlight */}
                <path d="M 176 140 L 177 143 L 180 144 L 177 145 L 176 148 L 175 145 L 172 144 L 175 143 Z" fill="#FFF" />
                <path d="M 190 141 Q 176 130 160 139" fill="none" stroke="#2D1A0C" strokeWidth="3" strokeLinecap="round" />

                {/* Slurping Mouth (Cute Puckered O Shape) */}
                <ellipse cx="150" cy="183" rx="7" ry="8.5" fill="#8C2D20" stroke="#A83C2C" strokeWidth="1.8" />
                <ellipse cx="150" cy="183" rx="4.5" ry="6" fill="#5E1810" />
                <path d="M 145 186 Q 150 182 155 186" fill="none" stroke="#F2967C" strokeWidth="1.5" />
                {/* Slurp vibration creases */}
                <path d="M 138 183 Q 140 183 141 181" fill="none" stroke="#D96B58" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 162 183 Q 160 183 159 181" fill="none" stroke="#D96B58" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}

            {/* ============ MODE: PEACE (SMILING AT PEACE) ============ */}
            {mode === "peace" && (
              <g>
                {/* Peaceful, Relaxed Eyebrows */}
                <path d="M 110 125 Q 123 119 137 124" fill="none" stroke="#5B3E28" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M 190 125 Q 177 119 163 124" fill="none" stroke="#5B3E28" strokeWidth="3.6" strokeLinecap="round" />

                {/* Closed Crescent Eyes (Blissful Peace) */}
                <path d="M 112 146 Q 125 136 138 146" fill="none" stroke="#2D1A0C" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 112 146 L 108 143" stroke="#2D1A0C" strokeWidth="2" strokeLinecap="round" />
                <path d="M 138 146 L 142 143" stroke="#2D1A0C" strokeWidth="2" strokeLinecap="round" />

                <path d="M 162 146 Q 175 136 188 146" fill="none" stroke="#2D1A0C" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 162 146 L 158 143" stroke="#2D1A0C" strokeWidth="2" strokeLinecap="round" />
                <path d="M 188 146 L 192 143" stroke="#2D1A0C" strokeWidth="2" strokeLinecap="round" />

                {/* Wide Serene Peaceful Smile */}
                <path d="M 136 180 Q 150 194 164 180" fill="none" stroke="#A83C2C" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 136 180 C 142 186 158 186 164 180 Z" fill="#D96B58" opacity="0.4" />
                <path d="M 133 178 Q 135 180 137 180" fill="none" stroke="#C88E68" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M 163 180 Q 165 180 167 178" fill="none" stroke="#C88E68" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            )}

            {/* ============ THE RAMEN BOWL & TOPPINGS ============ */}
            <g transform="translate(0, 10)">
              {/* Outer Lacquer Bowl */}
              <ellipse cx="150" cy="275" rx="84" ry="28" fill="#151515" stroke="#D4AF37" strokeWidth="3" filter="url(#softShadowFeast)" />
              <path d="M 66 275 C 66 338 234 338 234 275 Z" fill="url(#ramenGradFeast)" stroke="#4E3524" strokeWidth="2.5" />
              <path d="M 76 285 C 86 328 214 328 224 285 Z" fill="#6B1F14" />

              {/* Rich Pork Broth */}
              <ellipse cx="150" cy="275" rx="76" ry="22" fill="url(#soupGradFeast)" />
              <ellipse cx="130" cy="278" rx="16" ry="5" fill="#F7C85C" opacity="0.45" />
              <ellipse cx="175" cy="272" rx="14" ry="4" fill="#F7C85C" opacity="0.35" />

              {/* Toppings */}
              {/* Chashu Pork (Left) */}
              <g transform="translate(108, 275) rotate(-10)">
                <ellipse cx="0" cy="0" rx="20" ry="12" fill="#C26A42" stroke="#8A4020" strokeWidth="1.5" />
                <path d="M -5 0 Q 0 -5 5 0 Q 0 5 -5 0" fill="none" stroke="#F0C6AD" strokeWidth="1.8" />
              </g>
              {/* Ajitama Egg Half (Right) */}
              <g transform="translate(186, 275) rotate(15)">
                <ellipse cx="0" cy="0" rx="15" ry="10" fill="#FAF6EC" stroke="#C88E68" strokeWidth="1" />
                <ellipse cx="0" cy="0" rx="9" ry="6" fill="#FFB800" />
                <circle cx="-2" cy="-2" r="2.5" fill="#FFF" opacity="0.85" />
              </g>
              {/* Narutomaki Swirl (Top Center) */}
              <g transform="translate(150, 264)">
                <ellipse cx="0" cy="0" rx="12" ry="7" fill="#FAF6EC" stroke="#DCD2C0" strokeWidth="1" />
                <path d="M -4 0 Q 0 -3 4 0 Q 0 3 -4 0" fill="none" stroke="#FF8DA1" strokeWidth="2" />
              </g>
              {/* Green Onions Scallions */}
              <circle cx="135" cy="268" r="3" fill="#58A645" stroke="#356E28" strokeWidth="1" />
              <circle cx="166" cy="282" r="3.5" fill="#58A645" stroke="#356E28" strokeWidth="1" />
              <circle cx="125" cy="285" r="2.5" fill="#58A645" stroke="#356E28" strokeWidth="1" />
            </g>

            {/* ============ MODE SPECIFIC ARMS & NOODLES ============ */}
            {mode === "slurping" ? (
              <g transform="translate(0, 10)">
                {/* Animated Slurping Noodles extending from broth up to her mouth */}
                <g className="animate-slurp">
                  <path d="M 144 275 Q 140 230 147 173" fill="none" stroke="#FCE166" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 148 275 Q 152 230 149 173" fill="none" stroke="#FCE166" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 152 275 Q 148 230 151 173" fill="none" stroke="#FCE166" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 156 275 Q 158 230 153 173" fill="none" stroke="#FCE166" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Noodle shading & broth highlights */}
                  <path d="M 146 270 Q 142 225 148 173" fill="none" stroke="#E5B82A" strokeWidth="1.5" strokeDasharray="6,4" />
                  <path d="M 150 270 Q 154 225 150 173" fill="none" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                  {/* Slurp splash droplets */}
                  <circle cx="138" cy="210" r="2" fill="#FCE166" />
                  <circle cx="164" cy="225" r="2.5" fill="#FCE166" />
                </g>

                {/* Chopsticks lifting the noodles */}
                <path d="M 235 225 L 145 185" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
                <path d="M 240 240 L 145 192" stroke="#B8902A" strokeWidth="4" strokeLinecap="round" />
                
                {/* Right hand gripping chopsticks */}
                <g transform="translate(225, 230) rotate(-20)">
                  <ellipse cx="0" cy="0" rx="14" ry="18" fill="#F3CBA5" stroke="#4E3524" strokeWidth="1.8" />
                  <path d="M -10 -5 Q -15 0 -10 8" fill="none" stroke="#E0AF83" strokeWidth="1.5" />
                </g>

                {/* Floating Slurp Badges */}
                <g className="animate-bounce-gentle">
                  <rect x="30" y="160" rx="12" ry="12" width="68" height="26" fill="#FFF" stroke="#FFB7C5" strokeWidth="2" filter="url(#softShadowFeast)" />
                  <text x="64" y="177" textAnchor="middle" fill="#D96B58" fontSize="11" fontWeight="bold" fontFamily="sans-serif">SLURP! 🍜</text>
                </g>
                <g className="animate-pulse" style={{ animationDelay: "0.4s" }}>
                  <rect x="202" y="145" rx="12" ry="12" width="76" height="26" fill="#FFF" stroke="#FFD700" strokeWidth="2" filter="url(#softShadowFeast)" />
                  <text x="240" y="162" textAnchor="middle" fill="#C87D2B" fontSize="11" fontWeight="bold" fontFamily="sans-serif">SO GOOD! ✨</text>
                </g>
              </g>
            ) : (
              <g transform="translate(0, 10)">
                {/* Chopsticks resting neatly across rim of bowl */}
                <line x1="95" y1="265" x2="205" y2="260" stroke="#D4AF37" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="97" y1="270" x2="207" y2="265" stroke="#B8902A" strokeWidth="3.5" strokeLinecap="round" />

                {/* Hands resting cozily around the warm bowl */}
                <g transform="translate(75, 290)">
                  <ellipse cx="0" cy="0" rx="14" ry="20" fill="#F3CBA5" stroke="#4E3524" strokeWidth="1.8" transform="rotate(25)" />
                  <path d="M -8 -8 C -4 -12 4 -12 8 -8" fill="none" stroke="#E0AF83" strokeWidth="1.5" />
                </g>
                <g transform="translate(225, 290)">
                  <ellipse cx="0" cy="0" rx="14" ry="20" fill="#F3CBA5" stroke="#4E3524" strokeWidth="1.8" transform="rotate(-25)" />
                  <path d="M -8 -8 C -4 -12 4 -12 8 -8" fill="none" stroke="#E0AF83" strokeWidth="1.5" />
                </g>

                {/* Floating Peaceful Bliss Particles */}
                <g className="animate-float">
                  <text x="50" y="150" fontSize="22">💛</text>
                  <text x="230" y="140" fontSize="20">🍥</text>
                  <text x="80" y="100" fontSize="18">✨</text>
                  <text x="210" y="90" fontSize="24">💛</text>
                </g>
                <g className="animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>
                  <text x="35" y="190" fontSize="18">🍜</text>
                  <text x="245" y="180" fontSize="22">✨</text>
                  <text x="150" y="70" fontSize="20">💛</text>
                </g>
              </g>
            )}

            {/* Animated Steam Wisps rising from the broth */}
            <g className="animate-steam" style={{ animationDelay: "0s" }}>
              <path d="M 130 260 Q 125 240 135 220 Q 145 200 135 180" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            </g>
            <g className="animate-steam" style={{ animationDelay: "1.4s" }}>
              <path d="M 170 260 Q 178 240 168 220 Q 158 200 170 180" fill="none" stroke="#FFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.5" />
            </g>
          </g>

          {/* The High Messy Bun ("Pineapple Bun") */}
          <g filter="url(#softShadowFeast)">
            <path d="M 115 56 C 105 35 125 15 150 16 C 175 15 195 35 185 56 Z" fill="#6E4B2F" stroke="#4E3524" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 120 48 Q 135 20 160 25 Q 185 30 175 52 Q 150 40 120 48 Z" fill="#7B5638" stroke="#4E3524" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M 130 35 Q 150 18 170 30 Q 180 42 165 50 Q 145 35 130 35 Z" fill="#8A6240" />
            <path d="M 135 45 Q 150 22 168 32" fill="none" stroke="#B08350" strokeWidth="3" strokeLinecap="round" />
            <path d="M 125 40 Q 140 28 155 38" fill="none" stroke="#C79A64" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 150 20 Q 165 25 175 42" fill="none" stroke="#B08350" strokeWidth="2" strokeLinecap="round" />

            <g fill="none" stroke="#5E3F28" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 130 25 Q 122 12 115 10" />
              <path d="M 138 20 Q 134 8 128 5" />
              <path d="M 148 16 Q 148 4 145 2" />
              <path d="M 158 18 Q 164 6 168 4" />
              <path d="M 168 24 Q 178 12 184 12" />
              <path d="M 175 32 Q 188 22 195 24" />
              <path d="M 120 34 Q 108 26 102 28" />
            </g>
            <g fill="none" stroke="#B08350" strokeWidth="1.8" strokeLinecap="round">
              <path d="M 135 22 Q 128 10 122 7" />
              <path d="M 152 17 Q 156 6 158 3" />
              <path d="M 164 21 Q 174 10 178 9" />
              <path d="M 118 30 Q 110 22 106 24" />
            </g>
          </g>
        </svg>
      </div>

      {/* Dynamic Caption Banner */}
      {!readOnly && (
        <div className="px-2 text-center">
          {mode === "slurping" ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-heading font-extrabold text-xs sm:text-sm shadow-sm animate-pulse border border-amber-300">
              <Utensils className="w-4 h-4 text-amber-700 animate-bounce" />
              <span>🥢 Slurping up the special birthday ramen... So delicious! 🍜</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-heading font-extrabold text-xs sm:text-sm shadow-sm animate-bounce-gentle border border-emerald-300">
              <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600 animate-pulse" />
              <span>🍜 Smiling at peace... Warm broth, good friends, perfect birthday! ✨</span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Controls & Continuation Button */}
      {!readOnly && (
        <div className="space-y-4 pt-2 w-full max-w-md mx-auto">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSlurp}
              className={`px-4 py-2 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                mode === "slurping"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white scale-105 ring-2 ring-amber-300 shadow-amber-500/20"
                  : "bg-white/90 text-reef hover:bg-white border border-sunset/40 hover:scale-105"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Slurp Noodles 🥢</span>
            </button>

            <button
              onClick={handlePeace}
              className={`px-4 py-2 rounded-xl font-heading font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                mode === "peace"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white scale-105 ring-2 ring-emerald-300 shadow-emerald-500/20"
                  : "bg-white/90 text-reef hover:bg-white border border-sunset/40 hover:scale-105"
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Smile at Peace 😌✨</span>
            </button>
          </div>

          {onFinish && (
            <div className="pt-2">
              <button
                onClick={onFinish}
                className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-coral via-sunset to-coral hover:opacity-95 text-white font-heading text-base sm:text-lg font-extrabold shadow-xl shadow-coral/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 border-2 border-white animate-pulse"
              >
                <span>Finish Bowl & Celebrate 💛</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
