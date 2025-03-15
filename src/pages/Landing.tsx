import { useAuth } from "react-oidc-context";
import { Box, Button, Typography, Card, CardContent } from '@mui/material';

function Landing() {
    const auth = useAuth();

    if (auth.isLoading) {
    return <div>Loading...</div>;
    }

    if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
    }

    return (
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Fill the rest of the screen
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom,rgb(0, 0, 0),rgb(20, 0, 0),rgb(80, 0, 0))', // Fire gradient background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
        >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better contrast
          zIndex: 1,
        }}
      />
      <Card
        sx={{
          maxWidth: 400,
          position: 'relative',
          zIndex: 2,
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          backgroundColor: 'rgba(36, 36, 36, 0.9)', // Slightly translucent background
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }} gutterBottom>
        {auth.isAuthenticated ? 'Welcome Back, Firefighter!' : 'Protect Your Air, Protect Your Life'}
          </Typography>
          <Typography variant="h6" align="center" sx={{ fontWeight: 'lighter', }} gutterBottom>
        Find Wildfires & Monitor Air Quality
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2, color: 'white' }}>
        Stay informed about nearby active wildfires and local particulate matter sensors to ensure the air near you is safe.
          </Typography>
        
          {auth.isAuthenticated ? (
        <Box>
                <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 3, bgcolor: '#BF360C', ':hover': { bgcolor: '#8D2C0A' } }}
                onClick={() => window.location.href = '/home'}
                >
                Let's Go!
                </Button>
            </Box>
          ) : (
            <Box>
                <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mb: 2,
                  bgcolor: '#BF360C',
                  ':hover': { bgcolor: '#8D2C0A' },
                }}
                onClick={() => auth.signinRedirect()}
                >
                Sign In
                </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>    
      );
}

export default Landing;
