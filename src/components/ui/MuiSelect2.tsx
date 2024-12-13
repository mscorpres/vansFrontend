import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

export const MuiSelect2 = ({ options, label, name, control }) => {
  // Map options to the expected format if needed
  const option = options.map((r) => ({
    label: r.label, // The label to display
    value: r.value, // The value to store in form
  }));

  return (
    <Controller
      name={name} // Field name in the form
      control={control} // Control from react-hook-form
      defaultValue={{ label: "", value: "" }} // Set default value if undefined
      render={({ field }) => (
        <div>
          <Autocomplete
            {...field} // Spread the field properties like value, onChange, etc.
            options={option}
            onChange={(_, newValue) => {
              // Ensure the correct value format is passed
              field.onChange(newValue); // Update react-hook-form with the selected value
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value?.value
            } // Ensure proper comparison
            value={field.value || { label: "", value: "" }} // Set the value from form
            getOptionLabel={(option) => option.label} // Display label in the dropdown
            renderInput={(params) => (
              <TextField {...params} label={label} variant="outlined" />
            )}
            sx={{
              height: "30px",
              "& .MuiInputBase-root": {
                backgroundColor: field.value?.value ? "#FFFBEB" : "transparent", // Set background color to yellow if a value is selected
                borderColor: field.value?.value ? "#a8a29e" : "#a8a29e", // Border color based on selected value
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: field.value?.value ? "#a8a29e" : "#a8a29e", // Change border color on hover
                },
              },
            }}
          />
        </div>
      )}
    />
  );
};

export default MuiSelect2;
