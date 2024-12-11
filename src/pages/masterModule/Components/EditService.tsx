import React, { useEffect, useState } from "react";
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
import {
  getComponentDetailsForServices,
  listOfUom,
  saveEditedService,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { MuiDrawer } from "@/components/ui/MuiDrawer";
import MuiInput from "@/components/ui/MuiInput";
import MuiSelect from "@/components/ui/MuiSelect";
const EditService = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [asyncOptions, setAsyncOptions] = useState([]);
  const gstType = [
    {
      value: "I",
      label: "INTER STATE",
    },
    {
      value: "L",
      label: "INTRA STATE",
    },
  ];
  const gstRateList = [
    {
      value: "0",
      label: "0 %",
    },
    {
      value: "5",
      label: "5 %",
    },
    {
      value: "12",
      label: "12 %",
    },
    {
      value: "18",
      label: "18 %",
    },
    {
      value: "28",
      label: "28 %",
    },
  ];
  const isEnabledOptions = [
    {
      label: "Yes",
      value: "Y",
    },
    {
      label: "No",
      value: "N",
    },
  ];

  const fetchComponentDetails = async (sheetOpenEdit) => {
    const response = await execFun(
      () => getComponentDetailsForServices(sheetOpenEdit),
      "fetch"
    );
    let { data } = response;
    if (response.data.success) {
      let arr = data.data[0];
      let obj = {
        serviceCode: arr.partcode,
        serviceName: arr.name,
        serviceCategory: arr.name,
        description: arr.description,
        gstTaxRate: arr.gst_rate,
        taxType:
          arr.tax_type == "I"
            ? {
                value: "I",
                label: "INTER STATE",
              }
            : {
                value: "L",
                label: "INTRA STATE",
              },
        enabled: arr.enable_status,
        sacCode: arr.sac,
        uom: { label: arr.uomname, value: arr.uomid },
      };

      form.setFieldsValue(obj);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (response?.status == 200) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setAsyncOptions(arr);
    } else {
      toast({
        title: "Failed to fetch UOM",
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const saveEdit = async () => {
    const values = await form.validateFields();
    let payload = {
      componentKey: sheetOpenEdit,
      uom: values.uom.value,
      category: values.serviceCategory,
      enable_status: values.enabled.value,
      description: values.description,
      taxtype: values.taxType.value,
      gstrate: values.gstTaxRate.value,
      sac: values.sacCode,
    };
    // return;/
    const response = await execFun(() => saveEditedService(payload), "fetch");

    let { data } = response;

    if (response.data.success) {
      toast({
        title: data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenEdit(false);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    if (sheetOpenEdit) {
      listUom();
      fetchComponentDetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr]">
      {loading1("fetch") && <FullPageLoading />}
      <MuiDrawer
        open={sheetOpenEdit}
        setOpen={setSheetOpenEdit}
        title={`Update Services:  ${form.getFieldValue("serviceName")}`}
        content={
          <Form form={form} layout="vertical">
            <form
              //   onSubmit={form.handleSubmit(onSubmit)}
              className=""
            >
              {loading1("fetch") && <FullPageLoading />}
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <div className="grid grid-cols-1 gap-[30px]">
                  <Card className="rounded shadow bg-[#fff]">
                    <div className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Basic Details :
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        {/* Type Name or Code of the Client */}
                      </p>
                    </div>
                    <CardContent className="mt-[30px]">
                      <div className="grid grid-cols-3 gap-[20px]">
                        <Form.Item name="serviceCode">
                          <MuiInput
                            form={form}
                            name="serviceCode"
                            label="Service Code"
                            placeholder="Enter Service Code"
                          />
                        </Form.Item>
                        <Form.Item name="serviceName">
                          <MuiInput
                            form={form}
                            name="serviceName"
                            label="Service Name"
                            placeholder="Enter Service Name"
                          />
                        </Form.Item>
                        <Form.Item name="uom">
                          <MuiSelect
                            options={asyncOptions}
                            label={"UOM"}
                            name="uom"
                            form={form}
                          />
                        </Form.Item>
                        <Form.Item name="serviceCategory">
                          <MuiInput
                            form={form}
                            name="serviceCategory"
                            label="Service Category"
                            placeholder="Enter Service Category"
                          />
                        </Form.Item>
                        <Form.Item
                          className="w-full"
                          name="enabled"
                          rules={[
                            {
                              required: true,
                              message: "Please enter Enabled!",
                            },
                          ]}
                        >
                          <MuiSelect
                            options={isEnabledOptions}
                            label={"Enabled"}
                            name="enabled"
                            form={form}
                          />
                        </Form.Item>
                        <Form.Item name="description">
                          <MuiInput
                            form={form}
                            name="description"
                            label="Description"
                            placeholder="Enter Component Description"
                          />
                        </Form.Item>
                      </div>{" "}
                    </CardContent>
                  </Card>
                  <Card className="rounded shadow bg-[#fff]">
                    <div className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Tax Details :
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        {/* Type Name or Code of the Client */}
                      </p>
                    </div>
                    <CardContent className="mt-[30px]">
                      {" "}
                      <div className="grid grid-cols-3 gap-[20px]">
                        <Form.Item name="taxType">
                          <MuiSelect
                            options={gstType}
                            label={"Tax Type"}
                            name="taxType"
                            form={form}
                          />
                        </Form.Item>

                        <Form.Item
                          name="gstTaxRate"
                          rules={[
                            {
                              required: true,
                              message: "Please enter GST Tax Rate!",
                            },
                          ]}
                        >
                          <MuiSelect
                            options={gstRateList}
                            label={"GST Tax Rate"}
                            name="gstTaxRate"
                            form={form}
                          />
                        </Form.Item>

                        <Form.Item name="sacCode">
                          <MuiInput
                            form={form}
                            name="sacCode"
                            label="SAC Code"
                            placeholder="Enter SAC Code"
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
                  variant="outlined"
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpenEdit(false);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  style={{ margin: "10px" }}
                  variant="contained"
                  // type="submit"
                  // className="bg-cyan-700 hover:bg-cyan-600"
                  onClick={(e: any) => {
                    saveEdit();
                    e.preventDefault();
                  }}
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        }
      />
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
