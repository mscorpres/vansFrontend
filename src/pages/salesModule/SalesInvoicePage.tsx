import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import { columnDefs } from "@/config/agGrid/SalesInvoiceTableColumns";
import { RootState } from "@/store";
import { downloadEInvoiceList, fetchSalesOrderInvoiceList } from "@/features/salesmodule/salesInvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import moment from "moment";
import { rangePresets } from "@/General";
import { setDateRange } from "@/features/salesmodule/SalesSlice";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Input } from "@/components/ui/input";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "Invoice Number Wise", value: "soinvid_wise" },
] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  reportDateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range for the report.",
    }),
  soinvid_wise: z.string().optional(),
});

const SalesInvoicePage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [type, setType] = useState<string>("date_wise");
  const dispatch = useDispatch();
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const { data, loading } = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const [rowData, setRowData] = useState<any[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: undefined,
      reportDateRange: undefined,
      soinvid_wise: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const { dateRange, soinvid_wise } = formData;

    let dataString = "";
    if (type === "date_wise" && dateRange) {
      const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
      const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
      dataString = `${startDate}-${endDate}`;
      dispatch(setDateRange(dataString as any));
    } else if (type === "soinvid_wise" && soinvid_wise) {
      dataString = soinvid_wise;
      dispatch(setDateRange(dataString as any));
    } else {
      toast({
        title: "Please provide a valid date range or invoice number",
        className: "bg-red-600 text-white items-center",
      });
      return;
    }

    try {
      const resultAction = await dispatch(
        fetchSalesOrderInvoiceList({ type: type, data: dataString }) as any
      ).unwrap();
      if (resultAction.code == "200") {
        setRowData(resultAction.data);
        setIsSearchPerformed(true);
        toast({
          title: "Invoice fetched successfully",
          className: "bg-green-600 text-white items-center",
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

  const onGenerateReport = async (formData: z.infer<typeof FormSchema>) => {
    const { reportDateRange, soinvid_wise } = formData;

    let dataString = "";
    if (type === "date_wise" && reportDateRange) {
      const startDate = moment(reportDateRange[0]).format("DD-MM-YYYY");
      const endDate = moment(reportDateRange[1]).format("DD-MM-YYYY");
      dataString = `${startDate}-${endDate}`;
    } else if (type === "soinvid_wise" && soinvid_wise) {
      dataString = soinvid_wise;
    } else {
      toast({
        title: "Please provide a valid date range or invoice number for the report",
        className: "bg-red-600 text-white items-center",
      });
      return;
    }

    try {
      console.log("Downloading report with payload:", { type, data: dataString });
      const resultAction = await dispatch(
        downloadEInvoiceList({ type, data: dataString }) as any
      ).unwrap();
      console.log("Download response:", resultAction);
      if (resultAction.success) { // Check for success, not code
        const filePath = resultAction.data?.filePath || resultAction.data?.file_path;
        if (!filePath) {
          throw new Error("No file path returned in response");
        }
        const link = document.createElement("a");
        link.href = filePath;
        link.download = `tax_invoice_${moment().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Report downloaded successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        throw new Error(resultAction.message || "Failed to download report");
      }
    } catch (error: any) {
      console.error("Failed to download report:", error);
      toast({
        title: error.message || "Failed to download report",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  useEffect(() => {
    setRowData(data as any);
  }, [data]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
  }, [type]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {loading && <FullPageLoading />}
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-[#fff] px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]">
          <Select
            onValueChange={(value: string) => {
              setType(value);
              if (value === "soinvid_wise") {
                form.setValue("dateRange", undefined);
                form.setValue("reportDateRange", undefined);
              }
            }}
            defaultValue={type}
          >
            <SelectTrigger className="border-slate-300">
              <SelectValue placeholder="Select a filter type" />
            </SelectTrigger>
            <SelectContent>
              {wises.map((data) => (
                <SelectItem key={data.value} value={data.value}>
                  {data.label}
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
            {type === "date_wise" ? (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Space direction="vertical" size={12} className="w-full">
                        <RangePicker
                          className="border shadow-sm border-slate-300 py-[7px] hover:border-slate-400 w-full rounded-md"
                          onChange={(value) =>
                            field.onChange(
                              value ? value.map((date) => date!.toDate()) : []
                            )
                          }
                          format={dateFormat}
                          presets={rangePresets}
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
                name="soinvid_wise"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Invoice number"
                        className="border-slate-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end pr-2">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 rounded-md"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="border-t border-slate-300 mt-4 pt-4">
            <div className="text-center text-lg font-semibold text-slate-800 mb-4">
              GENERATE REPORT
            </div>
            <form
              onSubmit={form.handleSubmit(onGenerateReport)}
              className="space-y-6 overflow-hidden p-[10px]"
            >
              {type === "date_wise" ? (
                <FormField
                  control={form.control}
                  name="reportDateRange"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Space direction="vertical" size={12} className="w-full">
                          <RangePicker
                            className="border shadow-sm border-slate-300 py-[7px] hover:border-slate-400 w-full rounded-md"
                            onChange={(value) =>
                              field.onChange(
                                value ? value.map((date) => date!.toDate()) : []
                              )
                            }
                            format={dateFormat}
                            presets={rangePresets}
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
                  name="soinvid_wise"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Invoice number"
                          className="border-slate-300 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-end pr-2">
                <Button
                  type="submit"
                  className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 rounded-md"
                >
                  Download Report
                </Button>
              </div>
            </form>
          </div>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          suppressCellFocus={true}
          paginationAutoPageSize={true}
          loadingOverlayComponent={OverlayNoRowsTemplate}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
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