import { toast } from "@/components/ui/use-toast";
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

  export const stateOptions = [
    { code: "01", name: "Jammu And Kashmir" },
    { code: "02", name: "Himachal Pradesh" },
    { code: "03", name: "Punjab" },
    { code: "04", name: "Chandigarh" },
    { code: "05", name: "Uttarakhand" },
    { code: "06", name: "Haryana" },
    { code: "07", name: "Delhi" },
    { code: "08", name: "Rajasthan" },
    { code: "09", name: "Uttar Pradesh" },
    { code: "10", name: "Bihar" },
    { code: "11", name: "Sikkim" },
    { code: "12", name: "Arunachal Pradesh" },
    { code: "13", name: "Nagaland" },
    { code: "14", name: "Manipur" },
    { code: "15", name: "Mizoram" },
    { code: "16", name: "Tripura" },
    { code: "17", name: "Meghalaya" },
    { code: "18", name: "Assam" },
    { code: "19", name: "West Bengal" },
    { code: "20", name: "Jharkhand" },
    { code: "21", name: "Odisha" },
    { code: "22", name: "Chattisgarh" },
    { code: "23", name: "Madhya Pradesh" },
    { code: "24", name: "Gujarat" },
    { code: "25", name: "Daman And Diu" },
    { code: "26", name: "Dadra And Nagar Haveli" },
    { code: "27", name: "Maharashtra" },
    { code: "28", name: "Andhra Pradesh (Before Division)" },
    { code: "29", name: "Karnataka" },
    { code: "30", name: "Goa" },
    { code: "31", name: "Lakshadweep" },
    { code: "32", name: "Kerala" },
    { code: "33", name: "Tamil Nadu" },
    { code: "34", name: "Puducherry" },
    { code: "35", name: "Andaman And Nicobar Islands" },
    { code: "36", name: "Telangana" },
    { code: "37", name: "Andhra Pradesh (New)" },
    { code: "38", name: "Ladakh" }
  ];

  export const showToast = (message: any, type: string) => {
    if (type == "error") {
      toast({
        title: message,
        className: "bg-red-600 text-white items-center",
      });
    } else {
      toast({
        className: "bg-green-600 text-white items-center",
        description: message,
      });
    }
  };

  export const downloadFile = ({ fileUrl, fileName }: { fileUrl: string; fileName: string }) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName; // Specify the file name for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };