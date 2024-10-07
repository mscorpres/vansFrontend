import { podetail } from "@/data";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Badge, Edit2, EyeIcon, Filter, Trash } from "lucide-react";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
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
  fetchAllListOfVendor,
  fetchBomTypeWise,
  fetchListOfVendor,
  fetchState,
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import CustomTooltip from "@/components/shared/CustomTooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const FormSchema = z.object({
  wise: z.string().optional(),
  data: z.string().optional(),
});
const { RangePicker } = DatePicker;

const ManagePoPage: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const rowdata = podetail;
  const [wise, setWise] = useState("");
  const [asyncOptions, setAsyncOptions] = useState("");
  const dateFormat = "YYYY/MM/DD";
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "poId",
      headerName: "PO ID",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "costCenter",
      headerName: "COST CENTER",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendorNarration",
      headerName: "VENDER & NARRATION",
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "poRegDate",
      headerName: "PO REG. DATE",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
    {
      field: "approvedStatus",
      headerName: "APPROVED STATUS",
      flex: 1,
      cellRenderer: (params: any) => {
        const status = params.value;
        return (
          <Badge
            className={`${
              status === "Approved"
                ? "bg-green-600"
                : status === "Rejected"
                ? "bg-red-600"
                : "bg-yellow-600"
            }`}
          >
            {status}
          </Badge>
        );
      },
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Approved Status...",
        },
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: () => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button className="rounded h-[25px] w-[25px] felx justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600">
              <EyeIcon className="h-[15px] w-[15px] text-white" />
            </Button>
            <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600">
              <Edit2 className="h-[15px] w-[15px] text-white" />
            </Button>
            <Button className="bg-red-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
              <Trash className="h-[15px] w-[15px] text-white" />
            </Button>
          </div>
        );
      },
    },
  ]);
  const type = [
    {
      label: "Date Wise ",
      value: "datewise",
    },
    {
      label: "PO Wise",
      value: "powise",
    },
    {
      label: "Vendor Wise",
      value: "vendorwise",
    },
  ];
  const getVendorList = async () => {
    // return;
    console.log("herer");

    const response = await execFun(() => fetchListOfVendor(), "fetch");
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          label: r.name,
          value: r.code,
        };
      });
      setAsyncOptions(arr);
    }
  };
  const fetchManageList = (formData: z.infer<typeof FormSchema>) => {
    console.log("herrrr");
    console.log("formData", formData);
  };
  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
    };
  }, []);
  // useEffect(() => {
  //   getVendorList();
  // }, []);

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
            onSubmit={form.handleSubmit(fetchManageList)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
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
            />
            {wise === "datewise" ? (
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Space direction="vertical" size={12} className="w-full">
                        <RangePicker
                          className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                          onChange={(e: any) => form.setValue("data", e.value)}
                        />
                      </Space>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : wise === "vendorwise" ? (
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="vendor number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="PO number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={fetchManageList}
            >
              Search
            </Button>{" "}
            {/* <CustomTooltip
              message="Add Address"
              side="top"
              className="bg-yellow-700"
            >
              <Button
                onClick={() => {
                  setSheetOpen(true);
                }}
                className="bg-cyan-700 hover:bg-cyan-600 p-0 h-[30px] w-[30px] flex justify-center items-center shadow-slate-500"
              >
                <Plus className="h-[20px] w-[20px]" />
              </Button>
            </CustomTooltip> */}
          </form>{" "}
        </Form>
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <AgGridReact
          rowData={rowdata}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>{" "}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default ManagePoPage;
