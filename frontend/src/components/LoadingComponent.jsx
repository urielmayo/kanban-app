import { Box, CircularProgress, Typography } from "@mui/material";

function LoadingComponent({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}

export default LoadingComponent;
