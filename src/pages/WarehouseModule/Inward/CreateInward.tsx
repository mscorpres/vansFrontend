import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { colourOptions } from "@/data";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import FullPageLoading from "@/components/shared/FullPageLoading";
import Select from "react-select";
import { transformCurrencyData, transformOptionData } from "@/helper/transform";
import { Button, Form } from "antd";
import { primartButtonStyle, InputStyle } from "@/constants/themeContants";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShippingAddressForPO,
  fetchVendorAddressDetails,
  listOfCostCenter,
  listOfVendorBranchList,
} from "@/features/client/clientSlice";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { vendorTypeOptions } from "@/components/shared/Options";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker, Divider, Dropdown, Menu, Space } from "antd";
import useApi from "@/hooks/useApi";
import {
  fetchState,
  vendoradd,
  vendorUpdateSave,
} from "@/components/shared/Api/masterApi";
import { toast } from "@/components/ui/use-toast";

interface Props {
  setTab: string;
  setPayloadData: string;
  form: any;
  setFormVal: [];
  formVal: [];
}
const CreateInward: React.FC<Props> = ({
  setTab,
  setPayloadData,
  form,
  selectedVendor,
  setFormVal,
  formVal,
  currencyList,
  resetSure,
  setResetSure,
}) => {
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetOpenBranch, setSheetOpenBranch] = useState<boolean>(false);
  const [stateList, setStateList] = useState([]);
  const { vendorBranchlist, vendorPODetails } = useSelector(
    (state: RootState) => state.client
  );
  const [forms] = Form.useForm();
  const selBranch = Form.useWatch("branch", form);
  const params = useParams();
  const { execFun, loading: loading1 } = useApi();
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

  const addVendor = async (data) => {
    const values = forms.getFieldsValue();

    let p = {
      vendor: {
        vendorname: values.label,
        panno: values.pan,
        cinno: values.cin,
      },
      branch: {
        branch: values.label,
        address: values.address,
        state: values.state,
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
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenView(false);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createNewBranch = async (data) => {
    const values = forms.getFieldsValue();
    let p = {
      vendor: {
        vendorname: sheetOpenBranch,
      },
      branch: {
        branch: values.label,
        address: values.address,
        state: values.state,
        city: values.city,
        pincode: values.pin,
        fax: values.fax,
        mobile: values.mobile,
        email: values.email,
        gstin: values.gstin,
      },
    };

    const response = await execFun(() => vendorUpdateSave(p), "fetch");
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenView(false);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  //
  const getValues = async () => {
    let valuesOfFrom = await form.validateFields();
    setTab("add");
    setFormVal(valuesOfFrom);
    // return valuesOfFrom;
  };
  useEffect(() => {
    dispatch(fetchShippingAddressForPO());
    if (selectedVendor) {
      dispatch(listOfVendorBranchList({ vendorcode: selectedVendor?.value }));
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
      setResetSure(false);
    }
  }, [selectedVendor, selBranch]);
  useEffect(() => {
    if (searchData) {
      dispatch(listOfCostCenter({ search: searchData }));
    }
  }, [searchData]);

  useEffect(() => {
    if (vendorPODetails && resetSure == false) {
      let arr = vendorPODetails;

      form.setFieldValue("vendorGst", arr?.gstid);
      form.setFieldValue("address", arr?.address);
    }
    getStateList();
  }, [vendorPODetails]);

  return (
    <div className="h-[calc(100vh-100px)]">
      {
        // data.loading  &&
        // <FullPageLoading />
      }
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="rounded p-[30px] shadow bg-[#fff] h-[calc(100vh-145px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-[30px]">
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
                <div className="mt-[30px] grid grid-cols-3 gap-[40px]">
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
                      options={vendorTypeOptions}
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>
                  {/* <div> */}
                  {/* <p>error message</p> */}
                  <Form.Item
                    name="vendorName"
                    label={
                      <div
                        style={{
                          fontSize: window.innerWidth < 1600 && "0.7rem",
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
                          }}
                        >
                          Add Vendor
                        </span>
                      </div>
                    }
                    rules={rules.vendorName}
                  >
                    <ReusableAsyncSelect
                      placeholder="Vendor Name"
                      endpoint="/backend/vendorList"
                      transform={transformOptionData}
                      onChange={(e) => form.setFieldValue("vendorName", e)}
                      // value={selectedCustomer}
                      fetchOptionWith="payload"
                    />
                  </Form.Item>{" "}
                  <Form.Item
                    name="branch"
                    label={
                      <div
                        style={{
                          fontSize: window.innerWidth < 1600 && "0.7rem",
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
                  </Form.Item>{" "}
                </div>
                <div className="mt-[30px] grid grid-cols-4 gap-[40px]">
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
                  <Form.Item
                    name="costCenter"
                    label="Cost Center"
                    rules={rules.costCenter}
                  >
                    <ReusableAsyncSelect
                      placeholder="Cost Center"
                      endpoint="/backend/costCenter"
                      transform={transformOptionData}
                      fetchOptionWith="payload"
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>{" "}
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
                </div>{" "}
                <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
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
                  </Form.Item>{" "}
                </div>
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
      </Form>{" "}
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
                    setOpen(true);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  onClick={addVendor}
                  className="bg-cyan-700 hover:bg-cyan-600"
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
                    <Input className={InputStyle} placeholder="Enter fax" />
                  </Form.Item>
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
                  onClick={createNewBranch}
                  className="bg-cyan-700 hover:bg-cyan-600"
                >
                  Register
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
export default CreateInward;
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
  costCenter: [
    {
      required: true,
      message: "Please select a cost Center",
    },
  ],
};
const initialValues = {
  vendorType: "",
  vendorName: "",
  branch: "",
  vendorGst: "",
  address: "",
};
