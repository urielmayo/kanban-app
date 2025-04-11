import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

const TaskDescription = ({ description }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <MDEditor.Markdown
            source={description || "No description"}
            data-color-mode="light"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskDescription;
