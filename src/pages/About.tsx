import { Box, Card, CardContent, Typography } from '@mui/material';

const About = () => {

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        position: 'relative',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, rgb(80, 0, 0), rgb(20, 0, 0), rgb(0, 0, 0))',
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
            About This Project
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Welcome to <Typography component="span" fontWeight="bold">Haze</Typography>!
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            This project was created to help users track air quality sensors and fire data around the world. Users can view the data on a map and see the current air quality sensor and fire data in their area.
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            <Typography component="span" fontWeight="bold">Our Mission:</Typography>
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            This project was used as a as an example of a an application that uses AWS products such as Amplify, Cognito, lambda, apigateways, and dynamodb.
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Data is collected from the NASA API and the OpenAQ API.
            https://firms.modaps.eosdis.nasa.gov/api/
            https://api.openaq.org/
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            <Typography component="span" fontWeight="bold">Development Team:</Typography>
            
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Vance Boudreau
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
};

export default About;