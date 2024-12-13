import { StylesConfig } from "react-select";

interface OptionType {
  label: string;
  value: string;
}

export const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0",
    border: "2px solid #cbd5e1",
    //  border: "none",
    borderBottom: "2px solid #cbd5e1",
    borderColor: state.isFocused ? "#cbd5e1" : "grey",
    boxShadow: "none",
    color: "#475569",
    "&:hover": {
      borderColor: "#8d9196",
    },
    // background: "#FFFBEB",
    background: state.isFocused ? "#FFFBEB" : "white",
    fontSize: "15px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#f1f2f3"
      : state.isFocused
      ? "#f1f2f3"
      : "white",
    color: state.isSelected ? "black" : state.isFocused ? "black" : "black",
    "&:hover": {
      backgroundColor: "#f1f2f3",
      color: "black",
    },

    borderRadius: "5px",
    transition: "all 0.1s",
    cursor: "pointer",
    fontSize: "15px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#475569",
  }),
  container: (provided) => ({
    ...provided,
  }),
  menu: (provided) => ({
    ...provided,

    backgroundColor: "white",
    borderRadius: "10px",
    border: "none",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    msScrollbarTrackColor: "ButtonFace",
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "white", // White background for the dropdown list
    padding: "10px", // Padding inside the dropdown
    display: "flex", // Display flex for better item alignment
    flexDirection: "column", // Stack items vertically
    gap: "5px", // Space between the items
    borderRadius: "10px", // Rounded corners for the menu list
    position: "relative", // Position relative to adjust stacking context
    zIndex:10, // Ensure the dropdown list appears above other content
  }),
};
