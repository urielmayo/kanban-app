import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { Event as EventIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import TaskTimeLogDialog from "../components/TaskTimeLogDialog";
import { useParams, Link } from "react-router-dom";
import { getTask } from "../utils/http";
import LoadingComponent from "../components/LoadingComponent";
import ErrorComponent from "../components/ErrorComponent";

import TaskDescription from "../components/taskDetail/Description";
import TaskTimeLog from "../components/taskDetail/TimeLog";
function TaskDetail() {
  const [isTimeLogDialogOpen, setTimeLogDialogOpen] = useState(false);
  const params = useParams();

  const {
    data: task,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["project", params.projectId, "task", params.taskId],
    queryFn: () => getTask(params),
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent message={error} />;

  const handleOpenTimeLogDialog = () => {
    setTimeLogDialogOpen(true);
  };

  const handleCloseTimeLogDialog = () => {
    setTimeLogDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink underline="hover" color="inherit" component={Link} to="/">
          Projects
        </MuiLink>
        <MuiLink
          underline="hover"
          color="inherit"
          component={Link}
          to={`/projects/${params.projectId}`}
        >
          {task.project}
        </MuiLink>
        <Typography sx={{ color: "text.primary" }}>{task.title}</Typography>
      </Breadcrumbs>

      {/* Sección superior */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {task.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Usuario asignado */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1">
                Assigned to:{" "}
                {task.assigned_to
                  ? `${task.assigned_to.first_name} ${task.assigned_to.last_name}`
                  : "Unassigned"}
              </Typography>
            </Box>
            {/* Fecha límite */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventIcon />
              <Typography variant="body1">
                Deadline: {task.deadline || "No deadline"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Contenido principal en dos columnas */}
      <Grid container spacing={4}>
        {/* Columna izquierda: Descripción */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TaskDescription description={task.description} />
        </Grid>

        {/* Columna derecha: Registros de tiempo */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TaskTimeLog
            timelogs={task.timelogs}
            onCreateTimelog={handleOpenTimeLogDialog}
          />
        </Grid>
      </Grid>

      {/* Diálogo para agregar registros de tiempo */}
      <TaskTimeLogDialog
        open={isTimeLogDialogOpen}
        onClose={handleCloseTimeLogDialog}
      />
    </Box>
  );
}

export default TaskDetail;
