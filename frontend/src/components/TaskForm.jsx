import {
  Box,
  TextField,
  Typography,
  Link,
  Autocomplete,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTaskTemplates } from "../utils/http";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import { useParams } from "react-router-dom";
import { getProjectMembers } from "../utils/http";

function TaskForm({ initialData = {}, onSubmit, isSubmitting, errors }) {
  const { id } = useParams();
  const [taskForm, setTaskForm] = useState(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    deadline: initialData.deadline ? new Date(initialData.deadline) : null,
    assigned_to: initialData?.assigned_to?.id || "",
    template: "",
  }));

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    isError: isErrorTemplates,
  } = useQuery({
    queryFn: getTaskTemplates,
    queryKey: ["templates"],
  });

  const {
    data: members,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
  } = useQuery({
    queryFn: async () => getProjectMembers(id),
    queryKey: ["project", id, "members"],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const isLoading = isLoadingMembers && isLoadingTemplates;

  if (isLoading) return <LoadingComponent />;
  if (isErrorTemplates) return <ErrorComponent />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        sx={{ backgroundColor: "white" }}
        label="Task Title"
        fullWidth
        value={taskForm.title}
        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
        error={!!errors.title}
        helperText={errors.title}
      />
      <Autocomplete
        disabled={!templates}
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
        preview="live"
      />
      {errors?.description && (
        <FormHelperText error>{errors.description}</FormHelperText>
      )}
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
          error={!!errors.deadline}
          helperText={errors.deadline}
        />
      </LocalizationProvider>
      <Autocomplete
        disabled={!members}
        fullWidth
        options={members}
        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
        value={
          members?.find((member) => member.id === taskForm.assigned_to) || null
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
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}

export default TaskForm;
