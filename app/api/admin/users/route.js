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

export async function GET() {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });

  // Recupera profili e conteggi tramite subqueries o join
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, first_name, last_name, is_admin, created_at,
      devices:devices(count),
      orders:orders(count)
    `);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
