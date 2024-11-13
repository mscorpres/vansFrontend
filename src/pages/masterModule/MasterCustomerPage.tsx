import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { clientFormSchema } from "@/schema/masterModule/customerSchema";
import ClientActionCellRender from "@/config/agGrid/mastermodule/ClientActionCellRender";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import { createClient } from "@/features/client/clientSlice";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import {
  fetchCountryList,
  fetchState,
  getListOFbranchDetails,
  getListOFViewCustomers,
  getListOFViewCustomersOfSelected,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { Edit2 } from "lucide-react";
import Select from "react-select";
import {
  InputStyle,
} from "@/constants/themeContants";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { MoreOutlined } from "@ant-design/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dropdown, Form, Menu } from "antd";
import FullPageLoading from "@/components/shared/FullPageLoading";
import CreateBom from "./Bom/CreateBom";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { fetchCountries } from "@/features/salesmodule/createSalesOrderSlice";

const MasterCustomerPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [addBranch, setAddBranch] = useState(false);
  const [viewBranch, setViewBranch] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const { execFun, loading: loading1 } = useApi();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
    const dispatch = useDispatch<AppDispatch>();

    const menu = (
      <Menu>
        <Menu.Item
          key="AddBranch"
          onClick={() => setAddBranch(row.name)}
          // disabled={isDisabled}
        >
          Add Branch
        </Menu.Item>
        <Menu.Item
          key=" ViewBranch"
          onClick={() => setViewBranch(row)} // disabled={isDisabled}
        >
          View Branch
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

  const onSubmit = async (values: z.infer<typeof clientFormSchema>) => {
    try {
      const resultAction = await dispatch(
        createClient({
          endpoint: "/client/add",
          payload: {
            clientName: values.clientName,
            panNo: values.panNo,
            mobileNo: values.mobileNo,
            email: values.email || "",
            website: values.website || "",
            salesPersonName: values.salesPersonName || "",
          },
        })
      ).unwrap();

      if (resultAction.message) {
        toast({
          title: "Client created successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const components = useMemo(
    () => ({
      actionsCellRenderer: ClientActionCellRender,
      statusCellRenderer: (params: any) => {
        return <Badge className="bg-green-600">{params.data.status}</Badge>;
      },
    }),
    []
  );
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

  const columnDefs: ColDef<rowData>[] = [
    {
      field: "action",
      headerName: "",
      width: 40,

      cellRenderer: (params: any) => <ActionMenu row={params.data} />,
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 70,
    },
    {
      headerName: "Client Code",
      field: "code",
      filter: "agTextColumnFilter",
      width: 150,
      cellRenderer: CopyCellRenderer,
    },
    {
      headerName: "Client Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 390,
    },
    {
      headerName: "City",
      field: "city",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Email",
      field: "email",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "GSTIN",
      field: "gst",
      filter: "agTextColumnFilter",
      width: 390,
      cellRenderer: CopyCellRenderer,
    },
  ];
  const branchcolumnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 70,
    },
    {
      headerName: "Label",
      field: "label",
      filter: "agTextColumnFilter",
      width: 350,
      cellRenderer: CopyCellRenderer,
    },
    {
      headerName: "GST",
      field: "gst",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Country",
      field: "country",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "State",
      field: "state",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "PIN Code",
      field: "pincode",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Address ID",
      field: "addressID",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Address Line 1",
      field: "addressLine1",
      filter: "agTextColumnFilter",
      width: 390,
      cellRenderer: CopyCellRenderer,
    },
    {
      headerName: "Address Line 1",
      field: "addressLine2",
      filter: "agTextColumnFilter",
      width: 390,
      cellRenderer: CopyCellRenderer,
    },
    {
      field: "action",
      headerName: "",
      width: 40,

      cellRenderer: (params: any) => (
        <Edit2
          className="h-[20px] w-[20px] text-cyan-700 "
          onClick={() => setViewBranch(params?.data)}
        />
      ),
    },
  ];
  console.log("addbranch", addBranch);
  useEffect(() => {
    if (viewBranch) {
      editBranchList(viewBranch);
    }
  }, [viewBranch]);

  const editBranchList = async (viewBranch) => {
    console.log("viewBranch", viewBranch);

    // return;
    const response = await execFun(
      () => getListOFbranchDetails(viewBranch?.addressID),
      "fetch"
    );
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
      setOpenView(arr);
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
  const fetchList = async (formData: z.infer<typeof FormSchema>) => {
    // return;
    const response = await execFun(() => getListOFViewCustomers(), "fetch");
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
  const getTheListOfSelectedBranches = async (payload) => {
    // return;
    const response = await execFun(
      () => getListOFViewCustomersOfSelected(payload),
      "fetch"
    );
    console.log("response-", response);
    // return;
    let { data } = response;
    if (response.data.code === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          state: r?.state?.stateName,
          country: r?.country?.countryName,
          label: r.label,
          gst: r.gst,
          pincode: r.pinCode,
          addressLine1: r.addressLine2,
          addressLine2: r.addressLine2,
          addressID: r.addressID,
          // ...r,
        };
      });
      console.log("arr", arr);

      setBranchList(arr);
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
  const createNewBranch = async () => {
    console.log("paylo");

    // const response = await execFun(() => addbranchToClient(), "fetch");
  };
  const getCountryList = async () => {
    // return;
    const response = await execFun(() => fetchCountryList(), "fetch");
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
      setCountryList(arr);
    }
  };
  useEffect(() => {
    fetchList();
    getCountryList();
    getStateList();
  }, []);
  useEffect(() => {
    if (viewBranch) {
      console.log("viewBranch", viewBranch);
      console.log("viewBranch?.code", viewBranch?.code);

      getTheListOfSelectedBranches(viewBranch?.code);
    }
  }, [viewBranch]);

  return (
    <Wrapper>
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <Sheet open={addBranch} onOpenChange={setAddBranch}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[100%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">{`Add New Branch to ${addBranch}`}</SheetTitle>
            </SheetHeader>{" "}
            <div className="h-[calc(100vh-150px)]">
              {" "}
              <div className="rounded p-[20px] shadow bg-[#fff] max-h-[calc(100vh-100px)] overflow-y-auto">
                <Form form={form} layout="vertical">
                  {" "}
                  <div className="grid grid-cols-2 gap-[40px] ">
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Bill To Information
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Please provide Bill To address info */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item name="label" label="Label">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item name="country" label="Country">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("country", value)
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
                          </Form.Item>
                          <Form.Item name="state" label="State">
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
                              onChange={(value: any) =>
                                form.setValue("state", value)
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
                          </Form.Item>
                          <Form.Item name="pincode" label="Pincode">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item name="phone" label="Phone Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                            />
                          </Form.Item>
                          <Form.Item name="gst" label="GST Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item name="" label="Address Line 1">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item name="address2" label="Address Line 2">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 2"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Ship To Information
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Please provide Ship To address info */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item name="shipLabel" label="Label">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item name="labelCountry" label="Country">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("country", value)
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
                          </Form.Item>
                          <Form.Item name="shipState" label="State">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("shipState", value)
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
                          </Form.Item>
                          <Form.Item name="shipPincode" label="Pincode">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item name="shipPhone" label="Phone Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                            />
                          </Form.Item>
                          <Form.Item name="shipGst" label="GST Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item name="shipAddress1" label="Address Line 1">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item name="shipAddress2" label="Address Line 2">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 2"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Form>
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
                    onClick={() => createNewBranch()}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet open={viewBranch?.addressID} onOpenChange={setViewBranch}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[100%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">{`Edit Branch  ${viewBranch.label}`}</SheetTitle>
            </SheetHeader>{" "}
            <div className="h-[calc(100vh-150px)]">
              {" "}
              <div className="rounded p-[20px] shadow bg-[#fff] max-h-[calc(100vh-100px)] overflow-y-auto">
                <Form form={form} layout="vertical">
                  {" "}
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Bill To Information
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Please provide Bill To address info */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item name="label" label="Label">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item name="country" label="Country">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("country", value)
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
                          </Form.Item>
                          <Form.Item name="State" label="State">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("country", value)
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
                          </Form.Item>
                          <Form.Item name="pincode" label="Pincode">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item name="phone" label="Phone Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                            />
                          </Form.Item>
                          <Form.Item name="gst" label="GST Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item name="" label="Address Line 1">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item name="address2" label="Address Line 2">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 2"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Ship To Information
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Please provide Ship To address info */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item name="shipLabel" label="Label">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item name="labelCountry" label="Country">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("country", value)
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
                          </Form.Item>
                          <Form.Item name="shipState" label="State">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Branch"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setValue("shipState", value)
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
                          </Form.Item>
                          <Form.Item name="shipPincode" label="Pincode">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item name="shipPhone" label="Phone Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                            />
                          </Form.Item>
                          <Form.Item name="shipGst" label="GST Number">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item name="shipAddress1" label="Address Line 1">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item name="shipAddress2" label="Address Line 2">
                            {" "}
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 2"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Form>
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
                    onClick={() => createNewBranch()}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {viewBranch ? (
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={branchList}
            columnDefs={branchcolumnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        ) : (
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default MasterCustomerPage;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
