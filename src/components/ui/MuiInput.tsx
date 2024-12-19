import { OutlinedInput, TextField } from "@mui/material";
import { set } from "lodash";
import React from "react";

export const MuiInput = ({ fullWidth, label, form, name, type }) => {
  return (
    <TextField
      //   id="filled-basic"
      //   color="grey"
      //   sx={{ height: "30px" }}
      className="z-0"
      variant="outlined"
      fullWidth={true}
      label={label}
      value={form.getFieldValue(name) ?? ""}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldValue(name, event.target.value);
      }}
      focused={!!form.getFieldValue(name)}
      type={type}
      sx={{
        // paddingY: "2px",
        height: "48px", // Set custom height here (adjust as needed)
        "& .MuiInputBase-root": {
          height: "100%", // Ensure the inner input matches the outer height
        },
        "& .MuiOutlinedInput-notchedOutline": {
          height: "100%", // Adjust the outline height to match
        },
      }}
      //   error={form}
      //   helperText={"geee"}
      //   onChange={()=>{form.setFieldsValue({})}}
    />
  );
};

export default MuiInput;
