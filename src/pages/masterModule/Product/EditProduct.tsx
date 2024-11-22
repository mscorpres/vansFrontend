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
import { Form } from "antd";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Button } from "@/components/ui/button";
import {
  fetchImageProduct,
  getProductDetailsForEdit,
  saveProductDetails,
  updateProductMaterial,
  uploadProductImg,
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
import { useDispatch, useSelector } from "react-redux";
import { listOfUoms } from "@/features/client/clientSlice";
import { gstRateList } from "@/components/shared/Options";
import { IoCloudUpload } from "react-icons/io5";
import { AppDispatch, RootState } from "@/store";
import { spigenAxios } from "@/axiosIntercepter";
import { AgGridReact } from "ag-grid-react";
import { Download } from "lucide-react";
const EditProduct = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<File[] | null>(null);
  const [docList, setDocList] = useState([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const { execFun, loading: loading1 } = useApi();
  const dispatch = useDispatch<AppDispatch>();
  const [captions, setCaptions] = useState("");
  const { uomlist } = useSelector((state: RootState) => state.client);
  const typeOption = [
    {
      label: "FG",
      value: "default",
    },
    {
      label: "Semi FG",
      value: "semi",
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
      value: "REG",
    },
    {
      label: "Exempted",
      value: "EXE",
    },
  ];
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  const fetchComponentDetails = async (sheetOpenEdit: any) => {
    const response = await execFun(
      () => getProductDetailsForEdit(sheetOpenEdit),
      "fetch"
    );
    if (response.status == 200) {
      let { data } = response;
      let arr: any = data.data[0];
      let obj = {
        // serviceCode: arr.partcode,
        // serviceName: arr.name,
        // serviceCategory: arr.name,
        // description: arr.description,
        // sacCode: arr.sac,
        sku: arr.sku,
        pKey: arr.pKey,
        productName: arr.productname,
        type: arr.producttype_name,
        category: arr.productcategory,
        mrp: arr.mrp,
        uom: { label: arr.uomname, value: arr.uomid },
        costPrice: arr.costprice,
        enabled: arr.enablestatus_name,
        description: arr.description,
        // tax: arr.tax_type_name,
        tax: {
          value: arr.tax_type_name.id,
          label: arr.tax_type_name?.text,
        },
        type: {
          value: arr.producttype_name.id,
          label: arr.producttype_name?.text,
        },
        gst: {
          value: arr.gstrate_name.id,
          label: arr.gstrate_name?.text,
        },
        hsn: arr.hsncode,
        brand: arr.brand,
        ean: arr.ean,
        weight: arr.weight,
        vweight: arr.vweight,
        height: arr.height,
        width: arr.width,
        // brand: arr.brand,
        minStock: arr.minrmstock,
        batch: arr.batchstock,
        stockLoc: arr.minstock,
        labourCost: arr.laboutcost,
        jwCost: arr.jobworkcost,

        packingCost: arr.packingcost,
        otherCost: arr.othercost,
        // sku: arr.sku,
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

    let payload = {
      producttKey: values.sku,
      p_name: values.productName,
      category: values.category,
      mrp: values.mrp,
      producttype: values.type.value ?? values.type,
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

  useEffect(() => {
    if (sheetOpenEdit) {
      fetchComponentDetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);
  const callUom = async () => {
    let a;
    if (asyncOptions.length == 0) {
      a = await dispatch(listOfUoms());
    }

    let arr = a.payload.map((r: any, index: any) => {
      return {
        label: r.units_name,
        value: r.units_id,
      };
    });
    setAsyncOptions(arr);
  };
  const uploadDocs = async () => {
    const formData = new FormData();

    formData.append("caption", captions);
    formData.append("product", sheetOpenEdit);
    files.map((comp) => {
      formData.append("files", comp);
    });

    const response = await execFun(() => uploadProductImg(formData), "fetch");
    if (response.data.code == 200) {
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      setFiles([]);
      setCaptions("");
      // setLoading(false);
      setSheetOpen(false);
      setAttachmentFile(response.data.data);
    }
    // setLoading(false);
  };
  const submitTheForm = async () => {
    const values = form.getFieldsValue();

    let hehe = {
      p_name: values.productName,
      productKey: sheetOpenEdit,
      category: values.category,
      producttype: values.type.value ?? values.type,
      mrp: values.mrp,
      // producttype: values.type.value,
      isenabled: values.enabled.value,
      gsttype: values.tax.value,
      gstrate: values.gst.value,
      uom: values.uom.value ?? values.uom,
      location: "--",
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

    // return;
    const response = await execFun(() => updateProductMaterial(hehe), "fetch");

    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-600 text-white items-center",
      });
      setSheetOpenEdit(false);
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    if (uomlist) {
      callUom();
    }
  }, [uomlist]);
  const getUploadedDoc = async (sheetOpen) => {
    let payload = {
      product: sheetOpenEdit,
    };
    const response = await execFun(() => fetchImageProduct(payload), "fetch");
    console.log("response", response);

    if (response.data.code == 200) {
      // toast
      let arr = response.data.data.map((r: any) => {
        return {
          ...r,
        };
      });
      setDocList(arr);
      toast({
        title: "Docs fetched successfully",
        className: "bg-green-600 text-white items-center",
      });
    } else {
      toast({
        title: response.data.message.msg,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    if (sheetOpen == true) {
      getUploadedDoc(sheetOpen);
    }
  }, [sheetOpen]);
  const columnDefsDoc: ColDef<rowData>[] = [
    {
      headerName: "Id",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "Uploaded By",
      field: "uploaded_by",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Uploaded Date",
      field: "uploaded_date",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      field: "action",
      headerName: "",
      width: 50,
      cellRenderer: (params) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className=" rounded-full bg-white  hover:bg-white-600 h-[25px] w-[25px] flex justify-center items-center p-0"> */}
            {/* <Trash2
              className="h-[15px] w-[15px] text-red-500 hover:text-red-700"
              onClick={() => deleteSelected(params)}
            /> */}
            <a href={params?.data?.image_url} target="_blank">
              <Download className="h-[15px] w-[15px] text-blue-500 hover:text-blue-700" />
            </a>
            {/* </Button> */}
          </div>
        );
      },
    },
  ];
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
              onClick={() => submitTheForm()}
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
          className="min-w-[85%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Update Product</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-150px)]">
            {loading1("fetch") && <FullPageLoading />}
            <Form form={form} layout="vertical">
              <form
                //   onSubmit={form.handleSubmit(onSubmit)}
                className=""
              >
                <div className="rounded p-[30px] shadow bg-[#fff] max-h-[calc(100vh-100px)] overflow-y-auto">
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
                              placeholder="Product Type"
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
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Enter UOM"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              isDisabled={false}
                              isClearable={true}
                              isSearchable={true}
                              options={asyncOptions}
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
                          <Form.Item
                            name="enabled"
                            label="Enabled"
                            rules={[
                              {
                                required: true,
                                message: "Please enter enabled status!",
                              },
                            ]}
                          >
                            <Select
                              styles={customStyles}
                              components={{ DropdownIndicator }}
                              placeholder="Enter Enabled"
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
                              options={gstRateList}
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
                            />
                          </Form.Item>
                          <Form.Item name="ean" label="EAN">
                            <Input
                              className={InputStyle}
                              placeholder="Enter EAN"
                            />
                          </Form.Item>
                          <Form.Item name="weight" label="Weight (gms)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Weight (gms)"
                            />
                          </Form.Item>
                          <Form.Item
                            name="vweight"
                            label="Volumetric Weight (gms)"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Volumetric Weight (gms)"
                            />
                          </Form.Item>
                          <Form.Item name="height" label="Height (mm)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Height (mm)"
                            />
                          </Form.Item>
                          <Form.Item name="width" label="Width (mm)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Width (mm)"
                            />
                          </Form.Item>{" "}
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
                              onClick={(e) => {
                                e.preventDefault(e);
                                setSheetOpen(true);
                              }}
                              // disabled={!selectedFile}
                            >
                              Attach Image
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="rounded shadow bg-[#fff]">
                      <CardHeader className=" bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
                        <h3 className="text-[17px] font-[600] text-slate-600">
                          Production Plan and Costing :
                        </h3>
                        <p className="text-slate-600 text-[13px]"></p>
                      </CardHeader>
                      <CardContent className="mt-[30px]">
                        <div className="grid grid-cols-2 gap-[40px] mt-[30px] ">
                          <Form.Item name="brand" label="Min Stock (FG)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Min Stock (FG)"
                            />
                          </Form.Item>
                          <Form.Item name="minStock" label="Min Stock (RM)">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Min Stock (RM)"
                            />
                          </Form.Item>
                          <Form.Item name="batch" label="Mfg Batch Size">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Mfg Batch Size"
                            />
                          </Form.Item>
                          <Form.Item
                            name="stockLoc"
                            label="Default Stock Location"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Default Stock Location"
                            />
                          </Form.Item>
                          <Form.Item name="labourCost" label="Labour Cost">
                            <Input
                              className={InputStyle}
                              placeholder="Enter Labour Cost"
                            />
                          </Form.Item>
                          <Form.Item
                            name="packingCost"
                            label="Sec Packing Cost"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Sec Packing Cost"
                            />
                          </Form.Item>
                          <Form.Item name="jwCost" label="JW Cost">
                            <Input
                              className={InputStyle}
                              placeholder="Enter JW Cost"
                            />
                          </Form.Item>
                          <Form.Item
                            name="otherCost"
                            label="Default Other Cost"
                          >
                            <Input
                              className={InputStyle}
                              placeholder="Enter Other Cost"
                            />
                          </Form.Item>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className={modelFixFooterStyle}>
                  <Button
                    variant={"outline"}
                    className="shadow-slate-300 mr-[10px] border-slate-400 border"
                    onClick={(e) => {
                      e.preventDefault();
                      setSheetOpenEdit(false);
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
      </Sheet>{" "}
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[55%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {/* {loading == true && <FullPageLoading />} */}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {loading1("fetch") && <FullPageLoading />}
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
            </div>{" "}
            <div className="ag-theme-quartz h-[calc(100vh-400px)] mt-5">
              <AgGridReact
                //   loadingCellRenderer={loadingCellRenderer}
                rowData={docList}
                columnDefs={columnDefsDoc}
                defaultColDef={{ filter: true, sortable: true }}
                pagination={true}
                paginationPageSize={10}
                paginationAutoPageSize={true}
                suppressCellFocus={true}
              />
            </div>
          </div>{" "}
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              // onClick={() => setTab("create")}
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
