import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

function normalizeSupabaseUrl(url: string): string {
	return url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
}

export const supabase = createClient(normalizeSupabaseUrl(rawUrl), key)
