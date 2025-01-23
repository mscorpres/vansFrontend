import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import SearchIcon from "@mui/icons-material/Search";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Input, Space } from "antd";

import { gridOptions } from "@/config/agGrid/ModuleRegistry";
import {
  columnDefs,
  EwayBillColumnDefs,
  TruncateCellRenderer,
} from "@/config/agGrid/SalesEtransactionTableColumns";

import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  // fetchEInvoiceData,
  fetchEwayList,
  fetchInvoiceList,
} from "@/features/salesmodule/salesTransactionSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { CsvExportModule } from "ag-grid-community";
import { rangePresets } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@mui/material";
import { IoMdDownload } from "react-icons/io";
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const wises = [
  { label: "Date Wise", value: "date" },
  { label: "Invoice Number", value: "invoice" },
] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  wise: z.string(),
  invoice: z.string().optional(),
});

const SalesETransactionRegisterPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [wise, setWise] = useState<any>("date");
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const [type, setType] = useState<any>("e-invoice");
  const [rowData, setRowData] = useState<any[]>([]); // Local state for row data
  const { data, loading } = useSelector((state: RootState) => state.invoice);
  const { loading: loading2 } = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      wise: "date",
    },
  });

  const types = [
    { label: "e-Invoice", value: "e-invoice" },
    { label: "e-way Bill", value: "e-waybill" },
  ] as const;

  // Effect to reset rowData when type changes
  useEffect(() => {
    setRowData([]); // Reset row data
    setIsSearchPerformed(false); // Reset search performed state
  }, [type]);

  useEffect(() => {
    setRowData(data || []);
  }, [data]);

  const getColumnDefs = (type: string) => {
    if (type === "e-waybill") {
      return EwayBillColumnDefs;
    } else {
      return columnDefs;
    }
  };

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const { dateRange, wise, invoice } = formData;

    let dataString = "";
    if (wise === "date" && dateRange) {
      const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
      const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
      dataString = `${startDate}-${endDate}`;
    } else if (wise === "invoice") {
      dataString = invoice || "";
    }

    try {
      let resultAction;
      switch (type) {
        case "e-invoice":
          resultAction = await dispatch(
            fetchInvoiceList({ wise, data: dataString }) as any
          ).unwrap();
          break;
        case "e-waybill":
          resultAction = await dispatch(
            fetchEwayList({ wise, data: dataString }) as any
          ).unwrap();
          break;
        default:
          throw new Error("Invalid type selected");
      }

      if (resultAction.success) {
        setRowData(resultAction.data); // Assuming resultAction.data contains the row data
        setIsSearchPerformed(true);
        toast({
          title: "Data fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to fetch data",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch data:", error);
      toast({
        title: error.message || "Failed to fetch data",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] ">
      {(loading || loading2) && <FullPageLoading />}
      <div className=" bg-[#fff]">
        <Card className="border-none rounded shadow-none">
          <CardHeader className="bg-hbg p-0 h-[49px] border-b border-slate-300 flex justify-center pl-[10px]">
            <CardTitle className="text-slate-600 flex items-center gap-[10px]">
              <Filter className="h-[20px] w-[20px]" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-[20px] p-0">
            <div className="p-[18px]">
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 overflow-hidden p-[10px]"
              >
                <FormField
                  control={form.control}
                  name="wise"
                  render={({ field }) => (
                    <FormItem className="flex flex-col p-[10px]">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild onClick={() => setOpen(true)}>
                          <FormControl>
                            <Button
                              variant="outlined"
                              role="combobox"
                              className={`${cn(
                                " justify-between",
                                !field.value && "text-muted-foreground"
                              )} text-slate-600 border-slate-400 ${
                                field.value
                                  ? "text-slate-600"
                                  : "text-neutral-400 font-[350]"
                              }`}
                            >
                              {field.value
                                ? wises.find(
                                    (wise) => wise.value === field.value
                                  )?.label
                                : "Select"}
                              <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 ">
                          <Command>
                            <CommandInput
                              placeholder="Search framework..."
                              className="h-9"
                            />
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
                                      setWise(wise.value);
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
                {wise === "date" ? (
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={() => (
                      <FormItem className="pl-[10px] w-full">
                        <FormControl>
                          <Space direction="vertical" size={12}>
                            <RangePicker
                              presets={rangePresets}
                              className=" border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-[310px]"
                              onChange={(value) =>
                                form.setValue(
                                  "dateRange",
                                  value
                                    ? value.map((date) => date!.toDate())
                                    : []
                                )
                              }
                              format={dateFormat}
                              disabledDate={(current) =>
                                current && current > moment().endOf("day")
                              }
                            />
                          </Space>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="invoice"
                    render={({ field }) => (
                      <FormItem className="w-full p-[12px]">
                        <FormControl>
                          <Input {...field} placeholder="Invoice number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="flex space-x-2 float-end pr-2">
                  <Button
                    variant="outlined"
                    type="button"
                    disabled={rowData.length == 0}
                    onClick={onBtExport}
                    // className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                  >
                    <IoMdDownload size={20} />
                  </Button>
                  {/* ) */}
                  <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SearchIcon />}
                    className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                  >
                    search
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          modules={[CsvExportModule]}
          rowData={rowData} // Use local rowData state
          columnDefs={getColumnDefs(type)}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          gridOptions={gridOptions}
          suppressCellFocus={true}
          components={{
            truncateCellRenderer: TruncateCellRenderer,
            copyCellRenderer: CopyCellRenderer,
          }}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
    </Wrapper>
  );
};

// Wrapper styled component remains the same
const Wrapper = styled.div`
  .ag-theme-quartz .ag-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default SalesETransactionRegisterPage;
