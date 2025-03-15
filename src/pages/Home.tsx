import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { checkServiceStatus, getLocationData, getCountryInfo } from "../services/apiService";
import LineGraph from "../components/Linegraph";
import Piegraph from "../components/Piegraph";
import Globe from "../components/Globe";

type Coordinates = {
  lat: number;
  lng: number;
};

const Home = () => {
  const theme = useTheme();
  const [serviceStatus, setServiceStatus] = useState<string | null>(null);
  const [centerCoords, setCenterCoords] = useState<Coordinates | null>(null);
  const [calculationCoords, setCalculationCoords] = useState<Coordinates | null>(null);
  const [locationData, setLocationData] = useState<any | null>(null);
  const [countryData, setCountryData] = useState<any | null>(null);



  const handleCenterChange = (coords: [number, number]) => {
    setCenterCoords(coords); 
  };

  const linegraphxAxisData: any = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]; 
  const linegraphseriesData: any = [820, 932, 901, 934, 1290, 1330, 1320]; 

  useEffect(() => {
    const fetchServiceStatus = async () => {
      const response = await checkServiceStatus();
      setServiceStatus(response.message ?? null);
    };
    fetchServiceStatus();
  }, []);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (calculationCoords) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${calculationCoords.lat}&lon=${calculationCoords.lng}&format=json`
      );
      const data = await response.json();
      if (data.address && data.address.country_code) {
        const country_code = data.address.country_code.toUpperCase(); // Country code (ISO 3166-1 alpha-2)
        const country_response = await getCountryInfo(country_code);
        setCountryData(country_response.body ?? null);
      }
        const location_response = await getLocationData(calculationCoords.lat, calculationCoords.lng);
        setLocationData(location_response.body ?? null);
      }
    };
    fetchLocationData();
  }, [calculationCoords]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>

      {serviceStatus ? (
        <>
          <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
            Dashboard
          </Typography>
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          locationData: {locationData ? locationData : "No data"}
          
          </Typography>
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
          countryData: {countryData ? countryData : "No data"}
          </Typography>

          <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
            <Button sx={{ width: "100%", height: "10%", maxWidth: 900, marginBottom: 3 }} variant="contained" color="primary" onClick={setCalculationCoords}>
                <Typography fontWeight="bold" textAlign="center" sx={{ mb: 3 }} align="center">
                    Get Data for Current Location
                </Typography>
            </Button>
            <Globe center={centerCoords} onCenterChange={handleCenterChange} />
            {centerCoords && (
                <Typography
                  variant="body1"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    zIndex: 1000,
                  }}
                >
                  Center: {centerCoords[0].toFixed(2)}, {centerCoords[1].toFixed(2)}
                </Typography>
            )}
          </Box>
            
          <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
            <LineGraph xAxisData={linegraphxAxisData} seriesData={linegraphseriesData} title="Sales Over Time" seriesLabel="Sales" />
          </Box>

          <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
            <Piegraph />
          </Box>
        </>
      ) : (
        "API is down, please try again later"
      )}
    </Box>
  );
};

export default Home;
