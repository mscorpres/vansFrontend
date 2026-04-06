import * as React from "react";
import { CircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

import { CommandList } from "cmdk";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";
import { DialogProps } from "@radix-ui/react-dialog";
import NotificationPnnel from "../ui/NotificationPnnel";

const navLinks = [
  {
    href: "/",
    label: "Home",
    value: "home",
  },
  {
    href: "/master/material",
    label: "Material",
    value: "material",
  },
  {
    href: "/master/service",
    label: "Service",
    value: "service",
  },
  {
    href: "/create-po",
    label: "Create PO",
    value: "create-po",
  },
  {
    href: "/manage-po",
    label: "Manage PO",
    value: "manage-po",
  },
  {
    href: "/sales/order/create",
    label: "Create Sales Order",
    value: "create-sales-order",
  },
  {
    href: "/sales/order/register",
    label: "Sales Order Register",
    value: "sales-order-register",
  },
  {
    href: "/sales/order/shipment",
    label: "Sales Order Shipments",
    value: "shipments",
  },
  {
    href: "/sales/order/invoice",
    label: "Invoice Register",
    value: "invoice",
  },
  {
    href: "/sales/order/allocated",
    label: "Credit Note",
    value: "allocated-invoices",
  },
  {
    href: "/sales/order/e-transaction-register",
    label: "E Transaction Register",
    value: "e-transaction-register",
  },
  {
    href: "/master/product/",
    label: "Products",
    value: "products",
  },
  {
    href: "/master/billing-address",
    label: "Billing Address",
    value: "billing-address",
  },
  {
    href: "/master/shipping-address",
    label: "Shipping Address",
    value: "shipping-address",
  },
];

export default function QuickLink({ ...props }: DialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "ff" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-[40px] w-[350px] justify-start rounded-[0.5rem] bg-white text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Quick links...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[10px] top-[10px] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>f
        </kbd>
      </Button>
      <NotificationPnnel />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {navLinks.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  runCommand(() => navigate(item.href as string));
                }}
                className="pointer-events-auto data-[disabled]:pointer-events-auto data-[disabled]:opacity-70 cursor-pointer aria-selected:bg-zinc-200"
              >
                <div className="flex items-center justify-center w-4 h-4 mr-2">
                  <CircleIcon className="w-3 h-3" />
                </div>
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
