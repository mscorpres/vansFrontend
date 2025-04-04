import CustomTooltip from "@/components/shared/CustomTooltip";
import { Button } from "@/components/ui/button";
import { columnDefs } from "@/config/agGrid/mastermodule/BillingAddressTable";
import { Download, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { createBillingAddress } from "@/features/billingAddress/billingAdressSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import {
  InputStyle,
  LableStyle,
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import GoBackConfermationModel from "@/components/GoBackConfermationModel";
import { transformPlaceData } from "@/helper/transform";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { fetchBillingAddess } from "@/components/shared/Api/masterApi";
import { AgGridReact } from "ag-grid-react";
import useApi from "@/hooks/useApi";
import { RowData } from "@/data";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const schema = z.object({
  label: z.string().min(2, {
    message: "Label is required",
  }),
  company: z.string().min(2, {
    message: "Company is required",
  }),
  pan: z.string().min(2, {
    message: "Pan is required",
  }),
  state: z.string().min(2, {
    message: "State is required",
  }),
  gstin: z.string().min(2, {
    message: "GST is required",
  }),
  address: z.string().min(2, {
    message: "Address is required",
  }),
  addressLine1: z.string().min(2, {
    message: "Address is required",
  }),
  addressLine2: z.string().min(2, {
    message: "Address is required",
  }),
  cin: z.string().min(2, {
    message: "Cin no is required",
  }),
});

const MasterBillingAddressPage: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [stateList, setStateList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { execFun, loading: loading1 } = useApi();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      company: "",
      pan: "",
      state: "",
      gstin: "",
      address: "",
      addressLine1: "",
      addressLine2: "",
      cin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(
        createBillingAddress({
          endpoint: "/billingAddress/saveBillingAddress",
          payload: {
            label: values.label,
            company: values.company,
            pan: values.pan,
            state: values.state ?? values.state.value,
            gstin: values.gstin,
            address:
              values.address +
              " " +
              values.addressLine1 +
              " " +
              values.addressLine2,
            cin: values.cin,
          },
        })
      ).unwrap();

      if (resultAction?.success) {
        toast({
          title: "Billing Address created successfully",
          className: "bg-green-600 text-white items-center",
        });
        setLoading(false);
        form.reset({
          label: "",
          company: "",
          pan: "",
          state: "",
          gstin: "",
          address: "",
          addressLine1: "",
          addressLine2: "",
          cin: "",
        });
        setSheetOpen(false);
        getList();
      } else {
        toast({
          title: resultAction.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    setLoading(false);
  };
  const getList = async () => {
    const response = await execFun(() => fetchBillingAddess(), "fetch");

    let { data } = response;

    if (data.success) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-center text-white",
      });
    }
  };
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Master Billing Address");
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <GoBackConfermationModel
        open={open}
        setOpen={setOpen}
        goBack={setSheetOpen}
      />
      <div className="h-[calc(100vh-150px)]">
        <div className="h-[50px] flex items-center justify-end px-[10px] bg-white gap-[10px]">
          {" "}
          <CustomTooltip
            message="Download Excel Report"
            side="top"
            className="bg-cyan-700"
          >
            <Button
              className="bg-cyan-700 hover:bg-cyan-600 p-0 h-[30px] w-[30px] flex justify-center items-center shadow-slate-500"
              onClick={handleDownloadExcel}
            >
              <Download className="h-[20px] w-[20px]" />
            </Button>
          </CustomTooltip>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <div className="flex gap-[10px]">
                <CustomTooltip
                  message="Add Address"
                  side="top"
                  className="bg-cyan-700"
                >
                  <Button
                    onClick={() => setSheetOpen(true)}
                    className="bg-cyan-700 hover:bg-cyan-600 p-0 h-[30px] w-[30px] flex justify-center items-center shadow-slate-500"
                  >
                    <Plus className="h-[20px] w-[20px]" />
                  </Button>
                </CustomTooltip>{" "}
                {/* <Button
                  // type="submit"
                  className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
                  // onClick={() => {}}
                  onClick={(e: any) => {
                    e.preventDefault();
                    handleDownloadExcel();
                  }}
                  // disabled={rowData.length == 0}
                >
                  <IoMdDownload size={20} />
                </Button> */}
              </div>
            </SheetTrigger>
            <SheetContent
              className="min-w-[50%] p-0"
              onInteractOutside={(e: any) => {
                e.preventDefault();
              }}
            >
              <SheetHeader className={modelFixHeaderStyle}>
                <SheetTitle className="text-slate-600">
                  Add Billing Address
                </SheetTitle>
              </SheetHeader>
              <div>
                {loading === true && <FullPageLoading />}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 "
                  >
                    <div className=" h-[calc(100vh-100px)] overflow-y-auto p-[20px] space-y-8 ">
                      <div className="grid grid-cols-2 gap-[25px]">
                        <FormField
                          control={form.control}
                          name="label"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Label
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Enter Label"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
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
                        />

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
                                  placeholder="Enter Pan Number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gstin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                GST No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Enter GST Number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Cin No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Enter CIN Number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                State
                              </FormLabel>
                              <FormControl>
                                <ReusableAsyncSelect
                                  placeholder="State"
                                  endpoint="/others/states"
                                  transform={transformPlaceData}
                                  fetchOptionWith="query"
                                  onChange={(e: any) =>
                                    form.setValue("state", e.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Enter Address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="addressLine1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={LableStyle}>
                                Address Line 1
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className={InputStyle}
                                  placeholder="Enter Address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Address Line 2
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className={InputStyle}
                                placeholder="Enter Address "
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                        className="bg-cyan-700 hover:bg-cyan-600"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </SheetContent>
          </Sheet>
        </div>{" "}
        <div className="ag-theme-quartz h-[calc(100vh-150px)] bg-white p-4">
          {" "}
          {loading1("fetch") && <FullPageLoading />}
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
        </div>
      </div>
    </>
  );
};

export default MasterBillingAddressPage;
