# Redesign do Dashboard Administrativo - CAFTA Site

## Visão Geral

Este documento descreve a redesign da página principal do painel administrativo (`/admin`) do site CAFTA, transformando-o em um verdadeiro painel de controle com cartões funcionais que servem como pontos de entrada para as diferentes áreas administrativas.

## Motivação

Atualmente, a página `/admin` exibe diretamente a lista de mídia pendente para aprovação, o que:
1. Não fornece uma visão clara de todas as funções administrativas disponíveis
2. Mistura resumo/painel de controle com interface de ação detalhada
3. Não é escalável para adicionar novas ferramentas administrativas
4. Não segue as melhores práticas de UX para painéis de controle

A redesign propõe separar as preocupações:
- `/admin` → Painel de controle com visões resumidas e navegação
- `/admin/moderacao` → Página dedicada para aprovação de mídia (funcionalidade atual)
- `/admin/acervo` → Página existente para gerenciamento do acervo histórico (permanece inalterada)

## Arquitetura e Componentes

### Estrutura de Páginas

```
/admin                    → Dashboard administrativo (painel de controle)
/admin/moderacao          → Aprovação e gerenciamento de mídia pendente
/admin/acervo             → Visualização, edição e adição de itens do acervo
/admin/acervo/new         → Formulário para novo item do acervo
/admin/acervo/[id]/edit   → Formulário para edição de item do acervo
/admin/login              → Página de login (permanece inalterada)
```

### Layout do Dashboard (`/admin`)

O dashboard consistirá em:
1. **Cabeçalho** mantendo a identidade visual atual
2. **Grid responsivo de cartões** (2 cards por linha em desktop, 1 card por linha em mobile)
3. **Rodapé opcional** com links úteis ou informações do sistema

### Design dos Cartões

Cada cartão seguirá este padrão:

```
+------------------------------------------+
| [Ícone]                                  |
|                                          |
| TÍTULO                                   |
| Descrição curta da função                |
|                                          |
| [Contagem] [Rótulo da contagem]          |
|                                          |
| [Indicação visual de clicabilidade]      |
+------------------------------------------+
```

#### Cartão 1: Aprovação de Mídia
- **Título**: "Aprovação de Mídia"
- **Descrição**: "Revise e aprove ou rejeite submissões de mídia"
- **Rótulo da Contagem**: "Itens pendentes de aprovação"
- **Ícone**: Representação visual de mídia (pode ser um ícone genérico de arquivo ou combinações de imagem/vídeo/documento)
- **Ação ao clicar**: Navega para `/admin/moderacao`
- **Estilo**: Hover effect, soma elevado, cursor de apontador

#### Cartão 2: Gerenciamento do Acervo
- **Título**: "Gerenciamento do Acervo"
- **Descrição**: "Visualize, edite e gerencie itens do acervo histórico"
- **Rótulo da Contagem**: "Total de itens no acervo"
- **Ícone**: Representação visual de arquivo histórico ou biblioteca
- **Ação ao clicar**: Navega para `/admin/acervo` (mantém comportamento atual)
- **Estilo**: Hover effect, soma elevado, cursor de apontador

### Funcionalidades e Comportamentos

#### Contagens Dinâmicas
- A contagem de "Itens pendentes de aprovação" será obtida dos mesmos dados atualmente usados no dashboard (arquivos pendentes)
- A contagem de "Total de itens no acervo" será obtida do mesmo dado usado na página `/admin/acervo` (itens totais do mockAcervoData ou API)
- Ambas as contagens serão atualizadas em tempo real ou com cache adequado

#### Responsividade
- Desktop (≥ 1024px): Grid de 2 colunas (cards lado a lado)
- Tablet e Mobile (< 1024px): Grid de 1 coluna (cards empilhados verticalmente)
- Espaçamento consistente entre cards (gap-responsive)

#### Acessibilidade
- Cards serão elementos `<Link>` ou `<button>` com role apropriado
- Contraste de cores atendendo às diretrizes WCAG
- Foco visível para navegação por teclado
- Textos alternativos para ícones (se aplicável)

### Fluxo de Dados

1. **Dashboard (`/admin`)**:
   - Busca contagem de itens pendentes (mesmo endpoint/logica atualmente usada)
   - Busca contagem total de itens no acervo (mesmo endpoint/logica da página `/admin/acervo`)
   - Renderiza cards com essas contagens

2. **Página de Moderação (`/admin/moderacao`)**:
   - Reutiliza exatamente a lógica atual de busca e display de arquivos pendentes
   - Mantém as funções de aprovar/rejeitar
   - Pode ser otimizada posteriormente sem afetar o dashboard

## Tratamento de Erros e Edge Cases

### Estados de Loading
- Enquanto as contagens estão sendo carregadas, exibir esqueleto de carregamento (skeleton cards)
- Manter o mesmo comportamento de loading atual para consistência

### Estados Vazios
- Se não houver itens pendentes: mostrar "0" na contagem do cartão de mídia
- Se não houver itens no acervo: mostrar "0" na contagem do cartão do acervo
- Nenhum estado vazio especial é necessário nos cards (0 é um valor válido e informativo)

### Erros de Carregamento
- Em caso de falha ao buscar contagens, exibir um estado de erro nos cards afetados
- Manter tentações automáticas ou permitir refresh manual
- Logar erros para debugging sem expor detalhes técnicos ao usuário

## Considerações de Implementação

### Reutilização de Código
- A lógica de busca de arquivos pendentes será extraída para um hook ou utility compartilhado entre:
  * Dashboard (para contagem)
  * Página de moderação (para lista completa)
- A lógica de contagem de itens do acervo pode ser reutilizada ou adaptada da página atual

### Tecnologias e Estilos
- Manter o mesmo stack de tecnologias (Next.js, React, Tailwind CSS)
- Seguir os mesmos padrões de componentes e estilos já estabelecidos no projeto
- Utilizar os mesmos tokens de cores e espaçamento já definidos

### Testes
- Testes unitários para validar:
  * Renderização correta dos cards com diferentes contagens
  * Navegação correta ao clicar nos cards
  * Comportamento responsivo
- Testes de integração para verificar:
  * Busca correta de contagens das fontes de dados
  * Atualização dinâmica quando dados mudam

## Impacto e Migração

### Mudanças no Comportamento do Usuário
- **Antes**: Usuário logado no admin vê diretamente a lista de mídia pendente
- **Depois**: Usuário logado no admin vê o dashboard com dois cartões; deve clicar no cartão de mídia para ver a lista pendente

### Benefícios
1. **Claridade**: Divisão clara entre visão resumida (dashboard) e ação detalhada (páginas específicas)
2. **Escalabilidade**: Fácil adicionar novos cartões para novas funções administrativas
3. **Performance**: Potencial para carregar apenas contagens leves no dashboard, reservando cargas pesadas para páginas de detalhe
4. **UX**: Segue padrão estabelecido de painéis de controle (visão geral primeiro, detalhes sob demanda)

### Esforço de Implementação
- **Baixo a Médio**: Principalmente envolve reorganização de código existente
- **Aproveitamento Máximo**: Reutiliza 90%+ do código atual, apenas reorganizando
- **Risco Baixo**: Mudanças são principalmente de apresentação e navegação, não de lógica de negócio crítica

## Próximos Passos

Após aprovação deste design, o próximo passo será:
1. Criar o plano de implementação detalhado usando a skill `writing-plans`
2. Implementar as mudanças siguiendo o plano aprovado
3. Testar e validar o comportamento
4. Fazer deploy e monitorar métricas de uso

---
*Design criado em 11 de junho de 2026 para o projeto CAFTA Site.*