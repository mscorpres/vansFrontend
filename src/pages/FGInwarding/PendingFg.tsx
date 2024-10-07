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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Checkbox, DatePicker, Divider, Space, Typography } from "antd";
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
  fetchListOfPendingFg,
  getComponentsByNameAndNo,
  getListFgIn,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import { FaCheckCircle } from "react-icons/fa";
const FormSchema = z.object({
  wise: z.string().optional(),
});
const FormFGSchema = z.object({
  sku: z.string().optional(),
  qty: z.string().optional(),
});

const PendingFg = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [sheetOpenView, setSheetOpenView] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const fgForm = useForm<z.infer<typeof FormFGSchema>>({
    resolver: zodResolver(FormFGSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const fetchFGList = async (formData: z.infer<typeof FormSchema>) => {
    const { wise } = formData;
    console.log("fetchBOMList", formData);
    // return;
    const response = await execFun(() => fetchListOfPendingFg(), "fetch");
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
      label: "Pending",
      value: "p",
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
      flex: 1,
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
      cellRenderer: (e) => {
        return (
          <FaCheckCircle
            className="h-[15px] w-[15px] text-white bg-green-500 rounded-[50%] cursor-pointer"
            onClick={() => {
              setSheetOpenView(e?.data);
            }}
          />
          // <div className="flex gap-[5px] items-center justify-center h-full">
          //   <Checkbox onClick={(e) => rowData(e.target.checked)} />
          // </div>
        );
      },
    },
  ];
  console.log("sheetOpenView", sheetOpenView);
  const getinwardingDetails = async (sheetOpenView) => {
    let payload = {
      pprrequest2: sheetOpenView.mfg_transaction,
      pprrequest1: sheetOpenView.mfg_ref_transid_1,
      pprsku: sheetOpenView.mfg_sku,
    };
    const response = await execFun(() => getListFgIn(payload), "fetch");
    console.log("response", response);
    let { data } = response;
    if (response.status == 200) {
      console.log(" data.data[0]", data.data);
      let val = {
        sku: data.data.pprName,
        qty: data.data.pendingQty + "/" + data.data.completedQty,
      };
      fgForm.setValue("sku", val.sku);
      fgForm.setValue("qty", val.qty);
      console.log("val", val);
    }
  };
  useEffect(() => {
    if (sheetOpenView) {
      getinwardingDetails(sheetOpenView);
    }
  }, [sheetOpenView]);

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
        </Form>{" "}
        <Sheet open={sheetOpenView} onOpenChange={setSheetOpenView}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[50%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">FG Inwarding</SheetTitle>
            </SheetHeader>
            <div>
              <Form {...fgForm}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-[20px]">
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              NAME / SKU
                            </FormLabel>
                            <FormControl>
                              <Typography.Text
                                className={InputStyle}
                                placeholder="Enter NAME / SKU"
                                {...field}
                              ></Typography.Text>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              MFG / StIn QTY.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter MFG / StIn QTY."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              IN QTY.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter IN QTY."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className={modelFixFooterStyle}>
                    <Button
                      variant={"outline"}
                      className="shadow-slate-300 mr-[10px] border-slate-400 border"
                      onClick={(e: any) => {
                        setOpen(true);
                        e.preventDefault();
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-cyan-700 hover:bg-cyan-600"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
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

export default PendingFg;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
