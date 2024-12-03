import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space } from "antd";
import { transformOptionData } from "@/helper/transform";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { toast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { fetchListOfQ1 } from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { rangePresets } from "@/General";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  part: z.string().optional(),
});

const Q1 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [stockInfo, setStockInfo] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const { RangePicker } = DatePicker;

  const fetchComponentList = async (e: any) => {
    setSelectedCustomer(e);
  };
  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let { date } = formData;
    let dataString = "";
    if (date) {
      dataString = exportDateRangespace(date);
    }
    let payload = {
      data: selectedCustomer?.value,
      wise: "C",
      range: dataString,
    };
    const response = await execFun(() => fetchListOfQ1(payload), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = data.response.data2;
      let a = arr.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(a);
      setStockInfo(data.response.data1);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700 text-center text-white",
      });
    }
  };
  useEffect(() => {
    // fetchComponentList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Date",
      field: "date",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Qty In",
      field: "qty_in",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Qty Out",
      field: "qty_out",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Method",
      field: "mode",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Doc Type",
      field: "vendortype",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Vendor Code",
      field: "vendorcode",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Created/Approved By",
      field: "doneby",
      filter: "agTextColumnFilter",
      minWidth: 280,
      flex: 1,
    },
  ];
  console.log("selectedCustomer", selectedCustomer);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[520px]"
          >
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <ReusableAsyncSelect
                      placeholder="Part Name"
                      endpoint="/backend/getComponentByNameAndNo"
                      transform={transformOptionData}
                      onChange={fetchComponentList}
                      value={selectedCustomer}
                      fetchOptionWith="query2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="date"
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
                        format={"DD/MM/YYYY"}
                        presets={rangePresets}
                      />
                    </Space>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* )} */}
            <div className="flex items-center gap-[10px] justify-end">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={() => {
                //     fetchBOMList();
                //   }}
              >
                Search
              </Button>
            </div>
            <Divider />
            {/* <div className="h-[calc(100vh-10px)] grid grid-cols-[350px_1fr] flex "> */}
            {/* <div className="bg-[#fff] "> */}
            {/* <div className="p-[10px]"> */}
            {rowData.length > 0 && (
              <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
                <Card className="rounded-sm shadow-sm shadow-slate-500">
                  <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                    <CardTitle className="font-[550] text-slate-600">
                      Other Detail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
                    {/* //detais of client */}
                    <h3 className="font-[500]">CL Qty</h3>
                    <p className="text-[14px]">{stockInfo?.closingqty}</p>
                    <h3 className="font-[500]">Last In (Date / Type): </h3>
                    <p className="text-[14px]">{stockInfo?.lasttIN}</p>
                    <h3 className="font-[500]">Last Rate: </h3>
                    <p className="text-[14px]">{stockInfo?.lastRate}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
    </Wrapper>
  );
};

export default Q1;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
