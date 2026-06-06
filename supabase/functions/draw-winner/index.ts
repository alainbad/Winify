import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!
const RANDOM_ORG_KEY = Deno.env.get('RANDOM_ORG_API_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const ADMIN_EMAIL = 'badranalain87@gmail.com'
const FROM_EMAIL = 'Tick Pick <noreply@tick-pick.com>'
const SITE_URL = 'https://tick-pick.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { pool_id } = await req.json()
    if (!pool_id) return new Response(JSON.stringify({ error: 'pool_id required' }), { status: 400, headers: corsHeaders })

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { data: existing } = await supabase
      .from('winners')
      .select('id')
      .eq('pool_id', pool_id)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ error: 'Draw already completed for this pool' }), { status: 400, headers: corsHeaders })
    }

    const { data: entries, error: entriesErr } = await supabase
      .from('entries')
      .select('id, user_id')
      .eq('pool_id', pool_id)

    if (entriesErr || !entries || entries.length === 0) {
      return new Response(JSON.stringify({ error: 'No entries found for this pool' }), { status: 400, headers: corsHeaders })
    }

    const randomRes = await fetch('https://api.random.org/json-rpc/4/invoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: { apiKey: RANDOM_ORG_KEY, n: 1, min: 0, max: entries.length - 1, replacement: true },
        id: 1,
      }),
    })

    const randomData = await randomRes.json()
    const randomIndex = randomData.result.random.data[0]
    const winningEntry = entries[randomIndex]

    const { data: userData } = await supabase.auth.admin.getUserById(winningEntry.user_id)
    const winnerEmail = userData?.user?.email ?? ''
    const winnerName = userData?.user?.user_metadata?.full_name ?? winnerEmail

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

    const ticketNumber = randomIndex + 1
    const totalTickets = entries.length
    const drawnAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // Email the winner
    if (winnerEmail) {
      await sendEmail(
        winnerEmail,
        `🏆 Congratulations! You won on Tick Pick!`,
        `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB">
          <div style="background:#7C3AED;padding:40px 32px;text-align:center">
            <div style="font-size:48px;margin-bottom:8px">🏆</div>
            <h1 style="color:#fff;margin:0;font-size:28px;font-weight:900">You won!</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px">Congratulations, ${winnerName}</p>
          </div>
          <div style="padding:32px">
            <p style="font-size:16px;color:#111827;margin:0 0 20px">Your ticket <strong>#${ticketNumber}</strong> was drawn from <strong>${totalTickets} entries</strong> for <strong>Pool #${pool_id}</strong> on ${drawnAt}.</p>
            <p style="font-size:14px;color:#6B7280;margin:0 0 28px">The draw was conducted using RANDOM.ORG — a certified true random number generator, fully transparent and tamper-proof.</p>
            <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-bottom:28px">
              <p style="margin:0;font-size:14px;color:#15803D;font-weight:700">What happens next?</p>
              <p style="margin:8px 0 0;font-size:13px;color:#166534">Our team will contact you within 24 hours to arrange delivery of your prize. Reply to this email if you have any questions.</p>
            </div>
            <a href="${SITE_URL}/winners" style="display:block;background:#7C3AED;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:800;font-size:14px">View Winners Page</a>
          </div>
          <div style="padding:20px 32px;border-top:1px solid #E5E7EB;text-align:center">
            <p style="margin:0;font-size:12px;color:#9CA3AF">Tick Pick · tick-pick.com</p>
          </div>
        </div>`
      )
    }

    // Email the admin
    await sendEmail(
      ADMIN_EMAIL,
      `🎲 Draw completed — Pool #${pool_id}`,
      `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E5E7EB">
        <div style="background:#1F2937;padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:900">Draw Completed</h1>
          <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">Pool #${pool_id} · ${drawnAt}</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-bottom:1px solid #F3F4F6">
              <td style="padding:10px 0;color:#6B7280;font-weight:600">Winner</td>
              <td style="padding:10px 0;color:#111827;font-weight:700;text-align:right">${winnerName}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6">
              <td style="padding:10px 0;color:#6B7280;font-weight:600">Email</td>
              <td style="padding:10px 0;color:#111827;text-align:right">${winnerEmail}</td>
            </tr>
            <tr style="border-bottom:1px solid #F3F4F6">
              <td style="padding:10px 0;color:#6B7280;font-weight:600">Ticket</td>
              <td style="padding:10px 0;color:#111827;text-align:right">#${ticketNumber} of ${totalTickets}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6B7280;font-weight:600">Pool ID</td>
              <td style="padding:10px 0;color:#111827;text-align:right">#${pool_id}</td>
            </tr>
          </table>
          <a href="${SITE_URL}/admin" style="display:block;margin-top:24px;background:#1F2937;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:800;font-size:14px">Open Admin Panel</a>
        </div>
      </div>`
    )

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
