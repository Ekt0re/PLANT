'use client';

import FadeIn from '@/components/FadeIn';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { Check, X, Leaf, Wrench } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cachedFetch } from '@/hooks/useCache';

export default function Prodotti() {
  const supabase = createClient();
  const [prodotti, setProdotti] = useState([]);
  const [accessori, setAccessori] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, accData, newsData] = await Promise.all([
          cachedFetch('prodotti_list', async () => {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', 1)
              .eq('is_active', true)
              .order('price', { ascending: true });
            if (error) throw error;
            return data;
          }),
          cachedFetch('accessori_list', async () => {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('category_id', 2)
              .eq('is_active', true)
              .order('price', { ascending: true });
            if (error) throw error;
            return data;
          }),
          cachedFetch('news_slugs', async () => {
             const { data, error } = await supabase
              .from('news')
              .select('slug')
              .eq('is_published', true);
             if (error) throw error;
             return data;
          })
        ]);

        setProdotti(prodData || []);
        setAccessori(accData || []);
        setNewsList(newsData || []);
      } catch (err) {
        console.error("Errore fetch catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [supabase]);

  const displayProducts = prodotti;
  const displayAccessori = accessori;

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            border: '3px solid var(--accent-green-light)', borderTopColor: 'var(--accent-green)',
            animation: 'spin 1s linear infinite', margin: '0 auto 20px'
          }}></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Caricamento catalogo in corso...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Prodotti Hero */}
      <section className="page-hero text-center">
        <div className="container">
          <FadeIn>
            <h1 className="hero-title">I nostri Prodotti</h1>
            <p className="hero-subtitle">Tecnologia e natura, progettate per la tua casa.</p>
          </FadeIn>
        </div>
      </section>

      {/* Vasi Grid */}
      <section className="products-section">
        <div className="container">
          <FadeIn>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
              <Leaf size={32} color="var(--accent-green)" /> Vasi Intelligenti
            </h2>
          </FadeIn>
          <div className="products-grid">
            {displayProducts.map((p) => (
              <FadeIn key={p.id} className="product-card" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                  <FavoriteButton productId={p.id} />
                </div>
                {p.image_urls && (
                  <div className="product-image" style={{ position: 'relative', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', overflow: 'hidden' }}>
                    <Image 
                      src={p.image_urls} 
                      alt={p.name} 
                      fill
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div className="product-info">
                  <h3>
                    {(() => {
                      const relatedNews = newsList.find(n => n.slug === p.slug || n.slug === `news-${p.slug}`)?.slug;
                      return relatedNews ? (
                        <Link href={`/news/${relatedNews}?from=prodotti`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover-underline">
                          {p.name}
                        </Link>
                      ) : p.name;
                    })()}
                  </h3>
                  <p className="product-desc">{p.description}</p>
                  <div className="product-price">&euro; {p.price?.toFixed(2)}</div>
                  <AddToCartButton product={p} text="Aggiungi al carrello" />
                </div>
              </FadeIn>
            ))}
            {displayProducts.length === 0 && (
              <p style={{textAlign: "center", gridColumn:"1/-1"}}>Nessun prodotto disponibile al momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="comparison-section bg-light">
        <div className="container text-center">
          <FadeIn>
            <h2>Confronta i modelli</h2>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Funzionalità</th>
                    {displayProducts.map(p => (
                      <th key={p.id}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <CompareTableRows products={displayProducts} />
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Accessori Section */}
      {displayAccessori.length > 0 && (
        <section className="products-section" style={{ background: 'var(--bg-alt, #fafafa)' }}>
          <div className="container">
            <FadeIn>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <Wrench size={32} color="var(--accent-green)" /> Accessori Ufficiali
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '10px auto 0' }}>Complementi studiati per esaltare l'esperienza PLANT.</p>
              </div>
            </FadeIn>
            <div className="products-grid">
              {displayAccessori.map((acc) => (
                <FadeIn key={acc.id} className="product-card" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                    <FavoriteButton productId={acc.id} />
                  </div>
                  {acc.image_urls && (
                    <div className="product-image" style={{ position: 'relative', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', overflow: 'hidden' }}>
                      <Image 
                        src={acc.image_urls} 
                        alt={acc.name} 
                        fill
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                  <div className="product-info">
                    <h3>
                      {(() => {
                        const relatedNews = newsList.find(n => n.slug === acc.slug || n.slug === `news-${acc.slug}`)?.slug;
                        return relatedNews ? (
                          <Link href={`/news/${relatedNews}?from=prodotti`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover-underline">
                            {acc.name}
                          </Link>
                        ) : acc.name;
                      })()}
                    </h3>
                    <p className="product-desc">{acc.description}</p>
                    <div className="product-price">&euro; {acc.price?.toFixed(2)}</div>
                    <AddToCartButton product={acc} text="Aggiungi al carrello" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

// Subcomponent per fare il render dinamico delle righe della tabella basate su components del DB
function CompareTableRows({ products }) {
  const supabase = createClient();
  const [components, setComponents] = useState([]);
  const [pcRelations, setPcRelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompareData = async () => {
      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = products.map(p => p.id).sort().join(','); // key per cache
        const cacheKey = `compare_data_${productIds}`;

        const data = await cachedFetch(cacheKey, async () => {
          const { data: compData } = await supabase.from('components').select('*').order('id', { ascending: true });
          const ids = products.map(p => p.id);
          const { data: relData } = await supabase.from('product_components').select('*').in('product_id', ids);
          return {
            components: compData || [],
            relations: relData || []
          };
        });

        setComponents(data.components);
        setPcRelations(data.relations);
      } catch (err) {
        console.error("Errore fetch compare data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCompareData();
  }, [supabase, products]);
  
  if (loading) {
    return <tr><td colSpan={products.length ? products.length + 1 : 4} style={{ textAlign: 'center' }}>Caricamento dati di confronto...</td></tr>;
  }

  if (!components || components.length === 0 || products.length === 0) {
    return <tr><td colSpan={products.length + 1}>Nessun dato di confronto disponibile</td></tr>;
  }

  return (
    <>
      {components.map(comp => (
        <tr key={comp.id}>
          <td style={{ textAlign: 'left', fontWeight: '500' }}>
            {comp.name}
            <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '400' }}>{comp.description}</div>
          </td>
          {products.map(p => {
            const hasComponent = pcRelations.some(pc => pc.product_id === p.id && pc.component_id === comp.id);
            return (
              <td key={p.id}>
                {hasComponent ? 
                  <Check size={20} style={{ color: 'var(--accent-green)', margin: '0 auto' }} /> : 
                  <X size={20} style={{ color: '#ccc', margin: '0 auto' }} />
                }
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
