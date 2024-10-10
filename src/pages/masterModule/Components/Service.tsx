import React from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space, Typography } from "antd";
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
import {
  componentList,
  getComponentDetailsForServices,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import FullPageLoading from "@/components/shared/FullPageLoading";
import EditService from "./EditService";
const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  soWise: z.string().optional(),
});
const Service = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const addService = async () => {
    // const values = await form.validateFields();
    console.log("values", values);
    const response = await execFun(() => servicesaddition(values), "fetch");
    if (response.status == "success") {
      addToast("Service Created Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      form.resetFields();
    } else {
      addToast(response.message.msg, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const fetchServiceList = async () => {
    const response = await execFun(() => serviceList(), "fetch");
    const { data } = response;
    console.log("response0", response);
    if (response.status === 200) {
      let arr = data.data.map((r, id) => {
        return { id: id + 1, ...r };
      });
      setRowData(arr);
    }
  };
  useEffect(() => {
    fetchServiceList();
  }, []);
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "c_part_no",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Component",
      field: "c_name",
      filter: "agTextColumnFilter",
      width: 250,
    },

    {
      headerName: "UoM",
      field: "units_name",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600">
              <Edit2
                className="h-[15px] w-[15px] text-white"
                onClick={() => setSheetOpenEdit(e?.data?.component_key)}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr] overflow-hidden">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px]"
          >
            <div className="grid grid-cols-2 gap-[40px]  ">
              <div className="">
                <FormField
                  control={form.control}
                  name="partCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Part Code</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Part Code"
                          // {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="uom"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>UOM</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder="UOM"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={asyncOptions}
                          //   onChange={(e) => console.log(e)}
                          //   value={
                          //     data.clientDetails
                          //       ? {
                          //           label: data.clientDetails.city.name,
                          //           value: data.clientDetails.city.name,
                          //         }
                          //       : null
                          //   }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="compName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Component name</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Component name"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              <FormField
                control={form.control}
                name="Specifiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Specifiction</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Specifiction"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
            </Button>
          </form>
        </Form>{" "}
        <EditService
          sheetOpenEdit={sheetOpenEdit}
          setSheetOpenEdit={setSheetOpenEdit}
        />
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

export default Service;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
