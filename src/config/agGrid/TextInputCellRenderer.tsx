import { getComponentsByNameAndNo } from "@/components/shared/Api/masterApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
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
import { transformOptionData } from "@/helper/transform";
import useApi from "@/hooks/useApi";
import { Select } from "antd";
import { CommandList } from "cmdk";
import { useEffect, useState } from "react";
import { FaSortDown } from "react-icons/fa6";

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
  const [open, setOpen] = useState(false);
  const [compList, setCompList] = useState([]);
  const { value, colDef, data, api, column, search, setSearch, val } = props;
  const handleChange = (value: string) => {
    const newValue = value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column] }); // refresh the cell to show the new value
    setOpen(false);
  };

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    data[colDef.field] = newValue; // update the data
    api.refreshCells({ rowNodes: [props.node], columns: [column] }); // refresh the cell to show the new value
  };
  setCompList(search);

  const renderContent = () => {
    switch (colDef.field) {
      case "material":
        return (
          // <Select
          //   className="w-full"
          //   labelInValue
          //   filterOption={false}
          //   showSearch
          //   placeholder="Select Material"
          //   onSearch={(e) => {
          //     setSearch(e);
          //     if (data.type) {
          //       props.onSearch(e, data?.material);
          //     }
          //   }}
          //   options={val ? val : []}
          //   // onChange={(e) => handleChange(e.value)}
          //   value={typeof value === "string" ? { value } : value?.text}
          // />
          <ReusableAsyncSelect
            placeholder="Part Name"
            endpoint="/backend/getComponentByNameAndNo"
            transform={transformOptionData}
            onChange={(e) => handleChange(e.value)}
            // value={selectedCustomer}
            fetchOptionWith="payload"
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
      case "currency":
        return (
          <>
            <Input
              type="number"
              className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px] mr-2"
              placeholder={colDef.headerName}
              value={value}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[90px] justify-between  text-slate-600 items-center  border-slate-400 shadow-none px-[3px]"
                >
                  {value === "" ? (
                    <p className="text-slate-500 font-[400]">
                      {colDef.headerName}
                    </p>
                  ) : (
                    value
                  )}
                  <FaSortDown className="w-5 h-5  mb-[5px] opacity-50 shrink-0" />
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
      case "dueDate":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            type="text"
            placeholder={colDef.headerName}
            className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
          />
        );
      case "hsnCode":
        return (
          <Input
            onChange={handleInputChange}
            value={value}
            type="text"
            placeholder={colDef.headerName}
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
