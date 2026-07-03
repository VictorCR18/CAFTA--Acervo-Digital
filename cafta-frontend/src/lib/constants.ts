// ─── Navigation ───────────────────────────────────────────────────────────────
import { CategoriaAcervo, NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "#section_inicio", sectionId: "section_inicio" },
  { label: "Sobre nós", href: "#section_sobre", sectionId: "section_sobre" },
  { label: "Acervo", href: "#section_acervo", sectionId: "section_acervo" },
  {
    label: "Pesquisas",
    href: "#section_pesquisas",
    sectionId: "section_pesquisas",
  },
  { label: "Contato", href: "#section_contato", sectionId: "section_contato" },
];

// ─── Acervo Categories ────────────────────────────────────────────────────────

export const CATEGORIAS_ACERVO: CategoriaAcervo[] = [
  {
    slug: "eventos",
    titulo: "Eventos",
    descricao: "Mesas, palestras, atividades e mais.",
    imagemSrc: "/images/team/portrait-elegant-old-man-wearing-suit.jpg",
    imagemAlt: "Eventos do CAFTA",
  },
  {
    slug: "geras",
    titulo: "Geras",
    descricao: "Confundindo sextas com o fim do mundo.",
    imagemSrc:
      "/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg",
    imagemAlt: "Geras do CAFTA",
  },
  {
    slug: "assembleias",
    titulo: "Assembleias",
    descricao: "Comunicação entre os estudantes e o CAFTA.",
    imagemSrc: "/images/team/small-business-owner-drinking-coffee.jpg",
    imagemAlt: "Assembleias do CAFTA",
  },
  {
    slug: "cultura-esporte",
    titulo: "Cultura e Esporte",
    descricao: "Oficinas, campeonatos, apresentações e mais.",
    imagemSrc: "/images/team/smiley-business-woman-working-cashier.jpg",
    imagemAlt: "Cultura e esporte no CAFTA",
  },
];

export const CATEGORY_COLORS: Record<string, string> = {
  eventos: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  geras: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  assembleias: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "cultura-esporte": "bg-green-500/20 text-green-300 border-green-500/30",
};

// ─── Contact Info ─────────────────────────────────────────────────────────────

export const CONTATO = {
  email: "apeledahistória@gmail.com",
  instagram: "@cafta.ufc",
  instagramUrl: "https://instagram.com/cafta.ufc",
  telefone: "(85) 9999-9999",
};

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export const HERO_SLIDES = [
  "/images/slides/campus-1.jpg",
  "/images/slides/campus-2.jpg",
  "/images/barman-with-fruits.jpg",
  "/images/happy-loving-couple-bakers-drinking-coffee-looking-notebook.jpg",
];

// ─── Upload Settings ──────────────────────────────────────────────────────────

export const UPLOAD_ALLOWED_TYPES = {
  imagens: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  videos: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  artigos: [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const UPLOAD_MAX_SIZE_MB = 50;
