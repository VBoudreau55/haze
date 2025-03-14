import React from "react";
import { Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";

const LineGraph: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
          Sales Over Time
        </Typography>
        <LineChart
          xAxis={[{ data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] }]}
          series={[{ data: [820, 932, 901, 934, 1290, 1330, 1320], label: "Sales" }]}
          width={isMobile ? 350 : 800}
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default LineGraph;
