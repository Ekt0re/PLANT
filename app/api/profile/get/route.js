import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'plant-default-secret-key-32-chars!!';
const IV_LENGTH = 16;

function decrypt(text) {
  if (!text || !text.includes(':')) return text; // Ritorna il testo così com'è se non sembra cifrato (per compatibilità dati vecchi)
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    console.error('Decryption error:', e);
    return 'ERR_DEC';
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: 'Profilo non trovato' }, { status: 404 });
    }

    // Decifriamo i campi sensibili
    const decryptedProfile = {
      ...profile,
      phone: decrypt(profile.phone),
      address: decrypt(profile.address)
    };

    return NextResponse.json(decryptedProfile);
  } catch (error) {
    console.error('API Profile GET Error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
