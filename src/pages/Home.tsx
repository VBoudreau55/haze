import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { checkServiceStatus, getLocationData, getCountryInfo } from "../services/apiService";
import FirePieChart from "../components/FirePieChart";
import Globe from "../components/Globe";
import FireGaugeChart from "../components/FireGuageChart";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceStatus, setServiceStatus] = useState<string | null>(null);
  const [centerCoords, setCenterCoords] = useState<number[] | null>([37.908743881324625, -121.58020019531251]);
  const [calculationCoords, setCalculationCoords] = useState<number[] | null>(null);

  const [locationData, setLocationData] = useState<any | null>(() => {
    const savedLocationData = localStorage.getItem("locationData");
    return savedLocationData ? JSON.parse(savedLocationData) : null;
  });

  const [countryData, setCountryData] = useState<any | null>(() => {
    const savedCountryData = localStorage.getItem("countryData");
    return savedCountryData ? JSON.parse(savedCountryData) : null;
  });

  useEffect(() => {
    if (locationData) {
      localStorage.setItem("locationData", JSON.stringify(locationData));
    }
  }, [locationData]);

  useEffect(() => {
    if (countryData) {
      localStorage.setItem("countryData", JSON.stringify(countryData));
    }
  }, [countryData]);

  const [fireDayData, setfireDayData] = useState<any | null>(null);
  const [fireStats, setFireStats] = useState<any | null>(null);
  const [fireMarkers, setfireMarkers] = useState<any | null>(null);
  const [aqsensorsMarkers, setAqsensorsMarkers] = useState<any | null>(null);

  

  const handleCenterChange = (coords: [number, number]) => {
    setCenterCoords(coords);
  };

  const handleCenterCalculation = () => {
    console.log(centerCoords);
    setCalculationCoords(centerCoords);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchServiceStatus = async () => {
      const response = await checkServiceStatus();
      setServiceStatus(response.message ?? null);
      fetchFirstData();
      if (response.message === "Service is operational"){
        await fetchLocationData();
      }
    };
    fetchServiceStatus();
    
  }, []);

  const fetchFirstData = () => {
    if (!navigator.geolocation) {
      setCenterCoords([37.908743881324625, -121.58020019531251]);
    }
    else{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords: [number, number] = [latitude, longitude];
  
          setCenterCoords(coords); 
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: false }
      );
    }
  }

  useEffect(() => {
    fetchLocationData();
  }, [calculationCoords]);
  
  const fetchLocationData = async () => {
    console.log(centerCoords);
    if (!centerCoords) return;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${centerCoords[0]}&lon=${centerCoords[1]}&format=json`
    );
    const data = await response.json();
    if (data.address && data.address.country_code) {
      const country_code = data.address.country_code.toUpperCase(); // Country code (ISO 3166-1 alpha-2)
      const country_response = await getCountryInfo(country_code);
      setCountryData(country_response ?? null);
    }
    const location_response = await getLocationData(centerCoords[0], centerCoords[1]);
    setLocationData(location_response ?? null);
    handleDataCalculation();
  };

  const handleDataCalculation = () => {
    console.log(locationData);
    console.log(countryData);
    setfireDayData({
        'total_fires': countryData['nasa']['total_fires'],
       'total_day_fires': countryData['nasa']['total_day_fires'],
       'total_night_fires': countryData['nasa']['total_night_fires'],
    });
    setFireStats({
        'avg_brightness': countryData['nasa']['average_brightness'],
        'avg_bright_ti5': countryData['nasa']['average_bright5'],
        'avg_frp': countryData['nasa']['average_frp'],
    });
    setfireMarkers(countryData['nasa']['fire_data']);
    const sensors: any[] = [];
    for (const [key, value] of Object.entries(locationData['oaq'])) {
      (value as any)['id'] = key;
      sensors.push(value);
    }
    setAqsensorsMarkers(sensors);
    setIsLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>

      {serviceStatus ? (
        <>
                <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
                  Dashboard
                </Typography>

                <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
                  <Button sx={{ width: "100%", height: "10%", maxWidth: 900, marginBottom: 3 }} variant="contained" color="primary" onClick={handleCenterCalculation}>
                    <Typography fontWeight="bold" textAlign="center" sx={{ mb: 3 }} align="center">
                      Get Data for Current Location
                    </Typography>
                  </Button>
                  <Globe onCenterChange={handleCenterChange} sensorMarkers={aqsensorsMarkers} fireMarkers={fireMarkers} loading={isLoading}/>
                  {centerCoords && (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.400', borderRadius: 1 }}>
                      <Typography variant="h6" fontWeight="bold">Center Coordinates</Typography>
                      <Typography>Latitude: {centerCoords[0]}</Typography>
                      <Typography>Longitude: {centerCoords[1]}</Typography>
                    </Box>
                  )}
                </Box>
        {isLoading ? <CircularProgress /> : (
          <>
            <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3 }}>
              <FirePieChart fireDayData={fireDayData} loading={isLoading}/>
            </Box>
            <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3, height: 300 }}>
              <FireGaugeChart fireStats={fireStats} loading={isLoading}/>
            </Box>
          </>
        )}
        </>
      ) : (
        "API is down, please try again later"
      )}
    </Box>
  );
};

export default Home;

