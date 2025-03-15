import React from "react";
import { Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts";

const Piegraph: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
          Product Distribution
        </Typography>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 335, label: "Product A" },
                { id: 1, value: 310, label: "Product B" },
                { id: 2, value: 234, label: "Product C" },
                { id: 3, value: 135, label: "Product D" },
                { id: 4, value: 1548, label: "Product E" },
              ],
            },
          ]}
          width={isMobile ? 350 : 800}
          height={300}
        />
      </CardContent>
    </Card>
  );
};

export default Piegraph;
