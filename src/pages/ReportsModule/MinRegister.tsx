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
import MyAsyncSelect from "@/components/shared/MyAsyncSelect";
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
import {
  transformCustomerData,
  transformOptionData,
  transformPlaceData,
} from "@/helper/transform";
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
import { spigenAxios } from "@/axiosIntercepter";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  fetchListOfMINRegister,
  fetchListOfQ1,
  getComponentsByNameAndNo,
} from "@/components/shared/Api/masterApi";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string().optional(),
});

const MinRegister = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    console.log("formData", formData);
    let { date } = formData;
    let dataString = "";
    if (date) {
      const startDate = date[0]
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
      const endDate = date[1]
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");
      dataString = `${startDate}-${endDate}`;
      console.log("dateString", dataString);
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
      //   addToast(data.message.msg, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
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

export default MinRegister;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
