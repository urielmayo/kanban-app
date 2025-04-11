import ProjectForm from "../components/ProjectForm";
import { useParams, useNavigate } from "react-router";
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
    onSuccess: () => navigate("/"),
    onError: (err) => {
      setErrors(
        err.response.data || {
          non_field_errors: ["An error ocurred creating the project"],
        }
      );
    },
  });

  function handleSave(data) {
    mutation.mutate({ id, data });
  }

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <div>
      <h1>Editar Proyecto</h1>
      <ProjectForm project={project} onSave={handleSave} errors={errors} />
    </div>
  );
}

export default EditProject;
