<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Ported page bodies live in `src/views/` and are mounted by thin files in `src/routes/` — keeps the original app's pages intact while routing uses TanStack file routes.
- Ported code imports routing helpers from `@/lib/router-compat` (react-router-style API over TanStack Router) — avoids rewriting every page's navigation calls.
- Pages that need a signed-in user or browser-only data use `ssr: false` and do their own sign-in redirects, as the original app did; admin pages are wrapped in `AdminRoute`.
- Roles live only in `public.user_roles`, checked through `has_role`/`is_admin` — prevents privilege escalation.
- Files with `// @ts-nocheck` were ported with loose typing; remove the directive when touching a file substantially and fix its types.
