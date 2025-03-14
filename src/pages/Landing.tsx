import { useAuth } from "react-oidc-context";
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import GlobeComp from '../charts/Globe';

function Landing() {
    const auth = useAuth();

    if (auth.isLoading) {
    return <div>Loading...</div>;
    }

    if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
    }

    const signOutRedirect = () => {
    const clientId = "78e46q6f25uu1gahoqbjilqt9c";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://us-east-1zakuadvhr.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)', // Assuming the navbar height is 64px
            background: 'url(https://echarts.apache.org/examples/data-gl/asset/world.topo.bathy.200401.jpg) no-repeat center center',
            backgroundSize: 'cover',
          }}
        >
          <GlobeComp /> {/* The 3D Globe component as background */}
          <Card sx={{ maxWidth: 400, position: 'absolute', zIndex: 2, padding: 3 }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
            {auth.isAuthenticated ? 'Welcome Back!' : 'Please Sign In'}
              </Typography>
        
              {auth.isAuthenticated ? (
            <Box>
              <Typography variant="body1">Hello: {auth.user?.profile.email}</Typography>
              <Typography variant="body1">ID Token: {auth.user?.id_token}</Typography>
              <Typography variant="body1">Access Token: {auth.user?.access_token}</Typography>
              <Typography variant="body1">Refresh Token: {auth.user?.refresh_token}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => auth.removeUser()}
              >
                Sign Out
              </Button>
            </Box>
              ) : (
            <Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => auth.signinRedirect()}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => signOutRedirect()}
              >
                Sign Out (Redirect)
              </Button>
            </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      );
}

export default Landing;
