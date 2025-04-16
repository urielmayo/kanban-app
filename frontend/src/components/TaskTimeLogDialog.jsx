import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function TaskTimeLogDialog({ open, onClose, taskId }) {
  const [hours, setHours] = useState("");
  const [date, setDate] = useState(null);

  const handleSubmit = () => {
    // Aquí puedes manejar el envío del registro de tiempo
    console.log({ taskId, hours, date });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Time Log</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskTimeLogDialog;
