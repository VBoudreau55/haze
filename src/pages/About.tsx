import React from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, useTheme, useMediaQuery } from '@mui/material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: {
          xs: 2,
          sm: 3,
          md: 4
        },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: {
            xs: '95%',
            sm: '80%',
            md: 650
          },
          padding: {
            xs: 1,
            sm: 2
          },
          marginTop: {
            xs: 4,
            sm: 8,
            md: 10
          }
        }}
      >
        <CardContent>
          <Typography
            variant="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: {
                xs: '1.75rem',
                sm: '2rem'
              }
            }}
          >
            About Us
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Welcome to <span style={{ fontWeight: 'bold' }}>Lorem Ipsum</span>!
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia est at justo cursus, sed cursus magna viverra. Proin pharetra mollis odio, sed feugiat risus euismod sed. Sed ut nulla nulla.
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            <span style={{ fontWeight: 'bold' }}>Our Mission:</span>
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Fusce euismod nunc sed purus lacinia, ac hendrerit tortor aliquam. Suspendisse potenti. Aenean sit amet ipsum nec purus feugiat aliquam. Nullam euismod neque vitae lectus auctor, ac scelerisque libero tincidunt.
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            <span style={{ fontWeight: 'bold' }}>Development Team:</span>
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <List
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
                padding: 1
              }}
            >
              <ListItem sx={{ justifyContent: 'center' }}>John Doe</ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>Jane Smith</ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;