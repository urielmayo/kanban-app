import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import { useState } from "react";

import ProjectHeader from "../components/projectDetail/ProjectHeader";
import StatusColumn from "../components/projectDetail/StatusColumn";
import AddTaskModal from "../components/AddTaskModal";
import LoadingComponent from "../components/LoadingComponent";
import { getProjectDetail } from "../utils/http";
import ErrorComponent from "../components/ErrorComponent";

function ProjectDetail() {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectDetail(id),
  });

  const handleOpenModal = (statusId) => {
    setSelectedStatus(statusId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStatus(null);
  };

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  const statuses_length = project.statuses.length;
  const firstStatus = project.statuses[0].status.id;
  const lastStatus = project.statuses[statuses_length - 1].status.id;

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink underline="hover" color="inherit" component={Link} to="/">
          Projects
        </MuiLink>
        <Typography sx={{ color: "text.primary" }}>{project.name}</Typography>
      </Breadcrumbs>
      <ProjectHeader name={project.name} description={project.description} />

      <Grid container spacing={3} sx={{ width: "100%", margin: 0 }}>
        {project.statuses?.map((status) => (
          <Grid key={status.status.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatusColumn
              status={status.status}
              isFirstStatus={status.status.id === firstStatus}
              isLastStatus={status.status.id === lastStatus}
              tasks={project.tasks.filter(
                (task) => task.status === status.status.id
              )}
              onAddTask={handleOpenModal}
            />
          </Grid>
        ))}
      </Grid>

      <AddTaskModal
        open={openModal}
        onClose={handleCloseModal}
        projectId={id}
        statusId={selectedStatus}
        projectMembers={project?.members}
      />
    </Box>
  );
}

export default ProjectDetail;
