import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function TaskTimeLogDialog({ open, onClose, taskId }) {
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");

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
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
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
