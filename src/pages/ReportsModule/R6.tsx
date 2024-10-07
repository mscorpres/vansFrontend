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
  fetchListOfMINRegisterOut,
  fetchListOfQ1,
  fetchR2,
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
  component: z.string().optional(),
});

const R6 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;
  const theWise = form.watch("types");
  const dateFormat = "YYYY/MM/DD";
  console.log("theWise", theWise);

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
      searchValues: theWise,
      searchData: dataString || selectedCustomer?.value,
    };
    console.log("payload", payload);

    const response = await execFun(() => fetchR2(payload), "fetch");
    console.log("response", response);
    let { data } = response;
    if (data.code == 200) {
      let arr = data.response.data.map((r, index) => {
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
  const handleCompChange = (e: any) => {
    // form.setValue("component", e.value);
    setSelectedCustomer(e);
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
      headerName: "Po Date",
      field: "reg_date",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Created By",
      field: "reg_by",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "PO Order Id",
      field: "po_order_id",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Part",
      field: "part_no",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Compenent",
      field: "component_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Compenent Code/Description",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "UoM",
      field: "unit_name",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Qty",
      field: "ordered_qty",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: " Pending Qty",
      field: "ordered_pending",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Rate",
      field: "po_rate",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Currency",
      field: "currency_lable",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Currency Sym",
      field: "currency_symbol",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Vendor Code",
      field: "vendor_code",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Due Date",
      field: "due_date",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "po_cost_center",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Project Name",
      field: "po_project",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Branch In",
      field: "branch",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const type = [
    {
      label: "Date Wise",
      value: "P",
    },
    {
      label: "Part Wise",
      value: "PROJECT",
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
            />
            {theWise === "P" ? (
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
            ) : (
              <FormField
                control={form.control}
                name="component"
                render={() => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Component Name</FormLabel>
                    <FormControl>
                      <ReusableAsyncSelect
                        placeholder="Component Name"
                        endpoint="/rate/getcomponents"
                        transform={transformOptionData}
                        onChange={handleCompChange}
                        value={selectedCustomer}
                        fetchOptionWith="payload"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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

export default R6;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
