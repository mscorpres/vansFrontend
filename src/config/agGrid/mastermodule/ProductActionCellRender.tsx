import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Edit2, Eye, Image, Upload } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Select from "react-select";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { Textarea } from "@/components/ui/textarea";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchImageProduct, getProductForUpdate, updateProduct, uploadProductImages } from "@/features/product/productSlice";
import { useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useToast } from "@/components/ui/use-toast";

const productSchema = z.object({
  product_name: z.string().optional(),
  uom: z.string().optional(),
  productcategory: z.string().optional(),
  category: z.string().optional(),
  mrp: z.string().optional(),
  producttype: z.string().optional(),
  isenabled: z.string().optional(),
  description: z.string().optional(),
  gsttype: z.string().optional(),
  gstrate: z.string().optional(),
  
  hsn: z.string().optional(),
  brand: z.string().optional(),
  ean: z.string().optional(),
  weight: z.string().optional(),
  vweight: z.string().optional(),
  height: z.string().optional(),
  width: z.string().optional(),
  minstockrm: z.string().optional(),
  minstock: z.string().optional(),
  mfgBatchSize: z.string().optional(),
  location: z.string().optional(),
  labourcost: z.string().optional(),
  packingcost: z.string().optional(),
  jobworkcost: z.string().optional(),
  othercost: z.string().optional(),
  batchstock:z.string().optional(),
  caption:z.string().optional(),
 
});

const ProductActionCellRender = (params: any) => {
  const { productKey } = params.params.data;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
 
  const { toast } = useToast();
  const dispatch = useDispatch();

  const productData = useSelector(
    (state: RootState) =>
      state.prod.data.find((prod: any) => prod?.pKey === productKey) || {}
  );


  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      caption: "",
      
    },
  });


  useEffect(() => {
    if (productData) {
      form.reset({
        // pKey: productData.pKey,
        // sku: productData.sku,
        product_name: productData.productname,
        uom: productData.uomname,
        // uomid: productData.uomid,
        category: productData.productcategory,
        mrp: productData.mrp,
        producttype: productData.producttype_name,
        // costprice: productData.costprice,
        isenabled: productData.enablestatus_name,
        gsttype: productData.tax_type_name,
        gstrate: productData.gstrate_name,
        hsn: productData.hsncode,
        brand: productData.brand,
        ean: productData.ean,
        weight: productData.weight,
        vweight: productData.vweight,
        height: productData.height,
        width: productData.width,
        // url: productData.url,
        // loc: productData.loc,
        labourcost: productData.laboutcost,
        packingcost: productData.packingcost,
        othercost: productData.othercost,
        jobworkcost: productData.jobworkcost,
        minstock: productData.minstock,
        minstockrm: productData.minrmstock,
        batchstock: productData.batchstock,
        location: productData.loc,
        description: productData.description,
        
        
      
        

        // description: productData.description,
      });
    }
  }, [productData,form]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      // Generate preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const uploadImages = async () => {
    if (selectedFiles.length > 0) {
      const uploadPayload = {
        files: selectedFiles,
        product: productKey,
        caption: form.getValues('caption') || '',
      };

      try {
        const uploadAction = await dispatch(uploadProductImages(uploadPayload) as any);

        if (uploadProductImages.fulfilled.match(uploadAction)) {
          toast({
            title: "Images uploaded successfully",
            className: "bg-green-600 text-white items-center",
          });
        } else if (uploadProductImages.rejected.match(uploadAction)) {
          toast({
            title: (uploadAction.payload as { message: string })?.message || "Failed to upload images",
            className: "bg-red-600 text-white items-center",
          });
        }
      } catch (error) {
        toast({
          title: "An unexpected error occurred",
          className: "bg-red-600 text-white items-center",
        });
      }
    } else {
      toast({
        title: "No images selected",
        className: "bg-yellow-600 text-white items-center",
      });
    }
  };

  async function onSubmit(value: any) {
    const payload = {
      ...value,
      
      producttKey: productKey,
      status: value.active ? "active" : "inactive",
    };
  
    try {
      const action= await dispatch(updateProduct({ endpoint: `/products/updateProduct`, payload }) as any);
  
      if (updateProduct.fulfilled.match(action)) {
      
        toast({
          title: "Product updated successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else if (updateProduct.rejected.match(action)) {
       
        toast({
          title: (action.payload as { message: string })?.message || "Failed to update product",
          className: "bg-red-600 text-white items-center",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      toast({
        title: "An unexpected error occurred",
        className: "bg-red-600 text-white items-center",
      });
    }
  
    console.log(value);
  }
  
  return (
    <div className="flex items-center gap-[10px]">
      <Sheet>
        <SheetTrigger>
          <Edit2
            onClick={() => {
              if (productKey) {
                dispatch(
                  getProductForUpdate({ product_key: productKey }) as any
                );
              }
            }}
            className="text-cyan-700 h-[20px] w-[20px]"
          />
        </SheetTrigger>
        <SheetContent className="min-w-[60%] p-0">
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle>Updating: Oakmist 5 Ltr {productKey}</SheetTitle>
          </SheetHeader>
          <div className=" h-[calc(100vh-50px)]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="px-[10px] h-[calc(100vh-100px)] py-[20px] overflow-y-auto flex flex-col gap-[20px]">
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Basic Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="product_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Product name
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Product Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="uom"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Umo Name
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={true}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Good", value: "good" },
                                    { label: "Service", value: "service" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("uom", value!.value)
                                  }
                                  defaultValue={{
                                    label: "Good",
                                    value: "good",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="productcategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                productCategory
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Product category" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Category
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={true}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Good", value: "good" },
                                    { label: "Service", value: "service" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("category", value!.value)
                                  }
                                  defaultValue={{
                                    label: "Good",
                                    value: "good",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mrp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MRP
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Mrp" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="producttype"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Type
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={true}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Good", value: "good" },
                                    { label: "Service", value: "service" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue(
                                      "producttype",
                                      value!.value
                                    )
                                  }
                                  defaultValue={{
                                    label: "Good",
                                    value: "good",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="isenabled"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Enabled
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Enabled"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="enablestatus_name"
                                  // options={[
                                  //   { label: "Yes", value: "Y" },
                                  //   { label: "No", value: "N" },
                                  // ]}
                                  onChange={(value: any) =>
                                    form.setValue(
                                      "isenabled",
                                      value.value
                                    )
                                  }
                                  defaultValue={
                                    productData.enablestatus_name === "Y"
                                      ? { label: "Yes", value: "Y" }
                                      : { label: "No", value: "N" }
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="mt-[30px]">
                            <FormLabel className=" text-slate-600 ml-[10px]">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder=""
                                {...field}
                                className=" border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Tax Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="gsttype"
                          render={() => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Tax Type
                              </FormLabel>
                              <FormControl>
                                <Select
                                  styles={customStyles}
                                  placeholder="Product Type"
                                  className="border-0 basic-single"
                                  classNamePrefix="select border-0"
                                  components={{ DropdownIndicator }}
                                  isDisabled={false}
                                  isLoading={false}
                                  // isClearable={true}
                                  isSearchable={true}
                                  name="color"
                                  options={[
                                    { label: "Good", value: "good" },
                                    { label: "Service", value: "service" },
                                  ]}
                                  onChange={(value: any) =>
                                    form.setValue("gsttype", value!.value)
                                  }
                                  defaultValue={{
                                    label: "Exempted",
                                    value: "0",
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gstrate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                GST Rate
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Gst Rate" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="hsn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                HSN
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Hsn code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Advance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Brand
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Brand" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ean"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                EAN
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="Ean" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Weight
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="weight" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vweight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Volumetric Weight
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="vweight" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Height
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="vweight" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Width
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="width" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border rounded-md shadow-sm">
                    <CardHeader className="h-[50px] p-0 px-[10px] flex justify-center bg-hbg">
                      <CardTitle className="font-[500] text-slate-600">
                        Advance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-[20px] px-[10px]">
                      <div className="grid grid-cols-3 gap-[30px] items-center ">
                        <FormField
                          control={form.control}
                          name="minstockrm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MIN Stock (FG)
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="min stock" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minstock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MIN Stock(RM)
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="min stock rm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mfgBatchSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                MFG Batch Size
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="mfg batch size" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Default Stock Location
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Default Stock Location"
                                  {...field}
                                  className="border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="labourcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Labour Cost
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="labour cost" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="packingcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Sec Packing Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Sec Packing Cost"
                                  {...field}
                                  className="border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobworkcost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                JW Cost
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="JW Cost"
                                  {...field}
                                  className="border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="othercost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className=" text-slate-600 ml-[10px]">
                                Other Cost
                              </FormLabel>
                              <FormControl>
                              <Input placeholder="other cost" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className={modelFixFooterStyle}>
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
      <Sheet>
        <SheetTrigger>
          <Eye className="text-cyan-700 h-[20px] w-[20px]" onClick={() => {
              if (productKey) {
                dispatch(
                  fetchImageProduct(productKey) as any
                );
              }
            }} />
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle>Oakmist Plus</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <Image className="text-slate-300 h-[50px] w-[50px]" />
            <p className="text-slate-500 mt-[20px]">No image found</p>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet>
      <SheetTrigger>
        <Upload className="text-cyan-700 h-[20px] w-[20px]" />
      </SheetTrigger>
      <SheetContent className="p-0">
        <SheetHeader className={modelFixHeaderStyle}>
          <SheetTitle className="text-slate-600">Oakmist Plus</SheetTitle>
        </SheetHeader>
        <div>
          <div className="mt-[20px] flex flex-col gap-[20px] px-[20px]">
            <Input 
              placeholder="caption" 
              className="border-slate-400" 
              {...form.register('caption')}
            />
            <Label
              htmlFor="image"
              className="flex items-center justify-center border border-dashed border-slate-400 shadow h-[150px] rounded-md flex-col"
            >
              <Upload className="text-slate-300 h-[50px] w-[50px]" />
              <p className="text-slate-500 mt-[20px]">
                Select images to upload for this product.
              </p>
              <Input 
                id="image" 
                type="file" 
                multiple 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </Label>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {imagePreviews.map((src, index) => (
                  <img 
                    key={index} 
                    src={src} 
                    alt={`Preview ${index + 1}`} 
                    className="h-[100px] w-[100px] object-cover rounded-md shadow" 
                  />
                ))}
              </div>
            )}
          </div>
          <div className={modelFixFooterStyle}>
            <Button 
              className="bg-cyan-700 hover:bg-cyan-600" 
              onClick={uploadImages}
            >
              Upload Images
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </div>
  );
};

export default ProductActionCellRender;
