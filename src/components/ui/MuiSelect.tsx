import { Autocomplete, TextField } from "@mui/material";
import React from "react";

export const MuiSelect = ({ options, label, name, form }) => {
  // Map options to the expected format
  const option = options.map((r) => ({
    label: r.label, // The label to display
    value: r.value, // The value to store in form
  }));

  // Get the value from the form and set a default value if undefined
  const value = form.getFieldValue(name) || { label: "", value: "" }; // Set default value if undefined

  return (
    <div>
      <Autocomplete
        sx={{ height: "30px" }}
        options={option}
        onChange={(_, newValue) => {
          form.setFieldValue(name, newValue); // Update the form's field value with the object
        }}
        isOptionEqualToValue={(option, value) => option.value === value?.value} // Ensure proper comparison
        value={value} // Ensure value is not undefined (set to an empty object if needed)
        getOptionLabel={(option) => option.label} // Display label in the dropdown
        renderInput={(params) => (
          <TextField {...params} label={label} variant="outlined" />
        )}
      />
    </div>
  );
};

export default MuiSelect;
