import { Box, Typography, Tooltip, IconButton, Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteProject } from "../../utils/http";

function ProjectHeader({ name, description }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => navigate(".."),
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <Typography variant="h4">{name}</Typography>
      {description && (
        <Tooltip title={description} arrow>
          <IconButton size="small">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      )}
      <Button
        onClick={() => navigate(`/projects/${id}/edit`)} // Navegar a la página de edición
        variant="contained"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Button
        onClick={() => mutation.mutate({ id })} // Navegar a la página de edición
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
    </Box>
  );
}

export default ProjectHeader;
