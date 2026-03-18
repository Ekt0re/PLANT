import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
              const expirationOptions = { ...options, maxAge: 60 * 60 * 24 * 30 }
              request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            const expirationOptions = { ...options, maxAge: 60 * 60 * 24 * 30 }
            supabaseResponse.cookies.set(name, value, expirationOptions)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ============================================================
  // MODALITÀ MANUTENZIONE - Blocco completo lato backend
  // ============================================================
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === 'true'
  const isMaintenancePath = request.nextUrl.pathname === '/maintenance'
  const isStaticAsset = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/favicon')

  if (isMaintenanceMode) {
    // Se è un asset statico, lascia passare
    if (isStaticAsset) return supabaseResponse

    // Se siamo già sulla pagina di manutenzione, non fare redirect loop
    if (isMaintenancePath) return supabaseResponse

    // Controlla se l'utente è admin (unico bypass)
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()

      if (profile?.is_admin) return supabaseResponse // Admin bypassa
    }

    // BLOCCO TOTALE: ogni altra richiesta va in manutenzione
    const url = request.nextUrl.clone()
    url.pathname = '/maintenance'
    return NextResponse.redirect(url)
  }

  // Se la manutenzione è disattiva ma l'utente è su /maintenance, redirezione a home
  if (!isMaintenanceMode && isMaintenancePath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // ============================================================
  // ROTTE PROTETTE (Auth check)
  // ============================================================
  const isAuthProtected = 
    request.nextUrl.pathname.startsWith('/account/profilo') ||
    request.nextUrl.pathname.startsWith('/ordini') ||
    request.nextUrl.pathname.startsWith('/preferiti') ||
    request.nextUrl.pathname.startsWith('/admin');

  if (isAuthProtected) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/account'
      return NextResponse.redirect(url)
    }

    // Se è una rotta ADMIN, verifica il ruolo nel profilo
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/account/profilo'
        return NextResponse.redirect(url)
      }
    }
  }

  // Blocco guest rotte (redirect da login a profilo se già loggato)
  if (
    user && 
    (request.nextUrl.pathname === '/account' || request.nextUrl.pathname.startsWith('/login'))
  ) {
      const url = request.nextUrl.clone()
      url.pathname = '/account/profilo'
      return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
