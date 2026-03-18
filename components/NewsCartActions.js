'use client';

import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

/**
 * Componente invisibile che aggiunge listener ai pulsanti "Compra Ora" 
 * inseriti dinamicamente nel contenuto HTML delle news.
 */
export default function NewsCartActions() {
  const { addToCart } = useCart();

  useEffect(() => {
    const handleBuyClick = (e) => {
      const btn = e.target.closest('.buy-now-btn');
      if (!btn) return;

      try {
        const productData = JSON.parse(btn.getAttribute('data-product'));
        if (productData && productData.id) {
          addToCart(productData);
          
          // Feedback visivo temporaneo sul pulsante
          const originalText = btn.innerHTML;
          btn.innerHTML = '✓ Aggiunto!';
          btn.style.background = 'var(--accent-green)';
          btn.style.color = 'white';
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }
      } catch (err) {
        console.error('Errore durante l\'aggiunta al carrello dalla news:', err);
      }
    };

    document.addEventListener('click', handleBuyClick);
    return () => document.removeEventListener('click', handleBuyClick);
  }, [addToCart]);

  return null; // Componente funzionale senza UI propria
}
