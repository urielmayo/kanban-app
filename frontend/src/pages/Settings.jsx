import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  TextField,
  Grid,
  Divider,
} from "@mui/material";

function Settings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    defaultView: "board",
    timezone: "UTC",
  });

  const handleChange = (name) => (event) => {
    setSettings({
      ...settings,
      [name]: event.target.checked,
    });
  };

  const handleSave = () => {
    // Save settings to backend
    console.log("Saving settings:", settings);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleChange("darkMode")}
                />
              }
              label="Dark Mode"
            />
          </Grid>

          <Grid xs={12}>
            <Divider />
          </Grid>

          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange("notifications")}
                />
              }
              label="Enable Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange("emailNotifications")}
                />
              }
              label="Email Notifications"
            />
          </Grid>

          <Grid xs={12}>
            <Divider />
          </Grid>

          <Grid xs={12}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Default View"
                  select
                  value={settings.defaultView}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultView: e.target.value })
                  }
                >
                  <option value="board">Board</option>
                  <option value="list">List</option>
                </TextField>
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Timezone"
                  select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Settings;
