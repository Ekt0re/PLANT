'use client';

/**
 * useCache - Sistema di caching leggero per PLANT
 * 
 * Utilizza sessionStorage per persistere i dati tra le navigazioni
 * nella stessa sessione del browser. Supporta TTL configurabile
 * e invalidazione manuale.
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minuti

/**
 * Salva un valore nella cache con timestamp
 */
export function setCacheItem(key, data, ttl = DEFAULT_TTL) {
  try {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    sessionStorage.setItem(`plant_cache_${key}`, JSON.stringify(item));
  } catch (e) {
    // sessionStorage pieno o non disponibile — silenzioso
    console.warn('Cache write failed:', e);
  }
}

/**
 * Recupera un valore dalla cache se non è scaduto
 */
export function getCacheItem(key) {
  try {
    const raw = sessionStorage.getItem(`plant_cache_${key}`);
    if (!raw) return null;

    const item = JSON.parse(raw);
    const isExpired = Date.now() - item.timestamp > item.ttl;
    
    if (isExpired) {
      sessionStorage.removeItem(`plant_cache_${key}`);
      return null;
    }

    return item.data;
  } catch (e) {
    return null;
  }
}

/**
 * Invalida una o più chiavi dalla cache
 */
export function invalidateCache(...keys) {
  keys.forEach(key => {
    sessionStorage.removeItem(`plant_cache_${key}`);
  });
}

/**
 * Invalida tutta la cache PLANT
 */
export function clearAllCache() {
  const toRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith('plant_cache_')) {
      toRemove.push(key);
    }
  }
  toRemove.forEach(key => sessionStorage.removeItem(key));
}

/**
 * Fetch con cache integrata.
 * Se il dato è in cache e non scaduto, lo restituisce subito.
 * Altrimenti esegue la funzione fetcher e salva il risultato.
 * 
 * @param {string} key - Chiave cache univoca
 * @param {Function} fetcher - Funzione async che ritorna i dati
 * @param {number} ttl - Durata della cache in ms (default: 5 min)
 * @returns {Promise<any>} - Dati dalla cache o dal fetcher
 */
export async function cachedFetch(key, fetcher, ttl = DEFAULT_TTL) {
  const cached = getCacheItem(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  setCacheItem(key, data, ttl);
  return data;
}
