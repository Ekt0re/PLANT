import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'plant-default-secret-key-32-chars!!'; // Deve essere 32 chars
const IV_LENGTH = 16; 

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { first_name, last_name, birth_date, address, phone } = await request.json();

    // 1. Validazione base
    if (phone && !/^\+?[0-9\s-]{8,20}$/.test(phone)) {
      return NextResponse.json({ error: 'Formato telefono non valido' }, { status: 400 });
    }

    // 2. Sanificazione (molto base, Next/React gestiscono già l'output encoding)
    const sanitizedFirstName = first_name?.replace(/<[^>]*>?/gm, '');
    const sanitizedLastName = last_name?.replace(/<[^>]*>?/gm, '');

    // 3. Cifratura
    const encryptedPhone = encrypt(phone);
    const encryptedAddress = encrypt(address);

    // 4. Update nel DB
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: sanitizedFirstName || null,
        last_name: sanitizedLastName || null,
        birth_date: birth_date || null,
        phone: encryptedPhone, // Salviamo il dato cifrato
        address: encryptedAddress, // Salviamo il dato cifrato
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('DB Update Error:', error);
      return NextResponse.json({ error: 'Errore nel salvataggio dei dati' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Profile Error:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
