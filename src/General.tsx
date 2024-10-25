import { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";

export const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Today", value: [dayjs().startOf("day"), dayjs()] },
    { label: "Yesterday", value: [dayjs().add(-1, "d"), dayjs()] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
  ];

  export const TruncateCellRenderer = (props: any) => {
    const style = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      width: "100%",
      display: "block",
      cursor: "pointer", // Change cursor to indicate hoverable area
    };
  
    return (
      <div
        style={style}
        title={props.value}
      >
        {props.value}
      </div>
    );
  };