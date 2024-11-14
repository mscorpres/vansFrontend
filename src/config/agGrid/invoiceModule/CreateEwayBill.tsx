import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import Select from "react-select";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { AgGridReact } from "ag-grid-react";
import {
  columnDefs,
  docType,
  eInvoiceSchema,
  reverseOptions,
  subOptions,
  supplyTypeOptions,
  transactionTypeOptions,
  transportationMode,
  vehicleTypeOptions,
  ewayBillSchema,
  subsupplytype,
} from "@/constants/EwayBillConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Button } from "@/components/ui/button";
import { DatePicker, Space } from "antd";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { stateOptions, TruncateCellRenderer } from "@/General";
import ShowInvoiceModal from "@/config/agGrid/invoiceModule/ShowInvoiceModal";
import {
  createEwayBill,
  fetchDataForEwayBill,
  fetchDataForInvoice,
  generateEInvoice,
} from "@/features/salesmodule/salesInvoiceSlice";
import { transformStateOptions } from "@/helper/transform";

export default function CreateEwayBill() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [totalSum, setTotalSum] = useState(0);
  const [transactionType, setTransactionType] = useState<string | undefined>(
    ""
  );
  const [showCreatedInvoiceModal, setShowCreatedInvoiceModal] = useState(false);
  // const [invoiceData, setInvoiceData] = useState<any>({});
  const isEwayBill = window.location.href?.includes("e-way");

  const form = useForm({
    resolver: zodResolver(isEwayBill ? ewayBillSchema : eInvoiceSchema),
    mode: "onBlur",
  });
  const { ewayBillData, loading } = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const [rowData, setRowData] = useState(ewayBillData || []);
  const [orderId, setOrderId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  // const transTypeSelected = Form?.useWatch("transactionType", form);

  useEffect(() => {
    const shipId = (params?.id as string).replace(/_/g, "/");
    const action = isEwayBill ? fetchDataForEwayBill : fetchDataForInvoice;
    dispatch(action({ shipment_id: shipId })).then((res: any) => {
      if (res.payload?.success) {
        var data = res.payload?.data[0];
        console.log(data?.total_amount);
        setTotalSum(data?.total_amount)
        form.setValue("header.documentNo", data?.documentNo);
        setOrderId(data?.documentDetail?.documentNo);
        form.setValue(
          "header.documentDate",
          data?.documentDetail?.documentDate
        );
        form.setValue("billFrom.legalName", data?.bill_from?.legalName);
        form.setValue("billFrom.state", data?.bill_from?.state?.state_code);
        form.setValue("billFrom.location", data?.bill_from?.location);
        form.setValue("billFrom.gstin", data?.bill_from?.gstin);
        form.setValue("billFrom.pincode", data?.bill_from?.pincode);
        form.setValue("billFrom.pan", data?.bill_from?.pan);
        form.setValue("billFrom.addressLine1", data?.bill_from?.address1);
        form.setValue("billFrom.addressLine2", data?.bill_from?.address2);

        form.setValue("billTo.legalName", data?.bill_to?.client);
        form.setValue("billTo.state", data?.bill_to?.state?.state_code);
        form.setValue("billTo.location", data?.bill_to?.location);
        form.setValue("billTo.gstin", data?.bill_to?.gst);
        form.setValue("billTo.pincode", data?.bill_to?.pincode);
        form.setValue("billTo.pan", data?.bill_to?.pan);
        form.setValue("billTo.addressLine1", data?.bill_to?.address1);
        form.setValue("billTo.addressLine2", data?.bill_to?.address2);

        form.setValue("dispatchFrom.legalName", data?.ship_from?.legalName);
        form.setValue("dispatchFrom.state", data?.ship_from?.state?.state_code);
        form.setValue("dispatchFrom.pan", data?.ship_from?.pan);
        form.setValue("dispatchFrom.addressLine1", data?.ship_from?.address1);
        form.setValue("dispatchFrom.addressLine2", data?.ship_from?.address2);

        form.setValue("shipTo.legalName", data?.ship_to?.company);
        form.setValue("shipTo.pincode", data?.ship_to?.pincode);
        form.setValue("shipTo.pan", data?.ship_to?.panno);
        form.setValue("shipTo.gstin", data?.ship_to?.gst);
        form.setValue("shipTo.state", data?.ship_to?.state?.state_code);
        form.setValue("shipTo.addressLine1", data?.ship_to?.address1);
        form.setValue("shipTo.addressLine2", data?.ship_to?.address2);
      }
    });
  }, [params]);
  console.log(form.getValues(), form.formState.errors);

  useEffect(() => {
    setRowData(ewayBillData);
  }, [ewayBillData]);

  const onSubmit = (payload: any) => {
    console.log("Form data:", payload);

    if (isEwayBill) {
      dispatch(createEwayBill(payload)).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          toast({
            title: "Data Fetched Successfully",
            className: "bg-green-600 text-white items-center",
          });
          // setInvoiceData(response.payload.data);
          setShowCreatedInvoiceModal(true);
        }
      });
    } else {
      dispatch(generateEInvoice(payload)).then((response) => {
        console.log(response);
        if (response.meta.requestStatus === "fulfilled") {
          toast({
            title: "Created Successfully",
            className: "bg-green-600 text-white items-center",
          });
          // setInvoiceData(response.payload.data);
          setShowCreatedInvoiceModal(true);
        }
      });
    }
  };

  // useEffect(() => {
  //   let sum = 0;
  //   rowData?.forEach((item: any) => {
  //     const itemValue = parseFloat(item.item_value) || 0;
  //     const itemSGST = parseFloat(item.item_sgst) || 0;
  //     const itemGSTRate = parseFloat(item.item_igst) || 0;
  //     const itemCGST = parseFloat(item.item_cgst) || 0;
  //     sum += itemValue + itemSGST + itemGSTRate + itemCGST;
  //   });
  //   setTotalSum(sum);
  // }, [ewayBillData, rowData]);

  const handleSubmit = async () => {
    const isValid = await form.trigger(); // Validate fields
    if (isValid) {
      setShowConfirmation(true); // Open the confirmation modal
    } else {
      toast({
        title: "Please fill out all required fields correctly.",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const handleConfirmationClose = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed) {
      form.handleSubmit(onSubmit)(); // Proceed with submission
    }
  };

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col">
      {loading && <FullPageLoading />}
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="rounded p-[30px] shadow bg-[#fff] overflow-y-auto mb-10">
            <div className="text-slate-600 font-[600] text-[20px] flex justify-center">
              {isEwayBill ? "Create E-Way Bill" : "Create E-Invoice"}
            </div>
            {/*Document Details*/}
            <Card className="rounded shadow bg-[#fff] mb-8">
              <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Document Details
                </h3>
              </CardHeader>
              <CardContent className="mt-[30px]">
                <div className="grid grid-cols-3 gap-[40px] mt-[30px]">
                  <div>
                    <FormField
                      control={form.control}
                      name="header.supplyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Supply Type
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              styles={customStyles}
                              placeholder="Supply Type"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              components={{ DropdownIndicator }}
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={
                                isEwayBill ? supplyTypeOptions : subOptions
                              }
                              onChange={(selectedOption) => {
                                field.onChange(
                                  selectedOption ? selectedOption?.value : ""
                                );
                              }}
                              value={(isEwayBill
                                ? supplyTypeOptions
                                : subOptions
                              )?.find((option) => option.value === field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isEwayBill && (
                    <div>
                      <FormField
                        control={form.control}
                        name="header.subSupplyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Sub Supply Type
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                styles={customStyles}
                                placeholder="Sub Type"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={subsupplytype}
                                onChange={(selectedOption) => {
                                  field.onChange(
                                    selectedOption ? selectedOption?.value : ""
                                  );
                                }}
                                value={subsupplytype?.find(
                                  (option) => option.value === field.value
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <div className="">
                    <FormField
                      control={form.control}
                      name="header.documentNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Document No
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className={InputStyle}
                              placeholder="Document No"
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
                      name="header.documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Document Type
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              styles={customStyles}
                              placeholder="Document Type"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              components={{ DropdownIndicator }}
                              onChange={(selectedOption) => {
                                field.onChange(
                                  selectedOption ? selectedOption.value : null
                                );
                              }}
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={docType}
                              value={docType?.find(
                                (option) => option.value === field.value
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <Controller
                      control={form.control}
                      name="header.documentDate"
                      render={() => (
                        <FormItem className="pl-[10px] w-full flex flex-col">
                          <FormLabel className={LableStyle}>
                            Document Date
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Space direction="vertical" size={12}>
                              <DatePicker
                                className="border-0 border-b rounded-none shadow-none focus-visible:ring-0 border-neutral-700 py-[13px] w-[100%] hover:border-neutral-700"
                                format="DD-MM-YYYY"
                                onChange={(value: Dayjs | null) => {
                                  const formattedDate = value
                                    ? value.format("DD-MM-YYYY")
                                    : "";

                                  form.setValue(
                                    "header.documentDate",
                                    formattedDate
                                  );
                                }}
                                value={
                                  form.getValues("header.documentDate")
                                    ? dayjs(
                                        form.getValues("header.documentDate"),
                                        "DD-MM-YYYY"
                                      )
                                    : null
                                }
                              />
                            </Space>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="header.transactionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Transaction Type
                            <span className="pl-1 text-red-500 font-bold">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              styles={customStyles}
                              placeholder="Transaction Type"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              components={{ DropdownIndicator }}
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={transactionTypeOptions}
                              onChange={(selectedOption) => {
                                field.onChange(
                                  selectedOption ? selectedOption.value : null
                                );
                                setTransactionType(selectedOption?.value);
                              }}
                              value={transactionTypeOptions?.find(
                                (option) => option.value === field.value
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="header.reverseCharge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Reverse Charge
                        </FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            styles={customStyles}
                            placeholder="Reverse Charge"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={reverseOptions}
                            onChange={(selectedOption) => {
                              field.onChange(
                                selectedOption ? selectedOption?.value : ""
                              );
                            }}
                            value={subOptions?.find(
                              (option) => option.value === field.value
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="header.igstOnIntra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>
                          Igst on Intra
                        </FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            styles={customStyles}
                            placeholder="Igst on Intra"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            components={{ DropdownIndicator }}
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={reverseOptions}
                            onChange={(selectedOption) => {
                              field.onChange(
                                selectedOption ? selectedOption?.value : ""
                              );
                            }}
                            value={reverseOptions?.find(
                              (option) => option.value === field.value
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-[30px]">
              {/* Bill From */}
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Bill From
                  </h3>
                </CardHeader>
                <CardContent className="mt-[30px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="billFrom.legalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Name
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Legal Name"
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
                              GSTIN
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
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
                    <div>
                      <FormField
                        control={form.control}
                        name="billFrom.state"
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
                                {...field}
                                styles={customStyles}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
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
                                onChange={(selectedOption) => {
                                  field.onChange(
                                    selectedOption ? selectedOption.value : null
                                  );
                                }}
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
                        name="billFrom.location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Location
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Supplier Location"
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
                        name="billFrom.pincode"
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
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billFrom.addressLine1"
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
                              maxLength={100}
                              className={InputStyle}
                              placeholder="Address line 1"
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
                      name="billFrom.addressLine2"
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
                              maxLength={100}
                              className={InputStyle}
                              placeholder="Address line 2"
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
              {/* Bill To */}
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Bill To
                  </h3>
                </CardHeader>

                <CardContent className="mt-[10px]">
                  <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="billTo.legalName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Name
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Legal Name"
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
                        name="billTo.gstin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              GSTIN
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
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
                                {...field}
                                styles={customStyles}
                                placeholder="State"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
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
                                onChange={(selectedOption) => {
                                  field.onChange(
                                    selectedOption ? selectedOption.value : null
                                  );
                                }}
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
                        name="billTo.location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Location
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Place of Supply"
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
                        name="billTo.pincode"
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
                    <div className="">
                      <FormField
                        control={form.control}
                        name="billTo.pan"
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
                  </div>
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="billTo.addressLine1"
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
                              maxLength={100}
                              className={InputStyle}
                              placeholder="Address line 1"
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
                      name="billTo.addressLine2"
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
                              maxLength={100}
                              className={InputStyle}
                              placeholder="Address line 2"
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
              {/* Ship From */}
              {transactionType !== "1" && transactionType !== "2" && (
                <Card className="rounded shadow bg-[#fff]">
                  <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                    <h3 className="text-[17px] font-[600] text-slate-600">
                      Dispatch From
                    </h3>
                  </CardHeader>
                  <CardContent className="mt-[10px]">
                    <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                      <div className="">
                        <FormField
                          control={form.control}
                          name="dispatchFrom.legalName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Legal Name
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Legal Name"
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
                          name="dispatchFrom.state"
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
                                  {...field}
                                  styles={customStyles}
                                  placeholder="State"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isClearable={true}
                                  isSearchable={true}
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
                                  onChange={(selectedOption) => {
                                    field.onChange(
                                      selectedOption
                                        ? selectedOption.value
                                        : null
                                    );
                                  }}
                                
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
                          name="dispatchFrom.pan"
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
                    </div>
                    <div className="mt-[40px]">
                      <FormField
                        control={form.control}
                        name="dispatchFrom.addressLine1"
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
                                maxLength={100}
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
                        name="dispatchFrom.addressLine2"
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
                                maxLength={100}
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
              )}

              {/* Ship To */}
              {transactionType !== "1" && transactionType !== "3" && (
                <Card className="rounded shadow bg-[#fff]">
                  <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                    <h3 className="text-[17px] font-[600] text-slate-600">
                      Ship To
                    </h3>
                  </CardHeader>

                  <CardContent className="mt-[10px]">
                    <div className="mt-[30px] grid grid-cols-2 gap-[40px]">
                      <div className="">
                        <FormField
                          control={form.control}
                          name="shipTo.legalName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Legal Name
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Legal Name"
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
                                  {...field}
                                  styles={customStyles}
                                  placeholder="State"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isClearable={true}
                                  isSearchable={true}
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
                                  onChange={(selectedOption) => {
                                    field.onChange(
                                      selectedOption
                                        ? selectedOption.value
                                        : null
                                    );
                                  }}
                                  
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
                      <div className="">
                        <FormField
                          control={form.control}
                          name="shipTo.gstin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                GSTIN
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              </FormLabel>
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
                        name="shipTo.addressLine1"
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
                                maxLength={100}
                                className={InputStyle}
                                placeholder="Address line 1"
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
                        name="shipTo.addressLine2"
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
                                maxLength={100}
                                className={InputStyle}
                                placeholder="Address line 2"
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
              )}
            </div>
            <div className="grid grid-cols-2 gap-[30px] pt-8">
              {/* Transporter Details */}
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Transportation Details
                  </h3>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div className="">
                      <FormField
                        control={form.control}
                        name="ewaybillDetails.transporterId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Transporter Id
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Transporter Id"
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
                        name="ewaybillDetails.transporterName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Transporter Name
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Transporter Name"
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
                        name="ewaybillDetails.transDistance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Distance (in Km)
                              <span className="pl-1 text-red-500 font-bold">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Distance"
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
              {/* Part B */}
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Part B
                  </h3>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="ewaybillDetails.transMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Transporter Mode
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                styles={customStyles}
                                placeholder="Transporter Mode"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={transportationMode}
                                onChange={(selectedOption) => {
                                  field.onChange(
                                    selectedOption ? selectedOption.value : null
                                  );
                                }}
                                value={transportationMode?.find(
                                  (option) => option.value === field.value
                                )}
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
                        name="ewaybillDetails.vehicleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Vehicle Type
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Select
                                {...field}
                                styles={customStyles}
                                placeholder="Vehicle Type"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                components={{ DropdownIndicator }}
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={vehicleTypeOptions}
                                onChange={(selectedOption) => {
                                  field.onChange(
                                    selectedOption ? selectedOption.value : null
                                  );
                                }}
                                value={vehicleTypeOptions?.find(
                                  (option) => option.value === field.value
                                )}
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
                        name="ewaybillDetails.vehicleNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Vehicle No.
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Vehicle No."
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
                        name="ewaybillDetails.transporterDocNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Transport Doc
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Transport Doc"
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
                        name="ewaybillDetails.transporterDate"
                        render={() => (
                          <FormItem className="pl-[10px] w-full flex flex-col">
                            <FormLabel className={LableStyle}>
                              Transport Date
                              {isEwayBill && (
                                <span className="pl-1 text-red-500 font-bold">
                                  *
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  // className="border-0 border-b-2 border-black py-[10px] w-[450px] "
                                  className="border-0 border-b rounded-none shadow-none focus-visible:ring-0 border-neutral-700 w-[390px] hover:border-neutral-700"
                                  format="DD-MM-YYYY"
                                  onChange={(value: Dayjs | null) => {
                                    const formattedDate = value
                                      ? value.format("DD-MM-YYYY")
                                      : "";
                                    form.setValue(
                                      "ewaybillDetails.transporterDate",
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
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="rounded shadow bg-[#fff] mt-8">
              <CardHeader className="bg-[#e0f2f1] p-0 flex justify-between items-center px-[10px] py-[5px] w-full flex-row">
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Items Details: {rowData?.length} Items
                </h3>
                <h3 className="text-[17px] font-[600] text-slate-600">
                  Total Amount:  {totalSum}
                </h3>
              </CardHeader>

              <CardContent className="mt-[30px]">
                <div className="ag-theme-quartz h-[calc(100vh-140px)]">
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    suppressCellFocus={true}
                    paginationPageSize={10}
                    overlayNoRowsTemplate={OverlayNoRowsTemplate}
                    components={{
                      truncateCellRenderer: TruncateCellRenderer,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="h-[50px] flex items-center justify-center gap-[20px] px-[20px] pt-10">
              <Button
                className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] w-[148px] h-[50px] font-[600]"
                disabled={Object.keys(form.formState.errors).length > 0}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <ShowInvoiceModal
                open={showCreatedInvoiceModal}
                onClose={() => {
                  setShowCreatedInvoiceModal(false);
                  window.close();
                }}
                module={isEwayBill ? "E-WayBill" : "E-Invoice"}
                orderId={orderId}
              />
              <ConfirmationModal
                open={showConfirmation}
                onClose={()=>setShowConfirmation(false)}
                onOkay={() => handleConfirmationClose(true)}
                title="Confirm Submit!"
                description="Are you sure want to submit?"
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
