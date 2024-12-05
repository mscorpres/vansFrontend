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
import { transformOptionData } from "@/helper/transform";
import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  fetchListOfQ3,
  getProductsByNameAndNo,
} from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
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

const Q3 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();

  const fetchComponentList = async (e: any) => {
    setSelectedCustomer(e);

    const response = await execFun(() => getProductsByNameAndNo(e), "fetch");
  };
  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let payload = {
      sku_code: selectedCustomer?.value,
    };
    const response = await execFun(() => fetchListOfQ3(payload), "fetch");

    let { data } = response;
    if (data.success) {
      let arr = data.response.data2;
      let a = arr.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(arr);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700 text-center text-white",
        autoDismiss: true,
      });
      //   addToast(data.message.msg, {
      //     appearance: "error",
      //   });
    }
  };
  useEffect(() => {
    // fetchComponentList();
  }, []);
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "SKU Query Report");
  };
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "serial_no",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Date & Time",
      field: "date",
      filter: "agTextColumnFilter",
      flex: 1,
      width: 250,
    },
    {
      headerName: "Transaction Type",
      field: "transaction_type",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Qty",
      field: "qty",
      filter: "agTextColumnFilter",
      flex: 1,
      width: 150,
    },
    {
      headerName: "UoM",
      field: "uom",
      filter: "agTextColumnFilter",
      width: 130,
    },
    {
      headerName: "Created/Approved By",
      field: "doneby",
      flex: 1,
      filter: "agTextColumnFilter",
      width: 250,
    },
  ];

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
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          >
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <ReusableAsyncSelect
                      placeholder="SKU Code"
                      endpoint="/backend/getProductByNameAndNo"
                      transform={transformOptionData}
                      onChange={fetchComponentList}
                      value={selectedCustomer}
                      fetchOptionWith="search"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {/* )} */}{" "}
            <div className="flex items-center gap-[10px] justify-end">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={() => {
                //     fetchBOMList();
                //   }}
              >
                Search
              </Button>{" "}
              <Button
                // type="submit"
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey "
                // onClick={() => {}}
                disabled={rowData.length === 0}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleDownloadExcel();
                }}
              >
                <IoMdDownload size={20} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
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

export default Q3;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
