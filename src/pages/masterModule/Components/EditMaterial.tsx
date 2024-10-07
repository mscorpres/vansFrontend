import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form, Typography } from "antd";

import {
  getdetailsOfUpdateComponent,
  updateComponentofMaterial,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import styled from "styled-components";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import Select from "react-select";

import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Input } from "@/components/ui/input";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FullPageLoading from "@/components/shared/FullPageLoading";
const EditMaterial = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const { execFun, loading: loading1 } = useApi();
  const [editForm] = Form.useForm();
  const getDetails = async (sheetOpenEdit) => {
    let payload = { componentKey: sheetOpenEdit.component_key };
    const response = await execFun(
      () => getdetailsOfUpdateComponent(payload),
      "fetch"
    );
    console.log("response", response);
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data[0];
      console.log("arr", arr);
      let a = {
        compCode: arr.partcode,
        componentName: arr.name,
        uom: { label: arr.uomname, value: arr.uomid },
        soq: { label: arr.soqname, value: arr.soqid },

        moqQty: arr.moqqty,
        hsn: arr.hsncode,
        componentMake: arr.c_make,
        mrp: arr.mrp,
        jobWork: arr.jobwork_rate,
        qcStatus: arr.qc_status,
        description: arr.description,
        group: { label: arr.groupname, value: arr.groupid },
        brand: arr.brand,
        ean: arr.ean,
        weight: arr.weight,
        volWeight: arr.vweight,
        height: arr.height,
        width: arr.width,
        minStock: arr.minqty,
        MaxStock: arr.maxqty,
        MinOrder: arr.minorderqty,
        // StockLoc: arr.minorderqty,
        // MinOrder: arr.minorderqty,
        LeadTime: arr.leadtime,
        purchaseCost: arr.pocost,
        OtherCost: arr.othercost,
      };
      console.log("a", a);

      editForm.setFieldsValue(a);
    }
  };
  const submitTheForm = async () => {
    const values = editForm.getFieldsValue();
    console.log("values", values);

    let payload = {
      componentKey: values.compCode,
      componentname: values.componentName,
      uom: values.uom.value,
      //   soq: values.soq.value,
      soqqty: values.componentName,
      moqqty: values.moqQty,
      //   category: values.moqQty,
      mrn: values.mrp,
      group: values.group.value,
      enable_status: "N",
      jobwork_rate: values.jobWork,
      qc_status: values.qcStatus,
      description: values.description,
      comp_make: values.componentMake,
      taxtype: values.taxType,
      //   taxrate: values.componentMake,
      brand: values.brand,
      ean: values.ean,
      weightgms: values.weight,
      vweightgms: values.volWeight,
      height: values.height,
      width: values.width,
      minqty: values.minStock,
      maxqty: values.MaxStock,
      minorder: values.MinOrder,
      leadtime: values.LeadTime,
      //   alert: values.taxType,
      pocost: values.purchaseCost,
      othercost: values.OtherCost,
    };
    return;
    const response = await execFun(updateComponentofMaterial(values), "fetch");
  };
  useEffect(() => {
    if (sheetOpenEdit) {
      getDetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr]">
      {loading1("fetch") && <FullPageLoading />}
      <Sheet open={sheetOpenEdit} onOpenChange={setSheetOpenEdit}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[100%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Update Component</SheetTitle>
          </SheetHeader>
          <div>
            <Form form={editForm} layout="vertical">
              <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                <div className="grid grid-cols-4 gap-[20px]">
                  {" "}
                  <Form.Item name="compCode" label="Component Code">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="componentName" label="Component Name">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="uom" label="uom">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>
                  <Form.Item name="soq" label="SOQ">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="soqQty" label="SOQ Qty">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="moqQty" label="MOQ">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="componentMake" label="Component Make">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="hsn" label="HSN">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="mrp" label="MRP">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>
                  <Form.Item name="group" label="Group">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="enabled" label="Enabled">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="jobWork" label="Job Work">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="qcStatus" label="QC Status">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="description" label="Description">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                </div>
                <Typography.Title level={4}>Tax Details</Typography.Title>
                <div className="grid grid-cols-4 gap-[20px]">
                  {" "}
                  <Form.Item name="taxType" label="Tax Type">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="gstTaxRate" label="GST Tax Rate">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                </div>
                <Typography.Title level={4}>Advance Details :</Typography.Title>
                <div className="grid grid-cols-4 gap-[20px]">
                  {" "}
                  <Form.Item name="brand" label="Brand">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="ean" label="EAN">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="weight" label="Weight (gms)">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="volWeight" label="Volumetric Weight (gms)">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="height" label="Height (mm)">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="width" label="Width (mm)">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                </div>
                <Typography.Title level={4}>Production Plan :</Typography.Title>
                <div className="grid grid-cols-4 gap-[20px]">
                  {" "}
                  <Form.Item name="minStock" label="Min Stock">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="MaxStock" label="Max Stock">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="MinOrder" label="Min Order">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="StockLoc" label="Default Stock Location">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="LeadTime" label="Lead Time ( in days)">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="alert" label="Enable Alerts">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      //   placeholder="UOM"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={asyncOptions}
                      //   onChange={(e) => console.log(e)}
                      //   value={
                      //     data.clientDetails
                      //       ? {
                      //           label: data.clientDetails.city.name,
                      //           value: data.clientDetails.city.name,
                      //         }
                      //       : null
                      //   }
                    />
                  </Form.Item>{" "}
                  <Form.Item name="purchaseCost" label="Purchase Cost">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                  <Form.Item name="OtherCost" label="Other Cost">
                    <Input
                      placeholder="Enter Component Code"
                      className={InputStyle}
                    />
                  </Form.Item>{" "}
                </div>
              </div>{" "}
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
                  onClick={submitTheForm}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default EditMaterial;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
