import React, { useCallback, useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import { columnDefs } from "@/config/agGrid/SalesInvoiceTableColumns";
import { gridOptions } from "@/config/agGrid/ModuleRegistry";
import { RootState } from "@/store";
import { fetchSalesOrderInvoiceList } from "@/features/salesmodule/salesInvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const wises = [
  { label: "Date Wise", value: "datewise" },
  { label: "client", value: "clientwise" },
  { label: "so id", value: "so_id_wise" },

] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine(data => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
    wise: z.string().optional(),
});
const SalesInvoicePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [wise] = useState<any>("datwwise");
  const { data: rowData } = useSelector((state: RootState) => state.sellInvoice);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const { dateRange, wise } = formData;
  
    let dataString = "";
    if (wise === "datewise" && dateRange) {
      const startDate = dateRange[0].toLocaleDateString("en-GB").split("/").reverse().join("-");
      const endDate = dateRange[1].toLocaleDateString("en-GB").split("/").reverse().join("-");
      dataString = `${startDate}-${endDate}`;
    } else if (wise === "clientwise" && wise !== undefined) {
      dataString = wise;
    }
  
    try {
      console.log("Dispatching fetchSellRequestList with:", { wise, data: dataString });
      const resultAction = await dispatch(fetchSalesOrderInvoiceList({ wise, data: dataString }) as any).unwrap();
      console.log("Result Action:", resultAction);
      if (resultAction.success) {
        toast({
          title: "Invoice fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch sell requests:", error);
      toast({
        title: error.message || "Failed to fetch Product",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  
  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  useEffect(() => {
    if (wise === "datewise") {
      dispatch(fetchSalesOrderInvoiceList({ wise, data: "" }) as any);
    }
  }, [wise, dispatch]);


 



  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] ">
      <div className=" bg-[#fff]">
        <Card className="border-none rounded shadow-none">
          <CardHeader className="bg-hbg p-0 h-[49px] border-b border-slate-300 flex justify-center pl-[10px]">
            <CardTitle className="text-slate-600 flex items-center gap-[10px]">
              <Filter className="h-[20px] w-[20px]" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-[20px] p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-hidden p-[10px]">
                <FormField
                  control={form.control}
                  name="wise"
                  render={({ field }) => (
                    <FormItem className="flex flex-col p-[10px]">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild onClick={() => setOpen(true)}>
                          <FormControl>
                            <Button variant="outline" role="combobox" className={`${cn(" justify-between", !field.value && "text-muted-foreground")} text-slate-600 border-slate-400 ${field.value?"text-slate-600":"text-neutral-400 font-[350]"}`}>
                              {field.value ? wises.find((wise) => wise.value === field.value)?.label : "Select option "}
                              <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 ">
                          <Command>
                            <CommandInput placeholder="Search framework..." className="h-9" />
                            <CommandList className="max-h-[400px]">
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {wises.map((wise) => (
                                  <CommandItem
                                    key={wise.value}
                                    value={wise.value}
                                    className="data-[disabled]:opacity-100 aria-selected:bg-cyan-600 aria-selected:text-white data-[disabled]:pointer-events-auto flex items-center gap-[10px]"
                                    onSelect={() => {
                                      form.setValue("wise", wise.value);
                                      setOpen(false);
                                    }}
                                  >
                                    {wise.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  
                  name="dateRange"
                  render={() => (
                    <FormItem className="pl-[10px] w-fulls">
                      <FormControl>
                        <Space direction="vertical" size={12}>
                          <RangePicker
                          className=" border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-[310px]"
                            onChange={(value) => form.setValue("dateRange", value ? value.map((date) => date!.toDate()) : [])}
                            format={dateFormat}
                          />
                        </Space>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 ml-[10px]">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">

        
        <AgGridReact
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData as any}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          gridOptions={gridOptions}
          
        />
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
export default SalesInvoicePage;
