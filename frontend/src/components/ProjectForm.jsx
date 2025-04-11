import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import StatusesComponent from "./StatusesComponent";

const ProjectForm = ({ project = null, onSave, errors }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [statuses, setStatuses] = useState(project?.statuses || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, statuses });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          {project ? "Actualizar Proyecto" : "Crear Proyecto"}
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
            label="Nombre del Proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Descripción"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <StatusesComponent statuses={statuses} setStatuses={setStatuses} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {project ? "Actualizar" : "Crear"} Proyecto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectForm;
