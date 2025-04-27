import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { createTask } from "../utils/http";
import TaskForm from "./TaskForm";

function AddTask({ open, onClose, projectMembers, projectId, statusId }) {
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      onClose();
    },
    onError: (err) => {
      setErrors(err.response?.data);
    },
  });

  const handleSubmit = (taskPayload) => {
    mutate({ projectId, data: { ...taskPayload, status: statusId } });
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TaskForm
          projectMembers={projectMembers}
          onSubmit={handleSubmit}
          isPending={isPending}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddTask;
