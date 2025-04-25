import { Breadcrumbs, Link as MuiLink, Typography, Box } from "@mui/material";

import ProjectForm from "../components/ProjectForm";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProjectDetail, updateProject } from "../utils/http";
import LoadingComponent from "../components/LoadingComponent";
import ErrorComponent from "../components/ErrorComponent";
import { useState } from "react";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectDetail(id),
  });

  const mutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => navigate(`/projects/${id}`),
    onError: (err) => {
      setErrors(
        err.response.data || {
          non_field_errors: ["An error ocurred creating the project"],
        }
      );
    },
  });

  function handleSave(data) {
    mutation.mutate({ id: id, data: data });
  }

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink underline="hover" color="inherit" component={Link} to="/">
          Projects
        </MuiLink>
        <MuiLink
          underline="hover"
          color="inherit"
          component={Link}
          to={`/projects/${id}`}
        >
          {project.name}
        </MuiLink>
        <Typography sx={{ color: "text.primary" }}>editar</Typography>
      </Breadcrumbs>
      <ProjectForm project={project} onSave={handleSave} errors={errors} />
    </Box>
  );
}

export default EditProject;
