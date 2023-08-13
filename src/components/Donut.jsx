import { DonutChart, Text } from "@tremor/react";
import { timeFormatter } from "@/utils/timeFormatter";

export function Donut({ data }) {
  console.log(data.data);
  return (
    <div className="flex flex-col items-center gap-y-2">
      <DonutChart
        className="mt-6 w-24 ring-0 outline-none md:w-24 md:h-24 md:text-sm text-xs lg:text-sm h-24 lg:w-28 lg:h-28"
        data={data.data}
        // category="sales"
        index="name"
        valueFormatter={timeFormatter}
        label={timeFormatter(data.data[0].value, true)}
        colors={["slate", "lime", "stone", "indigo"]}
      />
      <Text className="dark:font-medium">{data.day}</Text>
    </div>
  );
}
