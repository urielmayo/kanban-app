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
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";

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

function createOrder(statuses) {
  const order = {};
  if (statuses) {
    statuses.forEach((st) => (order[st.status] = st.order));
  }
  return order;
}

function StatusesComponent({ statuses, setStatuses, errors = [] }) {
  const [selectedStatusIds, setSelectedStatusIds] = useState(
    statuses.map((st) => st.status)
  );
  const [statusOrders, setStatusOrders] = useState(createOrder(statuses));

  const {
    data: availableStatuses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["status"],
    queryFn: getStatuses,
  });

  const handleStatusChange = (event) => {
    const { value } = event.target; // value es un array de IDs

    const newOrders = {};
    value.forEach((id, index) => {
      newOrders[id] = index + 1;
    });

    setSelectedStatusIds(value);
    setStatusOrders(newOrders);

    // Map IDs back to full status object
    const updatedStatuses = value.map((id) => ({
      status: id,
      order: newOrders[id],
    }));
    setStatuses(updatedStatuses);
  };

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent />;

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel id="statuses-label">Statuses</InputLabel>
        <Select
          required
          labelId="statuses-label"
          label="Statuses"
          multiple
          value={selectedStatusIds}
          onChange={handleStatusChange}
          renderValue={(selectedIds) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selectedIds.map((id) => {
                const status = availableStatuses.find((s) => s.id === id);
                return <Chip key={id} label={status?.name || id} />;
              })}
            </Box>
          )}
          MenuProps={MenuProps}
          error={errors.length > 0}
        >
          {availableStatuses.map((status) => (
            <MenuItem key={status.id} value={status.id}>
              <Checkbox checked={selectedStatusIds.includes(status.id)} />
              <ListItemText primary={status.name} />
            </MenuItem>
          ))}
        </Select>
        {errors.length > 0 && <FormHelperText error>{errors}</FormHelperText>}
        <FormHelperText>
          The order is assigned based on select sequence
        </FormHelperText>
      </FormControl>
    </Box>
  );
}

export default StatusesComponent;
