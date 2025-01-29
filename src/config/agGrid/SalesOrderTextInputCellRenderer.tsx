import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppDispatch, RootState } from "@/store";
import { CommandList } from "cmdk";
import { useState } from "react";
import { FaSortDown, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Select } from "antd";
import { transformOptionData } from "@/helper/transform";
import { useParams } from "react-router-dom";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import moment from "moment";
import { fetchComponentDetailByCode } from "@/features/salesmodule/createSalesOrderSlice";
const frameworks = [
  {
    value: "/",
    label: "Home",
  },
  {
    value: "/login",
    label: "Login",
  },
  {
    value: "/create-po",
    label: "Create PO",
  },
  {
    value: "/manage-po",
    label: "Manage PO",
  },
  {
    value: "/add-po",
    label: "Add PO",
  },
];

const type = [
  {
    value: "product",
    label: "product",
  },
  {
    value: "component",
    label: "component",
  },
];

const gstRateList = [
  {
    value: "0",
    label: "0 %",
  },
  {
    value: "5",
    label: "5 %",
  },
  {
    value: "12",
    label: "12 %",
  },
  {
    value: "18",
    label: "18 %",
  },
  {
    value: "28",
    label: "28 %",
  },
];

const gstType = [
  {
    value: "I",
    label: "INTER STATE",
  },
  {
    value: "L",
    label: "INTRA STATE",
  },
];
const SalesOrderTextInputCellRenderer = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const { value, colDef, data, api, column, setRowData } = props;
  const { componentDetails } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const handleDeleteRow = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRowIndex !== null) {
      setRowData((prevData: any) =>
        prevData.filter((_: any, index: any) => index !== selectedRowIndex)
      );
      api.applyTransaction({
        remove: [api.getDisplayedRowAtIndex(selectedRowIndex).data],
      });

      // Example payload for deleteProduct
      const payload: any = {
        item: data?.material?.id,
        so_id: (params?.id as string)?.replace(/_/g, "/"),
        updaterow: data?.updateid,
      };
      if (window.location.pathname.includes("update")) {
        // dispatch(deleteProduct(payload));
      }
    }
    setShowConfirmDialog(false);
  };
  const updateData = (newData: any) => {
    api.applyTransaction({ update: [newData] });
    api.refreshCells({ rowNodes: [props.node], columns: [column] });
  };

  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = value; // Save ID in the data
    if (colDef.field === "material") {
      console.log("props", props);
      console.log("value", value);

      dispatch(
        fetchComponentDetailByCode({
          component_code: value,
          vencode: "CUS001",
          costCenter: props.getCostCenter,
        })
      ).then((response: any) => {
        if (response.meta.requestStatus === "fulfilled") {
          const componentData = response.payload;
          data["stock"] = componentData?.closingQty;
          data["hsnCode"] = componentData?.hsn;
          data["gstRate"] = componentData?.gstrate;
          data["rate"] = componentData?.rate;
          data["partno"] = componentData?.partno;
          updateData(data);
        }
      });
    }

    const localValue = parseFloat(data.localValue) || 0; // Ensure localValue is a number
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    const calculation = (localValue * data.gstRate) / 100;
    if (props.exRate?.currency !== "364907247") {
      data["foreignValue"] = localValue * props.exRate?.exchange_rate;
    }

    if (data.gstType === "L") {
      // Intra-State
      cgst = calculation / 2;
      sgst = calculation / 2; // Same as CGST
      igst = 0;
      data.cgst = cgst.toFixed(2);
      data.sgst = sgst.toFixed(2);
      data.igst = igst.toFixed(2);
    } else if (data.gstType === "I") {
      // Inter-State
      igst = calculation;
      cgst = 0;
      sgst = 0;
      data.cgst = cgst.toFixed(2);
      data.sgst = sgst.toFixed(2);
      data.igst = igst.toFixed(2);
    }
    // setDisplayText(text);
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column] }); // refresh the cell to show the new value
    api.applyTransaction({ update: [data] });
    setOpen(false);
    updateData(data);
  };

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // Update the data object

    // Update localValue if the rate or orderQty is changed
    if (colDef.field === "rate") {
      data["localValue"] = newValue * parseFloat(data.orderQty);
    }
    if (colDef.field === "orderQty") {
      data["localValue"] = newValue * parseFloat(data.rate);
    }
    const localValue = parseFloat(data.localValue) || 0; // Ensure localValue is a number
    if (props.exRate?.currency !== "364907247") {
      data["foreignValue"] = localValue * props.exRate?.exchange_rate;
    }
    // Calculate GST based on the updated values
    const gstRate = parseFloat(data.gstRate) || 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    // Perform GST calculation only if the relevant fields are updated
    if (
      colDef.field === "rate" ||
      colDef.field === "orderQty" ||
      colDef.field === "gstRate"
    ) {
      const calculation = (localValue * gstRate) / 100;

      if (data.gstType === "L") {
        // Intra-State
        cgst = calculation / 2;
        sgst = calculation / 2; // Same as CGST
        igst = 0;
      } else if (data.gstType === "I") {
        // Inter-State
        igst = calculation;
        cgst = 0;
        sgst = 0;
      }

      // Update the GST fields
      data["cgst"] = cgst.toFixed(2);
      data["sgst"] = sgst.toFixed(2);
      data["igst"] = igst.toFixed(2);
    }

    // Update the cell data and re-render
    api.refreshCells({ rowNodes: [props.node], columns: [column] });
    api.applyTransaction({ update: [data] });
    updateData(data);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleDateChange = (date: moment.Moment | null) => {
    data.dueDate = date ? date.format("DD-MM-YYYY") : ""; // Format the date for storage
    updateData(data); // Update the data
  };

  const renderContent = () => {
    switch (colDef.field) {
      case "delete":
        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleDeleteRow(props.node.rowIndex)}
              className={
                api.getDisplayedRowCount() <= 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:text-red-700 pt-3"
              }
              aria-label="Delete"
              disabled={api.getDisplayedRowCount() <= 1}
            >
              <FaTrash />
            </button>
            <CommonModal
              isDialogVisible={showConfirmDialog}
              handleOk={handleConfirmDelete}
              handleCancel={() => setShowConfirmDialog(false)}
              title="Reset Details"
              description={"Are you sure you want to remove this entry?"}
            />
          </div>
        );
      case "material":
        return (
          <Select
            className="w-full"
            labelInValue
            filterOption={false}
            showSearch
            placeholder="Select Material"
            onSearch={(e) => {
              props.setSearch(e);
              if (data.type) {
                props.onSearch(e, data.type);
              }
            }}
            options={transformOptionData(componentDetails || [])}
            onChange={(e) => handleChange(e.value)}
            value={typeof value === "string" ? { value } : value?.name}
          />
        );
      case "partno":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            // type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "asinNumber":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
              >
                {value === "" ? (
                  <p className="text-slate-500 font-[400]">
                    {colDef.headerName}
                  </p>
                ) : (
                  value
                )}
                <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0  ">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
                <CommandList className="max-h-[400px] overflow-y-auto">
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                      onSelect={(currentValue) => handleChange(currentValue)}
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      case "gstType":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
              >
                {value
                  ? gstType.find((option) => option.value === value)?.label
                  : colDef.headerName}
                {console.log(
                  gstType.find((option) => option.value === value)?.label,
                  value
                )}
                <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0  ">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
                <CommandList className="max-h-[400px] overflow-y-auto">
                  {gstType.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                      onSelect={(currentValue) => handleChange(currentValue)}
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      case "gstRate":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
              >
                {value
                  ? gstRateList.find((option) => option.value === value)?.label
                  : colDef.headerName}
                <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0  ">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
                <CommandList className="max-h-[400px] overflow-y-auto">
                  {gstRateList.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                      onSelect={(currentValue) => handleChange(currentValue)}
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      case "rate":
        return (
          <>
            <Input
              onChange={handleInputChange}
              value={value}
              type="text"
              placeholder={colDef.headerName}
              className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
            />
          </>
        );
      case "type":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between  text-slate-600 items-center  border-slate-400 shadow-none"
              >
                {value ? capitalizeFirstLetter(value) : colDef.headerName}
                <FaSortDown className="w-5 h-5 ml-2 mb-[5px] opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0  ">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
                <CommandList className="max-h-[400px] overflow-y-auto">
                  {type.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.label}
                      className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                      onSelect={(currentValue) => handleChange(currentValue)}
                      defaultValue={type[0].value}
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      case "dueDate":
        return (
          <DatePicker
            format="DD-MM-YYYY" // Set the format to dd-mm-yyyy
            onChange={handleDateChange}
            value={value ? moment(value, "DD-MM-YYYY") : null} // Convert string to moment object
            className="w-[100%] border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "hsnCode":
      case "remark":
      case "itemDescription":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "materialDescription":
        return (
          <Input
            readOnly
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "localValue":
      case "foreignValue":
      case "cgst":
      case "sgst":
      case "igst":
      case "partno":
      case "stock":
        return (
          <Input
            readOnly
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px] bg-slate-100"
          />
        );

      default:
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="number"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
    }
  };

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default SalesOrderTextInputCellRenderer;
