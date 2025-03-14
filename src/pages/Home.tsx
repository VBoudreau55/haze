import React from 'react';
import { Box, Typography, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { getUser, checkServiceStatus} from '../services/apiService';
import ReactECharts from 'echarts-for-react';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [serviceStatus, setServiceStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchServiceStatus = async () => {
      const response = await checkServiceStatus();
      setServiceStatus(response.message ?? null);
    };
    fetchServiceStatus();
  }, []);

  // Line Chart Configuration
  const lineChartOptions: echarts.EChartsOption = {
    title: {
      text: 'Sales Over Time',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
  };

  // Pie Chart Configuration
  const pieChartOptions: echarts.EChartsOption = {
    title: {
      text: 'Product Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item' as 'item',
    },
    series: [
      {
        name: 'Product Share',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 335, name: 'Product A' },
          { value: 310, name: 'Product B' },
          { value: 234, name: 'Product C' },
          { value: 135, name: 'Product D' },
          { value: 1548, name: 'Product E' },
        ],
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 5,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ mb: 3 }}>
        {serviceStatus ? serviceStatus : 'Loading...'}
      </Typography>

      {/* Line Chart Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          marginBottom: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
              Sales Over Time
            </Typography>
            <ReactECharts option={lineChartOptions} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </Box>

      {/* Pie Chart Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 900,
          marginBottom: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" textAlign="center" sx={{ mb: 2 }}>
              Product Distribution
            </Typography>
            <ReactECharts option={pieChartOptions} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </Box>

      {/* Placeholder Cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          gap: 3,
          width: '100%',
          maxWidth: 900,
        }}
      >
        <Box
          sx={{
            width: isMobile ? '100%' : '45%',
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                Placeholder Card
              </Typography>
              <Typography variant="body2" textAlign="center">
                Some other content or widgets go here.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            width: isMobile ? '100%' : '45%',
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                Another Placeholder
              </Typography>
              <Typography variant="body2" textAlign="center">
                More widgets or information can be placed here.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
