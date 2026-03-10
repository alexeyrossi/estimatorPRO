import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAuthCookieNames, isRecoverableSupabaseRefreshError } from './lib/auth/supabaseAuthRecovery'
import { getSupabaseEnv } from './lib/env'

function clearSupabaseAuthCookies(
    request: NextRequest,
    response: NextResponse,
    cookieNames: string[]
) {
    if (cookieNames.length === 0) return response

    request.cookies.delete(cookieNames)
    cookieNames.forEach((name) => response.cookies.delete(name))

    return response
}

export async function proxy(request: NextRequest) {
    const { url, anonKey } = getSupabaseEnv()
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        url,
        anonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let user = null
    let cookiesToClear: string[] = []

    try {
        const {
            data: { user: resolvedUser },
        } = await supabase.auth.getUser()

        user = resolvedUser
    } catch (error) {
        if (!isRecoverableSupabaseRefreshError(error)) {
            throw error
        }

        cookiesToClear = getSupabaseAuthCookieNames(
            request.cookies.getAll(),
            supabaseResponse.cookies.getAll()
        )
    }

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/history')
    const isLoginRoute = request.nextUrl.pathname === '/login'

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return clearSupabaseAuthCookies(request, NextResponse.redirect(url), cookiesToClear)
    }

    if (isLoginRoute && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return clearSupabaseAuthCookies(request, supabaseResponse, cookiesToClear)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
