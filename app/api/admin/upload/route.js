import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  return profile?.is_admin === true;
}

export async function POST(request) {
  const supabase = await createClient();
  
  // 1. Verifica Admin
  const isAdmin = await checkAdmin(supabase);
  if (!isAdmin) {
    // If checkAdmin returns false, it means either no user or user is not admin.
    // We can return a generic unauthorized/forbidden message.
    // For more specific errors, checkAdmin would need to return more detail.
    const { data: { user } } = await supabase.auth.getUser(); // Re-check for user to differentiate 401 vs 403
    if (!user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    } else {
      return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName');

    if (!file) return NextResponse.json({ error: 'File mancante' }, { status: 400 });

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
