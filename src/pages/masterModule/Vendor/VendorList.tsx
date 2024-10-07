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
import { Textarea } from "@/components/ui/textarea";
import { Edit2, EyeIcon, Filter, GitFork, Plus, Trash } from "lucide-react";
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
  fetchAllListOfVendor,
  fetchBomTypeWise,
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
});

const VendorList = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetOpenView, setSheetOpenView] = useState<boolean>(false);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [sheetOpenBranch, setSheetOpenBranch] = useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const fetchVendorList = async (formData: z.infer<typeof FormSchema>) => {
    // return;
    const response = await execFun(() => fetchAllListOfVendor(), "fetch");
    console.log("response", response);
    // return;
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
  const getStateList = async () => {
    // return;
    const response = await execFun(() => fetchState(), "fetch");
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
      setStateList(arr);
    }
  };

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
    fetchVendorList();
    getStateList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Nam",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Code",
      field: "vendor_code",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "PAN No.",
      field: "vendor_pan",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: () => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button
              onClick={() => {
                setSheetOpenView(true);
              }}
              className="rounded h-[25px] w-[25px] felx justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600"
            >
              <EyeIcon className="h-[15px] w-[15px] text-white" />
            </Button>
            <Button
              className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"
              onClick={() => {
                setSheetOpenEdit(true);
              }}
            >
              <Edit2 className="h-[15px] w-[15px] text-white" />
            </Button>
            <Button
              className="bg-yellow-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-yellow-600"
              onClick={() => {
                setSheetOpenBranch(true);
              }}
            >
              {/* <Trash className="h-[15px] w-[15px] text-white" /> */}
              <GitFork />
            </Button>
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
            // onSubmit={form.handleSubmit(fetchBOMList)}
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
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[50%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">
                Add Shipping Address
              </SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-[20px]">
                      <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Address label
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Address Label"
                                {...field}
                              />
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
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Company Name"
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
                              Pan No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Pan Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>GSTIN</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter GSTIN Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter State"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Complete Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address Line 1
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Complete Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address Line 2
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Complete Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
        {/* ---//////////////View */}
        <Sheet open={sheetOpenView} onOpenChange={setSheetOpenView}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[50%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">
                Listing Branch & Modification
              </SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-[20px]">
                      <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Address label
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Address Label"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Address label
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Address Label"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Company Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}{" "}
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="Branch"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={stateList}
                                // onChange={(e) => console.log(e)}
                                // value={
                                //   data.clientDetails
                                //     ? {
                                //         label: data.clientDetails.city.name,
                                //         value: data.clientDetails.city.name,
                                //       }
                                //     : null
                                // }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>City</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter City"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      <FormField
                        control={form.control}
                        name="gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>GSTIN</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter GSTIN Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pin No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Pin Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Email</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Mobile</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Mobile"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Complete Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    <div className="grid grid-cols-2 gap-[20px]">
                      <FormField
                        control={form.control}
                        name="fax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Fax</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Fax"
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
                      Update
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
        {/* ---//////////////Branch */}
        <Sheet open={sheetOpenBranch} onOpenChange={setSheetOpenBranch}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[50%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">Add Branch</SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address label
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Label"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-[20px]">
                      {/* <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Company Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Company Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}{" "}
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="Branch"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={stateList}
                                // onChange={(e) => console.log(e)}
                                // value={
                                //   data.clientDetails
                                //     ? {
                                //         label: data.clientDetails.city.name,
                                //         value: data.clientDetails.city.name,
                                //       }
                                //     : null
                                // }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>City</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter City"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      <FormField
                        control={form.control}
                        name="gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>GSTIN</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter GSTIN Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pin No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Pin Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Email</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Mobile</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Mobile"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Complete Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    <div className="grid grid-cols-2 gap-[20px]">
                      <FormField
                        control={form.control}
                        name="fax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Fax</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Fax"
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
                      Register
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
        {/* ---//////////////Edit */}
        <Sheet open={sheetOpenEdit} onOpenChange={setSheetOpenEdit}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[50%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">Update Vendor</SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    {/* <div className="grid grid-cols-2 gap-[20px]"> */}
                    <FormField
                      control={form.control}
                      name="vendorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Vendor's Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Enter Name"
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
                          <FormLabel className={LableStyle}>Pan No.</FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Enter pan Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>CIN</FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Enter CIN"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* </div> */}
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
                      Rectify & Safe
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
        <Divider />
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

export default VendorList;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
