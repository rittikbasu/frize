import { createClient } from '@supabase/supabase-js'
import { getInsights } from '@/utils/getInsights'
import { getCategories } from '@/utils/getCategories'
import { getDaysData } from '@/utils/getDaysData'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServerKey = process.env.SUPABASE_SERVICE_KEY || ''

export const SupabaseAdmin = createClient(supabaseUrl, supabaseServerKey)

function processData(data) {
  data.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "short" });
    item.date = `${date.getDate()} ${month}`;
  });
  return data.reverse();
}

export default async (req, res) => {
  if (req.method === 'GET') {
    let data;
    if (req.query.type === 'last_work_day') {
      const { data } = await SupabaseAdmin.from('timelog')
        .select("work_hours, focus, breaks, date, categories")
        .order("date", { ascending: false })
        .limit(1);
      const insightsData = getInsights(data);
      const totalHoursData = insightsData.slice(0, 3);
      const averageHoursData = insightsData.slice(3, 6);
      const categoryData = getCategories(data);
      return res.status(200).json({
          data: processData(data) || null,
          totalHoursData: totalHoursData || null,
          averageHoursData: averageHoursData || null,
          categoryData: categoryData || null,
        })
    } 
    else {
      console.log(req.query.start, req.query.end, req.query.days, req.query.restrictAccess)
      const { data } = await SupabaseAdmin.from('timelog')
        .select("work_hours, focus, breaks, date, categories, nonwork_categories, day")
        .gte("date", req.query.start)
        .lte("date", req.query.end)
        .order("date", { ascending: false });
      const insightsData = getInsights(data, req.query.days);
      const totalHoursData = insightsData.slice(0, 3);
      const averageHoursData = insightsData.slice(3, 6);
      const categoryData = getCategories(data, req.query.restrictAccess);
      const averageWorkWeek = insightsData[6].value;
      const daysData = getDaysData(data);
    return res.status(200).json({
        data: processData(data) || null,
        totalHoursData: totalHoursData || null,
        averageHoursData: averageHoursData || null,
        categoryData: categoryData || null,
        averageWorkWeek: averageWorkWeek || null,
        daysData: daysData || null,
      })
    }
  }

  return res.status(400).json({
    message: 'Unsupported Request',
  })
}
