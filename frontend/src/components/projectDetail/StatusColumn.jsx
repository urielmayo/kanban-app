import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "./TaskCard";

function StatusColumn({
  status,
  isFirstStatus,
  isLastStatus,
  tasks,
  onAddTask,
}) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: "100%",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#e5e5e5", // Cambia el color de fondo a un tono más oscuro
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "baseline", mb: 2 }}>
        <Typography variant="h6" sx={{ borderRight: 1, pr: 2 }}>
          {status.name}
        </Typography>
        <Typography variant="s" color="gray">
          {tasks.length} task{tasks.length !== 1 && "s"}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2 }}>
        {(tasks || []).map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isFirstStage={isFirstStatus}
            isLastStage={isLastStatus}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => onAddTask(status.id)}
      >
        Add Task
      </Button>
    </Paper>
  );
}

export default StatusColumn;
