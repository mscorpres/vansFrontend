import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Form, Switch } from "antd";

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
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";
import { Button } from "@/components/ui/button";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { gstRateList, taxType } from "@/components/shared/Options";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";
import { IoCloudUpload } from "react-icons/io5";
const EditMaterial = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const { execFun, loading: loading1 } = useApi();
  const [editForm] = Form.useForm();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [captions, setCaptions] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isEnabledOptions = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];

  const getDetails = async (sheetOpenEdit: any) => {
    let payload = { componentKey: sheetOpenEdit.component_key };
    const response = await execFun(
      () => getdetailsOfUpdateComponent(payload),
      "fetch"
    );
    let { data } = response;
    if (response.status === 200) {
      let arr = data.data[0];
      let a = {
        compCode: arr.partcode,
        componentName: arr.name,
        uom: { label: arr.uomname, value: arr.uomid },
        soq: { label: arr.soqname, value: arr.soqid },
        taxTypes: { label: arr.tax_type.text, value: arr.tax_type.id },
        gstTaxRate: { label: arr.gst_rate.text, value: arr.gst_rate.id },
        alert: arr.enable_status == "Y" ? "Yes" : "No",
        // enabled: arr.enable_status == "Y" ? "Yes" : "No",
        moqQty: arr.moqqty,
        hsn: arr.hsncode,
        componentMake: arr.c_make,
        mrp: arr.mrp,
        jobWork: arr.jobwork_rate,
        qcStatus: arr.qc_status == "E" ? "Yes" : "No",
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

      editForm.setFieldsValue(a);
    }
  };
  const submitTheForm = async () => {
    const values = editForm.getFieldsValue();
    // if (values) {
    let payload = {
      componentKey: sheetOpenEdit?.component_key,
      componentname: values.componentName,
      uom: values.uom.value,
      soq: values.soq.value,
      soqqty: values.soqQty,
      moqqty: values.moqQty,
      hsn: values.hsn,
      //   category: values.moqQty,
      mrn: values.mrp,
      group: values.group.value,
      enable_status: values.enabled.value,
      jobwork_rate: values.jobWork,
      qc_status: values.qcStatus ? "E" : "D",
      description: values.description,
      comp_make: values.componentMake,
      taxtype: values.taxTypes.value,
      taxrate: values.gstTaxRate.value,
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
      alert: values.alert,
      pocost: values.purchaseCost,
      othercost: values.OtherCost,
      //doubtfull param
      //   alert: values.taxType,category: values.moqQty,
    };
    // }

    // return;
    // return;
    setLoading(true);
    const response = await spigenAxios.post(
      "/component/updateComponent",
      payload
    );

    if (response.data.code == 200) {
      toast({
        title: response.data.message, // Assuming 'message' is in the response
        className: "bg-green-700 text-center text-white",
      });
      editForm.resetFields();
      setLoading(false);
      setSheetOpenEdit(false);
    } else {
      toast({
        title: "Failed to update component", // You can show an error message here if the code is not 200
        className: "bg-red-700 text-center text-white",
      });
    }
    setLoading(false);
  };

  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  const uploadDocs = async () => {
    // setLoading(true);
    // const values = await editForm.validateFields();
    // console.log("valeus", values);
    // return;
    const formData = new FormData();
    formData.append("caption", captions);
    formData.append("component", sheetOpenEdit?.component_key);
    files.map((comp) => {
      formData.append("files", comp);
    });
    const response = await spigenAxios.post(
      "/component/upload_comp_img",
      formData
    );
    if (response.data.code == 200) {
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      // setLoading(false);
      setSheetOpen(false);
      // setAttachmentFile(response.data.data);
    }
    // setLoading(false);
  };
  useEffect(() => {
    if (sheetOpenEdit) {
      getDetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[550px_1fr] overflow-hidden">
      {(loading1("fetch") || loading == true) && <FullPageLoading />}{" "}
      <Sheet
        open={sheetOpenEdit}
        onOpenChange={() => setSheetOpenEdit(setSheetOpenEdit)}
      >
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[80%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">{`Update Component:${sheetOpenEdit?.c_name}`}</SheetTitle>
          </SheetHeader>
          <Form form={editForm} layout="vertical">
            <div>
              {" "}
              {/* <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto"> */}
              <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-100px)] overflow-y-auto">
                {" "}
                {(loading1("fetch") || loading == true) && (
                  <FullPageLoading />
                )}{" "}
                <div className="grid grid-cols-2 gap-[30px]">
                  <Card className="rounded shadow bg-[#fff]">
                    <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Basic Details
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        {/* Type Name or Code of the Client */}
                      </p>
                    </CardHeader>
                    <CardContent className="mt-[30px]">
                      {" "}
                      <Form.Item
                        name="componentName"
                        label="Component Name"
                        rules={rules.componentName}
                      >
                        <Input
                          placeholder="Enter Component Code"
                          className={InputStyle}
                        />
                      </Form.Item>
                      <div className="grid grid-cols-2 gap-[20px]">
                        <Form.Item
                          name="compCode"
                          label="Component Code"
                          rules={rules.compCode}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item name="uom" label="uom" rules={rules.uom}>
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                          />
                        </Form.Item>
                        <Form.Item name="soq" label="SOQ" rules={rules.suom}>
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
                        {/* <Form.Item name="soqQty" label="SOQ Qty">
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item> */}
                        <Form.Item name="moqQty" label="MOQ" rules={rules.moq}>
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>
                        <Form.Item
                          name="componentMake"
                          label="Component Make"
                          rules={rules.maker}
                        >
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>
                        <Form.Item name="hsn" label="HSN " rules={rules.hsn}>
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>
                        <Form.Item name="mrp" label="MRP" rules={rules.mrp}>
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>
                        <Form.Item
                          name="group"
                          label="Group"
                          rules={rules.group}
                        >
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
                        <Form.Item
                          name="enabled"
                          label="Enabled"
                          rules={rules.enabled}
                        >
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            //   placeholder="UOM"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={isEnabledOptions}
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
                        <Form.Item
                          name="jobWork"
                          label="Job Work"
                          rules={rules.jobWork}
                        >
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
                            options={isEnabledOptions}
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
                        <Form.Item
                          name="description"
                          label="Description"
                          rules={rules.description}
                        >
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        {/* <Form.Item name="" label="Available Qty">
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "} */}
                        <Form.Item
                          name="customer"
                          label="Customer"
                          rules={rules.customer}
                        >
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="customercode"
                          label="Customer PART"
                          rules={rules.customercode}
                        >
                          <Input
                            // placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                      </div>
                      <Form.Item
                        name="custDes"
                        label="Customer. Desc."
                        rules={rules.custDes}
                      >
                        <Input
                          // placeholder="Enter Component Code"
                          className={InputStyle}
                        />
                      </Form.Item>{" "}
                    </CardContent>
                  </Card>
                  <Card className="rounded shadow bg-[#fff]">
                    <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Tax Details
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        {/* Type Name or Code of the Client */}
                      </p>
                    </CardHeader>
                    <CardContent className="mt-[30px]">
                      <div className="grid grid-cols-2 gap-[20px]">
                        <Form.Item
                          name="taxTypes"
                          label="Tax Type"
                          rules={rules.taxTypes}
                        >
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            //   placeholder="UOM"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={taxType}
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
                        <Form.Item
                          name="gstTaxRate"
                          label="GST Tax Rate"
                          rules={rules.gstTaxRate}
                        >
                          <Select
                            styles={customStyles}
                            components={{ DropdownIndicator }}
                            //   placeholder="UOM"
                            className="border-0 basic-single"
                            classNamePrefix="select border-0"
                            isDisabled={false}
                            isClearable={true}
                            isSearchable={true}
                            options={gstRateList}
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
                      <div className="grid grid-cols-2 gap-[20px]">
                        {" "}
                        <Form.Item
                          name="brand"
                          label="Brand"
                          rules={rules.brand}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item name="ean" label="EAN" rules={rules.ean}>
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="weight"
                          label="Weight (gms)"
                          rules={rules.weight}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="volWeight"
                          label="Volumetric Weight (gms)"
                          rules={rules.volWeight}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="height"
                          label="Height (mm)"
                          rules={rules.height}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="width"
                          label="Width (mm)"
                          rules={rules.width}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        {/* <Label htmlFor="picture">Picture</Label>
                        <Input
                          id="picture"
                          type="file"
                          accept="image/*" // Only allow image files
                          onChange={handleFileChange}
                        /> */}
                        {/* {preview && (
                            <img
                              src={preview}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                marginTop: "10px",
                              }}
                            />
                          )} */}
                        <Button
                          onClick={() => setSheetOpen(true)}
                          // disabled={!selectedFile}
                        >
                          Attach Image
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="rounded shadow bg-[#fff]">
                    <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                      <h3 className="text-[17px] font-[600] text-slate-600">
                        Production Plan :
                      </h3>
                      <p className="text-slate-600 text-[13px]">
                        {/* Type Name or Code of the Client */}
                      </p>
                    </CardHeader>
                    <CardContent className="mt-[30px]">
                      <div className="grid grid-cols-2 gap-[20px]">
                        {" "}
                        <Form.Item
                          name="minStock"
                          label="Min Stock"
                          rules={rules.minStock}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="MaxStock"
                          label="Max Stock"
                          rules={rules.maxStock}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="MinOrder"
                          label="Min Order"
                          rules={rules.minOrder}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        {/* <Form.Item
                          name="StockLoc"
                          label="Default Stock Location"
                        >
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
                        </Form.Item>{" "} */}
                        <Form.Item
                          name="LeadTime"
                          label="Lead Time ( in days)"
                          rules={rules.LeadTime}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="purchaseCost"
                          label="Purchase Cost"
                          rules={rules.purchaseCost}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                        <Form.Item
                          name="OtherCost"
                          label="Other Cost"
                          rules={rules.otherCost}
                        >
                          <Input
                            placeholder="Enter Component Code"
                            className={InputStyle}
                          />
                        </Form.Item>{" "}
                      </div>{" "}
                      <Form.Item
                        name="alert"
                        label="Enable Alerts"
                        // rules={rules.alert}
                      >
                        <Switch
                        // style={{
                        //   backgroundColor: "#E0f",
                        //   borderColor: "#4CAF50",
                        // }} // Custom color
                        />
                      </Form.Item>{" "}
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className={modelFixFooterStyle}>
                <Button
                  variant={"outline"}
                  className="shadow-slate-300 mr-[10px] border-slate-400 border"
                  onClick={(e: any) => {
                    setSheetOpenEdit(null);
                    e.preventDefault();
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-600"
                  onClick={submitTheForm}
                  // disabled={editForm.validateFields()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        </SheetContent>
      </Sheet>
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[35%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {/* {loading == true && <FullPageLoading />} */}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {/* {loading && <FullPageLoading />} */}
            <FileUploader
              value={files}
              onValueChange={handleFileChange}
              dropzoneOptions={{
                accept: {
                  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
                },
                maxFiles: 1,
                maxSize: 4 * 1024 * 1024, // 4 MB
                multiple: true,
              }}
            >
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg h-[120px] p-[20px] m-[20px]">
                <h2 className="text-xl font-semibold text-center mb-4">
                  <div className=" text-center w-full justify-center flex">
                    {" "}
                    <div>Upload Your Files</div>
                    <div>
                      {" "}
                      <IoCloudUpload
                        className="text-cyan-700 ml-5 h-[20]"
                        size={"1.5rem"}
                      />
                    </div>
                  </div>
                </h2>
                <FileInput>
                  <span className="text-slate-500 text-sm text-center w-full justify-center flex">
                    Drag and drop files here, or click to select files
                  </span>
                </FileInput>{" "}
              </div>{" "}
              <div className=" m-[20px]">
                <FileUploaderContent>
                  {files?.map((file, index) => (
                    <FileUploaderItem key={index} index={index}>
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </div>
            </FileUploader>{" "}
            <div className="w-full flex justify-center">
              <div className="w-[80%] flex justify-center">
                <Input
                  placeholder="Enter Image Captions"
                  className={InputStyle}
                  onChange={(e) => setCaptions(e.target.value)}
                />
              </div>
            </div>
          </div>{" "}
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setSheetOpen(false)}
            >
              Back
            </Button>{" "}
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={uploadDocs}
              // loading={laoding}
            >
              {/* {isApprove ? "Approve" : "Submit"} */}
              Upload
            </Button>
          </div>{" "}
        </SheetContent>
      </Sheet>{" "}
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
const rules = {
  compCode: [
    {
      required: true,
      message: "Please provide Part Code",
    },
  ],
  uom: [
    {
      required: true,
      message: "Please provide UOM !",
    },
  ],
  suom: [
    {
      required: true,
      message: "Please provide S UOM!",
    },
  ],
  componentName: [
    {
      required: true,
      message: "Please provide Component Name!",
    },
  ],
  moq: [
    {
      required: true,
      message: "Please provide MOQ Qty!",
    },
  ],
  group: [
    {
      required: true,
      message: "Please provide a Group!",
    },
  ],
  type: [
    {
      required: true,
      message: "Please provide a Type!",
    },
  ],
  smt: [
    {
      required: true,
      message: "Please provide SMT!",
    },
  ],
  specifiction: [
    {
      required: true,
      message: "Please provide  Specifiction!",
    },
  ],
  maker: [
    {
      required: true,
      message: "Please provide Maker!",
    },
  ],
  hsn: [
    {
      required: true,
      message: "Please provide hsn!",
    },
  ],
  mrp: [
    {
      required: true,
      message: "Please provide mrp!",
    },
  ],
  enabled: [
    {
      required: true,
      message: "Please provide enabled!",
    },
  ],
  jobWork: [
    {
      required: true,
      message: "Please provide jobWork!",
    },
  ],
  qcStatus: [
    {
      required: true,
      message: "Please provide qcStatus!",
    },
  ],
  description: [
    {
      required: true,
      message: "Please provide description!",
    },
  ],
  customer: [
    {
      required: true,
      message: "Please provide customer!",
    },
  ],
  customercode: [
    {
      required: true,
      message: "Please provide customer code!",
    },
  ],
  custDes: [
    {
      required: true,
      message: "Please provide Description!",
    },
  ],
  taxTypes: [
    {
      required: true,
      message: "Please provide Tax Types!",
    },
  ],
  gstTaxRate: [
    {
      required: true,
      message: "Please provide GST Tax Types!",
    },
  ],

  brand: [
    {
      required: true,
      message: "Please provide brand!",
    },
  ],
  ean: [
    {
      required: true,
      message: "Please provide ean!",
    },
  ],
  weight: [
    {
      required: true,
      message: "Please provide weight!",
    },
  ],
  volWeight: [
    {
      required: true,
      message: "Please provide V.weight!",
    },
  ],
  height: [
    {
      required: true,
      message: "Please provide height!",
    },
  ],
  width: [
    {
      required: true,
      message: "Please provide width!",
    },
  ],
  minStock: [
    {
      required: true,
      message: "Please provide min Stock!",
    },
  ],
  maxStock: [
    {
      required: true,
      message: "Please provide max Stock!",
    },
  ],
  minOrder: [
    {
      required: true,
      message: "Please provide min Stock!",
    },
  ],
  LeadTime: [
    {
      required: true,
      message: "Please provide Lead Time!",
    },
  ],
  purchaseCost: [
    {
      required: true,
      message: "Please provide purchase Cost!",
    },
  ],
  otherCost: [
    {
      required: true,
      message: "Please provide OtherCost!",
    },
  ],
  alert: [
    {
      required: true,
      message: "Please provide alert!",
    },
  ],
};
