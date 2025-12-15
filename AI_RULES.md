# Regras de Desenvolvimento para IA

Este documento descreve a pilha de tecnologia e as diretrizes para o uso de bibliotecas neste projeto, com o objetivo de manter a consistência e a eficiência no desenvolvimento.

## Pilha de Tecnologia

*   **Framework:** React (com Vite para desenvolvimento rápido)
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS (para utilitários e classes de componentes)
*   **Componentes UI:** shadcn/ui (construído sobre Radix UI e estilizado com Tailwind CSS)
*   **Roteamento:** React Router DOM
*   **Gerenciamento de Estado (Assíncrono):** React Query (para chamadas de API e cache)
*   **Backend/Serviços:** Supabase (para funções de borda, autenticação e banco de dados)
*   **Ícones:** Lucide React
*   **Animações:** Tailwind CSS Animate

## Regras de Uso de Bibliotecas

Para garantir a consistência e evitar duplicação de esforços, siga estas regras ao escolher e usar bibliotecas:

*   **Componentes UI:**
    *   **Prioridade:** Sempre utilize os componentes do `shadcn/ui` quando disponíveis. Eles já estão configurados com Tailwind CSS e seguem o estilo do projeto.
    *   **Customização:** Se um componente `shadcn/ui` não atender às necessidades exatas, crie um novo componente em `src/components/` que utilize os primitivos do Radix UI (se aplicável) e estilize-o com Tailwind CSS. **Não modifique os arquivos originais do `shadcn/ui`**.
*   **Estilização:**
    *   **Exclusividade:** Use **apenas Tailwind CSS** para estilização. Evite CSS puro, módulos CSS ou outras bibliotecas de estilização.
    *   **Classes Utilitárias:** Prefira classes utilitárias do Tailwind para estilos atômicos.
    *   **Classes Customizadas:** Para estilos mais complexos ou padrões repetitivos, defina classes customizadas em `src/index.css` usando `@apply` do Tailwind.
*   **Roteamento:**
    *   **React Router DOM:** Utilize `react-router-dom` para todas as necessidades de roteamento. Mantenha as rotas principais em `src/App.tsx`.
    *   **NavLink:** Use o componente `NavLink` customizado (`src/components/NavLink.tsx`) para links de navegação que precisam de estados `active` ou `pending`.
*   **Gerenciamento de Estado (Assíncrono):**
    *   **React Query:** Para qualquer operação de busca, cache, atualização ou mutação de dados assíncronos (especialmente com Supabase Functions), utilize `react-query`.
*   **Backend e Funções de Borda:**
    *   **Supabase:** Todas as interações com o backend, incluindo autenticação, banco de dados e funções de borda (Edge Functions), devem ser feitas através do cliente Supabase (`@supabase/supabase-js`).
*   **Ícones:**
    *   **Lucide React:** Use ícones da biblioteca `lucide-react`.
*   **Animações:**
    *   **Tailwind CSS Animate:** Para animações CSS, utilize as classes fornecidas pelo `tailwindcss-animate` e as keyframes definidas em `tailwind.config.ts`.
*   **Toasts/Notificações:**
    *   **Sonner:** Utilize o componente `Sonner` para exibir notificações de toast.
*   **Hooks Customizados:**
    *   Crie hooks customizados em `src/hooks/` para encapsular lógicas reutilizáveis, como `useGameState` ou `useAIGeneration`.
*   **Estrutura de Arquivos:**
    *   Componentes devem ir para `src/components/`.
    *   Páginas devem ir para `src/pages/`.
    *   Hooks devem ir para `src/hooks/`.
    *   Serviços de API devem ir para `src/services/`.
    *   Tipos devem ir para `src/types/`.
    *   Integrações externas (como Supabase) devem ir para `src/integrations/`.