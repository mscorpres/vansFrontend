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
import { transformOptionData } from "@/helper/transform";
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
import { DatePicker, Space } from "antd";
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
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import EditProduct from "./EditProduct";
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

const Product = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const fetchProductList = async () => {
    const response = await execFun(() => getProductList(), "fetch");
    console.log("response", response);
    let { data } = response;
    if (response.status === 200) {
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

  useEffect(() => {
    fetchProductList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Product Name",
      field: "p_name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "SKU",
      field: "p_sku",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Customer Code",
      field: "p_customer",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Customer Name",
      field: "cname",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600">
              <Edit2
                className="h-[15px] w-[15px] text-white"
                onClick={() => setSheetOpenEdit(e?.data?.product_key)}
              />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 overflow-hidden p-[10px] h-[800px]"
          >
            <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
              <div className="">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
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
                  name="uom"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>UOM</FormLabel>
                      <FormControl>
                        <Select
                          styles={customStyles}
                          components={{ DropdownIndicator }}
                          placeholder=" Enter UOM"
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
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Product</FormLabel>
                    <FormControl>
                      <Input
                        className={InputStyle}
                        placeholder="Enter Product"
                        // {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>{" "}
            <div className="">
              <FormField
                control={form.control}
                name="customerName"
                render={() => (
                  <FormItem>
                    <FormLabel className={LableStyle}>
                      Customer Name/Code
                    </FormLabel>
                    <FormControl>
                      <ReusableAsyncSelect
                        placeholder="Customer Name"
                        endpoint="/others/customerList"
                        transform={transformOptionData}
                        onChange={(e) => form.setValue("customerName", e)}
                        // value={selectedCustomer}
                        fetchOptionWith="payload"
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
        <EditProduct
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

export default Product;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
