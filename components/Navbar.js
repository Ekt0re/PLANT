'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, isLoaded } = useCart();
  const pathname = usePathname();

  if (pathname === '/maintenance') return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image 
              src="/assets/Logo.png" 
              alt="PLANT Logo" 
              width={35} 
              height={35} 
              style={{ objectFit: 'contain', height: '35px', width: 'auto' }}
              priority
            />
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '800', 
              letterSpacing: '-0.02em',
              color: 'var(--text-dark)'
            }}>PLANT</span>
          </Link>
        </div>
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link href="/prodotti" onClick={() => setIsMobileMenuOpen(false)}>Prodotti</Link></li>
          <li><Link href="/news" onClick={() => setIsMobileMenuOpen(false)}>News</Link></li>
          <li><Link href="/chi-siamo" onClick={() => setIsMobileMenuOpen(false)}>Chi siamo</Link></li>
          <li><Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>Account</Link></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/carrello" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
            <ShoppingBag size={24} />
            {isLoaded && cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: 'var(--accent-green)', color: 'white',
                borderRadius: '50%', width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            className="mobile-menu-btn" 
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
}
