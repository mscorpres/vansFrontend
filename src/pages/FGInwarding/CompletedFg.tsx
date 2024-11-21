import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { Checkbox, DatePicker, Space } from "antd";

import Select from "react-select";
import { transformOptionData } from "@/helper/transform";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { fetchListOfCompletedFg } from "@/components/shared/Api/masterApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  exportDatepace,
  exportDateRangespace,
} from "@/components/shared/Options";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { rangePresets } from "@/General";
const FormSchema = z.object({
  searchValue: z.string().optional(),
  datainp: z.string().optional(),
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
});

const CompeletedFg = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [wise, setWise] = useState();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";
  const fetchFGList = async (formData: z.infer<typeof FormSchema>) => {
    let { dateRange, datainp } = formData;

    let datas = "";
    if (wise === "datewise" && dateRange) {
      datas = exportDateRangespace(dateRange);
    } else if (wise === "skuwise" && datainp) {
      datas = datainp;
    }

    const response = await execFun(
      () => fetchListOfCompletedFg(wise, datas),
      "fetch"
    );

    let { data } = response;
    if (data.code === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-700 text-center text-white",
      });
    }
  };

  const type = [
    {
      label: "Date Wise",
      value: "datewise",
    },
    {
      label: "SKU Wise",
      value: "skuwise",
    },
    ,
  ];
  useEffect(() => {
    fetchFGList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Req Id",
      field: "mfg_transaction",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Type",
      field: "typeOfPPR",
      filter: "agTextColumnFilter",
      width: 100,
    },
    {
      headerName: "Req Date/Time",
      field: "mfg_full_date",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "SKU",
      field: "mfg_sku",
      filter: "agTextColumnFilter",
      width: 110,
    },
    {
      headerName: "Product",
      field: "p_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "MFG /Stin Qty",
      field: "mfg_prod_planing_qty",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Actions",
      cellRendererFramework: "ActionCellRenderer",
      width: 100,
      suppressMenu: true, // Optionally, hide the menu icon in this column
      cellRenderer: () => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Checkbox onClick={(e) => rowData(e.target.checked)} />
          </div>
        );
      },
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Store Completed");
  };
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
            onSubmit={form.handleSubmit(fetchFGList)}
            className="space-y-6 overflow-hidden p-[10px] h-[470px]"
          >
            <FormField
              control={form.control}
              name="wise"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Select Type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={type}
                      onChange={(e: any) => setWise(e.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {wise === "datewise" ? (
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Space direction="vertical" size={12} className="w-full">
                        <RangePicker
                          presets={rangePresets}
                          className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                          onChange={(value) =>
                            form.setValue(
                              "dateRange",
                              value ? value.map((date) => date!.toDate()) : []
                            )
                          }
                          format={"DD-MM-YYYY"}
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
                name="datainp"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <ReusableAsyncSelect
                        placeholder="Product Name/ SKU"
                        endpoint="/backend/fetchProduct"
                        transform={transformOptionData}
                        onChange={(e) => form.setValue("datainp", e.value)}
                        fetchOptionWith="payload"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}{" "}
            <div className="flex gap-[10px] justify-end">
              {" "}
              <Button
                // type="submit"
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
                // onClick={() => {}}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleDownloadExcel();
                }}
                disabled={rowData.length == 0}
              >
                <IoMdDownload size={20} />
              </Button>
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={fetchFGList}
              >
                Search
              </Button>
            </div>
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
        />
      </div>
    </Wrapper>
  );
};

export default CompeletedFg;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
