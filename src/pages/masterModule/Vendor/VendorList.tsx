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
import { Download, Filter } from "lucide-react";
import styled from "styled-components";
import { Divider, Dropdown, Menu } from "antd";
import { Input } from "@/components/ui/input";

import Select from "react-select";
import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import {
  addVendorBranch,
  fetchAllListOfVendor,
  fetchState,
  vendoradd,
  vendorGetAllBranchList,
  vendorGetAllDetailsFromSelectedBranch,
  vendorUpdatedetails,
  vendorUpdateSave,
  vendorUpdateSelectedBranch,
} from "@/components/shared/Api/masterApi";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { MoreOutlined } from "@ant-design/icons";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  wise: z.string().optional(),
  branch: z.string().optional(),
  label: z.string().optional(),
  mobile: z.string().optional(),
  gstin: z.string().optional(),
  city: z.string().optional(),
  pin: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  fax: z.string().optional(),
  vendorCode: z.string().optional(),
  addressCode: z.string().optional(),
  state: z.string().optional(),
  vendorName: z.string().optional(),
  cin: z.string().optional(),
  pan: z.string().optional(),
});

const VendorList = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [stateList, setStateList] = useState([]);
  const [viewAllBranch, setViewAllBranch] = useState([]);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetOpenView, setSheetOpenView] = useState<boolean>(false);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [sheetOpenBranch, setSheetOpenBranch] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const thebranch = form.watch("branch");

  const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
    const dispatch = useDispatch<AppDispatch>();

    const menu = (
      <Menu>
        <Menu.Item
          key="AddBranch"
          onClick={() => {
            setSheetOpenView(row);
          }}
          // disabled={isDisabled}
        >
          View
        </Menu.Item>
        <Menu.Item
          key=" ViewBranch"
          onClick={() => {
            setSheetOpenEdit(row);
          }}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          key=" Branch"
          onClick={() => {
            setSheetOpenBranch(row.data.vendor_code);
          }}
        >
          Branches
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Dropdown overlay={menu} trigger={["click"]}>
          {/* <Button icon={<Badge />} /> */}
          <MoreOutlined />
        </Dropdown>
      </>
    );
  };
  const { execFun, loading: loading1 } = useApi();
  const fetchVendorList = async (formData: z.infer<typeof FormSchema>) => {
    // return;
    const response = await execFun(() => fetchAllListOfVendor(), "fetch");
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
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r) => {
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
    // {
    //   headerName: "ID",
    //   field: "id",
    //   filter: "agNumberColumnFilter",
    //   width: 90,
    // },
    {
      field: "action",
      headerName: "",
      width: 50,
      cellRenderer: (params: any) => <ActionMenu row={params} />,
    },
    {
      headerName: "Name",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 450,
    },
    {
      headerName: "Code",
      field: "vendor_code",
      filter: "agTextColumnFilter",
      width: 200,
      cellRenderer: CopyCellRenderer,
    },
    {
      headerName: "PAN No.",
      field: "vendor_pan",
      filter: "agTextColumnFilter",
      flex: 2,
      // cellRenderer: CopyCellRenderer,
    },
  ];

  const getBranchList = async (id) => {
    // setLoading(true);

    const response = await execFun(() => vendorGetAllBranchList(id), "fetch");
    if (response.data.code == 200) {
      const { data } = response;
      let arr = data.data.final;
      let a = arr.map((r) => {
        return {
          label: r.text,
          value: r.id,
        };
      });
      setViewAllBranch(a);
    }
  };
  const getDetailsFromBranchList = async (id) => {
    setLoading(true);

    const response = await execFun(
      () => vendorGetAllDetailsFromSelectedBranch(id),
      "fetch"
    );
    if (response.data.code == 200) {
      const { data } = response;
      let r = data?.data?.final[0];
      let a = {
        state: { label: r.statename, value: r.statecode },
        label: r.label,
        city: r.city,
        gstin: r.gstin,
        pin: r.pincode,
        email: r.email_id,
        mobile: r.mobile_no,
        address: r.address,
        fax: r.fax,
        vendorCode: r.vendor_code,
        addressCode: r.address_code,
      };

      form.setValue("label", a.label);
      form.setValue("mobile", a.mobile);
      form.setValue("city", a.city);
      form.setValue("gstin", a.gstin);
      form.setValue("pin", a.pin);
      form.setValue("email", a.email);
      form.setValue("address", a.address);
      form.setValue("fax", a.fax);
      form.setValue("vendorCode", a.vendorCode);
      form.setValue("addressCode", a.addressCode);
      form.setValue("state", a.state?.value);
      setLoading(false);
    }
    setLoading(true);
  };
  const updateViewBranch = async (data) => {
    let p = {
      label: data?.label,
      state: data?.state,
      city: data?.city,
      address: data?.address,
      pincode: data?.pin,
      fax: data?.fax,
      email: data?.email,
      mobile: data?.mobile,
      gstid: data?.gstin,
      address_code: data?.addressCode,
      vendor_code: data?.vendorCode,
    };

    const response = await execFun(
      () => vendorUpdateSelectedBranch(p),
      "fetch"
    );
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenView(false);

      // form.resetFields();
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const updateVendor = async (data) => {
    let p = {
      cinno: data?.cin,
      panno: data?.pan,
      vendorcode: data?.vendorCode,
      vendorname: data?.vendorName,
    };

    const response = await execFun(() => vendorUpdateSave(p), "fetch");
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenEdit(false);
      // form.resetFields();
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createNewBranch = async (data) => {
    let p = {
      vendor: {
        vendorname: sheetOpenBranch,
      },
      branch: {
        branch: data.label,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pin,
        fax: data.fax,
        mobile: data.mobile,
        email: data.email,
        gstin: data.gstin,
      },
    };

    const response = await execFun(() => addVendorBranch(p), "fetch");
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenBranch(false);
      form.resetField();
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const addVendor = async (data) => {
    let p = {
      vendor: {
        vendorname: data.label,
        panno: data.pan,
        cinno: data.cin,
      },
      branch: {
        branch: data.label,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pin,
        fax: data.fax,
        mobile: data.mobile,
        email: data.email,
        gstin: data.gstin,
      },
    };
    const response = await execFun(() => vendoradd(p), "fetch");
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      // form.resetFields();
      setSheetOpen(false);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const getupdateDetails = async (id) => {
    // setLoading(true);

    const response = await execFun(() => vendorUpdatedetails(id), "fetch");
    if (response.data.code == 200) {
      const { data } = response;
      let arr = data.data[0];
      let obj = {
        vendorName: arr.vendor_name,
        pan: arr.vendor_pan,
        cin: arr.vendor_cin,
        cin: arr.vendor_cin,
        vendorCode: arr.vendor_code,
      };

      form.setValue("vendorName", obj.vendorName);
      form.setValue("pan", obj.pan);
      form.setValue("cin", obj.cin);
      form.setValue("vendorCode", obj.vendorCode);
      // let a = arr.map((r) => {
      //   return {
      //     label: r.text,
      //     value: r.id,
      //   };
      // });
      // setViewAllBranch(a);
    }
  };
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Manage Vendor");
  };
  useEffect(() => {
    if (sheetOpenView) {
      getBranchList(sheetOpenView?.data?.vendor_code);
    }
  }, [sheetOpenView]);

  useEffect(() => {
    getDetailsFromBranchList(thebranch);
  }, [thebranch]);
  useEffect(() => {
    getupdateDetails(sheetOpenEdit.data?.vendor_code);
  }, [sheetOpenEdit]);

  useEffect(() => {
    if (sheetOpenView == false) {
      form.setValue("label", "");
      form.setValue("branch", "");
      form.setValue("mobile", " ");
      form.setValue("city", "");
      form.setValue("gstin", "");
      form.setValue("pin", "");
      form.setValue("email", "");
      form.setValue("address", "");
      form.setValue("fax", "");
      form.setValue("vendorCode", "");
      form.setValue("addressCode", "");
      form.setValue("state", "");
    }
  }, [sheetOpenView]);
  useEffect(() => {
    if (sheetOpen == false) {
      form.setValue("label", "");
      form.setValue("mobile", " ");
      form.setValue("pan", " ");
      form.setValue("cin", " ");
      form.setValue("state", " ");
      form.setValue("mobile", " ");
      form.setValue("city", "");
      form.setValue("gstin", "");
      form.setValue("pin", "");
      form.setValue("email", "");
      form.setValue("address", "");
      form.setValue("fax", "");
      form.setValue("vendorCode", "");
      form.setValue("addressCode", "");
      form.setValue("state", "");
    }
  }, [sheetOpen]);

  return (
    <Wrapper className="h-[calc(100vh-50px)] grid grid-cols-[250px_1fr]">
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
            {/* )} */}
            <div className="grid grid-cols-2 gap-[20px]">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                onClick={(e) => {
                  e.preventDefault();
                  setSheetOpen(true);
                }}
              >
                Add Vendor
              </Button>
              <Download
                className="text-slate-600 w-[25px] h-[35px] cursor-pointer"
                onClick={handleDownloadExcel}
              />
            </div>
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
              <SheetTitle className="text-slate-600">Add Vendor</SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(addVendor)} className="">
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
                      />{" "}
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
                    </div>
                    <Divider />
                    <div className="grid grid-cols-2 gap-[20px]">
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
                                onChange={(e: any) =>
                                  form.setValue("state", e?.value)
                                }
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
                    </div>{" "}
                    <div className="grid grid-cols-2 gap-[20px]"></div>
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
                {`Listing Branch & Modification  ${form.getValues(
                  "vendorCode"
                )}`}
              </SheetTitle>
            </SheetHeader>
            <div>
              {loading1("fetch") && <FullPageLoading />}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(updateViewBranch)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address Branch
                          </FormLabel>
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
                              options={viewAllBranch}
                              onChange={(e: any) =>
                                form.setValue("branch", e?.value)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={stateList}
                                onChange={(e: any) =>
                                  form.setValue("state", e?.value)
                                }
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
                      />{" "}
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
                    <div className="grid grid-cols-2 gap-[20px]"></div>
                  </div>
                  <div className={modelFixFooterStyle}>
                    <Button
                      variant={"outline"}
                      className="shadow-slate-300 mr-[10px] border-slate-400 border"
                      onClick={(e: any) => {
                        setSheetOpenView(false);
                        e.preventDefault();
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      // onClick={() => updateViewBranch()}
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
              <SheetTitle className="text-slate-600">
                {` Add Branch ${sheetOpenBranch}`}
              </SheetTitle>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(createNewBranch)}
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
                                onChange={(e: any) =>
                                  form.setValue("state", e?.value)
                                }
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
                        setSheetOpenBranch(false);
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
              <SheetTitle className="text-slate-600">{`Update Vendor ${form.getValues(
                "vendorCode"
              )}`}</SheetTitle>
            </SheetHeader>
            <div>
              {" "}
              {loading1("fetch") && <FullPageLoading />}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(updateVendor)} className="">
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
                        setSheetOpenEdit(false);
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
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-50px)]">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
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
