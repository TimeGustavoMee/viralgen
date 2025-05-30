# my-v0-project

> Versão: 0.1.0

Aplicativo web moderno desenvolvido com [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) e outras tecnologias modernas do ecossistema React.

## 🧾 Descrição

Este projeto implementa uma aplicação com autenticação, dashboard interativo e várias seções (ajuda, configurações, favoritos, cobrança), utilizando roteamento baseado em arquivos do App Router do Next.js.

## 📁 Estrutura de Diretórios

```
.
├── app/                    # Páginas e layouts da aplicação
│   ├── page.tsx           # Página inicial
│   ├── layout.tsx         # Layout raiz
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── dashboard/         # Área autenticada com subrotas
│       ├── layout.tsx
│       ├── page.tsx
│       ├── help/
│       ├── settings/
│       ├── billing/
│       └── favorites/
├── public/                # Arquivos estáticos (não listado mas presumido)
├── tailwind.config.ts     # Configurações Tailwind
├── postcss.config.mjs     # Plugins PostCSS
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Metadados e dependências
├── .gitignore
└── README.md
```

## 🚀 Tecnologias Utilizadas

- [Next.js 13+](https://nextjs.org/) — App Router
- [React 18+](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PNPM](https://pnpm.io/) — Gerenciador de pacotes
- [PostCSS](https://postcss.org/)
- [Zod](https://zod.dev/) — Validação de esquemas
- [Lucide React](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Heroicons / Headless UI](https://headlessui.com/)

## 📦 Instalação

```bash
# Instale dependências
pnpm install
```

## 🧪 Desenvolvimento

```bash
# Rode a aplicação localmente
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

## 🛠️ Scripts Comuns

```bash
pnpm dev        # Inicia o servidor de desenvolvimento
pnpm build      # Build para produção
pnpm start      # Inicia o servidor em modo produção
```

## 🧰 Configurações

- `next.config.mjs`: Configurações avançadas do Next.js
- `tailwind.config.ts`: Customização do design system
- `postcss.config.mjs`: Processamento de CSS

## 📂 Páginas

- `/` — Página inicial
- `/login` — Login de usuário
- `/register` — Cadastro
- `/dashboard` — Área autenticada
  - `/dashboard/help` — Ajuda
  - `/dashboard/settings` — Configurações
  - `/dashboard/billing` — Faturas
  - `/dashboard/favorites` — Favoritos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
