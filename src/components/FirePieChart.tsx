import * as React from "react";
import { PieChart } from "@mui/x-charts";

interface FireDayData {
  total_fires: number;
  total_day_fires: number;
  total_night_fires: number;
}

interface FireChartProps {
  fireDayData?: FireDayData; // Make it optional to avoid undefined errors
}

const FirePieChart: React.FC<FireChartProps & { loading: boolean }> = ({ fireDayData, loading }: FireChartProps & { loading: boolean }) => {

  // Fallback values if data is missing
  const data = fireDayData
    ? [
        { id: 0, value: fireDayData.total_day_fires, label: "Day Fires" },
        { id: 1, value: fireDayData.total_night_fires, label: "Night Fires" },
      ]
    : [{ id: 0, value: 1, label: "No Data" }]; // Default placeholder to prevent errors

  return <PieChart loading={loading} series={[{ data }]} height={290} />;
};

export default FirePieChart;
