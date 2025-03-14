import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { getUser, checkServiceStatus } from "../services/apiService";
import SalesChart from "../components/Linegraph";
import ProductChart from "../components/Piegraph";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [serviceStatus, setServiceStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceStatus = async () => {
      const response = await checkServiceStatus();
      setServiceStatus(response.message ?? null);
    };
    fetchServiceStatus();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
      <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        {serviceStatus ? serviceStatus : "Loading..."}
      </Typography>

      {/* Line Chart */}
      <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
        <SalesChart />
      </Box>

      {/* Pie Chart */}
      <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
        <ProductChart />
      </Box>
    </Box>
  );
};

export default Home;
