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
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Button } from "@/components/ui/button";
import {
  getComponentDetailsForServices,
  getProductDetailsForEdit,
  saveProductDetails,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
const EditProduct = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const typeOption = [
    {
      label: "FG",
      value: "fg",
    },
    {
      label: "Semi FG",
      value: "fg",
    },
  ];
  const isEnabled = [
    {
      label: "Yes",
      value: "Y",
    },
    {
      label: "No",
      value: "N",
    },
  ];
  const taxDetails = [
    {
      label: "Regualar",
      value: "Y",
    },
    {
      label: "Exempted",
      value: "N",
    },
  ];
  const gstoptions = [
    {
      label: "05",
      value: "05",
    },
    {
      label: "12",
      value: "12",
    },
    {
      label: "18",
      value: "18",
    },
    {
      label: "28",
      value: "28",
    },
  ];
  const fetchComponentDetails = async (sheetOpenEdit) => {
    const response = await execFun(
      () => getProductDetailsForEdit(sheetOpenEdit),
      "fetch"
    );
    console.log("response0", response);
    if (response.status == 200) {
      let { data } = response;
      let arr = data.data[0];
      let obj = {
        // serviceCode: arr.partcode,
        // serviceName: arr.name,
        // serviceCategory: arr.name,
        // description: arr.description,
        // sacCode: arr.sac,
        sku: arr.sku,
        productName: arr.productname,
        type: arr.producttype_name,
        category: arr.productcategory,
        mrp: arr.mrp,
        uom: arr.uomname,
        costPrice: arr.costprice,
        enabled: arr.enablestatus_name,
        description: arr.description,
        tax: arr.tax_type_name,
        gst: arr.gstrate_name,
        hsn: arr.hsncode,
        brand: arr.brand,
        ean: arr.ean,
        weight: arr.weight,
        vweight: arr.vweight,
        height: arr.height,
        width: arr.width,
        brand: arr.brand,
        minStock: arr.minrmstock,
        batch: arr.batchstock,
        stockLoc: arr.minstock,
        labourCost: arr.laboutcost,
        jwCost: arr.jobworkcost,
        packingCost: arr.packingcost,
        otherCost: arr.othercost,
        sku: arr.sku,
        // uom: { label: arr.uomname, value: arr.uomid },
      };
      form.setFieldsValue(obj);
    } else {
      toast({
        title: response.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const createEntry = async () => {
    const values = await form.validateFields();
    console.log("values", values);

    let payload = {
      producttKey: values.sku,
      p_name: values.productName,
      category: values.category,
      mrp: values.mrp,
      producttype: values.type,
      // isenabled: values,
      gsttype: values.tax,
      gstrate: values.gst,
      uom: values.uomname,
      // location: values,
      hsn: values.hsn,
      brand: values.brand,
      ean: values.ean,
      weight: values.weight,
      vweight: values.vweight,
      height: values.height,
      width: values.width,
      minstock: values.stockLoc,
      minstockrm: values.minStock,
      batchstock: values.batch,
      labourcost: values.labourCost,
      packingcost: values.packingCost,
      othercost: values.otherCost,
      jobworkcost: values.jwCost,
      description: values.description,
    };
    console.log("payload", payload);
    // return;
    const response = await execFun(() => saveProductDetails(payload), "fetch");
    if (response.status == "success") {
      toast({
        title: response.message,
        className: "bg-green-600 text-white items-center",
      });
      // fetchComponentMap();
    }
    toast({
      title: response.message.msg || "Failed to Create Product",
      className: "bg-red-600 text-white items-center",
    });
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
    <div className="h-[calc(100vh-100px)] ">
      {loading1("fetch") && <FullPageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit the form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => createEntry()}
              className="bg-[#0E7490] hover:bg-[#0E7490]"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={sheetOpenEdit} onOpenChange={setSheetOpenEdit}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[100%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Update Product</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-150px)]">
            {/* {data.loading && <FullPageLoading />} */}
            <Form form={form} layout="vertical">
              <form
                //   onSubmit={form.handleSubmit(onSubmit)}
                className=""
              >
                <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-150px)] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-[30px]">
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
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="sku" label="SKU">
                            <Input
                              className={InputStyle}
                              placeholder="Enter SKU"
                              // {...field}
                            />
                          </Form.Item>
                          {/* </div>
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] "> */}
                          <Form.Item name="productName" label="Product Name">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Product Name"
                              // {...field}
                            />
                          </Form.Item>
                        </div>{" "}
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="type" label="Product Type">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="UOM"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={typeOption}
                            />
                          </Form.Item>
                          {/* </div>
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] "> */}
                          <Form.Item name="category" label="Product Category">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Product Category"
                              // {...field}
                            />
                          </Form.Item>
                        </div>
                        <div className="grid grid-cols-3 gap-[40px] mt-[30px] ">
                          <Form.Item name="mrp" label="MRP">
                            <Input
                              className={InputStyle}
                              placeholder="Enter MRP"
                              // {...field}
                            />
                          </Form.Item>
                          {/* </div>
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] "> */}
                          <Form.Item name="uom" label="UOM">
                            <Input
                              className={InputStyle}
                              placeholder="Enter UOM"
                              // {...field}
                            />
                          </Form.Item>
                          {/* </div>
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] "> */}
                          <Form.Item name="costPrice" label="Cost Price ">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Cost Price "
                              // {...field}
                            />
                          </Form.Item>
                        </div>{" "}
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="enabled" label="Enabled">
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Enter enabled"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={isEnabled}
                            />
                          </Form.Item>
                          {/* </div> */}
                          {/* <div className="grid grid-cols-2 gap-[40px] mt-[30px] "> */}
                          <Form.Item
                            name="description"
                            label="Product Description"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Product Description"
                              // {...field}
                            />
                          </Form.Item>
                        </div>
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
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item
                            name="tax"
                            label="TAX TYPE 
"
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Enter TAX TYPE "
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={taxDetails}
                            />
                          </Form.Item>
                          <Form.Item
                            name="gst"
                            label="GST Tax Rate 
"
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Enter GST Tax Rate "
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={gstoptions}
                            />
                          </Form.Item>
                          <Form.Item
                            name="hsn"
                            label="HSN
"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter HSN 
"
                              // {...field}
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Advance Details :
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Type Name or Code of the Client */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="brand" label="Brand">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Brand"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="ean" label="EAN">
                            <Input
                              className={InputStyle}
                              placeholder="Enter EAN"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="weight" label="Weight (gms)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Weight (gms)"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item
                            name="vweight"
                            label="Volumetric Weight (gms)"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Volumetric Weight (gms)"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="height" label="Height (mm)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Height (mm)"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="width" label="Width (mm)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Width (mm)"
                              // {...field}
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Production Plan and Costing :
                        </h3>
                        <p className="text-slate-600 text-[13px]">
                          {/* Type Name or Code of the Client */}
                        </p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="brand" label="Min Stock (FG)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Min Stock (FG)"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="minStock" label="Min Stock (RM)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Min Stock (RM)"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="batch" label="Mfg Batch Size">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Mfg Batch Size"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item
                            name="stockLoc"
                            label="Default Stock Location"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Default Stock Location"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="labourCost" label="Labour Cost">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Labour Cost"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item
                            name="packingCost"
                            label="Sec Packing Cost"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Sec Packing Cost"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item name="jwCost" label="JW Cost">
                            <Input
                              className={InputStyle}
                              placeholder="Enter JW Cost"
                              // {...field}
                            />
                          </Form.Item>
                          <Form.Item
                            name="otherCost"
                            label="Default Other Cost"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Other Cost"
                              // {...field}
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                  <div className="grid grid-cols-4 gap-[20px]">
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
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        // options={type}
                        onChange={(e: any) => form.setValue("wise", e.value)}
                      />
                    </Form.Item>

                    <Form.Item name="serviceCategory" label="Service Category">
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
                        onChange={(e: any) => form.setValue("wise", e.value)}
                      />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                      <Input
                        className={InputStyle}
                        placeholder="Enter Component Description"
                      />
                    </Form.Item>
                  </div>{" "}
                  <div className="grid grid-cols-1 gap-[20px]">
                    <Typography.Title level={3}>Tax Details :</Typography.Title>
                  </div>
                  <div className="grid grid-cols-4 gap-[20px]">
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
                        onChange={(e: any) => form.setValue("wise", e.value)}
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
                        onChange={(e: any) => form.setValue("wise", e.value)}
                      />
                    </Form.Item>

                    <Form.Item label="SAC Code" name="sacCode">
                      <Input className={InputStyle} placeholder="Enter SAC" />
                    </Form.Item>
                  </div>
                </div> */}
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
                    // type="submit"
                    className="bg-cyan-700 hover:bg-cyan-600"
                    onClick={(e: any) => {
                      setOpen(true);
                      e.preventDefault();
                    }}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditProduct;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
