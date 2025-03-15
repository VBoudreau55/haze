import React from "react";
import { Gauge } from "@mui/x-charts/Gauge";
import { Box, Typography, CircularProgress } from "@mui/material";

interface FireStats {
  avg_brightness: number;
  avg_bright_ti5: number;
  avg_frp: number;
}

interface FireGaugeProps {
  fireStats: FireStats;
  countryName: string;
}
const FireGaugeChart: React.FC<FireGaugeProps & { loading: boolean }> = ({ fireStats, loading, countryName }: FireGaugeProps & { loading: boolean }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%" height="100%" m={2} pt={2}>
          <Typography variant="h5" gutterBottom>Fire Stat Averages in {countryName}</Typography>
          <Box display="flex" justifyContent="space-around" alignItems="center" width="100%" height="100%">
          
            {/* Brightness Gauge */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" m={2}>
              <Typography variant="h6" gutterBottom>Brightness (K)</Typography>
              <Gauge value={parseFloat(fireStats.avg_brightness.toPrecision(2))} width={100} height={100} valueMin={250} valueMax={500} startAngle={-90} endAngle={90}/>
            </Box>

            {/* Bright_ti5 Gauge */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" m={2}>
              <Typography variant="h6" gutterBottom>Bright_ti5 (K)</Typography>
              <Gauge value={parseFloat(fireStats.avg_bright_ti5.toPrecision(2))} width={100} height={100} valueMin={200} valueMax={400} startAngle={-90} endAngle={90}/>
            </Box>

            {/* FRP Gauge */}
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" m={2}>
              <Typography variant="h6" gutterBottom>Fire Radiative Power (W)</Typography>
              <Gauge value={parseFloat(fireStats.avg_frp.toPrecision(2))} width={100} height={100} valueMin={0} valueMax={3} startAngle={-90} endAngle={90} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FireGaugeChart;
