import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import TaskDetail from "./pages/TaskDetail";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import CreateProject from "./pages/CreateProject";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1e40af", // Slightly darker blue
    },
    secondary: {
      main: "#475569", // Slightly darker gray-blue
    },
    background: {
      default: "#f5f5f5", // Slightly darker light gray
      paper: "white", // Slightly darker white for the navigation bar
    },
  },
  shape: {
    borderRadius: 16, // rounded-2xl
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "90%",
          maxHeight: "75%",
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="projects/new" element={<CreateProject />} />
                <Route path="projects/:id/edit" element={<EditProject />} />
                <Route
                  path="projects/:projectId/tasks/:taskId"
                  element={<TaskDetail />}
                />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
