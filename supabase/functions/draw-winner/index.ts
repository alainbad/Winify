import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RANDOM_ORG_KEY = Deno.env.get('RANDOM_ORG_API_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { pool_id } = await req.json()
    if (!pool_id) return new Response(JSON.stringify({ error: 'pool_id required' }), { status: 400, headers: corsHeaders })

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Check draw hasn't already happened for this pool
    const { data: existing } = await supabase
      .from('winners')
      .select('id')
      .eq('pool_id', pool_id)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ error: 'Draw already completed for this pool' }), { status: 400, headers: corsHeaders })
    }

    // Fetch all entries for this pool
    const { data: entries, error: entriesErr } = await supabase
      .from('entries')
      .select('id, user_id')
      .eq('pool_id', pool_id)

    if (entriesErr || !entries || entries.length === 0) {
      return new Response(JSON.stringify({ error: 'No entries found for this pool' }), { status: 400, headers: corsHeaders })
    }

    // Call RANDOM.ORG to get a truly random integer
    const randomRes = await fetch('https://api.random.org/json-rpc/4/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: RANDOM_ORG_KEY,
          n: 1,
          min: 0,
          max: entries.length - 1,
          replacement: true,
        },
        id: 1,
      }),
    })

    const randomData = await randomRes.json()
    const randomIndex = randomData.result.random.data[0]
    const winningEntry = entries[randomIndex]

    // Get user details
    const { data: userData } = await supabase.auth.admin.getUserById(winningEntry.user_id)
    const winnerEmail = userData?.user?.email ?? ''
    const winnerName = userData?.user?.user_metadata?.full_name ?? winnerEmail

    // Record the winner
    const { data: winner, error: winnerErr } = await supabase
      .from('winners')
      .insert({
        pool_id,
        entry_id: winningEntry.id,
        user_id: winningEntry.user_id,
        winner_name: winnerName,
        winner_email: winnerEmail,
        random_index: randomIndex,
        total_entries: entries.length,
        drawn_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (winnerErr) throw winnerErr

    return new Response(JSON.stringify({ success: true, winner }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
