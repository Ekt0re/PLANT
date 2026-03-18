import { createClient } from '@/utils/supabase/server';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import { notFound } from 'next/navigation';
import NewsCartActions from '@/components/NewsCartActions';
import Image from 'next/image';

// Genera la metadata dinamica
export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const slugTarget = (await params).slug;
  const isNumericId = /^\d+$/.test(slugTarget);

  let query = supabase.from('news').select('title, content');
  
  if (isNumericId) {
    query = query.or(`slug.eq.${slugTarget},id.eq.${slugTarget}`);
  } else {
    query = query.eq('slug', slugTarget);
  }

  const { data: news } = await query.maybeSingle();

  if (!news) return { title: 'News non trovata | PLANT' };

  return {
    title: `${news.title} | PLANT Blog`,
    description: news.content.substring(0, 160).replace(/[#*`_]/g, ''),
  };
}

export default async function NewsArticlePage({ params, searchParams }) {
  const supabase = await createClient();
  const { slug: slugTarget } = await params;
  const { from } = await searchParams;
  
  const isFromProducts = from === 'prodotti';
  const backLink = isFromProducts ? '/prodotti' : '/news';
  const backText = isFromProducts ? 'Scopri altri prodotti' : 'Torna alle news';
  
  const isNumericId = /^\d+$/.test(slugTarget);

  let query = supabase
    .from('news')
    .select('*');

  if (isNumericId) {
    query = query.or(`slug.eq.${slugTarget},id.eq.${slugTarget}`);
  } else {
    query = query.eq('slug', slugTarget);
  }

  const { data: news, error } = await query.maybeSingle();

  if (error || !news) {
    notFound();
  }

  // Recupero dati autore se presente
  let authorData = null;
  if (news.author_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', news.author_id)
      .maybeSingle();
    authorData = profile;
  }

  // Parse markdown to HTML e sanitizzazione
  const rawHtml = await marked.parse(news.content);
  // Permettiamo iframes (video) e elementi vari, ma preveniamo script attack
  const cleanHtml = DOMPurify.sanitize(rawHtml, { 
    ADD_TAGS: ['iframe', 'style', 'button', 'center', 'div'], 
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'class', 'style', 'data-product'] 
  });

  const authorName = authorData ? `${authorData.first_name} ${authorData.last_name}` : 'Redazione PLANT';
  const pubDate = new Date(news.published_at || news.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  // Calcolo tempo di lettura stimato
  const wordsPerMinute = 200;
  const wordCount = news.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Iniezione CSS Custom da DB, protetto dentro questo componente */}
      {news.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.custom_css, { ADD_TAGS: ['style'] }) }} />
      )}

      <article className="news-article" style={{ padding: '120px 0 80px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <Link href={backLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '30px' }}>
            <ArrowLeft size={18} /> {backText}
          </Link>

          {news.cover_image && (
            <div className="news-banner" style={{ 
              width: '100%', 
              borderRadius: '32px', 
              overflow: 'hidden', 
              marginBottom: '50px',
              position: 'relative',
              aspectRatio: '16/9',
              maxHeight: '450px',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)'
            }}>
              <Image 
                src={news.cover_image} 
                alt={news.title} 
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}

          <header style={{ marginBottom: '50px' }}>
            <h1 style={{ fontSize: '3rem', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>{news.title}</h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              color: 'var(--text-secondary)', 
              fontSize: '0.95rem',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '24px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} /> {pubDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> {authorName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', opacity: 0.8 }}>
                Tempo di lettura: ~{readTime} min
              </span>
            </div>
            {news.updated_at && news.updated_at !== news.created_at && (
              <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Ultimo aggiornamento: {new Date(news.updated_at).toLocaleDateString('it-IT')}
              </div>
            )}
          </header>


          {/* Render del contenuto Markdown/HTML */}
          <div 
            className="news-content" 
            dangerouslySetInnerHTML={{ __html: cleanHtml }} 
          />
          
          {/* Gestore azioni carrello (Client Component) */}
          <NewsCartActions />
          
        </div>
      </article>
    </main>
  );
}
