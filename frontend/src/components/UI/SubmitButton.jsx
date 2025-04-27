import { Button, CircularProgress } from "@mui/material";

export default function SubmitButton({ text, isPending, ...props }) {
  return (
    <Button type="submit" disabled={isPending} {...props}>
      {isPending ? <CircularProgress size={24} /> : text}
    </Button>
  );
}
