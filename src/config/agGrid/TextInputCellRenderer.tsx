import { getComponentsByNameAndNo } from "@/components/shared/Api/masterApi";
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
import useApi from "@/hooks/useApi";
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
const TextInputCellRenderer = (props: any) => {
  const [open, setOpen] = useState(false);
  const [compList, setCompList] = useState([]);
  const { value, colDef, data, api, column } = props;
  const { execFun, loading: loading1 } = useApi();
  const fetchComponentList = async (search) => {
    const response = await execFun(
      () => getComponentsByNameAndNo(search),
      "fetch"
    );
    console.log("response---", response);
    if (response.status === "sucess") {
      let arr = response.data.map((r) => {
        return {
          label: r.id,
          value: r.text,
        };
      });
      console.log("arr", arr);
      setCompList(arr);
    }
  };
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

  const renderContent = () => {
    switch (colDef.field) {
      case "material":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[100%] justify-between text-slate-600 items-center  border-slate-400 shadow-none"
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
                <CommandInput
                  placeholder="Search..."
                  onChangeCapture={(e: any) => {
                    data[colDef.field] = e.target.value;
                    api.refreshCells({
                      rowNodes: [props.node],
                      columns: [column],
                    });
                  }}
                  onKeyDown={(e: any) => {
                    e.key === "Enter" && setOpen(false);
                  }}
                />
                <CommandEmpty>No {colDef.headerName} found.</CommandEmpty>
                <CommandList className="max-h-[400px] overflow-y-auto">
                  {compList.map((framework) => (
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

  if (data.isNew) {
    return renderContent();
  }

  return <span>{value}</span>;
};

export default TextInputCellRenderer;
