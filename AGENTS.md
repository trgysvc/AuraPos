# Agent Instructions

## Git Rules
- Her anlamlı değişiklik grubundan sonra commit et ve push et
- Format: git add . && git commit -m "feat: açıklama" && git push origin main
- Commit mesajları İngilizce, conventional commits formatında

## Project
- Monorepo: Turborepo + pnpm
- Repo: https://github.com/trgysvc/AuraPos.git

## Stack
- apps/pos → Next.js PWA
- apps/dashboard → Next.js
- apps/kds → Next.js
- apps/branch-server → Node.js Fastify
- packages/shared-types, hardware, ui, electric-config, ai

## Rules
- Klasör yapısı monorepo_structure.txt'e uygun olsun
- Her sprint docs/_sprintN_tasks.md dosyasına göre yürü
- .env değerlerini asla commit etme

## Documentation References

### Core Stack
- Turborepo: https://turbo.build/repo/docs
- pnpm Workspaces: https://pnpm.io/workspaces
- Next.js App Router: https://nextjs.org/docs/app
- React Native: https://reactnative.dev/docs/getting-started
- Fastify: https://fastify.dev/docs/latest/

### Database & Sync
- Supabase: https://supabase.com/docs
- ElectricSQL: https://electric-sql.com/docs
- PGlite: https://pglite.dev/docs

### UI
- shadcn/ui: https://ui.shadcn.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/en-US/api

### Auth & Payments
- Supabase Auth: https://supabase.com/docs/guides/auth
- Stripe: https://stripe.com/docs

### Testing & CI
- Vitest: https://vitest.dev/guide/
- Playwright: https://playwright.dev/docs/intro

### TypeScript
- TypeScript: https://www.typescriptlang.org/docs/

### State Management
- Zustand: https://zustand.docs.pmnd.rs/getting-started/introduction
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview

### Hardware & Protocols
- ESC/POS: https://reference.epson-biz.com/modules/ref_escpos/index.php
- Web Serial API: https://developer.chrome.com/docs/capabilities/serial
- Web USB API: https://developer.chrome.com/docs/capabilities/usb

### PWA
- Workbox: https://developer.chrome.com/docs/workbox
- next-pwa: https://github.com/shadowwalker/next-pwa

### Deployment
- Docker: https://docs.docker.com
- GitHub Actions: https://docs.github.com/en/actions

### Design
- shadcn/ui components: https://ui.shadcn.com/docs/components
- Radix UI primitives: https://www.radix-ui.com/primitives/docs/overview/introduction
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide icons: https://lucide.dev/icons/
- Touch target guidelines (Google): https://m3.material.io/foundations/accessible-design/accessibility-basics
- Material Design 3 (referans): https://m3.material.io

## Design Rules
- Minimum touch target: 44x44px (POS dokunmatik ekran)
- Font size minimum: 16px
- Renk kontrastı WCAG AA standartı
- Dark mode varsayılan (mutfak/bar ortamı)
- Hızlı işlem öncelikli: 3 tıkla sipariş tamamlanabilmeli
- Türkçe UI metinleri

