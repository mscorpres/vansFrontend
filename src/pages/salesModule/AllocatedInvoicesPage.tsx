import React, { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import {
  columnDefs,
  TruncateCellRenderer,
} from "@/config/agGrid/SalesOrderAllocatedTableColumns";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import { gridOptions } from "@/config/agGrid/ModuleRegistry";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCreditDebitRegisterList } from "@/features/salesmodule/creditDebitRegisterSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import moment from "moment";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { CsvExportModule } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { setDateRange, setWise } from "@/features/salesmodule/SalesSlice";
import { rangePresets } from "@/General";
// import GenerateNoteReport from "@/pages/salesModule/GenerateNoteReport";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

const wises = [
  { label: "Date Wise", value: "date" },
  // { label: "Number", value: "noteNo" }, // Uncomment if needed
] as const;

const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .refine((data) => data.length === 2, {
      message: "Please select a valid date range.",
    })
    .optional(),
  number: z.string().optional(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

interface CreditNote {
  invoice_id: string;
  other_ref: string;
  material: Record<string, any>;
}

const AllocatedInvoicesPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<CreditNote>>(null);
  const [wiseType, setWiseType] = useState<string>("date");
  const [rowData, setRowData] = useState<CreditNote[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const { loading } = useSelector((state: RootState) => state.creditDebitRegister);

  console.log("rowData", rowData);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: [],
      number: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    const { dateRange, number } = formData;
    let dataString = "";

    if (wiseType === "date" && dateRange?.length === 2) {
      const startDate = moment(dateRange[0]).format("DD-MM-YYYY");
      const endDate = moment(dateRange[1]).format("DD-MM-YYYY");
      dataString = `${startDate}-${endDate}`;
      dispatch(setDateRange(dataString as any));
    } else {
      dataString = number || "";
    }

    try {
      const resultAction = await dispatch(
        fetchCreditDebitRegisterList({
          wise: wiseType,
          data: dataString,
        })
      ).unwrap();

      if (resultAction.success) {
        setRowData(resultAction.data);
        setIsSearchPerformed(true);
        toast({
          title: "Credit notes fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to fetch credit notes",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error: any) {
      toast({
        title: error.message || "Failed to fetch credit notes",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  useEffect(() => {
    if (wiseType) {
      dispatch(setWise(wiseType));
    }
  }, [wiseType, dispatch]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
  }, [wiseType]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {loading && <FullPageLoading />}
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-1 overflow-hidden p-[10px]"
          >
            <div className="p-[10px]">
              <Select
                value={wiseType}
                onValueChange={(value) => setWiseType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter type" />
                </SelectTrigger>
                <SelectContent>
                  {wises.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {wiseType === "date" ? (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="w-full p-[12px]">
                    <FormControl>
                      <Space direction="vertical" size={12} className="w-full">
                        <RangePicker
                          className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                          onChange={(value) =>
                            field.onChange(
                              value
                                ? value.map((date: any) => date?.toDate())
                                : []
                            )
                          }
                          format={dateFormat}
                          disabledDate={(current) =>
                            current && current > moment().endOf("day")
                          }
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
                name="number"
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
              {isSearchPerformed && (
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
                Search
              </Button>
            </div>
          </form>
        </Form>
        {/* <div>
          <GenerateNoteReport />
        </div> */}
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          modules={[CsvExportModule]}
          gridOptions={gridOptions}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
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

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default AllocatedInvoicesPage;