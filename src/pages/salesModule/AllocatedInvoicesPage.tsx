import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Filter } from "lucide-react";
import { RowData } from "@/types/SalesOrderAllocatedInvoicesType";
import { columnDefs } from "@/config/agGrid/SalesOrderAllocatedTableColumns";
import styled from "styled-components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DatePicker, Space } from "antd";
import { gridOptions } from "@/config/agGrid/ModuleRegistry";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  language: z.string().optional(),
});
const AllocatedInvoicesPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [rowData] = useState<RowData[]>([
    { id: 1, couriarName: "DHL", invoiceDate: "2024-07-16", coInvoiceId: "INV001", billingAddress: "123 Main St", clientAddress: "456 Elm St", shippingAddress: "789 Oak St" },
    // add more row data here
  ]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] ">
      <div className=" bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-hidden ] p-[10px]">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <>
                  <FormItem className="flex flex-col ">
                    <Popover open={open} onOpenChange={setOpen}>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="">
                          <AccordionTrigger className="w-full border-none text-slate-600 text-[15px]">Courier Name </AccordionTrigger>
                          <AccordionContent className="flex justify-center">
                            <PopoverTrigger asChild onClick={() => setOpen(true)}>
                              <FormControl>
                                <Button variant="outline" role="combobox" className={`${cn(" justify-between", !field.value && "text-muted-foreground")} text-slate-600 w-full ${field.value?"text-slate-600":"text-neutral-400 font-[350]"}`}>
                                  {field.value ? languages.find((language) => language.value === field.value)?.label : "Courier Name"}
                                  <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <PopoverContent className="p-0 ">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandList className="max-h-[400px]">
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {languages.map((language) => (
                                <CommandItem
                                  key={language.value}
                                  value={language.value}
                                  className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                                  onSelect={() => {
                                    form.setValue("language", language.value);
                                    setOpen(false);
                                  }}
                                >
                                  {language.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={() => (
                      <FormItem className="w-full ">
                        <FormControl>
                          <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="w-full border-none text-slate-600 text-[15px]">Date Wise</AccordionTrigger>
                              <AccordionContent>
                                <Space direction="vertical" size={12} className="w-full">
                                  <RangePicker className=" border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full" onChange={(value) => form.setValue("dateRange", value ? value.map((date) => date!.toDate()) : [])} format={dateFormat} />
                                </Space>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            />
            <Button type="submit" className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 ">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact gridOptions={gridOptions} rowData={rowData} columnDefs={columnDefs} defaultColDef={{ filter: true, sortable: true }} pagination={true} paginationPageSize={10} paginationAutoPageSize={true} />
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
export default AllocatedInvoicesPage;
