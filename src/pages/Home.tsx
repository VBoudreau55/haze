import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { checkServiceStatus, getLocationData, getCountryInfo } from "../services/apiService";
import FirePieChart from "../components/FirePieChart";
import Globe from "../components/Globe";
import FireGaugeChart from "../components/FireGuageChart";
import DataTable from "../components/countrySensorTable";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serviceStatus, setServiceStatus] = useState<string | null>(null);
  const [centerCoords, setCenterCoords] = useState<number[] | null>([37.908743881324625, -121.58020019531251]);
  const [calculationCoords, setCalculationCoords] = useState<number[] | null>(null);
  const [countrySensorData, setCountrySensorData] = useState<any | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const [locationData, setLocationData] = useState<any | null>(() => {
    const savedLocationData = localStorage.getItem("locationData");
    return savedLocationData ? JSON.parse(savedLocationData) : null;
  });

  const [countryData, setCountryData] = useState<any | null>(() => {
    const savedCountryData = localStorage.getItem("countryData");
    return savedCountryData ? JSON.parse(savedCountryData) : null;
  });

  const [lastUpdated, setLastUpdated] = useState<number>(() => {
    const savedLastUpdated = localStorage.getItem("lastUpdated");
    return savedLastUpdated ? parseInt(savedLastUpdated, 10) : Date.now();
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

  useEffect(() => {
    localStorage.setItem("lastUpdated", lastUpdated.toString());
  }, [lastUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(Date.now());
      fetchLocationData();
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  const [fireDayData, setfireDayData] = useState<any | null>(null);
  const [fireStats, setFireStats] = useState<any | null>(null);
  const [fireMarkers, setfireMarkers] = useState<any | null>(null);
  const [aqsensorsMarkers, setAqsensorsMarkers] = useState<any | null>(null);

  

  const handleCenterChange = (coords: [number, number]) => {
    setCenterCoords(coords);
  };

  const handleCenterCalculation = () => {
    setCalculationCoords(centerCoords);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchServiceStatus = async () => {
      const response = await checkServiceStatus();
      setServiceStatus(response.message ?? null);
      fetchFirstData();
      if (response.message === "Service is operational"){
        await fetchLocationDataFirst();
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
  
  const fetchLocationDataFirst = async () => {
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

  const fetchLocationData = async () => {
    setIsLoading(true);
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
    setCountrySensorData(countryData['oaq']['results'][0]['parameters']);
    setCountryName(countryData['oaq']['results'][0]['name']);
    setIsLoading(false);
  };

  const handleRecenter = () => {
    if (!centerCoords) return;

    const closestFire = countryData['nasa']['fire_data'].reduce((prev: any, curr: any) => {
      const prevDistance = Math.sqrt(
      Math.pow(prev.latitude - centerCoords[0], 2) + Math.pow(prev.longitude - centerCoords[1], 2)
      );
      const currDistance = Math.sqrt(
      Math.pow(curr.latitude - centerCoords[0], 2) + Math.pow(curr.longitude - centerCoords[1], 2)
      );
      return currDistance < prevDistance ? curr : prev;
    });
    setMapCenter([closestFire['latitude'], closestFire['longitude']]);
  }

  return (
    <Box sx={{ height: '100%' ,display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>

      {serviceStatus ? (
        <>
                <Box sx={{ textAlign: 'center', padding: 3, maxWidth: 900, marginBottom: 3 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    Fire Finder
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Use this tool to monitor wildfires and air quality in your area. Click "Get Data for Current Location" 
                    to fetch near real-time sensor readings nearby to the map location and fire alerts for the country.
                  </Typography>
                </Box>


                <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3, alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}>
                  
                  <Globe onCenterChange={handleCenterChange} sensorMarkers={aqsensorsMarkers} fireMarkers={fireMarkers} loading={isLoading} newCenter={mapCenter}/>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }}>
                    
                      <Button
                      sx={{
                        maxWidth: 900,
                        marginBottom: 3,
                        backgroundColor: '#FF5722', 
                        '&:hover': {
                          backgroundColor: '#D84315', 
                        },
                        
                        borderRadius: 2, 
                        display: 'flex',
                        justifyContent: 'center', 
                        }}
                      loading={isLoading}
                      variant="contained"
                      color="primary"
                      onClick={handleCenterCalculation}
                      >
                      <Typography fontWeight="bold" textAlign="center">
                      Get Data for Current Location
                      </Typography>
                      </Button>
                      <Box sx={{ mt: 2, p: 2,}}>
                      </Box>
                      {centerCoords && (
                        <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'grey.400', borderRadius: 1, backgroundColor: 'rgba(36, 36, 36, 0.9)', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">Center Coordinates</Typography>
                        <Typography>Latitude: {parseFloat(centerCoords[0].toPrecision(3))}</Typography>
                        <Typography>Longitude: {parseFloat(centerCoords[1].toPrecision(3))}</Typography>
                        </Box>
                      )}
                      <Box sx={{ mt: 2, p: 2,}}>
                      </Box>
                        <Button
                        sx={{
                        maxWidth: 900,
                        marginBottom: 3,
                        backgroundColor: '#FF5722', 
                        '&:hover': {
                          backgroundColor: '#D84315', 
                        },
                        borderRadius: 2, 
                        display: 'flex',
                        justifyContent: 'center', 
                        }}
                        loading={isLoading}
                        variant="contained"
                        color="primary"
                        onClick={handleRecenter}
                        >
                        <Typography fontWeight="bold" textAlign="center">
                        Go to Closest Fire Location
                        </Typography>
                        </Button>
                    </Box>
                </Box>
        {isLoading ? <CircularProgress /> : (
          <>
            <Box sx={{ textAlign: 'center', padding: 3, maxWidth: 900, marginBottom: 3 }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                    Extra Information
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Here are some additional statistics and data for the country you are viewing. Mosty fire data and air quality sensor data.
              </Typography>
            </Box>
            
            <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3, height: 300, backgroundColor: 'rgba(36, 36, 36, 0.9)', }}>
              <FireGaugeChart fireStats={fireStats} loading={isLoading} countryName={countryName ?? ''}/>
            </Box>
            <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3, backgroundColor: 'rgba(36, 36, 36, 0.9)', }}>
              <FirePieChart fireDayData={fireDayData} loading={isLoading} />
            </Box>
            <Box sx={{ width: "100%", maxWidth: 900, marginBottom: 3, height: 300, backgroundColor: 'rgba(36, 36, 36, 0.9)', }}>
              <DataTable data={countrySensorData} loading={isLoading} countryName={countryName ?? ''}/>
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

