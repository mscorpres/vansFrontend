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
import { Edit2, EyeIcon, Filter, Trash2 } from "lucide-react";
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
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import EditBom from "./EditBom";
import ViewBom from "./ViewBom";
const FormSchema = z.object({
  wise: z.string().optional(),
});

const CreateBom = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [openView, setSheetOpenView] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const fetchBOMList = async (formData: z.infer<typeof FormSchema>) => {
    const { wise } = formData;
    console.log("fetchBOMList", formData);
    // return;
    const response = await execFun(() => fetchBomTypeWise(wise), "fetch");
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
  const sfgType = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];
  const type = [
    {
      label: "FG",
      value: "FG",
    },
    {
      label: "SGF",
      value: "SGF",
    },
  ];
  useEffect(() => {
    fetchBOMList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 70,
    },
    {
      headerName: "BOM Name & SKU",
      field: "bom_product_sku",
      filter: "agTextColumnFilter",
      width: 200,
    },
    {
      headerName: "Customer",
      field: "client_name",
      filter: "agTextColumnFilter",
      width: 300,
    },
    {
      headerName: "Customer Code",
      field: "client_code",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (params: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button
              onClick={() => {
                setSheetOpenView(params.data?.subject_id);
              }}
              className="rounded h-[25px] w-[25px] felx justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600"
            >
              <EyeIcon className="h-[15px] w-[15px] text-white" />
            </Button>
            <Button
              className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"
              onClick={() => {
                setSheetOpenEdit(params.data?.subject_id);
              }}
            >
              <Edit2 className="h-[15px] w-[15px] text-white" />
            </Button>
          </div>
        );
      },
    },
  ];
  console.log("sheetOpenEdit", sheetOpenEdit);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(fetchBOMList)}
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
                      onChange={(e: any) => form.setValue("wise", e.value)}
                    />
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
        <Divider />
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[300px]"
          >
            {" "}
            <div className="">
              <FormField
                control={form.control}
                name="bom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>BOM</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Enter BOM"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="sku"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>SKU</FormLabel>
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Enter SKU"
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
                  name="product"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>SKU</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder=" Enter SKU"
                          className="border-0 basic-single"
                          classNamePrefix="select border-0"
                          isDisabled={false}
                          isClearable={true}
                          isSearchable={true}
                          options={sfgType}
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
              </div>{" "}
            </div>
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              Submit
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
      {sheetOpenEdit && (
        <EditBom
          sheetOpenEdit={sheetOpenEdit}
          setSheetOpenEdit={setSheetOpenEdit}
        />
      )}
      {openView && (
        <ViewBom openView={openView} setSheetOpenView={setSheetOpenView} />
      )}
    </Wrapper>
  );
};

export default CreateBom;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
