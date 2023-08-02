import { Card, Title, LineChart } from "@tremor/react";

function dataFormatter(total_hours) {
  // Calculate the hours and minutes
  const hours = Math.floor(total_hours);
  const minutes = Math.floor((total_hours - hours) * 60);

  // Format the time string
  let time_str;
  if (hours === 0) {
    time_str = `${minutes} min`;
  } else if (minutes === 0) {
    time_str = `${hours} hr`;
  } else {
    time_str = `${hours} hr ${minutes} min`;
  }

  return time_str;
}

export default function Chart(chartdata) {
  console.log(chartdata.chartdata);
  return (
    <Card className="">
      <Title>Productivity Graph</Title>
      <LineChart
        className="mt-6"
        data={chartdata.chartdata}
        index="date"
        categories={["work_hours", "focus", "breaks"]}
        colors={["lime", "gray", "orange"]}
        valueFormatter={dataFormatter}
        yAxisWidth={26}
      />
    </Card>
  );
}
