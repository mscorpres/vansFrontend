import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import {
  DatePickerStyle,
  primartButtonStyle,
  InputStyle,
} from "@/constants/themeContants";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
  transformCurrencyData,
  transformOptionData,
  transformOptionData2,
} from "@/helper/transform";
import { Button, DatePicker, Divider, Form } from "antd";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingList,
  fetchBillingListDetails,
  fetchShippingAddressDetails,
  fetchShippingAddressForPO,
  fetchVendorAddressDetails,
  listOfCostCenter,
  listOfVendorBranchList,
} from "@/features/client/clientSlice";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { useEffect, useState } from "react";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useApi from "@/hooks/useApi";
import {
  addVendorBranch,
  costCenterCreate,
  fetchState,
  vendoradd,
} from "@/components/shared/Api/masterApi";
import { toast } from "@/components/ui/use-toast";
interface Props {
  setTab: string;
  setPayloadData: string;
  form: any;
  setFormVal: [];
  formVal: [];
}
const CreatePoPage: React.FC<Props> = ({
  setTab,
  setPayloadData,
  form,
  selectedVendor,
  setFormVal,
  setBillStateCode,
  setShipStateCode,
  currencyList,
  setResetSure,
  resetSure,
  currencyval,
  isApprove,
  setCodeType,
  isImport,
  setIsImport,
}) => {
  const [searchData, setSearchData] = useState("");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetOpenBranch, setSheetOpenBranch] = useState<boolean>(false);
  const [sheetOpenCC, setSheetOpenCC] = useState<boolean>(false);
  const [stateList, setStateList] = useState([]);
  const dispatch = useDispatch();
  const {
    vendorBranchlist,
    shippingPOList,
    shippingPODetails,
    vendorPODetails,
    vendorBillingList,
    vendorBillingDetails,
    loading,
  } = useSelector((state: RootState) => state.client);
  const poTypeOptions = [
    {
      label: "New",
      value: "N",
    },
    {
      label: "Supplementary",
      value: "S",
    },
  ];
  const poVendorOptions = [
    {
      label: "Vendor",
      value: "vendor",
    },
  ];
  useEffect(() => {
    if (currencyval?.value == "364907247") {
      form.setFieldValue("exchange_rate", "1");
    }
  }, [currencyval]);

  const selBranch = Form.useWatch("branch", form);
  const dueDate = Form.useWatch("duedate", form);
  const selCostCenter = Form.useWatch("costCenter", form);
  const selShipping = Form.useWatch("shipId", form);
  const selBilling = Form.useWatch("billingId", form);
  const selPoType = Form.useWatch("poType", form);
  const selvenName = Form.useWatch("vendorName", form);

  const [forms] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const params = useParams();
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

  //
  const getValues = async () => {
    let valuesOfFrom = await form.validateFields();
    setTab("add");
    setFormVal(valuesOfFrom);
    // return valuesOfFrom;
  };

  const handleDateChange = (value: any) => {
    const formattedDate = value ? moment(value).format("DD-MM-YYYY") : "";
    setFieldValue("duedate", formattedDate); // Set value of 'duedate' in form state
  };
  const addVendor = async (data) => {
    const values = forms.getFieldsValue();

    let p = {
      vendor: {
        vendorname: data.label,
        panno: data.pan,
        cinno: data.cin,
        payment_terms: data.paymentTerms,
      },
      branch: {
        branch: values.label,
        address: values.address,
        state: values.state.value,
        city: values.city,
        pincode: values.pin,
        fax: values.fax,
        mobile: values.mobile,
        email: values.email,
        gstin: values.gstin,
      },
    };

    // return;

    const response = await execFun(() => vendoradd(p), "fetch");

    if (response.data.success) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpen(false);
      forms.resetFields();
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createNewBranch = async (data) => {
    const values = forms.getFieldsValue();

    let p = {
      vendor: {
        vendorname: selvenName.value,
      },
      branch: {
        branch: values.label,
        address: values.address,
        state: values.state.value ?? values.state,
        city: values.city,
        pincode: values.pin,
        fax: values.fax,
        mobile: values.mobile,
        email: values.email,
        gstin: values.gstin,
      },
    };

    // const response = await execFun(() => vendorUpdateSave(p), "fetch");

    const response = await execFun(() => addVendorBranch(p), "fetch");
    if (response.data.success) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      forms.resetFields();

      setSheetOpenBranch(false);
      dispatch(listOfVendorBranchList({ vendorcode: selectedVendor?.value }));
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createCostCenter = async (data) => {
    const values = forms.getFieldsValue();
    let p = {
      cost_center_id: values.costId,
      cost_center_name: values.name,
    };

    // const response = await execFun(() => vendorUpdateSave(p), "fetch");

    const response = await execFun(() => costCenterCreate(p), "fetch");
    if (response.data.success) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      forms.resetFields();

      setSheetOpenBranch(false);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  //
  useEffect(() => {
    dispatch(fetchShippingAddressForPO());

    if (selectedVendor) {
      dispatch(listOfVendorBranchList({ vendorcode: selectedVendor?.value }));
      setResetSure(false);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (selectedVendor && selBranch) {
      if (vendorBranchlist) {
        form.setFieldValue("paymentTerms", vendorBranchlist[0].payment_terms);
      }
      dispatch(
        fetchVendorAddressDetails({
          vendorcode: selectedVendor?.value,
          branchcode: selBranch?.value,
        })
      );
    } else {
      form.setFieldValue("vendorGst", "");
      form.setFieldValue("address", "");
    }
  }, [selectedVendor, selBranch]);
  useEffect(() => {
    if (searchData) {
      dispatch(listOfCostCenter({ search: searchData }));
    }
  }, [searchData]);
  useEffect(() => {
    if (selCostCenter) {
      dispatch(fetchBillingList({ cost_center: selCostCenter?.value }));
    }
  }, [selCostCenter]);
  useEffect(() => {
    if (selShipping) {
      dispatch(
        fetchShippingAddressDetails({ shipping_code: selShipping?.value })
      );
    }
  }, [selShipping]);
  useEffect(() => {
    getStateList();
  }, []);
  ///setting details from the shipping details
  useEffect(() => {
    if (shippingPODetails && resetSure == false && selShipping) {
      let arr = shippingPODetails;
      setShipStateCode(shippingPODetails.statecode);
      form.setFieldValue("shipgst", arr?.gstin);
      form.setFieldValue("shippan", arr?.pan);
      form.setFieldValue("shipAddress", arr?.address);
    } else {
      form.setFieldValue("shipgst", "");
      form.setFieldValue("shippan", "");
      form.setFieldValue("shipAddress", "");
    }
  }, [shippingPODetails]);

  useEffect(() => {
    if (vendorPODetails && resetSure == false && selectedVendor && selBranch) {
      let arr = vendorPODetails;

      form.setFieldValue("vendorGst", arr?.gstid);
      form.setFieldValue("address", arr?.address);

      if (arr.state == 100) {
        setIsImport("Import");
      } else {
        setIsImport("");
      }
    } else {
      form.setFieldValue("vendorGst", "");
      form.setFieldValue("address", "");
      setIsImport("");
    }
  }, [vendorPODetails]);
  useEffect(() => {
    if (selBilling) {
      dispatch(fetchBillingListDetails({ billing_code: selBilling?.value }));
    } else {
      form.setFieldValue("pan", "");
      form.setFieldValue("billgst", "");
      form.setFieldValue("billAddress", "");
    }
  }, [selBilling]);

  useEffect(() => {
    if (vendorBillingDetails && resetSure == false && selBilling) {
      let arr = vendorBillingDetails;
      setBillStateCode(vendorBillingDetails.statecode);
      form.setFieldValue("pan", arr?.pan);
      form.setFieldValue("billgst", arr?.gstin);
      form.setFieldValue("billAddress", arr?.address);
    } else {
      form.setFieldValue("pan", "");
      form.setFieldValue("billgst", "");
      form.setFieldValue("billAddress", "");
    }
  }, [vendorBillingDetails]);

  return (
    <div className="h-[calc(100vh-100px)]">
      {loading && <FullPageLoading />}
      <Form form={form} layout="vertical">
        <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-[30px]">
            <Card className="rounded shadow bg-[#fff]">
              <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Vendor Details
                </h3>
                <p className="text-slate-600 text-[13px]">
                  {/* Type Name or Code of the vendor */}
                </p>
              </CardHeader>
              <CardContent className="mt-[10px]">
                <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                  <Form.Item name="poType" label="PO Type" rules={rules.poType}>
                    <Select
                      styles={customStyles}
                      placeholder="PO type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      components={{ DropdownIndicator }}
                      isDisabled={false}
                      //isLoading={true}
                      isClearable={true}
                      isSearchable={true}
                      name="color"
                      options={poTypeOptions}
                      value={poTypeOptions[0]}
                      defaultInputValue={"New"}
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>
                  {selPoType?.value == "S" && (
                    <Form.Item
                      name="originalPO"
                      label="Original PO"
                      rules={rules.vendorType}
                    >
                      <ReusableAsyncSelect
                        placeholder="Original PO"
                        endpoint="/backend/searchPoByPoNo"
                        transform={transformOptionData}
                        onChange={(e) => form.setFieldValue("originalPO", e)}
                        // value={selectedCustomer}
                        fetchOptionWith="search"
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    name="vendorType"
                    label="Vendor Type"
                    rules={rules.vendorType}
                  >
                    <Select
                      styles={customStyles}
                      placeholder="Vendor type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      components={{ DropdownIndicator }}
                      isDisabled={false}
                      //isLoading={true}
                      isClearable={true}
                      isSearchable={true}
                      name="color"
                      options={poVendorOptions}
                      defaultInputValue="Vendor"
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>
                  {/* <div> */}

                  {/* <p>error message</p> */}
                </div>
                <Form.Item
                  name="vendorName"
                  label="Vendor Name"
                  label={
                    <div
                      style={{
                        fontSize: window.innerWidth < 1600 && "0.9rem",
                        display: "flex",
                        justifyContent: "space-between",
                        width: 350,
                      }}
                    >
                      Vendor Name
                      <span
                        onClick={() => setSheetOpen(true)}
                        style={{
                          color: "#1890FF",
                          cursor: "pointer",
                          fontSize: window.innerWidth < 1600 && "0.8rem",
                        }}
                      >
                        Add Vendor
                      </span>
                    </div>
                  }
                >
                  <ReusableAsyncSelect
                    placeholder="Vendor Name"
                    endpoint="/backend/vendorList"
                    transform={transformOptionData2}
                    onChange={(e) => form.setFieldValue("vendorName", e)}
                    // value={selectedCustomer}
                    fetchOptionWith="query2"
                  />
                </Form.Item>
                <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                  <Form.Item
                    name="branch"
                    label={
                      <div
                        style={{
                          fontSize: window.innerWidth < 1600 && "0.9rem",
                          display: "flex",
                          justifyContent: "space-between",
                          width: 350,
                        }}
                      >
                        Branch Name
                        <span
                          onClick={() => setSheetOpenBranch(true)}
                          style={{
                            color: "#1890FF",
                            cursor: "pointer",
                            fontSize: window.innerWidth < 1600 && "0.8rem",
                          }}
                        >
                          Add branch
                        </span>
                      </div>
                    }
                    rules={rules.branch}
                  >
                    <Select
                      styles={customStyles}
                      placeholder="Branch"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      components={{ DropdownIndicator }}
                      isDisabled={false}
                      //isLoading={true}
                      isClearable={true}
                      isSearchable={true}
                      name="color"
                      // transform={transformOptionData}
                      options={transformOptionData(vendorBranchlist)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="vendorGst"
                    label="GSTIN"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="GSTIN / UIN"
                    />
                  </Form.Item>
                </div>{" "}
                <Form.Item
                  name="address"
                  label="Address"
                  className=""
                  rules={rules.address}
                >
                  <Textarea
                    className="border-0 border-b rounded-none shadow-none outline-none resize-none border-slate-600 focus-visible:ring-0"
                    placeholder="Address"
                  />
                </Form.Item>
              </CardContent>
            </Card>
            <Card className="rounded shadow bg-[#fff]">
              <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  PO Terms & Other
                </h3>
                <p className="text-slate-600 text-[13px]"></p>
              </CardHeader>

              <CardContent className="mt-[10px]">
                <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                  <Form.Item
                    name="terms"
                    label="Terms & Condition"
                    className=""
                    // rules={rules.terms}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 "
                      placeholder="Terms & Condition"
                    />
                  </Form.Item>
                  <Form.Item
                    name="quotation"
                    label="Quotation"
                    className=""
                    // rules={rules.quotation}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="Quotation"
                    />
                  </Form.Item>
                  <Form.Item
                    name="paymentTerms"
                    label="Payment Terms"
                    className=""
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="Payment Terms"
                    />
                  </Form.Item>
                  <Form.Item
                    name="costCenter"
                    // label="Cost Center"
                    label={
                      <div
                        style={{
                          fontSize: window.innerWidth < 1600 && "0.9rem",
                          display: "flex",
                          justifyContent: "space-between",
                          width: 350,
                        }}
                      >
                        Cost Center
                        <span
                          onClick={() => setSheetOpenCC(true)}
                          style={{
                            color: "#1890FF",
                            cursor: "pointer",
                            fontSize: window.innerWidth < 1600 && "0.8rem",
                          }}
                        >
                          Add Cost Center
                        </span>
                      </div>
                    }
                    rules={rules.costCenter}
                  >
                    <ReusableAsyncSelect
                      placeholder="Cost Center"
                      endpoint="/backend/costCenter"
                      transform={transformOptionData2}
                      fetchOptionWith="query2"
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>
                  <Form.Item
                    name="project"
                    label="Project"
                    className=""
                    // rules={rules.project}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="Project"
                    />
                  </Form.Item>
                  <Form.Item
                    name="comment"
                    label="Comment"
                    className=""
                    // rules={rules.comment}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="Comment (If any)"
                    />
                  </Form.Item>
                  <Form.Item
                    name="currency"
                    label="Currency"
                    className=""
                    rules={rules.currency}
                  >
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Currency"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isClearable={false} // Prevent clearing the value
                      isSearchable={false} // Disable search if not needed
                      // options={
                      //   currencyList ? transformCurrencyData(currencyList) : []
                      // }
                      options={transformCurrencyData(currencyList || [])}
                      // onChange={(e) => handleCurrencyChange(e.value)}
                      // value={
                      //   // Find the corresponding option based on field.value
                      //   transformCurrencyData(currencyList)?.find(
                      //     (option) => option.value === field?.value
                      //   ) || null
                      // }
                      // onChange={(selectedOption) => {
                      //   // Update the form value with the selected option's value
                      //   field?.onChange(selectedOption?.value); // Use field.onChange to update the form value
                      // }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="exchange_rate"
                    label="Exchange Rate"
                    className=""
                    rules={rules.exchange_rate}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="Exchange Rate"
                      min={1}
                    />
                  </Form.Item>

                  {/* <Form.Item
                    name="duedate"
                    label="Due Date"
                    className=""
                    rules={rules.duedate}
                  >
                    <DatePicker
                      className={DatePickerStyle}
                      format="DD-MM-YYYY"
                      value={
                        Form.useWatch("duedate")
                          ? dayjs(Form.useWatch("duedate"), "DD-MM-YYYY")
                          : null
                      } // Ensure value is a Dayjs object
                      onChange={(value: Dayjs | null) => {
                        const formattedDate = value
                          ? value.format("DD-MM-YYYY")
                          : "";
                        Form.setFieldValue(
                          "duedate",
                          formattedDate
                          //   {
                          //   shouldValidate: true,
                          //   shouldDirty: true,
                          // }
                        );
                      }}
                    />
                  </Form.Item> */}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded shadow bg-[#fff]">
              <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Invoicing Details
                </h3>
                {/* <p className="text-slate-600 text-[13px]">Bill To -</p> */}
              </CardHeader>
              <CardContent className="mt-[30px]">
                <Form.Item
                  name="billingId"
                  label="Billing ID"
                  rules={rules.billingId}
                >
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    // placeholder="Ship "
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    //isLoading={true}
                    isClearable={true}
                    isSearchable={true}
                    // labe
                    name="color"
                    options={transformOptionData2(vendorBillingList)}
                    onChange={(e) => form.setFieldValue("billingId", e)}
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                  <Form.Item
                    name="pan"
                    label="PAN"
                    className=""
                    rules={rules.pan}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 "
                      placeholder="Billing PAN"
                    />
                  </Form.Item>

                  <Form.Item
                    name="billgst"
                    label="GSTIN"
                    className=""
                    rules={rules.billgst}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 "
                      placeholder="Billing GSTIN"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  name="billAddress"
                  label="Address"
                  className="mt-[40px]"
                  rules={rules.billAddress}
                >
                  <Textarea
                    className="border-0 border-b rounded-none shadow-none outline-none resize-none border-slate-600 focus-visible:ring-0"
                    placeholder="Billing Address"
                  />
                </Form.Item>
              </CardContent>
            </Card>
            <Card className="rounded shadow bg-[#fff]">
              <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Shipping Details
                </h3>
                {/* <p className="text-slate-600 text-[13px]">Ship To -</p> */}
              </CardHeader>
              <CardContent className="mt-[30px]">
                {" "}
                <Form.Item name="shipId" label="Ship ID" rules={rules.shipId}>
                  <Select
                    styles={customStyles}
                    components={{ DropdownIndicator }}
                    // placeholder="Ship "
                    className="border-0 basic-single"
                    classNamePrefix="select border-0"
                    isDisabled={false}
                    //isLoading={true}
                    isClearable={true}
                    isSearchable={true}
                    name="color"
                    options={transformOptionData2(shippingPOList)}
                    onChange={(e) => form.setFieldValue("shipId", e)}
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                  <Form.Item
                    name="shippan"
                    label="PAN"
                    className=""
                    rules={rules.shippan}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 "
                      placeholder="Shipping PAN"
                    />
                  </Form.Item>

                  <Form.Item
                    name="shipgst"
                    label="GSTIN"
                    className=""
                    rules={rules.shipgst}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 "
                      placeholder=" Shipping GSTIN"
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  rules={rules.shipAddress}
                  name="shipAddress"
                  label="Address"
                  className="mt-[40px]"
                >
                  <Textarea
                    className="border-0 border-b rounded-none shadow-none outline-none resize-none border-slate-600 focus-visible:ring-0"
                    placeholder="Shipping Address"
                  />
                </Form.Item>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-[50px] w-full flex justify-end items-center px-[20px] bg-white shadow-md border-t border-slate-300 text-white">
          <Button
            onClick={getValues}
            className={`${primartButtonStyle} flex gap-[10px] text-white`}
            type="submit"
          >
            Next
            <FaArrowRightLong className="" />
          </Button>
        </div>
      </Form>
      {/* ///add Branch */}
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
            {loading1("fetch") && <FullPageLoading />}
            <Form form={forms} layout="vertical">
              {/* <form onSubmit={forms.handleSubmit(addVendor)} className=""> */}
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item name="label" label=" Address label">
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      placeholder="GSTIN / UIN"
                    />
                  </Form.Item>{" "}
                  <Form.Item
                    name="pan"
                    label="Pan No."
                    className=""
                    // rules={rules.vendorGst}
                  >
                    <Input
                      className={InputStyle}
                      // className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      // placeholder="GSTIN / UIN"
                    />
                  </Form.Item>
                  <Form.Item
                    name="cin"
                    label="CIN"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input
                      className={InputStyle}
                      // className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      // placeholder="GSTIN / UIN"
                    />
                  </Form.Item>
                  <Form.Item
                    name="paymentTerm"
                    label="Payment Term"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input
                      className={InputStyle}
                      // className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      // placeholder="GSTIN / UIN"
                    />
                  </Form.Item>
                </div>
                <Divider />
                <div className="grid grid-cols-2 gap-[20px]">
                  {" "}
                  <Form.Item
                    name="company"
                    label="Company Name"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input
                      className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                      // placeholder="GSTIN / UIN"
                    />
                  </Form.Item>
                  <Form.Item
                    name="state"
                    label="state"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="State"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false} // Disable the select dropdown so it cannot be changed
                      isClearable={false} // Prevent clearing the value
                      isSearchable={false} // Disable search if not needed
                      name="state" // Ensure this name aligns with the form field
                      options={stateList}
                      onChange={(e: any) =>
                        form.setFieldValue("state", e?.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="city"
                    label="City"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="gstin"
                    label="GSTIN"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="pin"
                    label="Pin No."
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter Email" />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label="Mobile"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter mobile" />
                  </Form.Item>
                  <Form.Item
                    name="fax"
                    label="Fax"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter fax" />
                  </Form.Item>
                </div>{" "}
                <div className="grid grid-cols-2 gap-[20px]"></div>
                <Form.Item
                  name="address"
                  label="Address"
                  className=""
                  rules={rules.vendorGst}
                >
                  <Input className={InputStyle} placeholder="Enter address" />
                </Form.Item>
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant={"outline"}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpen(false);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  onClick={addVendor}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white"
                >
                  Register
                </Button>
              </div>
              {/* </form> */}
            </Form>
          </div>
        </SheetContent>
      </Sheet>{" "}
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
            <SheetTitle className="text-slate-600">{` Add Branch `}</SheetTitle>
          </SheetHeader>
          <div>
            {loading1("fetch") && <FullPageLoading />}
            <Form form={forms} layout="vertical">
              {/* <form onSubmit={form.handleSubmit(createNewBranch)} className=""> */}
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <Form.Item name="label" label=" Address label" className="">
                  <Input
                    className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                    placeholder="GSTIN / UIN"
                  />
                </Form.Item>{" "}
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
                  <Form.Item
                    name="state"
                    label="state"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="State"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false} // Disable the select dropdown so it cannot be changed
                      isClearable={false} // Prevent clearing the value
                      isSearchable={false} // Disable search if not needed
                      name="state" // Ensure this name aligns with the form field
                      options={stateList}
                      onChange={(e: any) =>
                        form.setFieldValue("state", e?.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="city"
                    label="City"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="gstin"
                    label="GSTIN"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="pin"
                    label="Pin No."
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter City" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter Email" />
                  </Form.Item>
                  <Form.Item
                    name="mobile"
                    label="Mobile"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Enter mobile" />
                  </Form.Item>
                </div>
                <Form.Item
                  name="address"
                  label="Address"
                  className=""
                  rules={rules.vendorGst}
                >
                  <Input className={InputStyle} placeholder="Enter address" />
                </Form.Item>
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item
                    name="fax"
                    label="Fax"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input
                      className={InputStyle}
                      placeholder="Enter Payment Terms"
                    />
                  </Form.Item>
                  <Form.Item
                    name="paymentTerms"
                    label="Payment Terms"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <Input className={InputStyle} placeholder="Payment Terms" />
                  </Form.Item>
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
                  onClick={createNewBranch}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white"
                >
                  Register
                </Button>
              </div>
              {/* </form> */}
            </Form>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={sheetOpenCC} onOpenChange={setSheetOpenCC}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[50%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">{` Add Cost Center `}</SheetTitle>
          </SheetHeader>
          <div>
            {loading1("fetch") && <FullPageLoading />}
            <Form form={forms} layout="vertical">
              {/* <form onSubmit={form.handleSubmit(createNewBranch)} className=""> */}
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <Form.Item name="costId" label="Cost Center Id" className="">
                  <Input
                    className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                    placeholder="Cost Center Id"
                  />
                </Form.Item>{" "}
                <Form.Item name="name" label="Cost Center Namel" className="">
                  <Input
                    className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0"
                    placeholder="Cost Center Name"
                  />
                </Form.Item>{" "}
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant={"outline"}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpenCC(false);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  onClick={createCostCenter}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white"
                >
                  Add
                </Button>
              </div>
              {/* </form> */}
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
const Switch = styled.div`
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 2.8em;
    height: 18px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 15px;
    width: 15px;
    border-radius: 20px;
    left: 2px;
    bottom: 1.5px;
    background-color: white;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #0891b2;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #0891b2;
  }

  input:checked + .slider:before {
    transform: translateX(1.7em);
  }
`;
export default CreatePoPage;
const rules = {
  poType: [
    {
      required: true,
      message: "Please select a Type",
    },
  ],
  vendorType: [
    {
      required: true,
      message: "Please select a  Vendor Type",
    },
  ],
  vendorName: [
    {
      required: true,
      message: "Please select a  Vendor Name",
    },
  ],
  branch: [
    {
      required: true,
      message: "Please select a  Vendor branch",
    },
  ],
  vendorGst: [
    {
      required: true,
      message: "Please select a  Vendor GST",
    },
  ],
  address: [
    {
      required: true,
      message: "Please select a  Vendor address",
    },
  ],
  terms: [
    {
      required: true,
      message: "Please select a  Vendor terms",
    },
  ],
  quotation: [
    {
      required: true,
      message: "Please select a  Vendor quotation",
    },
  ],
  paymentTerms: [
    {
      required: true,
      message: "Please select a payment Terms",
    },
  ],
  exchange_rate: [
    {
      required: true,
      message: "Please select Exchange rate",
    },
  ],
  currency: [
    {
      required: true,
      message: "Please select Currency",
    },
  ],
  duedate: [
    {
      required: true,
      message: "Please select Date",
    },
  ],
  costCenter: [
    {
      required: true,
      message: "Please select a cost Center",
    },
  ],
  project: [
    {
      required: true,
      message: "Please select a project",
    },
  ],
  comment: [
    {
      required: true,
      message: "Please select a project",
    },
  ],
  billingId: [
    {
      required: true,
      message: "Please select a  billing Id",
    },
  ],
  pan: [
    {
      required: true,
      message: "Please select a billing pan",
    },
  ],
  billgst: [
    {
      required: true,
      message: "Please select a bill gst",
    },
  ],
  billAddress: [
    {
      required: true,
      message: "Please select a bill Address",
    },
  ],
  shipId: [
    {
      required: true,
      message: "Please select a ship Id",
    },
  ],
  shippan: [
    {
      required: true,
      message: "Please select a ship pan",
    },
  ],
  shipgst: [
    {
      required: true,
      message: "Please select a ship gst",
    },
  ],
  shipAddress: [
    {
      required: true,
      message: "Please select a ship address",
    },
  ],
  date: [
    {
      required: true,
      message: "Please select a time period",
    },
  ],
};
