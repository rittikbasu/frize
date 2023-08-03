import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServerKey = process.env.SUPABASE_SERVICE_KEY || ''

export const SupabaseAdmin = createClient(supabaseUrl, supabaseServerKey)

export default async (req, res) => {
  if (req.method === 'GET') {
    console.log(req.query.start, req.query.end)
    const { data } = await SupabaseAdmin.from('insights')
      .select("work_hours, focus, breaks, date, categories")
      .gte("date", req.query.start)
      .lte("date", req.query.end)
      .order("date", { ascending: false });

    if (data) {
      data.forEach((item) => {
        const date = new Date(item.date);
        const month = date.toLocaleString("default", { month: "short" });
        item.date = `${date.getDate()} ${month}`;
      });
      return res.status(200).json({
        data: data.reverse() || null,
      })
    }
  }

  return res.status(400).json({
    message: 'Unsupported Request',
  })
}
