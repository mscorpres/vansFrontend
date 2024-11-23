import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
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
import {
  addClient,
  fetchCountryList,
  fetchState,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface OptionType {
  value: string;
  label: string;
}
interface Props {
  setTab: Dispatch<SetStateAction<string>>;
  setPayloadData: Dispatch<SetStateAction<any>>;
}
const FormSchema = z.object({
  name: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "Name is required.",
  }),
  salesPerson: z
    .string()
    .refine((data) => data !== undefined && data.length > 0, {
      message: "Salesperson is required.",
    }),
  address: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "Address is required.",
  }),
  mobile: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "Mobile number is required.",
  }),
  phone: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "Phone number is required.",
  }),
  gst: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "GST number is required.",
  }),
  city: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "City is required.",
  }),
  zip: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "Zip code is required.",
  }),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .refine((data) => data !== undefined && data.length > 0, {
      message: "Email is required.",
    }),
  website: z
    .string()
    // .url({ message: "Please enter a valid website URL" })
    .refine((data) => data !== undefined && data.length > 0, {
      message: "Website is required.",
    }),
  country: z
    .union([z.string(), z.number()])
    .refine((data) => data !== undefined && data !== "", {
      message: "Country is required.",
    })
    .transform((val) => String(val)),
  state: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "State is required.",
  }),
  pan: z.string().refine((data) => data !== undefined && data.length > 0, {
    message: "PAN number is required.",
  }),
});
const AddClient: React.FC<Props> = ({
  setTabvalue,
  setTab,
  setPayloadData,
}: any) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
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
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchBillingAddress({ billing_code: "R26331LI" }));
    // dispatch(fetchBillingAddressList({ search: "" }));
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
  const getCountryList = async () => {
    // return;
    const response = await execFun(() => fetchCountryList(), "fetch");
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          label: r.name,
          value: r.code,
        };
      });
      setCountryList(arr);
    }
  };
  const getStateList = async () => {
    // return;
    const response = await execFun(() => fetchState(), "fetch");
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          label: r.name,
          value: r.code,
        };
      });
      setStateList(arr);
    }
  };
  const onSubmit = async (data: CreateSalesOrderForm) => {
    console.log("Submitted Data from CreateSalesOrder:", data); // Debugging log
    let payload = {
      name: data.name,
      gst: data.gst,
      salesperson: data.salesPerson,
      panno: data.pan,
      address: data.address,
      country: data.country,
      state: data.state,
      state2: data.state,
      city: data.city,
      zipcode: data.gst,
      phone: data.phone,
      mobile: data.mobile,
      email: data.email,
      website: data.website,
    };
    const response = await execFun(() => addClient(payload), "fetch");
    console.log("response", response);
    if (response?.data?.code == 200) {
      toast({
        title: response?.data?.message?.msg,
        className: "bg-green-600 text-white items-center",
      });
      form.setValue("name", "");
      form.setValue("gst", "");
      form.setValue("salesPerson", "");
      form.setValue("address", "");
      form.setValue("country", "");
      form.setValue("state", "");
      form.setValue("city", "");
      form.setValue("zip", "");
      form.setValue("phone", "");
      form.setValue("mobile", "");
      form.setValue("email", "");
      form.setValue("pan", "");
      form.setValue("website", "");
      navigate("/master/customer");
    } else {
      toast({
        title: response?.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    getCountryList();
    getStateList();
  }, []);

  return (
    <div className="h-[calc(100vh-250px)]">
      {loading1("fetch") && <FullPageLoading />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {loading1("1") && <FullPageLoading />}
          <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-150px)] overflow-y-auto">
            <div className="grid grid-cols-1 gap-[30px]">
              <Card className="rounded shadow bg-[#fff]">
                <CardHeader className=" bg-[#e0f2f1]  flex justify-center px-[10px] ">
                  <h3 className="text-[17px] font-[600] text-slate-600">
                    Client Details
                  </h3>
                  <p className="text-slate-600 text-[13px]">
                    {/* Type Name or Code of the Client */}
                  </p>
                </CardHeader>
                <CardContent className="mt-[30px]">
                  <div className="grid grid-cols-4 gap-[40px] mt-[30px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Your Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Name"
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
                        name="gst"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>GST</FormLabel>
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
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="salesPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Sales Person
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Sales Person"
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
                        name="pan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>PAN</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter PAN Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>{" "}
                  {/* <div className="grid grid-cols-4 gap-[40px] mt-[30px]"> */}
                  <div className="mt-[40px]">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={LableStyle}>
                            Enter Address
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className={InputStyle}
                              placeholder="Enter Address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <p>error message</p> */}
                  </div>
                  {/* </div> */}
                  <div className="grid grid-cols-4 gap-[40px] mt-[30px]">
                    <div>
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Country
                            </FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="Country"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={countryList}
                                onChange={(value: any) =>
                                  form.setValue("country", value.value)
                                }
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
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>State</FormLabel>
                            <FormControl>
                              <Select
                                styles={customStyles}
                                components={{ DropdownIndicator }}
                                placeholder="state"
                                className="border-0 basic-single"
                                classNamePrefix="select border-0"
                                isDisabled={false}
                                isClearable={true}
                                isSearchable={true}
                                options={stateList}
                                onChange={(value: any) =>
                                  form.setValue("state", value.value)
                                }
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>City</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter City"
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
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>ZIP</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className={InputStyle}
                                placeholder="Enter ZIP Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-[40px] mt-[30px]">
                    <div className="mt-[40px]">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className={InputStyle}
                                placeholder="Enter Phone Number"
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
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Mobile</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className={InputStyle}
                                placeholder="Enter Mobile Number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      {/* <p>error message</p> */}
                    </div>
                    <div className="mt-[40px]">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>Email</FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Email ID"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />{" "}
                      {/* <p>error message</p> */}
                    </div>
                    <div className="mt-[40px]">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={LableStyle}>
                              Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={InputStyle}
                                placeholder="Enter Website"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <p>error message</p> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="h-[50px] w-full flex justify-end items-center px-[20px] bg-white shadow-md border-t border-slate-300">
            <Button
              // onClick={() => setTab("add")}
              className={`${primartButtonStyle} flex gap-[10px]`}
              type="submit"
            >
              Submit
              {/* <FaArrowRightLong className="" /> */}
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
export default AddClient;
