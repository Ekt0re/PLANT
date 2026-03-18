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
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  try {
    const { id, ...payload } = await request.json();
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const supabase = await createClient();
  if (!(await checkAdmin(supabase))) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
