import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { updateTask } from "../utils/http";
import TaskForm from "../components/TaskForm";
import { useParams } from "react-router";
import { getTask } from "../utils/http";
import LoadingComponent from "../components/LoadingComponent";
import { useState } from "react";

function TaskEdit({ open, onClose, taskId }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => getTask({ projectId: id, taskId }),
    enabled: !!taskId,
  });

  const { mutate, isLoading: isUpdatingTask } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      onClose();
    },
    onError: (err) => {
      setErrors(err.response?.data);
    },
  });

  const handleSubmit = (taskPayload) => {
    mutate({ projectId: id, taskId, data: taskPayload });
  };

  if (taskId && isLoading) return <LoadingComponent />;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          isSubmitting={isUpdatingTask}
          errors={errors}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TaskEdit;
