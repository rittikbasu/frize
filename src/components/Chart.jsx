import { Card, Title, LineChart } from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";

export default function Chart(chartData) {
  // change the names of keys in the object chartData to uppercase
  const data = chartData.chartData.map((item) => {
    const newItem = {};
    Object.keys(item).forEach((key) => {
      let newKey;
      if (key === "nonwork_categories") {
        newKey = "Non-work hours";
      } else {
        // key to title case
        newKey = key
          .split("_")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ");
      }
      newItem[newKey] = item[key];
    });
    return newItem;
  });

  console.log(data);

  const keys = Object.keys(data[0]).filter(
    (key) =>
      key !== "Date" &&
      key !== "Categories" &&
      key !== "Work Categories" &&
      key !== "Day"
  );

  return (
    <Card className="">
      <Title>Productivity Graph</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="Date"
        categories={keys}
        colors={["lime", "gray", "orange", "violet"]}
        valueFormatter={timeFormatter}
        yAxisWidth={26}
        // showLegend={false}
        curveType="monotone"
        // showYAxis={false}
        // showXAxis={false}
        // showTooltip={false}
        // showGridLines={false}
      />
    </Card>
  );
}
