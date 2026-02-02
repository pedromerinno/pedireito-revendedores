# Pé Direito – Revendedores

Landing e formulário de cadastro para revendedores Pé Direito, com integração Supabase (Pé Direito) e opcionalmente ActiveCampaign.

## Tecnologias

- Vite, TypeScript, React
- shadcn/ui, Tailwind CSS
- Vercel (hosting + serverless API)

## Desenvolvimento local

```sh
npm install
npm run dev
```

A API do formulário (`/api/submit-revendedor`) só funciona em ambiente com variáveis de ambiente (Vercel ou `vercel dev` com env configurado).

## Deploy na Vercel

O deploy deve ser feito a partir do repositório:

**https://github.com/pedromerinno/pedireito-revendedores**

1. Na [Vercel](https://vercel.com), crie ou edite o projeto e conecte o repositório **pedireito-revendedores** (ou importe por esse URL).
2. **Variáveis de ambiente** (obrigatório para o formulário funcionar):
   - Vá em **Settings > Environment Variables** do projeto.
   - Adicione (nunca commite valores reais no repositório):

   | Nome                 | Descrição                                      | Obrigatório |
   |----------------------|------------------------------------------------|-------------|
   | `SUPABASE_URL`       | URL do projeto Supabase Pé Direito (ex: `https://xxx.supabase.co`) | Sim |
   | `SUPABASE_ANON_KEY`  | Chave anon do Supabase (Dashboard > Project Settings > API) | Sim |
   | `AC_API_URL`         | URL da API ActiveCampaign (opcional) | Não |
   | `AC_API_KEY`         | Chave da API ActiveCampaign | Não |
   | `AC_LIST_ID`         | ID da lista de revendedores | Não |
   | `AC_CUSTOM_FIELD_ID` | ID do campo customizado (opcional) | Não |

   Os questionários são salvos na tabela `revendedores` do Supabase. O ActiveCampaign é opcional (envio em paralelo).

3. Faça o deploy. As chaves ficam apenas no servidor (função serverless); nenhuma chave é exposta no frontend.

## Enviar código para o repositório de deploy

O deploy na Vercel usa o repositório [pedireito-revendedores](https://github.com/pedromerinno/pedireito-revendedores). Para subir (ou atualizar) o código nesse repositório:

```sh
# Se ainda não adicionou o remote:
git remote add revendedores https://github.com/pedromerinno/pedireito-revendedores.git

# Enviar o branch main
git push -u revendedores main
```

Se o push pedir autenticação, use um [Personal Access Token](https://github.com/settings/tokens) ou SSH.
