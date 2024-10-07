import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { Checkbox, DatePicker, Divider, Space } from "antd";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import {
  transformCustomerData,
  transformOptionData,
  transformPlaceData,
} from "@/helper/transform";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { fetchListOfCompletedFg } from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
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
    console.log("dateRange, input", dateRange, datainp);
    console.log("Wise", wise);
    console.log("formData", formData);

    let dataString = "";
    if (wise === "datewise" && dateRange) {
      const startDate = dateRange[0]
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
      const endDate = dateRange[1]
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
      dataString = `${startDate}-${endDate}`;
      console.log("dateString", dataString);
    } else if (wise === "skuwise" && datainp) {
      dataString = datainp;
    }

    // return;
    const response = await execFun(
      () => fetchListOfCompletedFg(wise, dataString),
      "fetch"
    );
    console.log("response", response);
    // return;
    let { data } = response;
    if (data.code === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
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
                          className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                          onChange={(value) =>
                            field.onChange(
                              value ? value.map((date) => date!.toDate()) : []
                            )
                          }
                          format={dateFormat}
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
            )}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              //   onClick={fetchFGList}
            >
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
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

export default CompeletedFg;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
