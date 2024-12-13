import { OutlinedInput, TextField } from "@mui/material";
import { set } from "lodash";
import React from "react";

export const MuiInput = ({ fullWidth, label, form, name }) => {
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
      //   error={form}
      //   helperText={"geee"}
      //   onChange={()=>{form.setFieldsValue({})}}
    />
  );
};

export default MuiInput;
