'use client';

import { Hammer, Cog, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import FadeIn from '@/components/FadeIn';

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main>
      <section className="page-hero text-center" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="container">
          <FadeIn>
            <div style={{
              width: '80px', height: '80px',
              background: 'var(--accent-green)', color: 'var(--bg-color)',
              borderRadius: '24px', margin: '0 auto 30px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              <Hammer size={40} />
            </div>
            
            <h1 className="hero-title">Sistema in Aggiornamento</h1>
            <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
              Stiamo perfezionando l'esperienza PLANT. I nostri sistemi sono in manutenzione programmata per offrirti un servizio ancora più veloce e sicuro.
            </p>

            <div className="mission-cards" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '30px', maxWidth: '600px', margin: '0 auto 50px' }}>
              <div className="mission-card" style={{ padding: '30px' }}>
                <Cog size={32} color="var(--accent-green)" style={{ margin: '0 auto 15px', animation: 'spin-slow 6s linear infinite' }} />
                <h4>Ottimizzazione</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Miglioriamo le prestazioni e la fluidità.</p>
              </div>
              <div className="mission-card" style={{ padding: '30px' }}>
                <Clock size={32} color="var(--accent-green)" style={{ margin: '0 auto 15px' }} />
                <h4>Pazienza</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Torneremo online tra pochissimo.</p>
              </div>
            </div>

            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <a href="mailto:support@plant-next.it" className="btn btn-secondary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                Supporto Urgente
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
