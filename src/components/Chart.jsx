import { Card, Title, LineChart } from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";

export default function Chart(chartData) {
  console.log(chartData.chartData);
  return (
    <Card className="">
      <Title>Productivity Graph</Title>
      <LineChart
        className="mt-6"
        data={chartData.chartData}
        index="date"
        categories={["work_hours", "focus", "breaks"]}
        colors={["lime", "gray", "orange"]}
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
