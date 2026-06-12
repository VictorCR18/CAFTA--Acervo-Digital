# Especificação Técnica: Gerenciamento de Pesquisas Acadêmicas

## 1. Contexto e Problema
O CAFTA possui uma seção "Produções acadêmicas" na página inicial que exibe pesquisas dos membros. Atualmente, essas pesquisas são exibidas estaticamente através do componente `PesquisasSection` no homepage, mas não há uma interface administrativa para gerenciamento dessas publicações.

É necessário criar uma funcionalidade de administração que permita:
- Visualizar a lista de pesquisas cadastradas
- Criar novas pesquisas
- Editar pesquisas existentes
- Excluir pesquisas
- Buscar pesquisas por título

Esta funcionalidade deve se integrar ao painel administrativo existente, seguindo os mesmos padrões de UI/UX dos módulos de acervo e moderação.

## 2. Objetivos
- Criar um módulo completo de gerenciamento de pesquisas no painel admin
- Manter consistência visual e de interação com as páginas existentes de acervo e moderação
- Implementar todas as operações CRUD (Criar, Ler, Atualizar, Excluir)
- Fornecer interface de busca por título
- Utilizar dados mock inicialmente, com estrutura pronta para migração para API real
- Garantir validação de campos e tratamento adequado de estados (loading, error, empty)

## 3. Solução Proposta

### 3.1 Arquitetura
Módulo independente siguiendo os padrões estabelecidos:
```
/src
  /app
    /admin
      /pesquisas
        page.tsx              # Lista com busca
        /[id]
          edit/page.tsx       # Edição
        new/page.tsx          # Criação
  /components
    PesquisaForm.tsx          # Formulário específico
  /lib
    usePesquisas.ts           # Hook customizado
```

### 3.2 Componentes Principais

#### Hook `usePesquisas.ts`
- Gerencia estado: `data` (Pesquisa[]), `loading`, `error`
- Inicializa com `PESQUISAS_SAMPLE` do constants.ts
- Simula delay de API (500ms) em todas as operações
- Fornece funções: `getPesquisas()`, `createPesquisa()`, `updatePesquisa()`, `deletePesquisa()`
- Busca implementada via estado local na página de lista

#### Formulário `PesquisaForm.tsx`
- Campos:
  - Título (texto obrigatório)
  - Autores (texto obrigatório, converte para array)
  - Ano (number obrigatório, validação 1900-ano atual)
  - Link (texto opcional, validação URL básica)
  - Destaque (checkbox obrigatório)
- Validação client-side com mensagens em português brasileiro
- Estado local para controle de valores
- Loading state durante submit
- Tratamento de erros com alert por enquanto

#### Página Lista `/admin/pesquisas/page.tsx`
- Header padrão admin (igual a acervo e moderação)
- Barra de busca por título (filtro case-insensitive)
- Lista simples de pesquisas (cards ou lista vertical)
- Cada item exibe: título, autores, ano, badge de destaque, ícone de link (se existir)
- Botões de ação: Editar, Excluir
- Estados: loading, error, empty state ("Nenhuma pesquisa encontrada")
- Link para criação: "Nova Pesquisa"

#### Páginas CRUD
- **Nova** (`/admin/pesquisas/new`): Formulário vazio
- **Editar** (`/admin/pesquisas/[id]/edit`): Formulário pré-preenchido
- Após submit: redirect para lista com alert de sucesso
- Loading state durante operações
- Tratamento de erros com alert

### 3.3 Atualização do Dashboard
No `/app/admin/page.tsx`:
- Adicionar terceiro card: "Gerenciamento de Pesquisas"
- Ícone acadêmico (livro/graduação)
- Contagem dinâmica: `{pesquisas.length}`
- Descrição: "Visualize, edite e gerencie as publicações acadêmicas"
- Link para `/admin/pesquisas`

### 3.4 Estado e Persistência
- Dados em memória usando `PESQUISAS_SAMPLE` como fonte inicial
- Todas operações modificam estado local do hook
- Recarregamento reseta para estado inicial (como outros módulos)
- Estrutura pronta para substituição por API real (modificar apenas implementação do hook)

### 3.5 Segurança e Validação
- Validação client-side em todos os campos
- Prevenção de XSS através do échapper padrão do React/Next.js
- Sanitização básica de URLs para campo link
- Mensagens de erro amigáveis em português brasileiro
- Estado loading em operações assíncronas

### 3.6 Responsividade e Acessibilidade
- Layout adaptável para diferentes telas
- Componentes seguem padrões existentes de espaçamento e tipografia
- Navegação por teclado suportada
- Foco visível em elementos interativos
- Contraste adequado seguindo tema existente

## 4. Alternativas Consideradas

### 4.1 Extensão do Sistema de Acervo
- **Descrição**: Adaptar `AcervoForm` e `useAcervoItems` para lidar também com pesquisas
- **Prós**: Menos arquivos novos, reutilização máxima
- **Contras**: Alto acoplamento entre funcionalidades distintas, formulário complexo com lógica condicional, viola SRP
- **Rejeitada por**: Comprometer manutenibilidade e clareza de responsabilidades

### 4.2 Aproveitar PesquisasSection Existente
- **Descrição**: Basear administração na `PesquisasSection` do homepage adicionando ações inline
- **Prós**: Implementação inicial mais rápida, reaproveita design aprovado
- **Contras**: Menos padronizado com admin, interface de edição menos ideal, dificuldade de expansão futura
- **Rejeitada por**: Inconsistência na experiência de usuário admin e menor escalabilidade

### 4.3 Implementação Mínima com Modal
- **Descrição**: Lista de pesquisas com modais para criação/edição
- **Prós**: Boa experiência de usuário, foco no contexto
- **Contras**: Mais complexo inicialmente, requer gerenciamento de estado de modais
- **Considerada, mas**: A abordagem escolhida oferece melhor separação de preocupações e segue padrões estabelecidos

## 5. Decisão
Escolhida a **Abordagem 1: Implementação Customizada Completa** porque:
- Segue exatamente os padrões estabelecidos (acervo, moderação)
- Oferece melhor separação de responsabilidades e manutenibilidade
- É facilmente expansível para futuras funcionalidades
- Mantém consistência na experiência de usuários do admin
- Facilita testes unitários e integração
- Pode ser migrado suavemente para API real quando necessário

## 6. Perguntas Abertas
Nenhuma em aberto - todos os aspectos foram definidos com base nas respostas do usuário durante o brainstorming.

## 7. Notas de Implementação
1. **Sequência sugerida**:
   - Criar `lib/usePesquisas.ts`
   - Criar `components/PesquisaForm.tsx`
   - Criar páginas de administração (`/app/admin/pesquisas/`)
   - Atualizar `/app/admin/page.tsx` com novo card
   - Atualizar imports e exports conforme necessário

2. **Pontos de atenção**:
   - Converter string de autores para array (split por ';' e trim)
   - Validar ano como número inteiro dentro de faixa razoável
   - Validar link com expressão regular básica para http/https
   - Manter consistência de estilos com arquivos existentes
   - Usar mesmas cores e variáveis do tema (bg-cafta-dark, text-white, etc.)

3. **Próximos passos após implementação**:
   - Substituir alert por sistema de toast/notificação
   - Implementar paginação se quantidade de pesquisas crescer significativamente
   - Adicionar filtro por ano ou destaque
   - Preparar hook para consumo de API real (substituir mock por fetch)

---
*Especificação escrita em conformidade com o processo de brainstorming do CAFTA site. Aprovada para início da implementação.*