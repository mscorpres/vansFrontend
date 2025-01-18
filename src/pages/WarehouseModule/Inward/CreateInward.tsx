import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
  transformCurrencyData,
  transformOptionData,
  transformOptionData2,
  transformStateOptions,
} from "@/helper/transform";
import { Form } from "antd";
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
import { Divider } from "antd";
import useApi from "@/hooks/useApi";
import {
  addVendorBranch,
  fetchState,
  vendoradd,
  vendorUpdateSave,
} from "@/components/shared/Api/masterApi";
import { toast } from "@/components/ui/use-toast";
import FullPageLoading from "@/components/shared/FullPageLoading";
import MuiInput from "@/components/ui/MuiInput";
import { Button } from "@mui/material";
import { ArrowLeftIcon } from "lucide-react";
import { Save } from "@mui/icons-material";
import { Next } from "@/components/shared/Buttons";

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
  const selven = Form.useWatch("vendorType", form);
  const selvenName = Form.useWatch("vendorName", form);

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
        <div className="rounded p-[30px] shadow bg-[#fff] h-[calc(100vh-180px)] overflow-y-hidden">
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
                <div className="mt-[30px] grid grid-cols-3 gap-[20px]">
                  <Form.Item
                    name="vendorType"
                    // label="Vendor Type"
                    rules={rules.vendorType}
                  >
                    <Select
                      styles={customStyles}
                      placeholder="Vendor Type"
                      className="border-0 basic-single z-20 relative my-[30px]"
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
                  {/* {} */}
                  <Form.Item
                    name="vendorName"
                    className="z-20 relative"
                    label={
                      <div
                        style={{
                          fontSize: window.innerWidth < 1600 && "0.9rem",
                          display: "flex",
                          justifyContent: "space-between",
                          width: 350,
                        }}
                      >
                        {/* Vendor Name */}
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
                    rules={
                      selven == "c01" || selven?.value == "c01"
                        ? []
                        : rules.vendorName
                    }
                  >
                    <ReusableAsyncSelect
                      // placeholder="Vendor Name"
                      endpoint="/backend/vendorList"
                      transform={transformOptionData2}
                      onChange={(e) => form.setFieldValue("vendorName", e)}
                      // value={selectedCustomer}
                      fetchOptionWith="query2"
                    />
                  </Form.Item>{" "}
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
                        {/* Branch Name */}
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
                    rules={
                      selven == "c01" || selven?.value == "c01"
                        ? []
                        : rules.branch
                    }
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
                <div className="mt-[30px] grid grid-cols-4 gap-[20px]">
                  <Form.Item
                    name="vendorGst"
                    // label="GSTIN"
                    // className="my-[25px]"
                    rules={rules.vendorGst}
                  >
                    <MuiInput name="vendorGst" form={form} label="GSTIN" />
                  </Form.Item>
                  <Form.Item
                    name="costCenter"
                    // label="Cost Center"
                    rules={rules.costCenter}
                  >
                    <ReusableAsyncSelect
                      placeholder="Cost Center"
                      endpoint="/backend/costCenter"
                      transform={transformOptionData2}
                      fetchOptionWith="query2"
                    />
                    {/* <p>error message</p> */}
                  </Form.Item>{" "}
                  <Form.Item
                    name="currency"
                    // label="Currency"
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
                    // label="Exchange Rate"
                    className=""
                    rules={rules.exchange_rate}
                  >
                    <MuiInput
                      name="exchange_rate"
                      form={form}
                      label="Exchange Rate"
                    />
                  </Form.Item>
                </div>{" "}
                <div className="mt-[30px] grid grid-cols-2 gap-[20px]">
                  <Form.Item
                    name="address"
                    // label="Address"
                    className=""
                    rules={
                      selven == "c01" || selven?.value == "c01"
                        ? []
                        : rules.address
                    }
                  >
                    <MuiInput name="address" form={form} label="Address" />
                  </Form.Item>{" "}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-[50px] w-full flex justify-end items-center px-[20px] bg-white shadow-md border-t border-slate-300">
          {/* <Button
            variant="contained"
            onClick={getValues}
            className={`${primartButtonStyle} flex gap-[10px] `}
            type="submit"
          >
            Next
            <FaArrowRightLong className="" />
          </Button> */}
          <Next onClick={getValues} />
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
            {loading1("fetch") && <FullPageLoading />}
            <Form form={forms} layout="vertical">
              {/* <form onSubmit={forms.handleSubmit(addVendor)} className=""> */}
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item name="label">
                    <MuiInput
                      form={forms}
                      name="label"
                      placeholder=" Address label"
                      label={" Address label"}
                    />
                  </Form.Item>
                  <Form.Item
                    name="pan"
                    className=""
                    // rules={rules.vendorGst}
                  >
                    <MuiInput
                      form={forms}
                      name="pan"
                      placeholder="Pan Number"
                      label={"Pan Number"}
                    />
                  </Form.Item>
                  <Form.Item name="cin" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="cin"
                      placeholder="CIN"
                      label={"CIN"}
                    />
                  </Form.Item>
                  <Form.Item
                    name="paymentTerm"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <MuiInput
                      form={forms}
                      name="paymentTerm"
                      placeholder="Payment Term"
                      label={"Payment Term"}
                    />
                  </Form.Item>
                </div>
                {/* <Divider /> */}
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item
                    name="company"
                    className=""
                    rules={rules.vendorGst}
                  >
                    <MuiInput
                      form={forms}
                      name="company"
                      placeholder="Company Name"
                      label={"Company Name"}
                    />
                  </Form.Item>
                  <Form.Item name="state" className="" rules={rules.vendorGst}>
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
                  <Form.Item name="city" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="city"
                      placeholder="City"
                      label={"City"}
                    />
                  </Form.Item>
                  <Form.Item name="gstin" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="gstin"
                      placeholder="GSTIN"
                      label={"GSTIN"}
                    />
                  </Form.Item>
                  <Form.Item name="pin" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="pin"
                      placeholder="Pin Number"
                      label={"Pin Number"}
                    />
                  </Form.Item>
                  <Form.Item name="email" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="email"
                      placeholder="Email"
                      label={"Email"}
                    />
                  </Form.Item>
                  <Form.Item name="mobile" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="mobile"
                      placeholder="Mobile"
                      label={"Mobile"}
                    />
                  </Form.Item>
                  <Form.Item name="fax" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="fax"
                      placeholder="Fax"
                      label={"Fax"}
                    />
                  </Form.Item>
                </div>
                <Form.Item name="address" rules={rules.vendorGst}>
                  <MuiInput
                    form={forms}
                    name="address"
                    placeholder="Address"
                    label={"Address"}
                  />
                </Form.Item>
                <Form.Item name="paymentTerms" rules={rules.vendorGst}>
                  <MuiInput
                    form={forms}
                    name="paymentTerms"
                    placeholder="paymentTerms"
                    label={"paymentTerms"}
                  />
                </Form.Item>
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowLeftIcon />}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpen(false);
                    forms.resetFields();
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  type="submit"
                  startIcon={<Save />}
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
                <Form.Item name="label" className="">
                  <MuiInput
                    form={forms}
                    name="label"
                    placeholder=" Address label"
                    label={" Address label"}
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item name="state" className="" rules={rules.vendorGst}>
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
                  <Form.Item name="city" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="city"
                      placeholder="City"
                      label={"City"}
                    />
                  </Form.Item>
                  <Form.Item name="gstin" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="gstin"
                      placeholder="GSTIN"
                      label={"GSTIN"}
                    />
                  </Form.Item>
                  <Form.Item name="pin" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="pin"
                      placeholder="Pin Number"
                      label={"Pin Number"}
                      type={"number"}
                    />
                  </Form.Item>
                  <Form.Item name="email" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="email"
                      placeholder="Email"
                      label={"Email"}
                    />
                  </Form.Item>
                  <Form.Item name="mobile" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="mobile"
                      placeholder="Mobile"
                      label={"Mobile"}
                      type={"number"}
                    />
                  </Form.Item>
                </div>
                <Form.Item name="address" className="" rules={rules.vendorGst}>
                  <MuiInput
                    form={forms}
                    name="address"
                    placeholder="Address"
                    label={"Address"}
                  />
                </Form.Item>
                <div className="grid grid-cols-2 gap-[20px]">
                  <Form.Item name="fax" className="" rules={rules.vendorGst}>
                    <MuiInput
                      form={forms}
                      name="fax"
                      placeholder="Fax"
                      label={"Fax"}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  startIcon={<ArrowLeftIcon />}
                  variant="outlined"
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpenBranch(false);
                    forms.resetFields();
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  startIcon={<Save />}
                  sx={{ ml: 2 }}
                  variant="contained"
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
