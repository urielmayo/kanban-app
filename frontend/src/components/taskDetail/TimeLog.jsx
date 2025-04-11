import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
const TaskTimeLog = ({ timelogs, onCreateTimelog }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Time Logs
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {/* Aquí puedes listar los registros de tiempo */}
        {timelogs && timelogs.length > 0 ? (
          timelogs.map((log) => (
            <Box
              key={log.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2">
                {log.date} - {log.hours} hours
              </Typography>
              <Typography variant="body2">
                {log.user.first_name} {log.user.last_name}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No time logs available.
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Tooltip title="Add Time Log">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateTimelog}
            >
              Add Time Log
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskTimeLog;
