import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchBillingAddress,
  fetchClientAddressDetail,
  fetchClientDetails,
  fetchCountries,
  fetchProjectDescription,
  fetchStates,
} from "@/features/salesmodule/createSalesOrderSlice";
import { fetchBillingAddressList } from "../../features/salesmodule/createSalesOrderSlice";
import {
  transformCustomerData,
  transformOptionData,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

interface OptionType {
  value: string;
  label: string;
}
interface Props {
  setTab: Dispatch<SetStateAction<string>>;
  setPayloadData: Dispatch<SetStateAction<any>>;
}
type CreateSalesOrderForm = z.infer<typeof createSalesFormSchema>;
const CreateSalesOrder: React.FC<Props> = ({
  setTabvalue,
  setTab,
  setPayloadData,
}: any) => {
  const form = useForm<z.infer<typeof createSalesFormSchema>>({
    resolver: zodResolver(createSalesFormSchema),
    mode: "onBlur",
  });

  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedCostCenter, setSelectedCostCenter] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [options, setOptions] = useState<OptionType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.createSalesOrder);
  useEffect(() => {
    dispatch(fetchBillingAddress({ billing_code: "R26331LI" }));
    dispatch(fetchBillingAddressList({ search: "" }));
    dispatch(fetchCountries());
    dispatch(fetchStates());
  }, []);

  const handleClientCahnge = (e: any) => {
    form.setValue("customer", e.value);
    setSelectedCustomer(e);
    dispatch(fetchClientDetails(e!.value)).then((response: any) => {
      if (response.meta.requestStatus === "fulfilled") {
        setOptions([
          {
            label: response.payload.city.name,
            value: response.payload.city.name,
          },
        ]);
        dispatch(
          fetchClientAddressDetail({ addressID: response.payload.addressID })
        ).then((response: any) => {
          if (response.meta.requestStatus === "fulfilled") {
            form.setValue("billing_address", response.payload.address);
            form.setValue("client_gst", response.payload.gst);
          }
        });
      }
    });
  };

  const handleBillingAddressChange = (e: any) => {
    const billingCode = e.value;
    form.setValue("bill_from_address", billingCode);

    dispatch(fetchBillingAddress({ billing_code: billingCode })).then(
      (response: any) => {
        if (response.meta.requestStatus === "fulfilled") {
          const billingData = response.payload;
          form.setValue("address", billingData.address);
          form.setValue("company", billingData.company);
          form.setValue("gstin", billingData.gstin);
          form.setValue("pan", billingData.pan);
          form.setValue("statecode", billingData.statecode);
        }
      }
    );
  };

  const handleCostCenterChange = (e: any) => {
    setSelectedCostCenter(e);
    form.setValue("cost_center", e.value);
  };
  const handleProjectIdChange = (e: any) => {
    setSelectedProjectId(e);
    form.setValue("project_id", e.value);
    dispatch(fetchProjectDescription({ project_name: e.value })).then(
      (response: any) => {
        if (response.meta.requestStatus === "fulfilled") {
          form.setValue("project_description", response.payload?.description);
        }
      }
    );
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
                    Client Details
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
                        name="channels"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Select Channel
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="Select Channel"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                onChange={(e: any) =>
                                  form.setValue("channels", e.value)
                                }
                                name="color"
                                options={[
                                  {
                                    label: "Amazon",
                                    value: "AMZ",
                                  },
                                  {
                                    label: "Flipkart",
                                    value: "FLK",
                                  },
                                  {
                                    label: "B2B",
                                    value: "B2B",
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
                        name="customer"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Client Name
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder="Client Name"
                                endpoint="client/getClient"
                                transform={transformCustomerData}
                                onChange={handleClientCahnge}
                                value={selectedCustomer}
                                fetchOptionWith="query"
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
                        name="customer_branch"
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
                                options={options}
                                onChange={(e) => console.log(e)}
                                value={
                                  data.clientDetails
                                    ? {
                                        label: data.clientDetails.city.name,
                                        value: data.clientDetails.city.name,
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
                        name="client_gst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>GSTIN</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="GSTIN"
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
                      name="billing_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Billing Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Billing Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <p>error message</p> */}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    SO Terms
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide SO terms and other information
                  </p>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="terms_condition"
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
                        name="quotation_detail"
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
                        name="payment_term"
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
                        name="due_day"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Due Date (in days)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Due Date (in days)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex justify-end">
                        <Badge className="p-0 text-[13px] bg-transparent border-none shadow-none font-[400] max-h-max text-cyan-600 py-[3px] px-[10px] cursor-pointer hover:bg-blue-100 hover:shadow shadow-slate-500 rounded-full">
                          Add Vendor
                        </Badge>
                      </div>
                      <FormField
                        control={form.control}
                        name="cost_center"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Cost Center
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder="Cost Center"
                                endpoint="backend/costCenter"
                                transform={transformOptionData}
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
                    <div>
                      <div className="flex justify-end">
                        <Badge className="p-0 text-[13px] bg-transparent border-none shadow-none font-[400] max-h-max text-cyan-600 py-[3px] px-[10px] cursor-pointer hover:bg-blue-100 hover:shadow shadow-slate-500 rounded-full">
                          Add Vendor
                        </Badge>
                      </div>
                      <FormField
                        control={form.control}
                        name="project_id"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Project Id
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder="Project Id"
                                endpoint="backend/poProjectName"
                                transform={transformOptionData}
                                onChange={handleProjectIdChange}
                                value={selectedProjectId}
                                fetchOptionWith="payload"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <p>error message</p> */}
                    </div>
                  </div>
                  <div className="mt-[40px]">
                    <Textarea
                      value={
                        data.projectDescription
                          ? data.projectDescription.description
                          : ""
                      }
                      disabled={!data.projectDescription}
                      className="border-0 border-b rounded-none shadow-none outline-none resize-none border-slate-600 focus-visible:ring-0"
                      placeholder="Project Description"
                    />
                    {/* <p>error message</p> */}
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Comments</FormLabel>
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
                </CardContent>
              </Card>
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Dispatch from
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide billing information
                  </p>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="bill_from_address"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Billing Name
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                placeholder="Bill From Address"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                onChange={handleBillingAddressChange}
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
                        name="pan"
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
                        name="gstin"
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
                    <div className="">
                      <FormField
                        control={form.control}
                        name="statecode"
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address"
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
                    Ship To
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    Provide shipping information
                  </p>
                  <Switch className="flex items-center gap-[10px]">
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                    <p className="text-slate-600 text-[13px]">
                      Same as Billing Address
                    </p>
                  </Switch>
                </CardHeader>

                <CardContent className="mt-[10px]">
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="shipping_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Name</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Name"
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
                        name="shipping_pan"
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
                        name="shipping_gstin_uin"
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
                        name="shipping_state"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pincode
                            </FormLabel>
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
                                onChange={(e: any) =>
                                  form.setValue("shipping_state", e.value)
                                }
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
                        name="shipping_pinCode"
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
                      name="shipping_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Address"
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
export default CreateSalesOrder;
