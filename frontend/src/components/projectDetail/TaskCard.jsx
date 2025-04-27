import { useState } from "react";
import { Card, Typography, Box, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";

import { deleteTask, updateTaskStatus } from "../../utils/http";
import TaskEdit from "../../pages/TaskEdit";

function TaskCard({ task, isFirstStage, isLastStage }) {
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: (err) => {
      console.error("Failed to update task:", err);
    },
  });

  const updateTaskmutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", params.id] });
    },
    onError: (err) => {
      console.error("Failed to update task:", err);
    },
  });

  const handleMoveTaskRight = (e) => {
    e.stopPropagation();
    updateTaskmutation.mutate({
      projectId: params.id,
      taskId: task.id,
      direction: "forward",
    });
  };

  const handleMoveTaskLeft = () => {
    updateTaskmutation.mutate({
      projectId: params.id,
      taskId: task.id,
      direction: "backguard",
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({
      projectId: params.id,
      taskId: task.id,
    });
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          "&:hover": {
            boxShadow: 2,
          },
          position: "relative",
          boxShadow: "none",
          border: "1px solid #ccc", // Añade un borde gris claro
          p: 2,
        }}
      >
        {/* Sección superior */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            sx={{ typography: "h6", color: "black" }}
            onClick={() => navigate(`tasks/${task.id}`)}
          >
            {task.title}
          </Button>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton onClick={() => setOpenModal(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Sección inferior */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Due: {task.deadline}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {!isFirstStage && (
              <IconButton onClick={handleMoveTaskLeft}>
                <ArrowBackIcon size="small" />
              </IconButton>
            )}
            {!isLastStage && (
              <IconButton onClick={handleMoveTaskRight}>
                <ArrowForwardIcon size="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </Card>

      <TaskEdit open={openModal} onClose={handleCloseModal} taskId={task.id} />
    </>
  );
}

export default TaskCard;
