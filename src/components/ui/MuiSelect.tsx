import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";
interface Props {
  options: any;
  label: any;
  name: any;
  form: any;
}
export const MuiSelect: React.FC<Props> = ({ options, label, name, form }) => {
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
        // styles={customStyles}
        // sx={{ height: "30px" }}

        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: value?.value ? "#FFFBEB" : "transparent", // Set background color to yellow if a value is selected
            borderColor: value?.value ?? " .5px #FFB300",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: value?.value ?? "#a8a29e", // Change border color on hover
            },
            // Decrease the height of the input field
            height: "44px", // Adjust the height here as needed
          },
          // "& .MuiOutlinedInput-input": {
          //   padding: "5px ", // Adjust padding for smaller height
          // },
        }}
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
