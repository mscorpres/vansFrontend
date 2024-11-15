import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space } from "antd";
import {
  transformCustomerData,
  transformOptionData,
  transformPlaceData,
} from "@/helper/transform";
import Select from "react-select";

import useApi from "@/hooks/useApi";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  fetchListOfMINRegister,
} from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string(),
  search: z.string().optional(),
});

const MinRegister = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const theWise = form.watch("types");
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    console.log("formData", formData);
    let { date } = formData;
    let dataString = "";
    if (date) {
      dataString = exportDateRangespace(date);
    } else {
      dataString = formData.search;
    }
    let payload = {
      min_types: formData.types,
      data: dataString,
    };
    const response = await execFun(
      () => fetchListOfMINRegister(payload),
      "fetch"
    );
    console.log("response", response);
    let { data } = response;
    if (data.code == 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      console.log("arr", arr);

      setRowData(arr);
    } else {
  
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
      field: "DATE",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Tran Type",
      field: "TYPE",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Part No",
      field: "PART",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Component",
      field: "COMPONENT",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "In Box",
      field: "bom_product_sku",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Rate",
      field: "RATE",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Exchange Rate",
      field: "EXCHANGE_RATE",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Curr.",
      field: "CURRENCY",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Curr. Code",
      field: "CURRENCYSYMBOL",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount LC",
      field: "AMOUNT_LC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount FC",
      field: "AMOUNT_FC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "UoM",
      field: "UNIT",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Vendor Code",
      field: "VENDOR_CODE",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Vendor Name",
      field: "VENDOR_NAME",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Branch",
      field: "VENDOR_BRANCH",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Doc. Id",
      field: "INVOIVENUMBER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "TXT ID",
      field: "TRANSACTION",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "PO No.",
      field: "PONUMBER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "PO Date",
      field: "PODATE",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "COSTCENTER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "In By",
      field: "ISSUEBY",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const type = [
    {
      label: "All MIN(s)",
      value: "MIN",
    },
    {
      label: "Markup-MIN(s)",
      value: "MARKUP",
    },
    {
      label: "Pending-Markup",
      value: "NONMARKUP",
    },
    {
      label: "PO MIN(s)",
      value: "POMIN",
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Min Register");
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
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          >
            <FormField
              control={form.control}
              name="types"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder=" Enter Type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={type}
                      onChange={(e: any) => form.setValue("types", e.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {theWise == "POMIN" ? (
              <FormField
                control={form.control}
                name="search"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-slate-600"></FormLabel>
                    <FormControl>
                      <ReusableAsyncSelect
                        // placeholder="State"
                        endpoint="/backend/searchPoByPoNo"
                        transform={transformOptionData}
                        fetchOptionWith="payload"
                        onChange={(e: any) => form.setValue("search", e.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
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
                        />
                      </Space>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* )} */}
            <div className="flex gap-[10px] justify-end  px-[5px]">
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
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
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
        />
      </div>
    </Wrapper>
  );
};

export default MinRegister;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
