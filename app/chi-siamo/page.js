import FadeIn from '@/components/FadeIn';
import Image from 'next/image';
import { Lightbulb, PenTool, Cpu, FlaskConical, Rocket, User, Users, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Chi Siamo | PLANT',
  description: "Scopri la storia del project work PLANT sviluppato all'ITTG Chilesotti e MegaHub.",
};

const timelineSteps = [
  {
    icon: <Lightbulb size={24} />,
    title: "Ideazione",
    description: "Nascita dell'idea e definizione degli obiettivi principali: semplificare e automatizzare la cura botanica casalinga."
  },
  {
    icon: <PenTool size={24} />,
    title: "Prototipazione",
    description: "Studio di fattibilità, progettazione UX/UI dell'ecosistema e disegno concettuale dell'infrastruttura di sensori e vasi."
  },
  {
    icon: <Cpu size={24} />,
    title: "Realizzazione Software e Hardware",
    description: "Sviluppo del firmware per il monitoraggio e irrigazione, unito alla programmazione della piattaforma Cloud Next.js e database Supabase."
  },
  {
    icon: <FlaskConical size={24} />,
    title: "Testing e Integrazione",
    description: "Prove sul campo per verificare la stabilità della connessione dei dispositivi hardware, l'accuratezza dei sensori e la reattività del sito."
  },
  {
    icon: <Rocket size={24} />,
    title: "Presentazione del Project Work",
    description: "Conclusione e collaudo finale del sistema PLANT completo in tutte le sue infrastrutture."
  }
];

const teamMembers = [
  { name: "Ettore Sartori", role: "Sviluppatore & Ingegnere Hardware" },
  { name: "Simone Marangoni", role: "Sviluppatore Full-Stack" },
  { name: "Nicholas Favarel", role: "Sistemista & Hardware" },
  { name: "Enrico Brusamarello", role: "Sviluppatore & R&D" }
];

export default function ChiSiamo() {
  return (
    <main style={{ paddingBottom: '60px' }}>
      <section className="page-hero text-center">
        <div className="container">
          <FadeIn>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-alt)', padding: '10px 20px', borderRadius: '30px', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', gap: '8px', border: '1px solid var(--border-color)' }}>
              <GraduationCap size={18} color="var(--accent-green)" />
              <span>Project Work 2026</span>
            </div>
            <h1 className="hero-title">Il Progetto PLANT</h1>
            <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Dalla scuola al mondo reale. Tecnologia, natura e innovazione fusi in un unico ecosistema intelligente.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Storia del progetto */}
      <section className="about-story" style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="tech-grid" style={{ alignItems: 'center' }}>
            <FadeIn className="tech-image-wrapper" style={{ borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
               {/* Un'illustrazione/iconografia simbolica nel caso non ci sia una foto */}
               <div style={{ textAlign: 'center' }}>
                 <Image src="/assets/Logo.png" alt="Logo PLANT" width={180} height={180} style={{ opacity: 0.9, filter: 'drop-shadow(0 10px 20px rgba(34, 197, 94, 0.2))' }} />
               </div>
            </FadeIn>
            <FadeIn className="tech-text">
              <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Nato tra i banchi, cresciuto nell'innovazione.</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                PLANT è l'ufficiale <strong>Project Work</strong> del team Plant dell'<strong>ITTG Chilesotti</strong> di Thiene (VI). 
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                Sviluppato a partire dal 2026 da un team ristretto e specializzato nell'ambito di un percorso orientato alla professionalizzazione e all'innovazione tecnologica, realizzato e supportato in collaborazione con <strong>MegaHub Thiene</strong>.
              </p>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <MapPin size={16} color="var(--accent-green)" /> Thiene (VI)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  <Users size={16} color="var(--accent-green)" /> Team di 4
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Timeline del progetto */}
      <section className="timeline-section" style={{ padding: '80px 0', background: 'var(--bg-alt)', position: 'relative' }}>
        <div className="container">
          <FadeIn>
            <div className="section-header text-center" style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Come abbiamo costruito PLANT</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Un viaggio durato mesi, dalla prima scintilla all'implementazione funzionante hardware/software.
              </p>
            </div>
          </FadeIn>

          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Linea centrale verticale */}
            <div style={{ position: 'absolute', left: '24px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--accent-green), transparent)' }}></div>
            
            {timelineSteps.map((step, index) => (
              <FadeIn key={index} style={{ display: 'flex', gap: '30px', marginBottom: '50px', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  flexShrink: 0, 
                  width: '50px', height: '50px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-color)', 
                  border: '2px solid var(--accent-green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-green)',
                  boxShadow: '0 0 0 8px var(--bg-alt)'
                }}>
                  {step.icon}
                </div>
                <div className="mission-card" style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '10px' }}>{step.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Il Team */}
      <section className="team-section" style={{ padding: '100px 0' }}>
        <div className="container text-center">
          <FadeIn>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '20px' }}>TEAM PLANT</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 60px' }}>
              Un gruppo di studenti e professionisti uniti dalla stessa visione: portare l'IoT e la cura della natura nel palmo della tua mano.
            </p>
          </FadeIn>
          <div className="team-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {teamMembers.map((member, index) => (
              <FadeIn key={index} className="team-member hover-lift">
                <div className="team-avatar">
                  <User size={36} />
                </div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{member.name}</h4>
                <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 500 }}>{member.role}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer pre-CTA */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
        <div className="container text-center">
          <FadeIn>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '20px' }}>Vuoi saperne di più sul progetto?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Scopri i prodotti che abbiamo ideato e sperimentato.</p>
            <Link href="/prodotti" className="btn btn-primary" style={{ display: 'inline-flex' }}>Esplora i Dispositivi PLANT</Link>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
