# Bring Swazi Artistry into this project on Lovable Cloud

## What you'll get
All 23 pages of your app work here the same way they do now: home, explore, categories, artist profiles, login/signup and password reset, your profile, creating an artist profile, portfolio upload, messages, jobs (list, details, create, apply), learning resources, about, FAQ, and the admin area (ads, featured artists, resources). It keeps its current look, images and wording.

Everything will run on Lovable Cloud: a new database, logins and photo storage. Your old Supabase project won't be touched.

## Important to know
- **Existing data doesn't move over automatically.** User accounts, artists, bookings, messages and so on start empty. I can help you bring data across afterwards.
- **Most tables have to be rebuilt.** Your project's setup files only describe a handful of tables. The rest (artists, bookings, jobs, messages, resources, ads and more) I'll rebuild from the app's code, along with sensible security rules: people can only edit their own things, and only admins manage ads and resources.
- **Stokvel tables will be skipped.** These are tables like stokvels, members, contributions and investments, and no page in this app uses them. Tell me if you want them kept.
- **You'll need to make yourself an admin again.** After you sign up, I'll do this for you.

## Steps
1. Turn on Lovable Cloud.
2. Create the database: all the tables the app uses, plus its admin roles, messaging and notification features, and photo storage.
3. Bring over the styling, images and shared building blocks.
4. Move every page into this project, one by one, and connect each to the new backend.
5. Give each page its own title and description so it shows up well in search results and when shared.
6. Check every page in the preview and fix any problems.

## Technical details
- Port from Vite + react-router-dom to TanStack Start file routes (`/artist/$id`, `/jobs/$id/apply`, `/admin/resources/edit/$id`, etc.). Pages that need sign-in (profile, messages, create-profile, portfolio upload, create/apply job, admin) go under `_authenticated/`. Admin pages also check the user's role on top of that.
- Port `tailwind.config.ts` and `index.css` theme into `src/styles.css` (Tailwind v4, oklch).
- Replace `use-toast` with sonner. Replace `useNavigate`/`Link`/`useParams` from react-router with their TanStack equivalents.
- Schema rebuilt from `types.ts` plus the 4 existing migrations. Roles live in a separate `user_roles` table with a `has_role` security-definer function. Recreate the `send_message`, `mark_message_as_read` and `is_admin` functions.
- Storage buckets are recreated for whatever the code references (portfolio, avatars, resources).
