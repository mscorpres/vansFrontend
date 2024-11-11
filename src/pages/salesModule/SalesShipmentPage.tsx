import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Download, Filter } from "lucide-react";
import styled from "styled-components";
import { columnDefs } from "@/config/agGrid/SalesOrderShippingTableColumn";
import { DatePicker, Space } from "antd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShipMentsActionCellRender from "@/config/agGrid/cellRenders.tsx/ShipMentsActionCellRender";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import { RootState } from "@/store";
import {
  setDateRange,
} from "@/features/salesmodule/SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import { rangePresets } from "@/General";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { fetchSalesOrderShipmentList } from "@/features/salesmodule/salesShipmentSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "Shipment Id Wise", value: "shipid_wise" },
] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  shipid_wise: z.string().optional(),
});
const SalesShipmentPage: React.FC = () => {
  const dispatch = useDispatch();
  const gridRef = useRef<AgGridReact<any>>(null);
  const [type, setType] = useState<string>("date_wise");
  const [rowData, setRowData] = useState<any[]>([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const { data,loading } = useSelector(
    (state: RootState) => state.sellShipment
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const { dateRange, shipid_wise } = formData;

    let dataString = "";
    if (type === "date_wise" && dateRange) {
      const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
      const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
      dataString = `${startDate}-${endDate}`;
      dispatch(setDateRange(dataString as any));
    } else if (type === "shipid_wise" && shipid_wise) {
      dataString = shipid_wise;
      dispatch(setDateRange(dataString as any));
    }

    try {
      const resultAction = await dispatch(
        fetchSalesOrderShipmentList({ type, data: dataString }) as any
      ).unwrap();
      console.log("Result Action:", resultAction);
      if (resultAction.code === 200) {
        toast({
          title: "Register fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch sell requests:", error);
    }
  };

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  const components = useMemo(
    () => ({
      shipmentsActionRenderer: ShipMentsActionCellRender,
    }),
    []
  );

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  useEffect(() => {
    setRowData(data as any);
  }, [data]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
  }, [type]);


  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] ">
      {loading && <FullPageLoading />}
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]">
          <Select
            onValueChange={(value: string) => setType(value)}
            defaultValue={type}
          >
            <SelectTrigger>
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
                          className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
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
                name="shipid_wise"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="Invoice number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             <div className="flex space-x-2 float-end pr-2">
                  {isSearchPerformed && ( // Only show the download button if search is performed
                    <Button
                      type="button"
                      onClick={onBtExport}
                      className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                    >
                      <Download />
                    </Button>
                  )}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
            </Button>
          </div>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          components={components}
          loadingOverlayComponent={OverlayNoRowsTemplate}
          suppressCellFocus={true}
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
export default SalesShipmentPage;
