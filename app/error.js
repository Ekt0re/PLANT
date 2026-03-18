'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log error to console OR external service
    console.error('App Error:', error);
  }, [error]);

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
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 40px',
            color: '#ef4444'
          }}>
            <AlertCircle size={60} strokeWidth={1.5} />
          </div>
          
          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px',
            color: 'var(--text-primary)',
            fontWeight: '800'
          }}>Si è verificato un errore</h2>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Qualcosa è andato storto durante la crescita di questa pagina. 
            Stiamo lavorando per risolvere il problema al più presto.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => reset()}
              className="btn btn-primary" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '14px 28px'
              }}
            >
              <RefreshCw size={18} /> Riprova
            </button>
            <Link href="/" className="btn" style={{ 
              background: 'var(--bg-alt)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Home size={18} /> Vai alla Home
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              marginTop: '40px', 
              padding: '20px', 
              background: 'var(--bg-alt)', 
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '0.85rem',
              overflow: 'auto',
              maxHeight: '200px',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>Debug Info:</p>
              <pre style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {error.message || 'Unknown error'}
              </pre>
            </div>
          )}
        </FadeIn>
      </div>
    </main>
  );
}
