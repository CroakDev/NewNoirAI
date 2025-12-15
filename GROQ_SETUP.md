# Configuração da API Groq

O projeto agora usa a API **Groq** (gratuita) para geração de casos e **Pollinations.ai** (gratuita) para geração de imagens.

## Como obter a API Key do Groq

1. Acesse: https://console.groq.com/
2. Crie uma conta gratuita
3. Vá em "API Keys" no menu lateral
4. Clique em "Create API Key"
5. Copie a chave gerada (começa com `gsk_`)

## Configurar no Supabase

### Opção 1: Via Dashboard do Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **Project Settings** → **Edge Functions** → **Environment Variables**
3. Adicione uma nova variável:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Cole sua chave da Groq (ex: `gsk_xxxxxxxxxxxxx`)
4. Salve as alterações

### Opção 2: Via CLI do Supabase

```bash
# Se você tiver o Supabase CLI instalado
supabase secrets set GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

## Deploy das Funções

Após configurar a API key, você precisa fazer deploy das funções atualizadas:

```bash
# Deploy de todas as funções
supabase functions deploy generate-case
supabase functions deploy generate-image
```

Ou se preferir, você pode usar a interface do Supabase Dashboard para fazer o deploy.

## O que mudou?

### Geração de Casos (generate-case)
- **Antes**: Usava Lovable AI Gateway (com créditos pagos)
- **Agora**: Usa Groq API com modelo `llama-3.3-70b-versatile` (gratuito)
- **Vantagens**:
  - Totalmente gratuito
  - Muito rápido
  - Sem limite de créditos

### Geração de Imagens (generate-image)
- **Antes**: Usava Lovable AI Gateway com Gemini
- **Agora**: Usa Pollinations.ai (gratuito, sem API key necessária)
- **Vantagens**:
  - Totalmente gratuito
  - Sem necessidade de API key
  - Gera URLs diretas de imagens

## Testando

Após o deploy, teste criando um novo caso no jogo. Se aparecer algum erro, verifique:

1. A API key do Groq está configurada corretamente
2. As funções foram deployadas
3. Os logs das Edge Functions no Supabase Dashboard

## Limites da API Gratuita do Groq

A API gratuita do Groq tem limites generosos:
- **30 requests por minuto**
- **14,400 requests por dia**
- **6,000 tokens por minuto**

Isso é mais do que suficiente para uso pessoal e testes!

## Fallback

Se a API key não estiver configurada, a função tentará usar `gsk_free` como fallback, mas isso NÃO funcionará. Você PRECISA configurar sua própria chave do Groq.
