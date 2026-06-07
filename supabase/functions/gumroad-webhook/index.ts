import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? 'https://dwjghqslnrkcjhaoaneq.supabase.co'
const SUPABASE_SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!
const GUMROAD_SELLER_ID = Deno.env.get('GUMROAD_SELLER_ID')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const seller_id = params.get('seller_id') ?? ''
    const refunded = params.get('refunded') ?? 'false'
    const passthrough = params.get('passthrough') ?? ''
    const sale_id = params.get('sale_id') ?? ''
    const email = params.get('email') ?? ''
    const price_raw = params.get('price') ?? '0'
    const order_number = params.get('order_number') ?? ''

    // Verify seller_id
    if (GUMROAD_SELLER_ID && seller_id !== GUMROAD_SELLER_ID) {
      return new Response(JSON.stringify({ error: 'Seller ID mismatch' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Skip refunded purchases
    if (refunded === 'true') {
      return new Response(JSON.stringify({ ok: true, skipped: 'refunded' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse passthrough JSON
    let user_id: string
    let pool_id: number
    try {
      const parsed = JSON.parse(passthrough)
      user_id = String(parsed.user_id)
      pool_id = Number(parsed.pool_id)
      if (!user_id || !pool_id) throw new Error('Missing user_id or pool_id')
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid passthrough payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!sale_id) {
      return new Response(JSON.stringify({ error: 'Missing sale_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Price comes in cents from Gumroad — convert to dollars
    const amount_paid = Number(price_raw) / 100

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { error } = await supabase
      .from('entries')
      .upsert(
        {
          user_id,
          pool_id,
          tickets: 1,
          amount_paid,
          sale_id,
          gumroad_order: order_number,
        },
        { onConflict: 'sale_id' }
      )

    if (error) throw error

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
