import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { useNavigate } from "react-router-dom";
import { BsLink45Deg } from "react-icons/bs";

const frameworks = [
  {
    value: "/",
    label: "Home",
  },
  {
    value: "/login",
    label: "Login",
  },

  ////
  {
    value: "/master/material",
    label: "Material",
  },
  {
    value: "/master/service",
    label: "Service",
  },
  ////

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
  {
    value: "/sales/order/create",
    label: "Create Sales Order",
  },
  {
    value: "/sales/order/register",
    label: " Sales Order Register",
  },
  {
    value: "/sales/order/shipments",
    label: "Shipments",
  },
  {
    value: "/sales/order/invoice",
    label: "Invoice",
  },
  {
    value: "/sales/order/allocated",
    label: "Allocated Invoices",
  },
  {
    value: "/sales/order/e-transaction-register",
    label: " E Transaction Register",
  },
  {
    value: "/master/product/sfg",
    label: "Products",
  },
  {
    value: "/master/billing-address",
    label: "Billing Address",
  },
  {
    value: "/master/shipping-address",
    label: "Shipping Address",
  },
];

function QuickLinks() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const navigate = useNavigate();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Quick links
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0  ">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandList className="max-h-[400px] overflow-y-auto p-[10px]">
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                  navigate(framework.value);
                }}
              >
                <BsLink45Deg className={"w-[20px] h-[20px]  "} />
                {framework.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default QuickLinks;
