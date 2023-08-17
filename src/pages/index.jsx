import { useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";
import Chart from "@/components/Chart";
import { Donut } from "@/components/Donut";
import SearchDrawer from "@/components/SearchDrawer";
import {
  Title,
  BarList,
  Card,
  Text,
  DateRangePicker,
  DateRangePickerItem,
  Button,
} from "@tremor/react";
import { BiSearch } from "react-icons/bi";
import { timeFormatter } from "@/utils/timeFormatter";
import { getCategories } from "@/utils/getCategories";
import { getInsights } from "@/utils/getInsights";
import { getTotalDays } from "@/utils/getTotalDays";
import { getDaysData } from "@/utils/getDaysData";
import "react-modern-drawer/dist/index.css";

export default function Home({
  data,
  totalHoursData,
  averageHoursData,
  categoryData,
  averageWorkWeekData,
  sevenDaysData,
}) {
  const [chartData, setChartData] = useState(data);
  const [totalHours, setTotalHours] = useState(totalHoursData);
  const [averageHours, setAverageHours] = useState(averageHoursData);
  const [averageWorkWeek, setAverageWorkWeek] = useState(averageWorkWeekData);
  const [categories, setCategories] = useState(categoryData);
  const [daysData, setDaysData] = useState(sevenDaysData);
  const [restrictAccess, setRestrictAccess] = useState(false);
  const [isRittik, setIsRittik] = useState(false);

  useEffect(() => {
    async function fetchIsRittik() {
      try {
        const response = await fetch("/api/ip");
        const data = await response.json();
        setIsRittik(data.isRittik);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchIsRittik();
  }, []);

  // from date should be 1 month before to date
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  const toDate = new Date();
  toDate.setDate(toDate.getUTCDate() - 1);

  const [dateInput, setDateInput] = useState({
    from: fromDate,
    to: toDate,
  });
  const [totalDays, setTotalDays] = useState(getTotalDays(fromDate, toDate));
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  async function dateChangeHandler(date) {
    let currentRestrictAccess = restrictAccess;
    if (!isRittik) {
      console.log("Not Rittik");
      currentRestrictAccess = date.selectValue === "All time";
      setRestrictAccess(currentRestrictAccess);
    }
    if (date.selectValue === "Last work day") {
      const request = await fetch(`/api/supabase?type=last_work_day`);
      const response = await request.json();
      setChartData(response.data);
      setTotalHours(response.totalHoursData);
      setAverageHours(response.averageHoursData);
      setCategories(response.categoryData);
      const date = new Date(response.data[0].date);
      date.setFullYear(new Date().getFullYear());
      setDateInput({
        from: date,
        to: date,
      });
      setTotalDays(1);
    } else {
      setDateInput(date);
      if (date.to !== undefined && date.from !== undefined) {
        let start;
        let end;
        if (date.selectValue === "Last 7 days") {
          start = date.from;
          end = date.to;
        } else {
          start = new Date(date.from);
          start.setDate(start.getDate() + 1);
          end = new Date(date.to);
          end.setDate(end.getDate() + 1);
        }

        const request = await fetch(
          `/api/supabase?start=${start.toISOString().slice(0, 10)}&end=${end
            .toISOString()
            .slice(0, 10)}&days=${getTotalDays(
            start,
            end
          )}&restrictAccess=${currentRestrictAccess}`
        );
        const response = await request.json();
        setChartData(response.data);
        setTotalHours(response.totalHoursData);
        setAverageHours(response.averageHoursData);
        setAverageWorkWeek(response.averageWorkWeek);
        setCategories(response.categoryData);
        setTotalDays(getTotalDays(start, end));
        setDaysData(response.daysData);
        // console.log(response.daysData);
      }
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => {
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  // logic to hide search button when footer is visible
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const searchButton = document.getElementById("searchButton");
      const footer = document.getElementById("footer");

      if (searchButton && footer) {
        const searchButtonRect = searchButton.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();

        if (searchButtonRect.bottom >= footerRect.top) {
          // console.log(searchButtonRect.bottom, footerRect.top);
          setIsSearchBarVisible(false);
        } else if (searchButtonRect.bottom < footerRect.top) {
          // console.log(searchButtonRect.bottom, footerRect.top);
          setIsSearchBarVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="max-w-5xl lg:mx-auto flex flex-col items-center gap-y-10 lg:justify-center h-full px-4 my-24 lg:mt-36">
      <Head>
        <title>frize | Productivity Dashboard</title>
      </Head>
      {/* put date range picker and search side by side */}
      <div className="flex flex-col justify-center items-center gap-y-10">
        <DateRangePicker
          className="max-w-xs lg:max-w-sm mx-auto px-4"
          enableSelect={true}
          enableYearNavigation={true}
          enableClear={true}
          placeholder="Select a date range"
          selectPlaceholder="Select"
          value={dateInput}
          onValueChange={dateChangeHandler}
          minDate={isRittik ? new Date("2022-12-25") : fromDate}
          maxDate={toDate}
          defaultValue={dateInput}
          color="lime"
        >
          <DateRangePickerItem
            className=""
            color="lime"
            key="last_work_day"
            value="Last work day"
          />
          <DateRangePickerItem
            className=""
            color="lime"
            key="last_7_days"
            value="Last 7 days"
            from={last7Days}
            to={toDate}
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
      </div>
      <Chart chartData={chartData} restrictAccess={restrictAccess} />
      {totalDays > 1 && isRittik && (
        <Card className="w-full md:order-none order-last -mt-10 md:mt-0">
          <Title>Day Based Trends</Title>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-none lg:grid-flow-col gap-4">
            {daysData.map((day) => (
              <Donut data={day} key={day.day} />
            ))}
          </div>
        </Card>
      )}
      <div className="md:grid grid-flow-col gap-y-10 space-y-10 md:space-y-0 gap-x-4 w-full">
        <div className="md:col-span-1">
          <Card className="">
            <Title>Insights</Title>
            {isRittik && (
              <Text className="mt-2">
                Showing data for {chartData.length} days
              </Text>
            )}
            <BarList
              data={totalHours}
              className="mt-6"
              valueFormatter={(value) =>
                timeFormatter(value, false, restrictAccess)
              }
            />
            {totalDays > 1 && (
              <Text className="mt-6 ">
                did not work for{" "}
                {isRittik ? totalDays - chartData.length : "🏖️"} out of{" "}
                {totalDays} days
              </Text>
            )}
          </Card>
        </div>
        {chartData.length > 1 && (
          <div className="md:col-span-1">
            <Card className="">
              <Title>Averages</Title>
              <BarList
                data={averageHours}
                className="mt-6"
                valueFormatter={(value) =>
                  timeFormatter(value, false, restrictAccess, isRittik)
                }
              />
              {totalDays > 6 && (
                <Text className="mt-6">
                  worked for {isRittik ? averageWorkWeek : "👨🏾‍💻"} days a week on
                  average
                </Text>
              )}
            </Card>
          </div>
        )}
        <div className="md:row-span-3 md:col-span-2">
          <Card className="">
            <Title>Category</Title>
            <BarList
              data={categories}
              className="mt-6"
              valueFormatter={(value) =>
                timeFormatter(value, false, restrictAccess)
              }
            />
          </Card>
        </div>
      </div>
      <div
        id="searchButton"
        className={`fixed bottom-8 lg:bottom-6 order-last z-50 w-full text-center`}
      >
        {isSearchBarVisible && (
          <Button
            size="md"
            icon={BiSearch}
            className="border dark:border-gray-800 border-gray-200 rounded-full py-1 px-4 dark:bg-black/30 bg-white/30 backdrop-blur"
            color="blue"
            variant="light"
            onClick={openDrawer}
          >
            Search
          </Button>
        )}
      </div>
      <SearchDrawer isOpen={isOpen} closeDrawer={closeDrawer} />
    </div>
  );
}

export const getStaticProps = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServerKey = process.env.SUPABASE_SERVICE_KEY || "";
  const SupabaseAdmin = createClient(supabaseUrl, supabaseServerKey);

  const startDate = new Date();
  // startDate.setDate(startDate.getDate() - 2);
  startDate.setMonth(startDate.getMonth() - 1);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);

  const { data, error } = await SupabaseAdmin.from("timelog")
    .select(
      "work_hours, focus, breaks, date, categories, work_categories, nonwork_categories, day"
    )
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

  const insightsData = getInsights(data, getTotalDays(startDate, endDate));
  const totalHoursData = insightsData.slice(0, 3);
  const averageHoursData = insightsData.slice(3, 6);
  const categoryData = getCategories(data);
  const averageWorkWeek = insightsData[6].value;
  const daysData = getDaysData(data);

  return {
    props: {
      data: data,
      totalHoursData: totalHoursData,
      averageHoursData: averageHoursData,
      categoryData: categoryData,
      averageWorkWeekData: averageWorkWeek,
      sevenDaysData: daysData,
    },
    revalidate: 1,
  };
};
