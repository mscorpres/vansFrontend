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
import { ICellRendererParams } from "ag-grid-community";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
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
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import { fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import { RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ActionCellRenderer from "./ActionCellRenderer";
import {
  componentList,
  componentMapList,
  fetchBomTypeWise,
  fetchListOfCompletedFg,
  fetchListOfCompletedFgOut,
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";

const dateFormat = "YYYY/MM/DD";
const FormSchema = z.object({
  wise: z.string().optional(),
  date: z.array(z.date()),
  // .length(1)
  // .optional()
  // .refine((data) => data === undefined || data.length === 1, {
  //   message: "Please select a valid date range.",
  // }),
});

const FgOutCreate = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [wise, setWise] = useState();
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const fetchFgOutList = async (formData: z.infer<typeof FormSchema>) => {
    const { date } = formData;
    console.log("fetchBOMList", formData);
    console.log("wise", wise);
    let dataString = "";
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
    // return;
    const response = await execFun(
      () => fetchListOfCompletedFgOut(dataString),
      "fetch"
    );
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.response.data.map((r, index) => {
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
      label: "Out",
      value: "0",
    },
  ];
  useEffect(() => {
    fetchFgOutList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "BOM Name & SKU",
      field: "bom_product_sku",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Customer",
      field: "client_name",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Customer Code",
      field: "client_code",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Actions",
      cellRendererFramework: "ActionCellRenderer",
      width: 150,
      suppressMenu: true, // Optionally, hide the menu icon in this column
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
            onSubmit={form.handleSubmit(fetchFgOutList)}
            className="space-y-6 overflow-hidden p-[10px] h-[170px]"
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Space direction="vertical" size={12} className="w-full">
                      <DatePicker
                        className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                        // onChange={(value) => console.log("value", value)}
                        onChange={(value) =>
                          field.onChange(
                            value ? value?.map((date) => date!.toDate()) : ""
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
            {/* )} */}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              //   onClick={() => {
              //     fetchBOMList();
              //   }}
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

export default FgOutCreate;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
