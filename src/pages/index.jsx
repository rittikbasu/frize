import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Chart from "@/components/Chart";
import {
  Title,
  Flex,
  BarList,
  Bold,
  Grid,
  Col,
  Card,
  Text,
  Metric,
  DateRangePicker,
  DateRangePickerItem,
} from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";
import { getCategories } from "@/utils/getCategories";
import { getInsights } from "@/utils/getInsights";

export default function Home({ data }) {
  const [categoryData, setCategoryData] = useState(getCategories(data));
  console.log(categoryData);
  const [chartData, setChartData] = useState(data);
  // from date should be 1 month before to date
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  const [dateInput, setDateInput] = useState({
    from: fromDate,
    to: new Date(),
  });

  function last7Days() {
    const today = new Date();
    const last7Days = new Date(today.setDate(today.getDate() - 7));

    return last7Days;
  }

  async function dateChangeHandler(date) {
    console.log(date);
    setDateInput(date);
    if (date.to !== undefined && date.from !== undefined) {
      let start = new Date(date.from);
      start.setDate(start.getDate() + 1);
      let end = new Date(date.to);
      end.setDate(end.getDate() + 1);

      const request = await fetch(
        `/api/supabase?start=${start.toISOString().slice(0, 10)}&end=${end
          .toISOString()
          .slice(0, 10)}`
      );
      const response = await request.json();
      setChartData(response.data);
      setCategoryData(getCategories(response.data));
    }
  }

  const barListData = getInsights(chartData);

  return (
    <div className="max-w-5xl lg:mx-auto flex flex-col gap-y-10 items-center lg:justify-center h-screen px-4 mt-28 lg:my-[40rem]">
      <DateRangePicker
        className="max-w-sm mx-auto focus:outline-none"
        enableSelect={true}
        enableYearNavigation={true}
        enableClear={true}
        placeholder="Select a date range"
        selectPlaceholder="Select"
        value={dateInput}
        onValueChange={dateChangeHandler}
        minDate={new Date("2022-12-24")}
        maxDate={new Date()}
        color="lime"
      >
        <DateRangePickerItem
          className=""
          color="lime"
          key="last_7_days"
          value="Last 7 days"
          from={last7Days()}
          to={new Date()}
        />
        <DateRangePickerItem
          className=""
          color="lime"
          key="all_data"
          value="All time"
          from={new Date("2022-12-24")}
          to={new Date()}
        />
      </DateRangePicker>
      <Chart chartData={chartData} />
      <Card className="">
        <Title>Insights</Title>
        <BarList
          data={barListData}
          className="mt-6"
          valueFormatter={timeFormatter}
        />
      </Card>
      <Card className="">
        <Title>Category</Title>
        <BarList
          data={categoryData}
          className="mt-6"
          valueFormatter={timeFormatter}
        />
      </Card>

      {/*  make a card showing the average hours worked, focus, breaks */}
      <Grid
        numItems={1}
        numItemsSm={2}
        numItemsLg={6}
        className="lg:gap-4 gap-y-4"
      >
        <Col numColSpan={3}>
          <Card className="">
            <Title>Insights</Title>
            <BarList
              data={barListData}
              className="mt-6"
              valueFormatter={timeFormatter}
            />
          </Card>
        </Col>
        <Col numColSpan={3}>
          <Card className="">
            <Title>Category</Title>
            <BarList
              data={categoryData}
              className="mt-6"
              valueFormatter={timeFormatter}
            />
          </Card>
        </Col>
        <Col numColSpan={1}>
          <Card className="bg-zinc-700 dark:bg-slate-950">
            <Text className="text-center text-base font-bold dark:text-lime-500">
              Average Breaks
            </Text>
            <Metric className="text-center text-xl font-bold">
              {timeFormatter(barListData[1].value)}
            </Metric>
          </Card>
        </Col>
      </Grid>
    </div>
  );
}

export const getStaticProps = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServerKey = process.env.SUPABASE_SERVICE_KEY || "";
  const SupabaseAdmin = createClient(supabaseUrl, supabaseServerKey);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  const endDate = new Date();

  const { data, error } = await SupabaseAdmin.from("insights")
    .select("work_hours, focus, breaks, date, categories")
    .gte("date", startDate.toISOString().slice(0, 10))
    .lte("date", endDate.toISOString().slice(0, 10))
    .order("date", { ascending: false });
  // .limit(130);

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

  return {
    props: {
      data: data,
    },
    revalidate: 1,
  };
};
