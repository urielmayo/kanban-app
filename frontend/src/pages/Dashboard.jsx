import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../utils/http";
import { useNavigate, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LoadingComponent from "../components/LoadingComponent";
import ErrorComponent from "../components/ErrorComponent";

function Dashboard() {
  const navigate = useNavigate();
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Link to="projects/new">
          <Button variant="contained" startIcon={<AddIcon />}>
            New Project
          </Button>
        </Link>
      </Box>

      {projects?.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
            p: 3,
            border: "1px dashed",
            borderColor: "grey.400",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            You have no projects created. Start now!
          </Typography>
          <Link to="projects/new">
            <Button variant="contained" startIcon={<AddIcon />}>
              Create Your First Project
            </Button>
          </Link>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects?.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Dashboard;
