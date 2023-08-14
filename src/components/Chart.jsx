import { Card, Title, LineChart } from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";

export default function Chart({ chartData, restrictAccess }) {
  // change the names of keys in the object chartData to uppercase
  const unwantedKeys = ["categories", "work_categories", "day"];
  const colors = ["lime", "gray", "orange", "violet"];
  if (restrictAccess) {
    unwantedKeys.push("focus");
    colors.splice(1, 1);
  }
  const data = chartData.map((item) => {
    const newItem = {};
    Object.keys(item).forEach((key) => {
      if (unwantedKeys.includes(key)) return;
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
  // get keys
  const keys = Object.keys(data[0]).filter((key) => key !== "Date");
  return (
    <Card className="">
      <Title>Productivity Graph</Title>
      <LineChart
        className="mt-6"
        data={data}
        index="Date"
        categories={keys}
        colors={colors}
        valueFormatter={timeFormatter}
        yAxisWidth={26}
        // showLegend={false}
        curveType="monotone"
        showYAxis={!restrictAccess}
        showTooltip={!restrictAccess}
        startEndOnly={restrictAccess}
      />
    </Card>
  );
}
