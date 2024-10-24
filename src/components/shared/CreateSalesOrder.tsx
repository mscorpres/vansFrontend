import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchBillAddressList, fetchCustomerDetail } from "@/features/salesmodule/createSalesOrderSlice";
import {
  transformOptionData,
  transformOptions,
  transformPlaceData,
} from "@/helper/transform";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createSalesFormSchema } from "@/schema/salesorder/createsalesordeschema";
interface Props {
  setTab: Dispatch<SetStateAction<string>>;
  setPayloadData: Dispatch<SetStateAction<any>>;
  handleCustomerSelection: (e: any) => void;
  form: any;
  branches: any[];
  handleBranchSelection: (e: any) => void;
  handleCostCenterChange: (e: any) => void;
}
type CreateSalesOrderForm = z.infer<typeof createSalesFormSchema>;
const CreateSalesOrder: React.FC<Props> = ({
  setTabvalue,
  setTab,
  setPayloadData,
  handleCustomerSelection,
  form,
  branches,
  handleBranchSelection,
  handleCostCenterChange,
}: any) => {
  const [selectedCostCenter, setSelectedCostCenter] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [options, setOptions] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.createSalesOrder);
  // useEffect(() => {
  //   dispatch(fetchBillingAddress({ billing_code: "R26331LI" }));
  //   dispatch(fetchBillingAddressList({ search: "" }));
  //   dispatch(fetchCountries());
  //   dispatch(fetchStates());
  // }, []);
  console.log(data?.customerList);

  // const handleBillingAddressChange = (e: any) => {
  //   const billingCode = e.value;
  //   form.setValue("bill_from_address", billingCode);

  //   dispatch(fetchBillingAddress({ billing_code: billingCode })).then(
  //     (response: any) => {
  //       if (response.meta.requestStatus === "fulfilled") {
  //         const billingData = response.payload;
  //         form.setValue("address", billingData.address);
  //         form.setValue("company", billingData.company);
  //         form.setValue("gstin", billingData.gstin);
  //         form.setValue("pan", billingData.pan);
  //         form.setValue("statecode", billingData.statecode);
  //       }
  //     }
  //   );
  // };

  // const handleCostCenterChange = (e: any) => {
  //   setSelectedCostCenter(e);
  //   form.setValue("cost_center", e.value);
  // };
  // const handleProjectIdChange = (e: any) => {
  //   setSelectedProjectId(e);
  //   form.setValue("project_id", e.value);
  //   dispatch(fetchProjectDescription({ project_name: e.value })).then(
  //     (response: any) => {
  //       if (response.meta.requestStatus === "fulfilled") {
  //         form.setValue("project_description", response.payload?.description);
  //       }
  //     }
  //   );
  // };

  const handleInputChange = async (inputValue: string) => {
    if (inputValue) {
      console.log("Searching for:", inputValue);
      try {
        dispatch(fetchCustomerDetail({ search: inputValue })).then(
          (response) => {
            if (fetchCustomerDetail.fulfilled.match(response)) {
              // Map the customer data to the required format
              const options = response.payload.map((customer) => ({
                value: customer.id,
                label: customer.text,
              }));
              setOptions(options);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching customer list:", error);
        setOptions([]); // Clear options on error
      }
    } else {
      setOptions([]); // Clear options if input is empty
    }
  };

  const onSubmit = (data: CreateSalesOrderForm) => {
    console.log("Submitted Data from CreateSalesOrder:", data); // Debugging log
    if (data) {
      setPayloadData(data);
      setTabvalue("add"); // Switch to AddSalesOrder tab
    } else {
      console.error("Data is null or undefined");
    }
  };
  console.log(form.getValues());
  return (
    <div className="h-[calc(100vh-150px)]">
      {data.loading && <FullPageLoading />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-150px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-[30px]">
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Customer Details
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Type Name or Code of the Client
                  </p>
                </CardHeader>
                <CardContent className="mt-[30px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="customer_type"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Customer Type
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="Customer Type"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                onChange={(e: any) =>
                                  form.setValue("customer_type", e.value)
                                }
                                name="color"
                                options={[
                                  {
                                    label: "CUSTOMER",
                                    value: "c01",
                                  },
                                ]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="customer_code"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Customer Name
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder="Customer Name"
                                endpoint="/others/customerList"
                                transform={transformOptions}
                                fetchOptionWith="payload"
                                onChange={handleCustomerSelection}
                                // onInputChange={handleInputChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="billTo.branch"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Branch</FormLabel>
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
                                options={branches}
                                onChange={handleBranchSelection}
                                value={
                                  branches?.length > 0
                                    ? {
                                        label: branches.find(
                                          (branch: any) =>
                                            branch.value ===
                                            form.getValues("billTo.branch")
                                        )?.label,
                                        value: form.getValues("billTo.branch"),
                                      }
                                    : null
                                }
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
                        name="billTo.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              PIN Code
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="PIN Code"
                                {...field}
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
                        name="billTo.gst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              GST / UIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="GST / UIN"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="billTo.state"
                        render={() => (
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
                                onInputChange={handleInputChange} // Call API on input change
                                name="customer" // Ensure correct name for the field
                                options={options} // Use the fetched options
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billTo.address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Bill To Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <p>error message</p> */}
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billTo.address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Billing To Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Ship To Details
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide the ship to address information
                  </p>
                </CardHeader>

                <CardContent className="mt-[10px]">
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="shipTo.company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Company
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Company"
                                {...field}
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
                        name="shipTo.panno"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pan No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Pan No."
                                {...field}
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
                        name="shipTo.gst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              GSTIN / UIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="GSTIN / UIN"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="shipTo.state"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isLoading={true}
                                isClearable={true}
                                isSearchable={true}
                                name="color"
                                options={
                                  data.states
                                    ? transformPlaceData(data.states)
                                    : []
                                }
                                // onChange={(e: any) =>
                                //   form.setValue("shipTo.state", e.value)
                                // }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <p>error message</p> */}
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="shipTo.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pincode
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Pincode"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="shipTo.address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Ship To Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="shipTo.address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Ship To Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    So Terms & Other
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide SO terms and other information
                  </p>
                </CardHeader>
                <CardContent className="mt-[10px]">
                <div>
                      <div className="flex justify-end">
                        <Badge className="p-0 text-[13px] bg-transparent border-none shadow-none font-[400] max-h-max text-cyan-600 py-[3px] px-[10px] cursor-pointer hover:bg-blue-100 hover:shadow shadow-slate-500 rounded-full">
                          Add Vendor
                        </Badge>
                      </div>
                      <FormField
                        control={form.control}
                        name="costcenter"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Cost Center
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder="Cost Center"
                                endpoint="backend/costCenter"
                                transform={transformOptions}
                                fetchOptionWith="payload"
                                onChange={handleCostCenterChange}
                                value={selectedCostCenter}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <p>error message</p> */}
                    </div>
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="termscondition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Terms and Conditions
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Terms and Conditions"
                                {...field}
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
                        name="quotationdetail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Quotation
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Quotation"
                                {...field}
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
                        name="paymentterms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Payment Terms
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Payment Terms"
                                {...field}
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
                      name="project_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Project</FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Project"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="so_comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Comments (If any)
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Comments"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  </div>
                 
                </CardContent>
              </Card>
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Bill From Details
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide the bill from address information
                  </p>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="billFrom.billFromId"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Billing ID
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                placeholder="Bill From Address"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                // onChange={dispatch(fetchBillAddressList(form.getValues("cost_center")))}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                // options={
                                //   data && data?.billingAddressList
                                //     ? transformOptionData(
                                //         data?.billingAddressList
                                //       )
                                //     : []
                                // }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <p>error message</p> */}
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="billFrom.pan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pan No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Pan No."
                                {...field}
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
                        name="billFrom.gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              GSTIN / UIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="GSTIN / UIN"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billFrom.address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address Line 1
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <p>error message</p> */}
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billFrom.address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Address Line 2
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address Line 2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="h-[50px] w-full flex justify-end items-center px-[20px] bg-white shadow-md border-t border-slate-300">
            <Button
              onClick={() => setTab("add")}
              className={`${primartButtonStyle} flex gap-[10px]`}
              type="submit"
            >
              Next
              <FaArrowRightLong className="" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CreateSalesOrder;
