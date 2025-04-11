import {
  Box,
  TextField,
  Typography,
  Link,
  Autocomplete,
  Button,
  CircularProgress,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskTemplates } from "../utils/http";
import LoadingComponent from "./LoadingComponent";

function TaskForm({
  initialData = {},
  projectMembers = [],
  onSubmit,
  isSubmitting,
}) {
  const [taskForm, setTaskForm] = useState(() => ({
    title: initialData.title || "",
    description: initialData.description || "",
    deadline: initialData.deadline ? new Date(initialData.deadline) : null,
    assigned_to: initialData.assigned_to || "",
    template: "",
  }));

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryFn: getTaskTemplates,
    queryKey: ["templates"],
  });

  const handleSubmit = () => {
    if (!taskForm.title || !taskForm.deadline) {
      console.error("Form validation failed. Required fields missing.");
      return;
    }

    const taskPayload = {
      title: taskForm.title,
      description: taskForm.description,
      deadline: taskForm.deadline
        ? taskForm.deadline.toISOString().split("T")[0]
        : null,
      assigned_to: taskForm.assigned_to || null,
    };

    onSubmit(taskPayload);
  };

  if (isLoadingTemplates) {
    return <LoadingComponent />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
      <TextField
        sx={{ backgroundColor: "white" }}
        label="Task Title"
        fullWidth
        required
        value={taskForm.title}
        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
      />
      <Autocomplete
        options={templates}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Template" />}
        onChange={(event, newValue) => {
          setTaskForm({
            ...taskForm,
            description: newValue ? newValue.content : "",
          });
        }}
      />
      <MDEditor
        data-color-mode="light"
        value={taskForm.description}
        onChange={(value) =>
          setTaskForm({ ...taskForm, description: value || "" })
        }
        preview="edit"
      />
      <Typography variant="caption" display="block">
        Markdown supported -{" "}
        <Link
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener"
        >
          Learn more
        </Link>
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Deadline"
          value={taskForm.deadline}
          onChange={(newValue) =>
            setTaskForm({ ...taskForm, deadline: newValue })
          }
          slotProps={(params) => <TextField {...params} fullWidth required />}
        />
      </LocalizationProvider>
      <Autocomplete
        fullWidth
        options={projectMembers || []}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        value={
          projectMembers?.find(
            (member) => member.id === taskForm.assigned_to
          ) || null
        }
        onChange={(event, newValue) => {
          setTaskForm({
            ...taskForm,
            assigned_to: newValue ? newValue.id : "",
          });
        }}
        renderInput={(params) => <TextField {...params} label="Assign To" />}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}

export default TaskForm;
