import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  Box,
  Typography,
  Chip,
  FormHelperText,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getStatuses } from "../utils/http";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function StatusesComponent({ statuses, setStatuses }) {
  const [selectedStatuses, setSelectedStatuses] = useState(statuses);
  const [statusOrders, setStatusOrders] = useState({});

  // Fetch statuses using useQuery
  const { data: availableStatuses, isLoading } = useQuery({
    queryKey: ["status"],
    queryFn: getStatuses,
  });

  const handleStatusChange = (event) => {
    const { value } = event.target;

    // Assign order based on the sequence of selection
    const newOrders = {};
    value.forEach((status, index) => {
      newOrders[status.id] = index + 1; // Order starts from 1
    });

    setSelectedStatuses(value);
    setStatusOrders(newOrders);

    // Update parent state
    setStatuses(
      value.map((status) => ({
        status: status.id,
        order: newOrders[status.id],
      }))
    );
  };

  const handleOrderChange = (statusId, order) => {
    const newOrders = { ...statusOrders, [statusId]: order };
    setStatusOrders(newOrders);

    // Update parent state
    setStatuses(
      selectedStatuses.map((status) => ({
        status: status.id,
        order: newOrders[status.id],
      }))
    );
  };

  if (isLoading) {
    return <Typography>Cargando estados...</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="statuses-label">Estados</InputLabel>
        <Select
          labelId="statuses-label"
          multiple
          value={selectedStatuses}
          onChange={handleStatusChange}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value.id} label={value.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {availableStatuses.map((status) => (
            <MenuItem key={status.id} value={status}>
              <Checkbox
                checked={selectedStatuses.some((s) => s.id === status.id)}
              />
              <ListItemText primary={status.name} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          The order is assigned based on select sequence
        </FormHelperText>
      </FormControl>
      {selectedStatuses.map((status) => (
        <TextField
          key={status.id}
          margin="normal"
          fullWidth
          label={`Orden para ${status.name}`}
          type="number"
          value={statusOrders[status.id] || ""}
          disabled
        />
      ))}
    </Box>
  );
}

export default StatusesComponent;
