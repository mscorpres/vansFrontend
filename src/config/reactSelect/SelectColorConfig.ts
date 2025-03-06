import { StylesConfig } from "react-select";

interface OptionType {
  label: string;
  value: string;
}

export const customStyles: StylesConfig<OptionType, false> = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "5px", // Slightly rounded corners for a softer look
    border: "1px solid #e2e8f0", // Full border with a light "pearly" gray color
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(203, 213, 225, 0.3)" // Subtle shadow on focus for a "pearly" effect
      : "0 1px 2px rgba(0, 0, 0, 0.05)", // Light shadow for a refined look
    color: "#475569",
    "&:hover": {
      borderColor: "#8d9196", // Slightly darker border on hover
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // Enhance shadow on hover
    },
    background: "transparent",
    fontSize: "15px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0891b2"
      : state.isFocused
      ? "#fff"
      : "white",
    color: state.isSelected
      ? "#fff"
      : state.isFocused
      ? "#475569"
      : "#475569",
    "&:hover": {
      backgroundColor: "#0891b2",
      color: "#fff",
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
    background: "#fff",
    borderRadius: "10px",
    border: "none",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
    msScrollbarTrackColor: "ButtonFace",
  }),
  menuList: (provided) => ({
    ...provided,
    background: "#fff",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    borderRadius: "10px",
  }),
};