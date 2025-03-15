import React from "react";
import { Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";

interface LineGraphProps {
  xAxisData: string[];
  seriesData: number[];
  title?: string;
  seriesLabel?: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ xAxisData, seriesData, title = "Sales Over Time", seriesLabel = "Sales" }: LineGraphProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <LineChart
          xAxis={[{ data: xAxisData }]}
          series={[{ data: seriesData, label: seriesLabel }]}
          width={isMobile ? 350 : 800}
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default LineGraph;
