export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Return false if they are missing or still have placeholder values
  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) return false;
  if (url === 'YOUR_SUPABASE_URL' || key === 'YOUR_SUPABASE_ANON_KEY') return false;
  
  return true;
}
