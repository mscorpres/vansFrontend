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
import { fetchProductData } from "@/features/salesmodule/SalesSlice";
import { AppDispatch, RootState } from "@/store";
import { CommandList } from "cmdk";
import { useEffect, useState } from "react";
import { FaSortDown, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Select } from "antd";
import "ag-grid-enterprise";
// import { transformCurrencyData, transformOptionData } from "@/helper/transform";
// import CurrencyRateDialog from "@/components/ui/CurrencyRateDialog";
// import {
//   DeletePayload,
//   deleteProduct,
// } from "@/features/salesmodule/SalesSlice";
import { useParams } from "react-router-dom";
// import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import moment from "moment";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformCurrencyData, transformOptionData } from "@/helper/transform";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import {
  fetchComponentDetails,
  fetchCurrency,
} from "@/features/client/clientSlice";
import { fetchFGProductData } from "@/features/client/storeSlice";

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
    label: "LOCAL",
  },
];
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
const bomStatusList = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Alternative",
    label: "Alternative",
  },
  {
    value: "InActive",
    label: "InActive",
  },
];
const bomStatusCat = [
  {
    value: "Part",
    label: "Part",
  },
  {
    value: "Packaging",
    label: "Packaging",
  },
  {
    value: "PCB",
    label: "PCB",
  },
  {
    value: "Other",
    label: "Other",
  },
];
const TextInputCellRenderer = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const {
    value,
    colDef,
    data,
    api,
    column,
    materialList,
    currency,
    setRowData,
  } = props;
  const { componentDetails } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const { product, productData } = useSelector(
    (state: RootState) => state.store
  );
  const { hsnlist, getComponentData } = useSelector(
    (state: RootState) => state.client
  );

  const [openCurrencyDialog, setOpenCurrencyDialog] = useState(false);

  const handleDeleteRow = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    if (selectedRowIndex !== null) {
      setRowData((prevData: any) =>
        prevData.filter((_: any, index: any) => index !== selectedRowIndex)
      );
      api.applyTransaction({
        remove: [api.getDisplayedRowAtIndex(selectedRowIndex).data],
      });
      // Example payload for deleteProduct
      const payload: DeletePayload = {
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
    // setRowData((prevData: any) => [...prevData, newData]);
  };

  const handleCurrencyChange = (value: any) => {
    dispatch(fetchCurrency());
    data["currency"] = value;
    setOpenCurrencyDialog(true);
  };
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = value; // Save ID in the data
    if (colDef.field === "product") {
      data["product"] = data.product;

      dispatch(
        fetchFGProductData({
          search: data["product"],
        })
      ).then((res) => {
        if (res.payload) {
          let date2 = res.payload;
          data["stock"] = res.payload?.total;
          data["uom"] = res.payload?.unit;
        }
      });

      api.refreshCells({ rowNodes: [props.node], columns: [column] });
      api.applyTransaction({ update: [data] });
      updateData(data);
    }
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    const calculation = (data.localValue * data.gstRate) / 100;
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

    // Update localValue if the rate is changed
    if (colDef.field === "rate") {
      data["localValue"] = newValue * parseFloat(data.orderQty);
    }
    if (colDef.field === "orderQty") {
      data["localValue"] = newValue * parseFloat(data.rate);
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
      const calculation = (data.localValue * gstRate) / 100;

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

      // Update IGST for all cases where relevant fields change
      data["cgst"] = cgst.toFixed(2);
      data["sgst"] = sgst.toFixed(2);
      data["igst"] = igst.toFixed(2);
    }

    // Update the cell data and re-render
    api.refreshCells({ rowNodes: [props.node], columns: [column] });
    api.applyTransaction({ update: [data] });
    updateData(data);
  };
  const submitCurrencyRate = (field: string, value: any) => {
    data[field] = value?.rate;
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
              handleOk={(e: any) => handleConfirmDelete(e)}
              handleCancel={() => setShowConfirmDialog(false)}
              title="Reset Details"
              description={"Are you sure you want to remove this entry?"}
            />
          </div>
        );
      case "materialbymer":
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
            options={props?.materialList}
            onChange={(e) => handleChange(e.value)}
            value={typeof value === "string" ? { value } : value?.label}
          />
          //   <ReusableAsyncSelect
          //     placeholder="Part Name"
          //     endpoint="/backend/getComponentByNameAndNo"
          //     transform={transformOptionData}
          //     onSearch={(e) => {
          //       setSearch(e);
          //       if (data.type) {
          //         props.onSearch(e, data?.material);
          //       }
          //     }}
          //     value={props.val}
          //     fetchOptionWith="payload"
          //   />
        );
      case "material":
        return (
          <Select
            className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white flex items-center gap-[10px] w-full overflow-y-auto"
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
            value={typeof value === "string" ? { value } : value?.text}
            style={{ pointerEvents: "auto" }}
          />
        );
      case "transfermaterial":
        return (
          <Select
            className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white flex items-center gap-[10px] w-full overflow-y-auto"
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
            value={typeof value === "string" ? { value } : value?.text}
            style={{ pointerEvents: "auto" }}
          />
        );
      case "product":
        return (
          <Select
            className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white flex items-center gap-[10px] w-full overflow-y-auto"
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
            options={transformOptionData(product || [])}
            onChange={(e) => handleChange(e.value)}
            value={typeof value === "string" ? { value } : value?.text}
            style={{ pointerEvents: "auto" }}
          />
        );
      case "procurementMaterial":
        return (
          <Select
            className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white flex items-center gap-[10px] w-full overflow-y-auto"
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
            value={typeof value === "string" ? { value } : value?.text}
            style={{ pointerEvents: "auto" }}
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
            <Select
              className="w-1/3"
              labelInValue
              filterOption={false}
              placeholder="Currency"
              defaultValue={{ value: "364907247", label: "₹" }}
              options={transformCurrencyData(props?.currencyList || [])}
              onChange={(e) => handleCurrencyChange(e.value)}
              // value={value}
            />
            {/* <CurrencyRateDialog
              open={openCurrencyDialog}
              onClose={() => setOpenCurrencyDialog(false)}
              currency={data.currency || ""}
              price={parseFloat(data.rate) || 0}
              inputHandler={submitCurrencyRate}
              rowId={data.rowId}
            /> */}
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
            value={value}
            // type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "localValue":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "value":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "foreignValue":
      case "cgst":
      case "sgst":
      case "igst":
        return (
          <Input
            readOnly
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "bomStatus":
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
                  {bomStatusList.map((framework) => (
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
      case "bomCategory":
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
                  {bomStatusCat.map((framework) => (
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

      case "hsnSearch":
        return (
          <Select
            onPopupScroll={(e) => e.preventDefault()}
            className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white flex items-center gap-[10px] overflow-y-auto"
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
            options={transformOptionData(hsnlist || [])}
            onChange={(e) => handleChange(e.value)}
            value={typeof value === "string" ? { value } : value?.text}
            style={{ pointerEvents: "auto" }} // Ensure pointer events are enabled
          />
        );
      case "vendorName":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "component_fullname":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "uom":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            disabled
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "orderQty":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            placeholder={colDef.headerName}
            type="text"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "stock":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            disabled
            placeholder={colDef.headerName}
            type="number"
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
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

  if (data?.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default TextInputCellRenderer;
