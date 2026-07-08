"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "/images/campus-1.jpeg",
  "/images/campus-2.jpeg",
  "/images/happy-loving-couple-bakers-drinking-coffee-looking-notebook.jpg",
  "/images/happy-waitress-giving-coffee-customers-while-serving-them-coffee-shop.jpg",
];

const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="section_inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === current ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}

      <div
        className="absolute inset-0 bg-gradient-to-b from-cafta-dark/80 via-cafta-dark/60 to-cafta-dark/90"
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-24 text-center">
        <p className="section-eyebrow animate-fade-in">Bem vindo!</p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mt-3 mb-6 animate-slide-up">
          SITE <span className="text-cafta-gold">CAFTA</span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in">
          Um{" "}
          <em className="text-cafta-gold-light not-italic">acervo digital</em>{" "}
          da História — fotos, vídeos e produções acadêmicas do curso de
          História da UFC.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#section_sobre" className="btn-cafta-outline">
            Sobre nós
          </a>
          <a href="#section_pesquisas" className="btn-cafta-primary">
            Ver pesquisas
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-cafta-gold w-8"
                : "bg-white/30 w-4 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
