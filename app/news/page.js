'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import FadeIn from '@/components/FadeIn';
import { Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { cachedFetch, invalidateCache } from '@/hooks/useCache';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export default function NewsPage() {
  const supabase = createClient();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await cachedFetch('news', async () => {
        const { data: newsData, error } = await supabase
          .from('news')
          .select('id, title, slug, content, cover_image, published_at, created_at')
          .order('created_at', { ascending: false });
        // Lancio errore se fallisce per non cacciare in cache valori nulli
        if (error) throw error;
        return newsData;
      }, 5 * 60 * 1000); // 5 min TTL
      
      setNews(data || []);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [supabase]);

  const handleRefresh = async () => {
    invalidateCache('news');
    await fetchNews();
  };

  // Strip html for description preview
  const getPreviewText = (markdownContent) => {
    if (!markdownContent) return '';
    try {
      const html = marked.parse(markdownContent);
      const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
      return clean.length > 150 ? clean.substring(0, 150) + '...' : clean;
    } catch(e) {
      return '';
    }
  };

  return (
    <main className="news-page" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Hero Section */}
      <section className="page-hero text-center" style={{ padding: '120px 0 60px' }}>
        <div className="container">
          <FadeIn>
            <span style={{ 
              background: 'var(--accent-green-light)', color: 'var(--accent-green)', 
              padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' 
            }}>Blog & News</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
              <h1 className="hero-title" style={{ margin: 0 }}>Ultime dal mondo PLANT</h1>
              <button 
                onClick={handleRefresh}
                disabled={loading}
                title="Aggiorna news"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--accent-green)', display: 'flex', alignItems: 'center',
                  padding: '8px', borderRadius: '50%', transition: 'background-color 0.2s',
                  opacity: loading ? 0.5 : 1
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-alt)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <RefreshCw size={24} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
            <p className="hero-subtitle">Scopri consigli, aggiornamenti e novità sulla cura delle tue piante.</p>
          </FadeIn>
        </div>
      </section>

      {/* News Grid */}
      <section className="news-grid-section" style={{ paddingBottom: '100px' }}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>Caricamento news...</div>
          ) : news.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
              {news.map((item, index) => (
                <FadeIn key={item.id} delay={index * 0.1}>
                  <article className="news-card" style={{ 
                    background: 'var(--card-bg)', borderRadius: '24px', overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease',
                    height: '100%', display: 'flex', flexDirection: 'column'
                  }}>
                    {item.cover_image && (
                      <div style={{ height: '220px', overflow: 'hidden' }}>
                        <img src={item.cover_image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} /> {new Date(item.published_at || item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', lineHeight: '1.3', color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', flex: 1 }}>
                        {getPreviewText(item.content)}
                      </p>
                      <Link href={`/news/${item.slug || item.id}`} style={{ 
                        color: 'var(--accent-green)', fontWeight: 'bold', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '8px'
                      }}>
                        Leggi di più <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-secondary)' }}>
              <p>Non ci sono ancora news pubblicate.</p>
              <Link href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Torna in Home</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
