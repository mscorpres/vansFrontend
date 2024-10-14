import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Form, Typography } from "antd";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Button } from "@/components/ui/button";
import { getComponentDetailsForServices } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
const EditService = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const fetchComponentDetails = async (sheetOpenEdit) => {
    const response = await execFun(
      () => getComponentDetailsForServices(sheetOpenEdit),
      "fetch"
    );
    console.log("response0", response);
    if (response.status == 200) {
      let { data } = response;
      let arr = data.data[0];
      let obj = {
        serviceCode: arr.partcode,
        serviceName: arr.name,
        serviceCategory: arr.name,
        description: arr.description,
        sacCode: arr.sac,
        uom: { label: arr.uomname, value: arr.uomid },
      };
      console.log("obj", obj);

      form.setFieldsValue(obj);
    } else {
      toast({
        title: response.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  console.log("sheeet", sheetOpenEdit);
  const saveEdit = async () => {
    const values = await form.validateFields();
    console.log("values", values);
    return;
    const response = await execFun(() => servicesaddition(values), "update");
    if (response.status == 200) {
      setSheetOpenEdit(false);
    }
  };
  useEffect(() => {
    if (sheetOpenEdit) {
      fetchComponentDetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]">
      {loading1("fetch") && <FullPageLoading />}
      <Sheet open={sheetOpenEdit} onOpenChange={setSheetOpenEdit}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[80%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Update Services</SheetTitle>
          </SheetHeader>
          <div>
            <Form form={form} layout="vertical">
              <form
                //   onSubmit={form.handleSubmit(onSubmit)}
                className=""
              >
                <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="grid grid-cols-1 gap-[30px]">
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Basic Details :
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Type Name or Code of the Client */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        {" "}
                        <div className="grid grid-cols-3 gap-[20px]">
                          <Form.Item name="serviceCode" label="Service Code">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Service Code"
                            />
                          </Form.Item>
                          <Form.Item name="serviceName" label="Service Name">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Service Name"
                            />
                          </Form.Item>
                          <Form.Item name="uom" label="UOM">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Select UOM"
                              className="border-0 basic-single "
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              // options={type}
                              onChange={(e: any) =>
                                form.setValue("wise", e.value)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name="serviceCategory"
                            label="Service Category"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Service Category"
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-full"
                            name="enabled"
                            label="Enabled"
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Select Enabled"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              // options={type}
                              onChange={(e: any) =>
                                form.setValue("wise", e.value)
                              }
                            />
                          </Form.Item>
                          <Form.Item name="description" label="Description">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Component Description"
                            />
                          </Form.Item>
                        </div>{" "}
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Tax Details :
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Type Name or Code of the Client */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        {" "}
                        <div className="grid grid-cols-3 gap-[20px]">
                          <Form.Item label="Tax Type" name="taxType">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Select Tax Type"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              // options={type}
                              onChange={(e: any) =>
                                form.setValue("wise", e.value)
                              }
                            />
                          </Form.Item>

                          <Form.Item label="GST Tax Rate" name="gstTaxRate">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Select GST Tax Rate"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              // options={type}
                              onChange={(e: any) =>
                                form.setValue("wise", e.value)
                              }
                            />
                          </Form.Item>

                          <Form.Item label="SAC Code" name="sacCode">
                            <Input
                              className={InputStyle}
                              placeholder="Enter SAC"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-4 gap-[20px]"></div>
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
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default EditService;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
