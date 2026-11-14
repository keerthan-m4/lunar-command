# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Mission persistence and controls

- Active mission state is autosaved in the current browser using `localStorage`.
- Three manual save slots let you save and restore mission snapshots.
- Export mission backup downloads a JSON snapshot.
- Compact dashboard and reduced-motion preferences are stored locally.
- Dynamic events use a deterministic day/resource/crew-based roll and retain their pending event and event log in the same browser.
- Browser-local saves do not sync across devices or users. A shared cloud database and authentication would be required for cross-device synchronization.

All resource values, forecasts, event effects, and crew condition changes remain illustrative gameplay assumptions, not validated engineering predictions or live NASA telemetry.


## Supabase authentication setup

1. Copy `.env.example` to `.env`.
2. Put the Supabase project URL and publishable key in `.env`.
3. In Supabase Dashboard, enable Email provider under Authentication > Providers.
4. Add your local and production site URLs under Authentication > URL Configuration (Site URL and Redirect URLs).
5. Run `npm.cmd install` and `npm.cmd run dev`.

The publishable key is designed for frontend use. Never put a Supabase secret or service-role key in this app. This release adds email/password sign-up, login, logout, session restoration, and password reset. Mission persistence remains browser-local until cloud database syncing is configured separately.


## Cloud mission storage

1. In Supabase Dashboard, open SQL Editor and run the complete SQL in `supabase/schema.sql`.
2. The app uses the authenticated user's UUID as the row key. Row Level Security policies restrict select/insert/update to `auth.uid() = user_id`.
3. Mission state and save slots are saved to `public.user_missions` after changes (debounced by 900 ms).
4. Cloud saves are per-account. Do not disable RLS or expose a service-role key in the browser.
