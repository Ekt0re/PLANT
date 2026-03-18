'use client';

import { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

/**
 * Componente per il rendering sicuro del contenuto Markdown/HTML lato client.
 * Evita dipendenze pesanti come jsdom nel Server Side Rendering (SSR) per 
 * migliorare stabilità su piattaforme serverless come Netlify.
 */
export default function NewsContent({ content, customCss }) {
  const [renderedHtml, setRenderedHtml] = useState('');
  const [cleanCss, setCleanCss] = useState('');

  useEffect(() => {
    async function processContent() {
      if (!content) return;
      
      try {
        // Parsing Markdown
        const rawHtml = await marked.parse(content);
        
        // Sanitizzazione nel browser (usando isomorphic-dompurify che si aggancia al DOM nativo)
        const cleanHtml = DOMPurify.sanitize(rawHtml, { 
          ADD_TAGS: ['iframe', 'style', 'button', 'center', 'div'], 
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'class', 'style', 'data-product'] 
        });
        
        setRenderedHtml(cleanHtml);

        if (customCss) {
          const sanitizedCss = DOMPurify.sanitize(customCss, { ADD_TAGS: ['style'] });
          setCleanCss(sanitizedCss);
        }
      } catch (err) {
        console.error('Errore durante il parsing del contenuto news:', err);
      }
    }

    processContent();
  }, [content, customCss]);

  return (
    <>
      {cleanCss && (
        <style dangerouslySetInnerHTML={{ __html: cleanCss }} />
      )}
      <div 
        className="news-content" 
        dangerouslySetInnerHTML={{ __html: renderedHtml || (content ? 'Caricamento contenuto...' : '') }} 
      />
    </>
  );
}
