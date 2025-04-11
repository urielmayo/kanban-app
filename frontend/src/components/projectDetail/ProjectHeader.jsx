import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteProject } from "../../utils/http";
import { useState } from "react";

function ProjectHeader({ name, description }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => navigate(".."),
  });

  const handleDeleteProject = () => {
    mutation.mutate(id);
    setOpenConfirmDialog(false);
  };

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
        onClick={() => navigate(`/projects/${id}/edit`)} // Navigate to the edit page
        variant="contained"
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Button
        onClick={() => setOpenConfirmDialog(true)} // Open the confirmation dialog
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>

      {/* Confirmation dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to delete this project? All tasks related to
            this project will also be deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteProject} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectHeader;
