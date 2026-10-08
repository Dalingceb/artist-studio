CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text, is_artist boolean DEFAULT false, profile_image text,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL, created_at timestamptz DEFAULT now(), UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(auth.uid(), 'admin') $$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL, category text NOT NULL, location text NOT NULL, phone text NOT NULL,
  bio text, banner_image text, profile_image text, website text, social_links text, expo_push_token text,
  rating numeric DEFAULT 0, featured boolean DEFAULT false, featured_priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.artists TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artists TO authenticated;
GRANT ALL ON public.artists TO service_role;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Artists viewable by all" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Users create own artist" ON public.artists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners or admins update artist" ON public.artists FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Owners or admins delete artist" ON public.artists FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

CREATE TABLE public.artist_portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title text NOT NULL, description text, media_url text NOT NULL, media_type text NOT NULL DEFAULT 'image',
  thumbnail_url text, category text, tags text, price text, layout_type text, featured boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.artist_portfolio TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artist_portfolio TO authenticated;
GRANT ALL ON public.artist_portfolio TO service_role;
ALTER TABLE public.artist_portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio viewable by all" ON public.artist_portfolio FOR SELECT USING (true);
CREATE POLICY "Artist owners manage portfolio" ON public.artist_portfolio FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.user_id = auth.uid()));

CREATE TABLE public.artist_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL, comment text, created_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.artist_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artist_reviews TO authenticated;
GRANT ALL ON public.artist_reviews TO service_role;
ALTER TABLE public.artist_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable by all" ON public.artist_reviews FOR SELECT USING (true);
CREATE POLICY "Users write own reviews" ON public.artist_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users edit own reviews" ON public.artist_reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id);
CREATE POLICY "Users delete own reviews" ON public.artist_reviews FOR DELETE TO authenticated USING (auth.uid() = reviewer_id OR public.is_admin());

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_title text NOT NULL, booking_purpose text NOT NULL, event_date date NOT NULL, event_time text,
  location text NOT NULL, proposed_price text NOT NULL, description text, additional_requirements text, phone text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients and artists view bookings" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = client_id OR EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Clients create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients and artists update bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = client_id OR EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.user_id = auth.uid()));
CREATE POLICY "Clients delete bookings" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = client_id);

CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user1_name text, user2_name text, last_message text, profile_image text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view conversations" ON public.conversations FOR SELECT TO authenticated USING (auth.uid() IN (user1_id, user2_id));
CREATE POLICY "Participants create conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (user1_id, user2_id));
CREATE POLICY "Participants update conversations" ON public.conversations FOR UPDATE TO authenticated USING (auth.uid() IN (user1_id, user2_id));
CREATE POLICY "Participants delete conversations" ON public.conversations FOR DELETE TO authenticated USING (auth.uid() IN (user1_id, user2_id));

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name text, message text NOT NULL, is_read boolean DEFAULT false,
  media_url text, media_type text, media_size integer,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants view messages" ON public.messages FOR SELECT TO authenticated USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Users send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Participants update messages" ON public.messages FOR UPDATE TO authenticated USING (auth.uid() IN (sender_id, recipient_id));
CREATE POLICY "Senders delete messages" ON public.messages FOR DELETE TO authenticated USING (auth.uid() = sender_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

CREATE OR REPLACE FUNCTION public.mark_message_as_read(p_message_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.messages SET is_read = true WHERE id = p_message_id AND recipient_id = auth.uid();
$$;

CREATE TABLE public.job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL, description text NOT NULL, category text NOT NULL, location text NOT NULL,
  budget_range text NOT NULL, requirements text NOT NULL DEFAULT '', event_date date NOT NULL, event_time text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.job_listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_listings TO authenticated;
GRANT ALL ON public.job_listings TO service_role;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs viewable by all" ON public.job_listings FOR SELECT USING (true);
CREATE POLICY "Clients create jobs" ON public.job_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients update jobs" ON public.job_listings FOR UPDATE TO authenticated USING (auth.uid() = client_id OR public.is_admin());
CREATE POLICY "Clients delete jobs" ON public.job_listings FOR DELETE TO authenticated USING (auth.uid() = client_id OR public.is_admin());

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter text, proposed_rate text, additional_info text, status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants and clients view applications" ON public.job_applications FOR SELECT TO authenticated
  USING (auth.uid() = artist_id OR auth.uid() = client_id OR EXISTS (SELECT 1 FROM public.job_listings j WHERE j.id = job_id AND j.client_id = auth.uid()));
CREATE POLICY "Artists apply" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "Clients and applicants update" ON public.job_applications FOR UPDATE TO authenticated
  USING (auth.uid() = artist_id OR EXISTS (SELECT 1 FROM public.job_listings j WHERE j.id = job_id AND j.client_id = auth.uid()));
CREATE POLICY "Applicants withdraw" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = artist_id);

CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text, image_url text, link_url text,
  position text NOT NULL DEFAULT 'banner', is_active boolean DEFAULT true, pages text[] DEFAULT '{home}',
  start_date timestamptz, end_date timestamptz, created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads TO authenticated;
GRANT ALL ON public.ads TO service_role;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active ads viewable by all" ON public.ads FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage ads" ON public.ads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.resource_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, content text NOT NULL, excerpt text,
  category_id uuid REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  author_id uuid NOT NULL, featured_image text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  tags text[], estimated_read_time integer,
  difficulty_level text CHECK (difficulty_level IN ('beginner','intermediate','advanced')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.resource_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  media_url text NOT NULL, media_type text NOT NULL CHECK (media_type IN ('image','video')),
  caption text, alt_text text, file_size integer, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resource_categories, public.learning_resources, public.resource_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_categories, public.learning_resources, public.resource_media TO authenticated;
GRANT ALL ON public.resource_categories, public.learning_resources, public.resource_media TO service_role;
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by all" ON public.resource_categories FOR SELECT USING (true);
CREATE POLICY "Published resources viewable" ON public.learning_resources FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Media viewable by all" ON public.resource_media FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.resource_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage resources" ON public.learning_resources FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage media" ON public.resource_media FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.resource_categories (name, description) VALUES
  ('Business & Marketing','Learn how to promote your art and build a sustainable business'),
  ('Technical Skills','Improve your artistic techniques and learn new mediums'),
  ('Career Development','Guidance on building your artistic career and finding opportunities'),
  ('Digital Tools','Master digital tools and software for modern artists'),
  ('Industry Insights','Stay updated with trends and insights in the art world');

CREATE POLICY "Public read app buckets" ON storage.objects FOR SELECT
  USING (bucket_id IN ('ad-images','artist-images','learning-resources','media','portfolio'));
CREATE POLICY "Admins write admin buckets" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id IN ('ad-images','learning-resources') AND public.is_admin())
  WITH CHECK (bucket_id IN ('ad-images','learning-resources') AND public.is_admin());
CREATE POLICY "Users upload to user buckets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('artist-images','media','portfolio'));
CREATE POLICY "Owners modify user bucket files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('artist-images','media','portfolio') AND owner = auth.uid());
CREATE POLICY "Owners delete user bucket files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('artist-images','media','portfolio') AND owner = auth.uid());
