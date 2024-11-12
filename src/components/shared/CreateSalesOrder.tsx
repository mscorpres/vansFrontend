import { FaArrowRightLong } from "react-icons/fa6";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  transformCurrencyData,
  transformOptionData,
  transformOptions,
  transformStateOptions,
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
import dayjs, { Dayjs } from "dayjs";
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
import { stateOptions } from "@/General";
import { DatePicker, Space } from "antd";
import { toast } from "@/components/ui/use-toast";
interface Props {
  setTab: Dispatch<SetStateAction<string>>;
  setPayloadData: Dispatch<SetStateAction<any>>;
  handleCustomerSelection: (e: any) => void;
  form: any;
  branches: any[];
  handleBranchSelection: (e: any) => void;
  handleCostCenterChange: (e: any) => void;
  handleBillIdChange: (e: any) => void;
  currencyList: any;
  searchCustomerList: (e: any) => void;
  backCreate: boolean;
}
type CreateSalesOrderForm = z.infer<typeof createSalesFormSchema>;
const CreateSalesOrder: React.FC<Props> = ({
  setTab,
  setPayloadData,
  handleCustomerSelection,
  form,
  branches,
  handleBranchSelection,
  handleCostCenterChange,
  handleBillIdChange,
  currencyList,
  backCreate,
}: any) => {
  const data = useSelector((state: RootState) => state.createSalesOrder);

  const onSubmit = (data: CreateSalesOrderForm) => {
    console.log("Submitted Data from CreateSalesOrder:", data); // Debugging log
    if (data) {
      setPayloadData(data);
      setTab("add"); // Switch to AddSalesOrder tab
    } else {
      console.error("Data is null or undefined");
    }
  };
  console.log(form.getValues(), currencyList);

  const customerOptions = [
    {
      label: "CUSTOMER",
      value: "c01",
    },
  ];
  const update = window.location.pathname.includes("update");

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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                                options={customerOptions}
                                defaultValue={"c01"}
                                // value={customerOptions.find((c) => c.value === field.value)}
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <ReusableAsyncSelect
                                placeholder={
                                  update || backCreate
                                    ? form.getValues("customer_name")
                                    : "Customer Name"
                                }
                                endpoint="/others/customerList"
                                transform={transformOptions}
                                fetchOptionWith="payload"
                                onChange={handleCustomerSelection}
                                // value={form.watch("customer_code")}
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
                            <FormLabel className={LableStyle}>
                              Branch
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              State
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={true} // Disable the select dropdown so it cannot be changed
                                isClearable={false} // Prevent clearing the value
                                isSearchable={false} // Disable search if not needed
                                name="customer" // Ensure this name aligns with the form field
                                options={
                                  stateOptions
                                    ? transformStateOptions(stateOptions)
                                    : []
                                }
                                value={
                                  // Find the corresponding option based on field.value (which is the stateCode)
                                  transformStateOptions(stateOptions)?.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
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
                            Bill To Address1
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
                            Bill To Address2
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              State
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={true}
                                isClearable={false}
                                isSearchable={false}
                                name="customer"
                                options={
                                  stateOptions
                                    ? transformStateOptions(stateOptions)
                                    : []
                                }
                                value={
                                  // Find the corresponding option based on field.value (which is the stateCode)
                                  transformStateOptions(stateOptions)?.find(
                                    (option) => option.value === field.value
                                  ) || null
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
                        name="shipTo.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pincode
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                            Ship To Address1
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
                            Ship To Address2
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="po_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              PO Number
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="PO Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="po_date"
                        render={() => (
                          <FormItem className="pl-[10px] w-full flex flex-col">
                            <FormLabel className={LableStyle}>
                              PO Date
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 w-full pt-5"
                                  format="DD-MM-YYYY"
                                  value={
                                    form.watch("po_date")
                                      ? dayjs(
                                          form.watch("po_date"),
                                          "DD-MM-YYYY"
                                        )
                                      : null
                                  }
                                  onChange={(value: Dayjs | null) => {
                                    const formattedDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    form.setValue("po_date", formattedDate);
                                  }}
                                />
                              </Space>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name="reference_no"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Reference Number
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Reference Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="reference_date"
                        render={() => (
                          <FormItem className="pl-[10px] w-full flex flex-col">
                            <FormLabel className={LableStyle}>
                              Reference Date
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 w-full pt-5"
                                  format="DD-MM-YYYY"
                                  value={
                                    form.watch("reference_date")
                                      ? dayjs(
                                          form.watch("reference_date"),
                                          "DD-MM-YYYY"
                                        )
                                      : null
                                  }
                                  onChange={(value: Dayjs | null) => {
                                    const formattedDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    form.setValue(
                                      "reference_date",
                                      formattedDate
                                    );
                                  }}
                                />
                              </Space>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="currency.currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Currency
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Currency"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isClearable={false} // Prevent clearing the value
                              isSearchable={false} // Disable search if not needed
                              options={
                                currencyList
                                  ? transformCurrencyData(currencyList)
                                  : []
                              }
                              value={
                                // Find the corresponding option based on field.value
                                transformCurrencyData(currencyList)?.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                // Update the form value with the selected option's value
                                field.onChange(selectedOption?.value); // Use field.onChange to update the form value
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="">
                      <FormField
                        control={form.control}
                        name="currency.exchange_rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Exchange Rate
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Exchange Rate"
                                min={1}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="due_date"
                        render={() => (
                          <FormItem className="pl-[10px] w-full flex flex-col">
                            <FormLabel className={LableStyle}>
                              Due Date
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  className="border-0 border-b rounded-none shadow-none border-slate-600 focus-visible:ring-0 w-full pt-5"
                                  format="DD-MM-YYYY"
                                  value={
                                    form.watch("due_date")
                                      ? dayjs(
                                          form.watch("due_date"),
                                          "DD-MM-YYYY"
                                        )
                                      : null
                                  }
                                  onChange={(value: Dayjs | null) => {
                                    const formattedDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    form.setValue("due_date", formattedDate);
                                  }}
                                />
                              </Space>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                            <FormLabel className={LableStyle}>
                              Project
                            </FormLabel>
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
                    <div>
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
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <ReusableAsyncSelect
                              placeholder={
                                update || backCreate
                                  ? form.getValues("costcenter_name")
                                  : "Cost Center"
                              }
                              endpoint="backend/costCenter"
                              transform={transformOptions}
                              fetchOptionWith="payload"
                              onChange={handleCostCenterChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="billFrom.billFromId"
                        render={() => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Billing ID
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                placeholder={
                                  update || backCreate
                                    ? form.getValues("billIdName")
                                    : "Bill From Address"
                                }
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                onChange={handleBillIdChange}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={
                                  data && data?.billingAddressList
                                    ? transformOptionData(
                                        data?.billingAddressList
                                      )
                                    : []
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
                        name="billFrom.pan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Pan No.
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
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
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
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
              onClick={() => {
                const errors = form.formState.errors;
                if (Object.keys(errors).length > 0) {
                  // Iterate over the errors and show a toast
                  Object.values(errors).forEach((error: any) => {
                    toast({
                      title: error.message || "Failed",
                      className: "bg-red-600 text-white items-center",
                    });
                  });
                }
                // setTab("add");
              }}
              className={`${primartButtonStyle} flex gap-[10px]`}
              type="submit"
              disabled={form.errors}
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
