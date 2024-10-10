import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import { clientFormSchema } from "@/schema/masterModule/customerSchema";
import ReusableTable from "@/components/shared/ReusableTable";
import columnDefs from "@/config/agGrid/mastermodule/CustomerTable";
import { transformCustomerTableData } from "@/helper/TableTransformation";
import ClientActionCellRender from "@/config/agGrid/mastermodule/ClientActionCellRender";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { AppDispatch } from "@/store";
import { createClient } from "@/features/client/clientSlice";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import {
  addbranchToClient,
  getListOFViewCustomers,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { EyeIcon } from "lucide-react";
import Select from "react-select";
import { BsGearFill } from "react-icons/bs";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Form } from "antd";
import FullPageLoading from "@/components/shared/FullPageLoading";
import CreateBom from "./Bom/CreateBom";

const MasterCustomerPage: React.FC = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [addBranch, setAddBranch] = useState(false);
  const [viewBranch, setViewBranch] = useState(false);
  const [sheetOpenEdit, setSheetOpenEdit] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const { execFun, loading: loading1 } = useApi();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const onSubmit = async (values: z.infer<typeof clientFormSchema>) => {
    try {
      const resultAction = await dispatch(
        createClient({
          endpoint: "/client/add",
          payload: {
            clientName: values.clientName,
            panNo: values.panNo,
            mobileNo: values.mobileNo,
            email: values.email || "",
            website: values.website || "",
            salesPersonName: values.salesPersonName || "",
          },
        })
      ).unwrap();

      if (resultAction.message) {
        toast({
          title: "Client created successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: resultAction.message || "Failed to Create Product",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const components = useMemo(
    () => ({
      actionsCellRenderer: ClientActionCellRender,
      statusCellRenderer: (params: any) => {
        return <Badge className="bg-green-600">{params.data.status}</Badge>;
      },
    }),
    []
  );
  const columnDefs: ColDef<rowData>[] = [
    {
      field: "action",
      headerName: "",
      flex: 1,
      width: 950,
      cellRenderer: (params) => {
        return (
          <div className="flex items-center justify-center h-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-cyan-600 hover:text-white">
                {" "}
                <Button className="rounded h-[25px] w-[25px] flex justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600">
                  <BsGearFill className="h-[15px] w-[15px] text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="hover:bg-cyan-600 hover:text-white "
                  onClick={() => setAddBranch(params.data.name)}
                >
                  Add Branch
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-cyan-600 hover:text-white"
                  onClick={() => setViewBranch(params)}
                >
                  View Branch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Client Code",
      field: "code",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Client Name",
      field: "name",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "City",
      field: "city",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Mobile",
      field: "mobile",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "GSTIN",
      field: "gst",
      filter: "agTextColumnFilter",
      flex: 1,
    },
  ];
  console.log("addbranch", addBranch);

  const fetchList = async (formData: z.infer<typeof FormSchema>) => {
    // return;
    const response = await execFun(() => getListOFViewCustomers(), "fetch");
    console.log("response", response);
    // return;
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };
  const createNewBranch = async () => {
    console.log("paylo");

    const response = await execFun(() => addbranchToClient(), "fetch");
  };
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Wrapper>
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <Sheet open={addBranch} onOpenChange={setAddBranch}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[100%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">{`Add New Branch to ${addBranch}`}</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-150px)]">
              <Form form={form} layout="vertical">
                {" "}
                <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                  <Card className="rounded shadow bg-[#fff]">
                    <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Bill To Information
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        Please provide Bill To address info
                      </p>
                    </CardHeader>
                    <CardContent className="mt-[30px]">
                      <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                        <Form.Item name="label" label="Label">
                          <Input
                            className={InputStyle}
                            placeholder="Enter Label"
                          />
                        </Form.Item>
                        <Form.Item name="country" label="Country">
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            placeholder="Branch"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={countryList}
                            onChange={(value: any) =>
                              form.setValue("country", value)
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
                        </Form.Item>
                        <Form.Item name="State" label="State">
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            placeholder="Branch"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={countryList}
                            onChange={(value: any) =>
                              form.setValue("country", value)
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
                        </Form.Item>
                        <Form.Item name="pincode" label="Pincode">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Pincode"
                          />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone Number">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Phone Number"
                          />
                        </Form.Item>
                        <Form.Item name="gst" label="GST Number">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter GST Number"
                          />
                        </Form.Item>
                        <Form.Item name="" label="Address Line 1">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Address Line 1"
                          />
                        </Form.Item>
                        <Form.Item name="address2" label="Address Line 2">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Address Line 2"
                          />
                        </Form.Item>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="rounded shadow bg-[#fff]">
                    <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Ship To Information
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        Please provide Ship To address info
                      </p>
                    </CardHeader>
                    <CardContent className="mt-[30px]">
                      <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                        <Form.Item name="shipLabel" label="Label">
                          <Input
                            className={InputStyle}
                            placeholder="Enter Label"
                          />
                        </Form.Item>
                        <Form.Item name="labelCountry" label="Country">
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            placeholder="Branch"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={countryList}
                            onChange={(value: any) =>
                              form.setValue("country", value)
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
                        </Form.Item>
                        <Form.Item name="shipState" label="State">
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            placeholder="Branch"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={countryList}
                            onChange={(value: any) =>
                              form.setValue("shipState", value)
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
                        </Form.Item>
                        <Form.Item name="shipPincode" label="Pincode">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Pincode"
                          />
                        </Form.Item>
                        <Form.Item name="shipPhone" label="Phone Number">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Phone Number"
                          />
                        </Form.Item>
                        <Form.Item name="shipGst" label="GST Number">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter GST Number"
                          />
                        </Form.Item>
                        <Form.Item name="shipAddress1" label="Address Line 1">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Address Line 1"
                          />
                        </Form.Item>
                        <Form.Item name="shipAddress2" label="Address Line 2">
                          {" "}
                          <Input
                            className={InputStyle}
                            placeholder="Enter Address Line 2"
                          />
                        </Form.Item>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Form>
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
                  onClick={() => createNewBranch()}
                >
                  Update
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
        />
      </div>
    </Wrapper>
  );
};

export default MasterCustomerPage;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
