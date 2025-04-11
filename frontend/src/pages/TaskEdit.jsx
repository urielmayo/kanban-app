import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { updateTask, updateTaskStatus } from "../utils/http";
import TaskForm from "../components/TaskForm";
import { useParams } from "react-router";
import { getTask } from "../utils/http";

function TaskEdit({ open, onClose, taskId }) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => getTask({ projectId: id, taskId }),
    enabled: !!taskId,
  });

  const { mutate, isLoading: isUpdatingTask } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      onClose();
    },
    onError: (err) => {
      console.error("Failed to update task:", err);
    },
  });

  const handleSubmit = (taskPayload) => {
    mutate({ projectId: id, taskId, data: taskPayload });
  };

  if (!taskId || isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          isSubmitting={isUpdatingTask}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TaskEdit;
