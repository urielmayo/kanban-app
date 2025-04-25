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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskTimeLog } from "../utils/http";
import { useParams } from "react-router-dom";

function TaskTimeLogDialog({ open, onClose }) {
  const [taskForm, setTaskForm] = useState({
    hours: "",
    date: null,
  });
  const [errors, setErrors] = useState({});
  const params = useParams();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTaskTimeLog,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["project", params.projectId, "task", params.taskId],
      });
    },
    onError: (err) => {
      setErrors(err.response?.data);
    },
  });

  const handleSubmit = () => {
    // Aquí puedes manejar el envío del registro de tiempo
    const formData = {
      hours: taskForm.hours,
      date: taskForm.date ? taskForm.date.toISOString().split("T")[0] : null,
    };

    mutation.mutate({
      projectId: params.projectId,
      taskId: params.taskId,
      data: formData,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Time Log</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          required
          label="Hours"
          type="number"
          value={taskForm.hours}
          onChange={(e) => setTaskForm({ ...taskForm, hours: e.target.value })}
          fullWidth
          error={!!errors.hours}
          helperText={errors.hours}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={taskForm.date}
            onChange={(newValue) =>
              setTaskForm({ ...taskForm, date: newValue })
            }
            renderInput={(params) => <TextField {...params} fullWidth />}
            slotProps={(params) => <TextField {...params} fullWidth required />}
            error={!!errors.date}
            helperText={errors.date}
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
