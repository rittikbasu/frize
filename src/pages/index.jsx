import { createClient } from "@supabase/supabase-js";
import Chart from "@/components/Chart";

export default function Home(data) {
  const chartdata = data.data;
  console.log(chartdata);
  return (
    <div className="max-w-2xl flex items-center justify-center h-screen mx-auto px-4">
      <Chart chartdata={chartdata} />
    </div>
  );
}

export const getStaticProps = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServerKey = process.env.SUPABASE_SERVICE_KEY || "";
  const SupabaseAdmin = createClient(supabaseUrl, supabaseServerKey);

  const { data, error } = await SupabaseAdmin.from("insights")
    .select("work_hours, focus, breaks, date")
    .order("date", { ascending: false })
    .limit(100);

  if (error) {
    console.log(error);
  } else {
    // convert date to dd MMM format without year
    data.forEach((item) => {
      const date = new Date(item.date);
      const month = date.toLocaleString("default", { month: "short" });
      item.date = `${date.getDate()} ${month}`;
    });
    // change the order of the data
    data.reverse();
  }

  // else {
  //   data.forEach((item) => {
  //     const date = new Date(item.date);
  //     const month = date.toLocaleString("default", { month: "short" });
  //     const year = date.toLocaleString("default", { year: "2-digit" });
  //     item.date = `${month} ${year}`;
  //   });
  // }

  return {
    props: {
      data: data,
    },
    revalidate: 1,
  };
};
