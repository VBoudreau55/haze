import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import { EChartsOption } from 'echarts';

const MapChart: React.FC = () => {
  const [option, setOption] = useState<EChartsOption | null>(null);
  const ROOT_PATH = 'https://echarts.apache.org/examples';

  useEffect(() => {
    // Fetch population data
    const loadGeoJSON = async () => {
        try {
          const worldGeoJSON = await axios.get('https://geojson-maps.ash.ms/world-110m.json');
          echarts.registerMap('world', worldGeoJSON.data);
        } catch (error) {
          console.error('Error loading world GeoJSON:', error);
        }
      };
    const fetchPopulationData = async () => {
      try {
        // Fake test data
        const data = [
          [35.86166, 104.195397, 1409517397], // China
          [20.593684, 78.96288, 1339180127],  // India
          [37.09024, -95.712891, 331002651],  // USA
          [55.378051, -3.435973, 67886011],   // UK
          [36.204824, 138.252924, 126476461], // Japan
        ];

        // Convert to [longitude, latitude, size]
        const populationPoints = data
          .filter(item => item[2] > 0)
          .map(item => [item[1], item[0], 0]); // Longitude, Latitude, Scaled Population

        return populationPoints;
      } catch (error) {
        console.error('Error fetching population data:', error);
        return [];
      }
    };

    const fetchData = async () => {
        await loadGeoJSON(); 
      const populationData = await fetchPopulationData();

      setOption({
        backgroundColor: '#000',
        geo: {
          map: 'world',
          roam: true, // Allows zoom and pan
          silent: false,
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: '#333',
            borderColor: '#888',
          },
          emphasis: {
            itemStyle: {
              areaColor: '#555',
            },
          },
          regions: [{
                name: 'Guangdong',
                itemStyle: {
                    areaColor: 'red',
                    color: 'red'
                }
            }],
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: populationData,
            symbolSize: (val) => val[2] / 2, // Adjust size dynamically
            itemStyle: {
              color: 'red',
            },
          },
        ],
      });
    };

    fetchData();
  }, []);

  if (!option) {
    return <div>Loading...</div>;
  }

  return <ReactECharts option={option} style={{ width: '100%', height: '100vh' }} />;
};

export default MapChart;
