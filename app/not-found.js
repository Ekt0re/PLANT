'use client';

import Link from 'next/link';
import { Leaf, ArrowLeft, Search } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function NotFound() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-color)',
      padding: '20px'
    }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'var(--accent-green-light)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 40px',
            color: 'var(--accent-green)'
          }}>
            <Search size={60} strokeWidth={1.5} />
          </div>
          
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: '800', 
            marginBottom: '10px',
            color: 'var(--text-primary)',
            letterSpacing: '-2px',
            lineHeight: 1
          }}>404</h1>
          
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '20px',
            color: 'var(--text-primary)'
          }}>Pagina non trovata</h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Sembra che questa pianta non sia nel nostro vivaio. 
            Forse è appassita o è stata spostata in un altro vaso.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn btn-primary" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '14px 28px'
            }}>
              <ArrowLeft size={18} /> Torna alla Home
            </Link>
            <Link href="/prodotti" className="btn" style={{ 
              background: 'var(--bg-alt)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '14px 28px'
            }}>
              Esplora i Prodotti
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
