# Pé Direito – Revendedores

Landing e formulário de cadastro para revendedores Pé Direito, com integração ActiveCampaign.

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

1. Conecte este repositório ao projeto na [Vercel](https://vercel.com).
2. **Variáveis de ambiente** (obrigatório para o formulário funcionar):
   - Vá em **Settings > Environment Variables** do projeto.
   - Adicione (nunca commite valores reais no repositório):

   | Nome                 | Descrição                                      | Obrigatório |
   |----------------------|------------------------------------------------|-------------|
   | `AC_API_URL`         | URL da API ActiveCampaign (ex: `https://xxx.api-us1.com`) | Sim |
   | `AC_API_KEY`         | Chave da API (ActiveCampaign > Configurações > Desenvolvedor) | Sim |
   | `AC_LIST_ID`         | ID da lista de revendedores (Campanhas > Listas) | Sim |
   | `AC_CUSTOM_FIELD_ID` | ID do campo customizado para o JSON do questionário (opcional) | Não |

3. Faça o deploy. As chaves ficam apenas no servidor (função serverless); nenhuma chave é exposta no frontend.
