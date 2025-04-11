import { useMutation } from "@tanstack/react-query";
import ProjectForm from "../components/ProjectForm";
import { useNavigate } from "react-router-dom";
import { createProject } from "../utils/http";
import { useState } from "react";

const CreateProject = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => navigate("/"),
    onError: (err) => {
      setErrors(
        err.response.data || {
          non_field_errors: ["An error ocurred creating the project"],
        }
      );
    },
  });

  const handleSave = (params) => {
    mutation.mutate(params);
  };

  return <ProjectForm onSave={handleSave} errors={errors} />;
};

export default CreateProject;
