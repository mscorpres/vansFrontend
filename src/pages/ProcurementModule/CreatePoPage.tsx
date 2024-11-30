import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePickerStyle, primartButtonStyle } from "@/constants/themeContants";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { transformCurrencyData, transformOptionData, transformOptionData2 } from "@/helper/transform";
import { Button, DatePicker, Form } from "antd";

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
import { useEffect, useState } from "react";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import FullPageLoading from "@/components/shared/FullPageLoading";
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
}) => {
  const [searchData, setSearchData] = useState("");
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

  const selBranch = Form.useWatch("branch", form);
  const dueDate = Form.useWatch("duedate", form);
  const selCostCenter = Form.useWatch("costCenter", form);
  const selShipping = Form.useWatch("shipId", form);
  const selBilling = Form.useWatch("billingId", form);
  const selPoType = Form.useWatch("poType", form);

  const params = useParams();

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
  useEffect(() => {
    dispatch(fetchShippingAddressForPO());

    if (selectedVendor) {
      dispatch(listOfVendorBranchList({ vendorcode: selectedVendor?.value }));
      setResetSure(false);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (selectedVendor && selBranch) {
      dispatch(
        fetchVendorAddressDetails({
          vendorcode: selectedVendor?.value,
          branchcode: selBranch?.value,
        })
      );
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
    if (params) {
    }
  }, [params]);
  ///setting details from the shipping details
  useEffect(() => {
    if (shippingPODetails && resetSure == false) {
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
    if (vendorPODetails && resetSure == false) {
      let arr = vendorPODetails;

      form.setFieldValue("vendorGst", arr?.gstid);
      form.setFieldValue("address", arr?.address);
    } else {
      form.setFieldValue("vendorGst", "");
      form.setFieldValue("address", "");
    }
  }, [vendorPODetails]);
  useEffect(() => {
    if (selBilling) {
      dispatch(fetchBillingListDetails({ billing_code: selBilling?.value }));
    }
  }, [selBilling]);

  useEffect(() => {
    if (vendorBillingDetails && resetSure == false) {
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
    <div className="h-[calc(100vh-150px)]">
      {loading && <FullPageLoading />}
      <Form form={form} layout="vertical">
        <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-150px)] overflow-y-auto">
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
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>
                  {/* <div> */}

                  {/* <p>error message</p> */}
                </div>
                <Form.Item
                  name="vendorName"
                  label="Vendor Name"
                  rules={rules.vendorName}
                >
                  <ReusableAsyncSelect
                    placeholder="Vendor Name"
                    endpoint="/backend/vendorList"
                    transform={transformOptionData}
                    onChange={(e) => form.setFieldValue("vendorName", e)}
                    // value={selectedCustomer}
                    fetchOptionWith="query2"
                  />
                </Form.Item>
                <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                  <Form.Item name="branch" label="Branch" rules={rules.branch}>
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
                    label="Cost Center"
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

                  <Form.Item
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
                  </Form.Item>
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
                    options={transformOptionData(vendorBillingList)}
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
                    options={transformOptionData(shippingPOList)}
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
