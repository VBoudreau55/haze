import { Box, Typography, Divider, Switch, FormControlLabel, TextField, Button, useTheme, useMediaQuery } from '@mui/material';

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: {
          xs: 2,
          sm: 3,
          md: 4
        },
        height: '100vh',
        justifyContent: 'flex-start',
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Settings
      </Typography>

      {/* Profile Section */}
      <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          Profile Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Notification Section */}
      <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          Notification Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Switch />}
          label="Enable Email Notifications"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Switch />}
          label="Enable SMS Notifications"
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Privacy Section */}
      <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          Privacy Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Switch />}
          label="Make Profile Public"
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Switch />}
          label="Share Data with Third Parties"
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
