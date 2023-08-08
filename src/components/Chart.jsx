import { Card, Title, LineChart } from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";

export default function Chart(chartData) {
  const keys = Object.keys(chartData.chartData[0]).filter(
    (key) => key !== "date" && key !== "categories"
  );
  return (
    <Card className="">
      <Title>Productivity Graph</Title>
      <LineChart
        className="mt-6"
        data={chartData.chartData}
        index="date"
        categories={keys}
        colors={["lime", "gray", "orange", "pink", "violet"]}
        valueFormatter={timeFormatter}
        yAxisWidth={26}
        // showLegend={false}
        curveType="monotone"
        // showYAxis={false}
        // showTooltip={false}
      />
    </Card>
  );
}
