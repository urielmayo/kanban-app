import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate, useParams } from "react-router-dom";

function ProjectHeader({ name, description }) {
  const navigate = useNavigate();
  const { id } = useParams();
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
      <button
        onClick={() => navigate(`/projects/${id}/edit`)} // Navegar a la página de edición
        style={{
          marginLeft: "auto",
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Editar Proyecto
      </button>
    </Box>
  );
}

export default ProjectHeader;
