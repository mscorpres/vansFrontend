import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import {
  addbranchToClient,
  fetchCountryList,
  fetchState,
  getListOFbranchDetails,
  getListOFViewCustomers,
  getListOFViewCustomersOfSelected,
  updateBranchOfCustomer,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { Edit2 } from "lucide-react";
import Select from "react-select";
import { InputStyle } from "@/constants/themeContants";
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
import { Dropdown, Form, Menu, Switch } from "antd";
import FullPageLoading from "@/components/shared/FullPageLoading";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import CustomTooltip from "@/components/shared/CustomTooltip";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const MasterCustomerPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [addBranch, setAddBranch] = useState(false);
  const [viewBranch, setViewBranch] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [editVal, setEditVal] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [samebilling, setSameBilling] = useState(false);
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
          onClick={() => setAddBranch(row)}
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

  const getStateList = async () => {
    // return;
    const response = await execFun(() => fetchState(), "fetch");
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
      field: "action",
      headerName: "",
      width: 40,

      cellRenderer: (params: any) => (
        <Edit2
          className="h-[20px] w-[20px] text-cyan-700 "
          onClick={() => editBranchList(params?.data)}
        />
      ),
    },
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
      width: 190,
      cellRenderer: CopyCellRenderer,
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
      cellRenderer: CopyCellRenderer,
      width: 200,
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
  ];

  const editBranchList = async (params) => {
    setEditVal(params?.addressID);
    // return;
    const response = await execFun(
      () => getListOFbranchDetails(params?.addressID),
      "fetch"
    );
    let { data } = response;
    if (response.data.success) {
      let bill = data.data.billingAddress;
      let ship = data.data.shippingAddress;
      let billcomp = {
        label: bill.country.countryName,
        value: bill.country.countryID,
      };
      let billState = {
        value: bill.state.stateCode,
        label: bill.state.stateName,
      };
      let shipState = {
        value: ship.state.stateCode,
        label: ship.state.stateName,
      };
      let shipcomp = {
        label: ship.country.countryName,
        value: ship.country.countryID,
      };

      form.setFieldValue("billlabel", bill.label);
      form.setFieldValue("billgst", bill.gst);
      form.setFieldValue("billcountry", billcomp);
      form.setFieldValue("billstate", billState);
      form.setFieldValue("billpincode", bill.pinCode);
      form.setFieldValue("billphone", bill.phoneNo);
      form.setFieldValue("billaddress1", bill.addressLine1);
      form.setFieldValue("billaddress2", bill.addressLine2);
      form.setFieldValue("shipLabel", ship.label);
      form.setFieldValue("shipGst", ship.gst);
      form.setFieldValue("shipCountry", shipcomp);
      form.setFieldValue("shipState", shipState);
      form.setFieldValue("shipPincode", ship.pinCode);
      form.setFieldValue("shipCompany", ship.company);
      form.setFieldValue("shipAddress1", ship.addressLine1);
      form.setFieldValue("shipAddress2", ship.addressLine1);
      form.setFieldValue("shipPan", ship.panno);
      setOpenView(bill);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700",
      });
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const fetchList = async () => {
    // return;
    const response = await execFun(() => getListOFViewCustomers(), "fetch");
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
    let { data } = response;

    // return;
    if (data?.success) {
      let arr = data.data.map((r: any, index: any) => {
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

      setBranchList(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      setViewBranch(false);
      toast({
        title: response?.message,
        className: "bg-red-700 text-white items-center",
      });
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
    fetchList();
  };
  const createNewBranch = async () => {
    const value = await form.validateFields();

    let payload = {
      client: addBranch?.code,
      billToLabel: value.billlabel,
      billToCountry: value.billcountry?.value,
      billToState: value.billstate.value,
      billToPincode: value.billpincode,
      billToPhone: value.billphone,
      billToGst: value.billgst,
      billToAddresLine1: value.billaddress1,
      billToAddresLine2: value.billaddress2,
      ////////////
      shipToLabel: value.shipLabel,
      shipToCompany: value.shipCompany,
      shipToCountry: value.shipCountry.value,
      shipToState: value.shipState.value,
      shipToPincode: value.shipPincode,
      shipToGst: value.shipGst,
      shipToPan: value.shipPan,
      shipToAddress1: value.shipAddress2,
      shipToAddress2: value.shipAddress1,
      same_shipping_addres: samebilling,
    };

    const response = await execFun(() => addbranchToClient(payload), "fetch");

    if (response?.data?.success) {
      toast({
        title: response?.data?.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
      setAddBranch(false);
      setSameBilling(false);
    } else {
      toast({
        title: response?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const updateSelectedBranch = async () => {
    const value = await form.validateFields();

    let payload = {
      addressID: editVal,
      client: value.addBranch?.code,
      billToLabel: value.billlabel,
      billToCountry: value.billcountry.value,
      billToState: value.billstate.value,
      billToPincode: value.billpincode,
      billToPhone: value.billphone,
      billToGst: value.billgst,
      billToAddresLine1: value.billaddress1,
      billToAddresLine2: value.billaddress2,
      ////////////
      shipToLabel: value.shipLabel,
      shipToCompany: value.shipCompany,
      shipToCountry: value.shipCountry.value,
      shipToState: value.shipState.value,
      shipToPincode: value.shipPincode,
      shipToGst: value.shipGst,
      shipToPan: value.shipPan,
      shipToAddress1: value.shipAddress2,
      shipToAddress2: value.shipAddress1,
      same_shipping_addres: samebilling,
    };
    // return;

    const response = await execFun(
      () => updateBranchOfCustomer(payload),
      "fetch"
    );
    if (response?.data?.success) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      form.resetFields();
      setOpenView(false);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const getCountryList = async () => {
    // return;
    const response = await execFun(() => fetchCountryList(), "fetch");
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r: any, index: any) => {
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
      getTheListOfSelectedBranches(viewBranch?.code);
    }
  }, [viewBranch]);

  useEffect(() => {
    if (samebilling) {
      let billLabel = form.getFieldValue("billlabel");
      let billCountry = form.getFieldValue("billcountry");
      let billState = form.getFieldValue("billstate");
      let billPincode = form.getFieldValue("billpincode");
      let billPhone = form.getFieldValue("billphone");
      let billGst = form.getFieldValue("billgst");
      let billAddress1 = form.getFieldValue("billaddress1");
      let billAddress2 = form.getFieldValue("billaddress2");
      form.setFieldValue("shipLabel", billLabel);
      form.setFieldValue("shipcountry", billCountry);
      form.setFieldValue("shipState", billState);
      form.setFieldValue("shipPincode", billPincode);
      // form.setFieldValue("shipPan", billPhone);
      form.setFieldValue("shipGst", billGst);
      form.setFieldValue("shipAddress1", billAddress1);
      form.setFieldValue("shipAddress2", billAddress2);
    }
  }, [samebilling]);

  return (
    <Wrapper>
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <Sheet open={addBranch} onOpenChange={setAddBranch}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[100%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">{`Add New Branch to ${addBranch?.name}`}</SheetTitle>
            </SheetHeader>{" "}
            {loading1("fetch") && <FullPageLoading />}
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
                          <Form.Item
                            name="billlabel"
                            label="Label"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Label!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billcountry"
                            label="Country"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Country!",
                              },
                            ]}
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Country"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setFieldValue("billcountry", value)
                              }
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
                          <Form.Item
                            name="billstate"
                            label="State"
                            rules={[
                              {
                                required: true,
                                message: "Please input your State!",
                              },
                            ]}
                          >
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
                              onChange={(value: any) =>
                                form.setFieldValue("billstate", value)
                              }
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
                          <Form.Item
                            name="billpincode"
                            label="Pincode"
                            rules={[
                              {
                                required: false,
                                message: "Please input your Pincode!",
                              },
                              {
                                min: 6,
                                message:
                                  "Pincode must be at least 6 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              type="number"
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billphone"
                            label="Phone Number"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Phone Number!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                              type="number"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billgst"
                            label="GST Number"
                            rules={[
                              {
                                required: false,
                                message: "Please input your GST!",
                              },
                              {
                                min: 15,
                                max: 15,
                                message: "GST must be at least 15 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billaddress1"
                            label="Address Line 1"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billaddress2"
                            label="Address Line 2"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
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
                        <h3 className="flex text-[17px] font-[600] text-slate-600 justify-between">
                          Ship To Information
                          <CustomTooltip
                            message="Same as Billing Address"
                            side="top"
                            className="bg-cyan-700"
                          >
                            <Switch
                              className="ml-[10px]"
                              onChange={(e) => {
                                setSameBilling(e);
                              }}
                            ></Switch>
                          </CustomTooltip>
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Please provide Ship To address info */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item
                            name="shipLabel"
                            label="Label"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Label!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item
                            name="shipCompany"
                            label="Company"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Company!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item
                            name="shipCountry"
                            label="Country"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Country!",
                              },
                            ]}
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Country"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setFieldValue("shipcountry", value)
                              }
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
                          <Form.Item
                            name="shipState"
                            label="State"
                            rules={[
                              {
                                required: true,
                                message: "Please input your State!",
                              },
                            ]}
                          >
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
                              onChange={(value: any) =>
                                form.setFieldValue("shipState", value)
                              }
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
                          <Form.Item
                            name="shipPincode"
                            label="Pincode"
                            rules={[
                              {
                                required: false,
                                message: "Please input your Pincode!",
                              },
                              {
                                min: 6,
                                message:
                                  "Pincode must be at least 6 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                              type="number"
                            />
                          </Form.Item>
                          <Form.Item
                            name="shipPan"
                            label="Pan Number"
                            rules={[
                              {
                                required: false,
                                message: "Please input your Pan Number!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                            />
                          </Form.Item>
                        </div>
                        <Form.Item
                          name="shipGst"
                          label="GST Number"
                          rules={[
                            {
                              required: false,
                              message: "Please input your GST!",
                            },
                            {
                              min: 15,
                              max: 15,
                              message: "GST must be at least 15 characters!",
                            },
                          ]}
                        >
                          <Input
                            className={InputStyle}
                            placeholder="Enter GST Number"
                          />
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item
                            name="shipAddress1"
                            label="Address Line 1"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item
                            name="shipAddress2"
                            label="Address Line 2"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
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
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant={"outline"}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setAddBranch(false);
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
                  Create
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Sheet open={openView?.addressID} onOpenChange={setOpenView}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[100%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">{`Edit Branch `}</SheetTitle>
            </SheetHeader>{" "}
            {loading1("fetch") && <FullPageLoading />}
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
                          <Form.Item
                            name="billlabel"
                            label="Label"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Label!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Label"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billcountry"
                            label="Country"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Country!",
                              },
                            ]}
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Country"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setFieldValue("billcountry", value)
                              }
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
                          <Form.Item
                            name="billstate"
                            label="State"
                            rules={[
                              {
                                required: true,
                                message: "Please input your State!",
                              },
                            ]}
                          >
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
                              onChange={(value: any) =>
                                form.setFieldValue("billstate", value)
                              }
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
                          <Form.Item
                            name="billpincode"
                            label="Pincode"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Pincode!",
                              },
                              {
                                min: 6,
                                message:
                                  "Pincode must be at least 6 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              type="number"
                              placeholder="Enter Pincode"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billphone"
                            label="Phone Number"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Phone Number!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Phone Number"
                              type="number"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billgst"
                            label="GST Number"
                            rules={[
                              {
                                required: true,
                                message: "Please input your GST!",
                              },
                              {
                                min: 15,
                                max: 15,
                                message: "GST must be at least 15 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter GST Number"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billaddress1"
                            label="Address Line 1"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item
                            name="billaddress2"
                            label="Address Line 2"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
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
                        <h3 className="flex text-[17px] font-[600] text-slate-600 justify-between">
                          Ship To Information
                          <CustomTooltip
                            message="Same as Billing Address"
                            side="top"
                            className="bg-cyan-700"
                          >
                            <Switch
                              className="ml-[10px]"
                              onChange={(e) => {
                                setSameBilling(e);
                              }}
                            ></Switch>
                          </CustomTooltip>
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
                          <Form.Item name="shipCompany" label="Company">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Company"
                            />
                          </Form.Item>
                          <Form.Item name="shipCountry" label="Country">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Country"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setFieldValue("shipcountry", value)
                              }
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
                              placeholder="State"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={countryList}
                              onChange={(value: any) =>
                                form.setFieldValue("shipState", value)
                              }
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
                          <Form.Item
                            name="shipPincode"
                            label="Pincode"
                            rules={[
                              {
                                required: false,
                                message: "Please input your name!",
                              },
                              {
                                min: 6,
                                message:
                                  "Pincode must be at least 6 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pincode"
                              type="number"
                            />
                          </Form.Item>
                          <Form.Item name="shipPan" label="Pan Number">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Pan Number"
                            />
                          </Form.Item>{" "}
                        </div>
                        <Form.Item
                          name="shipGst"
                          label="GST Number"
                          rules={[
                            {
                              required: true,
                              message: "Please input your GST!",
                            },
                            {
                              min: 15,
                              max: 15,
                              message: "GST must be at least 15 characters!",
                            },
                          ]}
                        >
                          <Input
                            className={InputStyle}
                            placeholder="Enter GST Number"
                          />
                        </Form.Item>{" "}
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                          <Form.Item
                            name="shipAddress1"
                            label="Address Line 1"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 1"
                            />
                          </Form.Item>
                          <Form.Item
                            name="shipAddress2"
                            label="Address Line 2"
                            rules={[
                              {
                                required: true,
                                message: "Please input your Address!",
                              },
                              {
                                min: 10,
                                message:
                                  "Address must be at least 10 characters!",
                              },
                            ]}
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Address Line 2"
                            />
                          </Form.Item>{" "}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Form>
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant={"outline"}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setOpenView(false);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-600"
                  onClick={() => updateSelectedBranch()}
                >
                  Update
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-[20px] justify-end bg-white mt-[-20px] "></div>
        {viewBranch ? (
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={branchList}
            columnDefs={branchcolumnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            suppressCellFocus={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            enableCellTextSelection = {true}
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
            suppressCellFocus={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            enableCellTextSelection = {true}
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
