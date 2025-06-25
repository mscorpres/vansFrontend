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
import {
  DatePickerStyle,
  InputStyle,
  LableStyle,
} from "@/constants/themeContants";
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
import { fetchCountryListByCode } from "@/components/shared/Api/masterApi";
import { Checkbox } from "@/components/ui/checkbox";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";

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

  const [isExportInvoice, setIsExportInvoice] = useState(false);
const [isLoadingCountries, setIsLoadingCountries] = useState(false);
const [countryOptions, setCountryOptions] = useState([]);
const [countryLabel, setCountryLabel] = useState<string | null>(null);

const fetchCountries = async (inputValue: string) => {
  setIsLoadingCountries(true);
  try {
    console.log("Fetching countries with search:", inputValue); // Debug API call
    const response = await fetchCountryListByCode(inputValue);
    console.log("Country API response:", response); // Debug response
    // Ensure response.data is an array
    const countries = Array.isArray(response.data)
      ? response.data.map((country: any) => ({
          value: country.code,
          label: country.name,
        }))
      : [];
    console.log("Mapped countries:", countries); // Debug mapped data
    setIsLoadingCountries(false);
    return countries;
  } catch (error: any) {
    console.error("Failed to fetch countries:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    toast({
      title: "Failed to load country list",
      description: error.message || "Please try again later.",
      className: "bg-red-600 text-white items-center",
    });
    setIsLoadingCountries(false);
    return [];
  }
};


  useEffect(() => {
    const shipId = (params?.id as string).replace(/_/g, "/");
    const action = isEwayBill ? fetchDataForEwayBill : fetchDataForInvoice;
    dispatch(action({ shipment_id: shipId })).then((res: any) => {
      if (res.payload?.success) {
        var data = res.payload?.data;
        form.setValue("ewaybillDetails.transDistance", data?.transporterDetails?.transDistance || "0");
        console.log("data", data);
        setTotalSum(data?.total_amount);
        form.setValue("header.documentNo", data?.documentNo);
        form.setValue("header.documentType", data?.documentType);
        form.setValue("header.documentDate", dayjs().format("DD-MM-YYYY"));
        form.setValue("header.dispatch_doc_no", data?.dispatchDocNo);
        form.setValue("header.dispatch_through", data?.dispatchThrough);
        form.setValue("header.transactionType", data?.transactionType);
        form.setValue("header.delivery_note", data?.deliveryNote);
        //in repsoen the delivery date comign is yyyy-mm-dd i want to dd-mm-yyyy here
        form.setValue("header.delivery_date", dayjs(data?.deliveryDate).format("DD-MM-YYYY"));
        form.setValue("header.supplyType", data?.supplyType || data?.supplyTypeEW);
        // form.setValue("header.subSupplyType", data?.subSupplyType);
        form.setValue("billFrom.location", data?.billFromLocation);
        form.setValue("billTo.location", data?.billToLocation);
        form.setValue("shipTo.location", data?.shipToLocation);
        form.setValue("dispatchFrom.location", data?.dispatchFromLocation);
        
      
        
        
        setOrderId(data?.documentNo);
        // form.setValue(
        //   "header.documentDate",
        //   data?.documentDetail?.documentDate
        // );
        form.setValue("billFrom.legalName", data?.bill_from?.legalName);
        form.setValue("billFrom.state", data?.bill_from?.state?.state_code);
        // form.setValue("billFrom.location", data?.bill_from?.location);
        form.setValue("billFrom.gstin", data?.bill_from?.gstin);
        form.setValue("billFrom.pincode", data?.bill_from?.pincode);
        form.setValue("billFrom.pan", data?.bill_from?.pan);
        form.setValue("billFrom.addressLine1", data?.bill_from?.address1);
        form.setValue("billFrom.addressLine2", data?.bill_from?.address2);

        form.setValue("billTo.legalName", data?.bill_to?.client);
        form.setValue("billTo.state", data?.bill_to?.state?.state_code);
        // form.setValue("billTo.location", data?.bill_to?.location);
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
        // form.setValue("dispatchFrom.location", data?.ship_from?.location);
        form.setValue("dispatchFrom.pincode", data?.ship_from?.pincode);

        form.setValue("shipTo.legalName", data?.ship_to?.company);
        form.setValue("shipTo.pincode", data?.ship_to?.pincode);
        form.setValue("shipTo.pan", data?.ship_to?.panno);
        form.setValue("shipTo.gstin", data?.ship_to?.gst);
        form.setValue("shipTo.state", data?.ship_to?.state?.state_code);
        form.setValue("shipTo.addressLine1", data?.ship_to?.address1);
        form.setValue("shipTo.addressLine2", data?.ship_to?.address2);

//part b
        form.setValue("ewaybillDetails.transMode", data?.transporterMode || "");
      form.setValue("ewaybillDetails.vehicleType", data?.vehicleType || "");
      form.setValue("ewaybillDetails.vehicleNo", data?.vehicleNo || "");
      form.setValue("ewaybillDetails.transporterDocNo", data?.transportDoc || "");
      // Set Transport Date to Current Date
      form.setValue("ewaybillDetails.transporterDate", dayjs().format("DD-MM-YYYY"));
      
      }
    });
  }, [params]);

  useEffect(() => {
    setRowData(ewayBillData);
  }, [ewayBillData]);

const onSubmit = (payload: any) => {
  const modifiedPayload = {
    ...payload,
    ...(isExportInvoice && payload.expDtls?.CntCode
      ? { expDtls: { CntCode: payload.expDtls.CntCode } }
      : {}),
  };
  console.log("modifiedPayload", modifiedPayload);
  if (isEwayBill) {
    dispatch(createEwayBill(modifiedPayload)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast({
          title: "Data Fetched Successfully",
          className: "bg-green-600 text-white items-center",
        });
        setShowCreatedInvoiceModal(true);
      }
    });
  } else {
    dispatch(generateEInvoice(modifiedPayload)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast({
          title: "Created Successfully",
          className: "bg-green-600 text-white items-center",
        });
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
                                className={DatePickerStyle}
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


                  <div className="flex items-center space-x-2">
  <FormField
    control={form.control}
    name="isExportInvoice"
    render={({ field }) => (
      <FormItem className="flex items-center space-x-2">
        <FormControl>
          <Checkbox
            checked={isExportInvoice}
            onCheckedChange={(checked) => {
              setIsExportInvoice(checked);
              field.onChange(checked);
              if (!checked) {
                form.setValue("expDtls.CntCode", "");
              }
            }}
          />
        </FormControl>
        <FormLabel className={LableStyle}>
          Is this an export invoice?
        </FormLabel>
      </FormItem>
    )}
  />
</div>
{isExportInvoice && (
  <div>
    <FormField
      control={form.control}
      name="expDtls.CntCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={LableStyle}>
            Country
            <span className="pl-1 text-red-500 font-bold">*</span>
          </FormLabel>
          <FormControl>
            <ReusableAsyncSelect
              endpoint="/backend/countrieswithcode"
              fetchOptionWith="search"
              placeholder="Country"
              transform={(data: { code: string; name: string }[]) =>
                data.map((item) => ({
                  value: item.code,
                  label: item.name,
                }))
              }
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption.value : "");
                console.log("Selected country:", selectedOption); // Debug selection
              }}
              value={
                field.value
                  ? {
                      value: field.value,
                      label:
                        (form.getValues("expDtls.CntCode") &&
                          countryOptions.find(
                            (opt) => opt.value === field.value
                          )?.label) ||
                        field.value,
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
)}
                  {/* <FormField
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
                  /> */}
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
                  
                    <div className="">
                      <FormField
                        control={form.control}
                        name="dispatchFrom.location"
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
                      />  </div>
                      <div className="">
                      <FormField
                        control={form.control}
                        name="dispatchFrom.pincode"
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
                   
                    <div className="">
                      <FormField
                        control={form.control}
                        name="shipTo.location"
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
                      /> </div>
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
                    Dispatch Details
                  </h3>
                </CardHeader>
                <CardContent className="mt-[10px]">
                  <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                    {!isEwayBill && (
                      <div className="">
                        <FormField
                          control={form.control}
                          name="header.dispatch_doc_no"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Dispatch Doc No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder=" Dispatch Doc No"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {!isEwayBill && (
                      <div className="">
                        <FormField
                          control={form.control}
                          name="header.dispatch_through"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Dispatch Through
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Dispatch Through"
                                  {...field}
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
                    {!isEwayBill && (
                      <div className="">
                        <FormField
                          control={form.control}
                          name="header.delivery_note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Delivery Note
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Dilever Note"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {!isEwayBill && (
                      <div>
                      <FormField
                        control={form.control}
                        name="header.delivery_date"
                        render={({ field }) => (
                          <FormItem className="pl-[10px] w-full flex flex-col">
                            <FormLabel className={LableStyle}>Delivery Date</FormLabel>
                            <FormControl>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  className={DatePickerStyle}
                                  format="DD-MM-YYYY"
                                  value={field.value ? dayjs(field.value, "DD-MM-YYYY") : null}
                                  onChange={(value: Dayjs | null) => {
                                    const formattedDate = value ? value.format("DD-MM-YYYY") : "";
                                    form.setValue("header.delivery_date", formattedDate, {
                                      shouldValidate: true,
                                    });
                                  }}
                                />
                              </Space>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    )}
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
              <span className="pl-1 text-red-500 font-bold">*</span>
            )}
          </FormLabel>
          <FormControl>
            <Space direction="vertical" size={12}>
              <DatePicker
                className={DatePickerStyle}
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
                value={
                  form.getValues("ewaybillDetails.transporterDate")
                    ? dayjs(
                        form.getValues("ewaybillDetails.transporterDate"),
                        "DD-MM-YYYY"
                      )
                    : dayjs() // Default to current date
                }
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
                  Total Amount: {totalSum}
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
                // disabled={Object.keys(form.formState.errors).length > 0}
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
                onClose={() => setShowConfirmation(false)}
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
