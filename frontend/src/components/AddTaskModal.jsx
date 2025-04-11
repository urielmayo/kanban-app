import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../utils/http";
import TaskForm from "./TaskForm";

function AddTaskModal({ open, onClose, projectMembers, projectId, statusId }) {
  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreatingTask } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      onClose();
    },
    onError: (err) => {
      console.error("Failed to create task:", err);
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
          isSubmitting={isCreatingTask}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskModal;
