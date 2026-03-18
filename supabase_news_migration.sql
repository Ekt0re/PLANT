-- ===========================================
-- MIGRAZIONE: Tabella News per il sito PLANT
-- Eseguire nel SQL Editor di Supabase
-- ===========================================

CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    custom_css TEXT,
    cover_image VARCHAR(512),
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Tutti possono leggere le news pubblicate
CREATE POLICY "News viewable by everyone when published" ON public.news
  FOR SELECT USING (is_published = true);

-- Solo admin possono gestire tutte le news
CREATE POLICY "News manageable by admins" ON public.news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
