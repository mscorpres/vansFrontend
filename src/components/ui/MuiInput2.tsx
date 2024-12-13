import { TextField } from "@mui/material";
import { Controller } from "react-hook-form"; // Import Controller from react-hook-form
import React from "react";

export const MuiInput2 = ({ label, name, control, fullWidth = true, type }) => {
  return (
    <Controller
      name={name} // Field name in the form
      control={control} // Control from react-hook-form
      //   sx={{ padding: "13.5px" }}
      render={({ field, fieldState }) => (
        <TextField
          {...field} // Spread the field properties like value, onChange, etc.
          label={label}
          //   sx={{ padding: "13.5px" }}
          className="z-1"
          variant="outlined"
          fullWidth={fullWidth}
          error={!!fieldState?.error} // Show error if there is any
          helperText={fieldState?.error?.message} // Show error message
          focused={!!field.value} // Focus input if there is a value
          type={type}
        />
      )}
    />
  );
};

export default MuiInput2;
