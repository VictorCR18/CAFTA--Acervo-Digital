import type { AcervoItem } from '@/types'

export const mockAcervoData: AcervoItem[] = [
  {
    id: '1',
    title: 'Carta de Frei Tito de Alencar',
    description: 'Uma carta escrita pelo frei Tito de Alencar discutindo a abolição da escravidão no Ceará.',
    categoryId: 'documentos',
    historicalPeriod: 'Século XIX',
    authorship: 'Frei Tito de Alencar',
    fileUrl: '/uploads/documentos/pending/1234567890_carta.pdf',
    publicationDate: '1888-05-13',
  },
  {
    id: '2',
    title: 'Fotografia da Greve de 1917',
    description: 'Fotografia histórica da greve operária de 1917 em Fortaleza, mostrando trabalhadores em frente à Alfândega.',
    categoryId: 'imagens',
    historicalPeriod: 'Início do Século XX',
    authorship: 'Desconhecido',
    fileUrl: '/uploads/imagens/pending/1234567891_greve1917.jpg',
    publicationDate: '1917-08-15',
  },
  {
    id: '3',
    title: 'Áudio do Discurso de Getúlio Vargas',
    description: 'Registro de áudio do discurso de Getúlio Vargas durante a Revolução de 1930, armazenado em formato digital.',
    categoryId: 'videos',
    historicalPeriod: 'Revolução de 1930',
    authorship: 'Getúlio Vargas',
    fileUrl: '/uploads/videos/pending/1234567892_vargas.mp4',
    publicationDate: '1930-11-03',
  },
  {
    id: '4',
    title: 'Mapa Antigo do Ceará',
    description: 'Mapa cartográfico do Ceará do século XVIII, mostrando as capitanias e rotas comerciais da época.',
    categoryId: 'documentos',
    historicalPeriod: 'Século XVIII',
    authorship: 'Cartógrafo Anônimo',
    fileUrl: '/uploads/documentos/pending/1234567893_mapa.pdf',
    publicationDate: '1750-01-01',
  },
]