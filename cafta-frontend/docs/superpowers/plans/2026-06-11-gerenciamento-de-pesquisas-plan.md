# Plano de Implementação: Gerenciamento de Pesquisas Acadêmicas

## Objetivo
Implementar o módulo de gerenciamento de pesquisas acadêmicas conforme especificação em `docs/superpowers/specs/2026-06-11-gerenciamento-de-pesquisas-design.md`

## Sequência de Implementação

### Fase 1: Preparação e Estrutura Base
1. Criar diretório `src/app/admin/pesquisas/`
2. Criar arquivo `src/lib/usePesquisas.ts` (hook customizado)
3. Criar arquivo `src/components/PesquisaForm.tsx` (formulário específico)
4. Testar componentes isoladamente com histórias mock

### Fase 2: Páginas de Administração
5. Criar `src/app/admin/pesquisas/page.tsx` (lista com busca)
6. Criar `src/app/admin/pesquisas/new/page.tsx` (página de criação)
7. Criar `src/app/admin/pesquisas/[id]/edit/page.tsx` (página de edição)
8. Implementar navegação entre páginas usando `next/navigation`

### Fase 3: Integração e Atualizações
9. Atualizar `src/app/admin/page.tsx` para adicionar novo card "Gerenciamento de Pesquisas"
10. Atualizar imports e exports conforme necessário
11. Testar fluxo completo: lista → criar → editar → excluir → buscar

### Fase 4: Refinamento e Qualidade
12. Implementar tratamento de estados loading e error
13. Adicionar validação de campos com mensagens em português
14. Testar responsividade e acessibilidade básica
15. Verificar consistência visual com acervo e moderação

## Tarefas Detalhadas

### Tarefa 1: Hook usePesquisas.ts
- [ ] Criar arquivo `src/lib/usePesquisas.ts`
- [ ] Implementar estado com `useState`: data, loading, error
- [ ] Inicializar com `PESQUISAS_SAMPLE` do constants
- [ ] Implementar função `getPesquisas()` com simulação de delay
- [ ] Implementar função `createPesquisa()` com geração de ID temporário
- [ ] Implementar função `updatePesquisa()` por ID
- [ ] Implementar função `deletePesquisa()` por ID
- [ ] Todos os métodos devem simular delay de 500ms
- [ ] Tratamento de erro com try/catch
- [ ] Exportar hook como função padrão

### Tarefa 2: Componente PesquisaForm.tsx
- [ ] Criar arquivo `src/components/PesquisaForm.tsx`
- [ ] Definir interface props: `onSubmitSuccess`, `initialData?`
- [ ] Implementar estado local para todos os campos do formulário
- [ ] Campos:
  - title: string (obrigatório)
  - authors: string (obrigatório, será convertido para array)
  - year: number (obrigatório, validação 1900-ano atual)
  - link: string (opcional, validação URL)
  - featured: boolean (obrigatório)
- [ ] Implementar validação client-side:
  - Título: não vazio
  - Autores: não vazio, converte para array trimando
  - Ano: número inteiro, min 1900, max ano atual
  - Link: se preenchido, deve começar com http:// ou https://
  - Destaque: obrigatório (checkbox)
- [ ] Implementar função handleSubmit:
  - Prevenir comportamento padrão do formulário
  - Validar todos os campos
  - Converter autores string para array
  - Chamar função apropiada do hook (create ou update)
  - Handling loading state
  - Chame onSubmitSuccess com dados se bem-sucedido
  - Tratamento de erro com alert
- [ ] Implementar loading state em botão submit
- [ ] Implementar reset de erros ao digitar nos campos
- [ ] Estilizar conforme padrões existentes (igual a AcervoForm)
- [ ] Exportar componente como padrão

### Tarefa 3: Página Lista - /app/admin/pesquisas/page.tsx
- [ ] Criar arquivo `src/app/admin/pesquisas/page.tsx`
- [ ] Implementar header padrão admin (igual a acervo/moderacao)
- [ ] Usar hook `usePesquisas` para obter dados
- [ ] Implementar estado local para termo de busca
- [ ] Implementar filtragem case-insensitive por título
- [ ] Renderizar lista simples de pesquisas
- [ ] Cada item de lista deve mostrar:
  - Título
  - Autores (joined por ', ')
  - Ano
  - Badge de destaque (se featured = true)
  - Ícone de link (se link existir)
- [ ] Botões de ação por item:
  - Editar: navega para `/admin/pesquisas/[id]/edit`
  - Excluir: chama deletePesquisa e mostra alert de confirmação
- [ ] Estados de loading e error com componentes reutilizáveis
- [ ] Empty state: "Nenhuma pesquisa encontrada"
- [ ] Link para página de criação: "Nova Pesquisa" -> `/admin/pesquisas/new`
- [ ] Implementar debounce ou atualização em tempo real da busca
- [ ] Exportar página como padrão

### Tarefa 4: Página de Criação - /app/admin/pesquisas/new/page.tsx
- [ ] Criar arquivo `src/app/admin/pesquisas/new/page.tsx`
- [ ] Implementar header padrão admin
- [ ] Título: "Nova Pesquisa"
- [ ] Descrição: "Adicione uma nova publicação acadêmica"
- [ ] Usar componente `PesquisaForm` sem initialData
- [ ] Implementar função handleSubmitSuccess:
  - Mostrar alert "Pesquisa criada com sucesso!"
  - Redirecionar para `/admin/pesquisas`
- [ ] Link de voltar: "Volta ao painel" -> `/admin`
- [ ] Exportar página como padrão

### Tarefa 5: Página de Edição - /app/admin/pesquisas/[id]/edit/page.tsx
- [ ] Criar arquivo `src/app/admin/pesquisas/[id]/edit/page.tsx`
- [ ] Implementar header padrão admin
- [ ] Usar hook `useParams` para obter id
- [ ] Usar hook `usePesquisas` para obter dados
- [ ] Buscar pesquisa por id nos dados do hook
- [ ] Se não encontrada: redirecionar para `/admin/pesquisas`
- [ ] Implementar loading state enquanto busca dados
- [ ] Usar componente `PesquisaForm` com initialData da pesquisa encontrada
- [ ] Implementar função handleSubmitSuccess:
  - Mostrar alert "Pesquisa atualizada com sucesso!"
  - Redirecionar para `/admin/pesquisas`
- [ ] Link de voltar: "Volta ao pesquisas" -> `/admin/pesquisas`
- [ ] Exportar página como padrão

### Tarefa 6: Atualização do Dashboard - /app/admin/page.tsx
- [ ] Editar arquivo `src/app/admin/page.tsx`
- [ ] Adicionar terceiro card no grid existente
- [ ] Card deve ter:
  - Ícone acadêmico (usar SVG similar aos outros cards)
  - Título: "Gerenciamento de Pesquisas"
  - Descrição: "Visualize, edite e gerencie as publicações acadêmicas"
  - Contagem dinâmica: `{pesquisas.length}` (do hook usePesquisas)
  - Link para `/admin/pesquisas`
  - Estilo idêntico aos outros cards (hover, bordas, etc.)
- [ ] Importar hook `usePesquisas` para obter contagem
- [ ] Testar que contagem atualiza quando pesquisas são adicionadas/removidas

### Tarefa 7: Testes e Validação
- [ ] Testar fluxo completo de criação:
  - Navegar para `/admin/pesquisas/new`
  - Preencher todos os campos corretamente
  - Submeter formulário
  - Verificar alert de sucesso
  - Verificar redirecionamento para lista
  - Verificar pesquisa na lista
- [ ] Testar fluxo de edição:
  - Clicar em editar em uma pesquisa existente
  - Verificar formulário pré-preenchido
  - Modificar alguns campos
  - Submeter
  - Verificar alert de sucesso e atualização na lista
- [ ] Testar exclusão:
  - Clicar em excluir em uma pesquisa
  - Verificar alert de confirmação (usar window.confirm ou similar)
  - Verificar remoção da lista
- [ ] Testar busca:
  - Digitar termo na barra de busca
  - Verificar filtragem em tempo real
  - Testar com termos que existem e não existem
  - Verificar limpeza da busca
- [ ] Testar validação:
  - Tentar submeter com título vazio -> erro de validação
  - Tentar submeter com ano inválido -> erro de validação
  - Tentar submeter com link malformado -> erro de validação
  - Verificar que erros somem ao corrigir campos
- [ ] Testar estados loading:
  - Verificar spinner durante operações
  - Verificar botão desabilitado durante submit
- [ ] Testar responsividade básica em diferentes tamanhos de tela
- [ ] Verificar consistência de cores, espaçamento e tipografia com acervo/moderação

## Critérios de Aceitação
- [ ] Todas as operações CRUD funcionam com dados mock
- [ ] Interface consistente com acervo e moderação (cores, espaçamento, tipografia)
- [ ] Validação de campos funcionando com mensagens em português
- [ ] Estados loading e error tratados adequadamente
- [ ] Busca por título funcionando em tempo real
- [ ] Navegação entre páginas funcionando corretamente
- [ ] Contagem no dashboard atualizando dinamicamente
- [ ] Cabeçalho padrão admin presente em todas as páginas
- [ ] Layout responsivo em telas móveis e desktop
- [ ] Nenhum erro de console durante uso normal

## Estimativa de Tempo
- Fase 1 (Hook e Formulário): 2-3 horas
- Fase 2 (Páginas): 3-4 horas
- Fase 3 (Integração): 1-2 horas
- Fase 4 (Testes e Refinamento): 2-3 horas
- **Total estimado**: 8-12 horas

## Próximos Passos Após Esta Implementação
1. Substituir alert por sistema de toast/notificação mais sofisticado
2. Implementar paginação se a quantidade de pesquisas crescer
3. Adicionar filtros adicionais (por ano, por destaque)
4. Preparar hook para consumo de API real (substituir mock por fetch)
5. Adicionar testes unitários com Jest/Roller
6. Implementar upload de anexos para pesquisas (se necessário no futuro)

## Observações
- Todos os textos devem estar em português brasileiro
- Seguir exatamente os padrões de código existentes (arquivos de referência: acervo, moderacao)
- Usar as mesmas cores e variáveis do tema definidas no projeto
- Manter comentários explicativos apenas quando necessário
- Funções devem ser puras e testáveis quando possível
- Tratamento de erro deve ser amigável para o usuário final