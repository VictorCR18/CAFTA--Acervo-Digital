import type { NavItem, CategoriaAcervo, Pesquisa } from '@/types'

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Início', href: '#section_inicio', sectionId: 'section_inicio' },
  { label: 'Sobre nós', href: '#section_sobre', sectionId: 'section_sobre' },
  { label: 'Acervo', href: '#section_acervo', sectionId: 'section_acervo' },
  { label: 'Pesquisas', href: '#section_pesquisas', sectionId: 'section_pesquisas' },
  { label: 'Contato', href: '#section_contato', sectionId: 'section_contato' },
]

// ─── Acervo Categories ────────────────────────────────────────────────────────

export const CATEGORIAS_ACERVO: CategoriaAcervo[] = [
  {
    slug: 'eventos',
    titulo: 'Eventos',
    descricao: 'Mesas, palestras, atividades e mais.',
    imagemSrc: '/images/team/portrait-elegant-old-man-wearing-suit.jpg',
    imagemAlt: 'Eventos do CAFTA',
  },
  {
    slug: 'geras',
    titulo: 'Geras',
    descricao: 'Confundindo sextas com o fim do mundo.',
    imagemSrc: '/images/team/cute-korean-barista-girl-pouring-coffee-prepare-filter-batch-brew-pour-working-cafe.jpg',
    imagemAlt: 'Geras do CAFTA',
  },
  {
    slug: 'assembleias',
    titulo: 'Assembleias',
    descricao: 'Comunicação entre os estudantes e o CAFTA.',
    imagemSrc: '/images/team/small-business-owner-drinking-coffee.jpg',
    imagemAlt: 'Assembleias do CAFTA',
  },
  {
    slug: 'cultura-esporte',
    titulo: 'Cultura e Esporte',
    descricao: 'Oficinas, campeonatos, apresentações e mais.',
    imagemSrc: '/images/team/smiley-business-woman-working-cashier.jpg',
    imagemAlt: 'Cultura e esporte no CAFTA',
  },
]

// ─── Sample Pesquisas ─────────────────────────────────────────────────────────

export const PESQUISAS_SAMPLE: Pesquisa[] = [
  {
    id: '1',
    title: 'Impacto das Tecnologias Educacionais na Aprendizagem de Línguas Indígenas',
    titulo: 'Impacto das Tecnologias Educacionais na Aprendizagem de Línguas Indígenas',
    authors: ['Dr. Ana Silva', 'Prof. Carlos Santos', 'Dra. Maria Oliveira'],
    autores: ['Dr. Ana Silva', 'Prof. Carlos Santos', 'Dra. Maria Oliveira'],
    year: 2024,
    ano: 2024,
    link: 'https://doi.org/10.1000/educacao-indigena-2024',
    destaque: true,
  },
  {
    id: '2',
    title: 'Análise Histórica dos Movimentos Estudantis no Ceará (1960-1980)',
    titulo: 'Análise Histórica dos Movimentos Estudantis no Ceará (1960-1980)',
    authors: ['Prof. João Pereira', 'Dra. Luciana Ferreira'],
    autores: ['Prof. João Pereira', 'Dra. Luciana Ferreira'],
    year: 2023,
    ano: 2023,
    link: 'https://periodicos.ufc.br/revistahistorica/article/view/12345',
    destaque: false,
  },
  {
    id: '3',
    title: 'Sustentabilidade na Gestão de Resíduos Sólidos em Municípios do Semiárido',
    titulo: 'Sustentabilidade na Gestão de Resíduos Sólidos em Municípios do Semiárido',
    authors: ['Eng. Fernando Costa', 'Dra. Isabela Almeida', 'Prof. Roberto Lima'],
    autores: ['Eng. Fernando Costa', 'Dra. Isabela Almeida', 'Prof. Roberto Lima'],
    year: 2023,
    ano: 2023,
    link: null,
    destaque: true,
  },
  {
    id: '4',
    title: 'Métodos Quantitativos na Avaliação de Políticas Públicas de Educação',
    titulo: 'Métodos Quantitativos na Avaliação de Políticas Públicas de Educação',
    authors: ['Dra. Sofia Rocha', 'Prof. Eduardo Mendes'],
    autores: ['Dra. Sofia Rocha', 'Prof. Eduardo Mendes'],
    year: 2022,
    ano: 2022,
    link: 'https://repositorio.ufc.br/handle/ri/67890',
    destaque: false,
  },
  {
    id: '5',
    title: 'Preservação de Tradições Orais em Comunidades Ribeirinhas do Amazonas',
    titulo: 'Preservação de Tradições Orais em Comunidades Ribeirinhas do Amazonas',
    authors: ['Profa. Carla Novais', 'Dr. Diego Silva', 'MSc. Elena Santos'],
    autores: ['Profa. Carla Novais', 'Dr. Diego Silva', 'MSc. Elena Santos'],
    year: 2022,
    ano: 2022,
    link: 'https://www.scielo.br/j/antropologia/a/abc123/',
    destaque: false,
  },
  {
    id: '6',
    title: 'Inovação Pedagógica na Educação Profissional e Tecnológica',
    titulo: 'Inovação Pedagógica na Educação Profissional e Tecnológica',
    authors: ['Prof. Marcos Alves', 'Dra. Patricia Nunes'],
    autores: ['Prof. Marcos Alves', 'Dra. Patricia Nunes'],
    year: 2021,
    ano: 2021,
    link: null,
    destaque: true,
  },
]

// ─── Contact Info ─────────────────────────────────────────────────────────────

export const CONTATO = {
  email: 'apeledahistória@gmail.com',
  instagram: '@cafta.ufc',
  instagramUrl: 'https://instagram.com/cafta.ufc',
  telefone: '(85) 9999-9999',
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

export const HERO_SLIDES = [
  '/images/slides/campus-1.jpg',
  '/images/slides/campus-2.jpg',
  '/images/barman-with-fruits.jpg',
  '/images/happy-loving-couple-bakers-drinking-coffee-looking-notebook.jpg',
]

// ─── Upload Settings ──────────────────────────────────────────────────────────

export const UPLOAD_ALLOWED_TYPES = {
  imagens: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  artigos: [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const

export const UPLOAD_MAX_SIZE_MB = 50
