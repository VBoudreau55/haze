import { Box, Button, Typography, Card, CardContent } from '@mui/material';

interface LandingProps {
  isAuth: boolean;
  handleSignIn: (args?: any) => Promise<void>;
}
const Landing: React.FC<LandingProps> = ({ isAuth, handleSignIn }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, rgb(0, 0, 0), rgb(20, 0, 0), rgb(80, 0, 0))',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      <Card
        sx={{
          maxWidth: 400, position: 'relative', zIndex: 2, padding: 3, borderRadius: 2,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          backgroundColor: 'rgba(36, 36, 36, 0.9)',
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            {isAuth ? 'Welcome Back, Firefighter!' : 'Protect Your Air, Protect Your Life'}
          </Typography>
          <Typography variant="h6" align="center" fontWeight="lighter" gutterBottom>
            Find Wildfires & Monitor Air Quality 
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2, color: 'white' }}>
            Stay informed about nearby active wildfires and local particulate matter sensors.
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2, color: 'white' }}>
          </Typography>

          {isAuth ? (
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 3, bgcolor: '#BF360C', ':hover': { bgcolor: '#8D2C0A' } }}
              onClick={() => window.location.href = '/Home'}
            >
              Let's Go!
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, bgcolor: '#BF360C', ':hover': { bgcolor: '#8D2C0A' } }}
              onClick={() => handleSignIn()}
            >
              Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Landing;
