import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseEnv } from '../env'

export async function createClient() {
    const cookieStore = await cookies()
    const { url, anonKey } = getSupabaseEnv()

    return createServerClient(
        url,
        anonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Server Components can hit this path because request
                        // cookies are read-only there. That is expected here
                        // because proxy.ts refreshes auth cookies per request.
                    }
                },
            },
        }
    )
}
