import { useState } from "react";
import { Box, Container, TextField, Typography, Paper } from "@mui/material";
import StatusesComponent from "./StatusesComponent";
import SubmitButton from "./UI/SubmitButton";

const ProjectForm = ({ project = null, onSave, errors, isPending }) => {
  const [formState, setFormState] = useState({
    name: project?.name || "",
    description: project?.description || "",
    statuses:
      project?.statuses.map((st) => ({
        status: st.status.id,
        order: st.order,
      })) || [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStatusesChange = (updatedStatuses) => {
    setFormState((prevState) => ({
      ...prevState,
      statuses: updatedStatuses,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          {`${project ? "Update" : "Create"} project`}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {errors?.non_field_errors && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errors.non_field_errors}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            name="name"
            label="Project name"
            value={formState.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formState.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <StatusesComponent
            statuses={formState.statuses}
            setStatuses={handleStatusesChange}
            errors={errors.statuses}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            isPending={isPending}
            text={project ? "UPDATE" : "CREATE"}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectForm;
