import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columnDefs } from "@/config/agGrid/mastermodule/MasterProductTable";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Select from "react-select";

import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import styled from "styled-components";
import ReusableTable from "@/components/shared/ReusableTable";
import { transformProductTable } from "@/helper/TableTransformation";
import { createProduct } from "@/features/product/semiProductSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useToast } from "@/components/ui/use-toast";


const schema = z.object({
  productType: z.enum(["good", "service"]),
  productSku: z.string().min(2, {
    message: "SKU is required",
  }),
  uom: z.string().min(2, {
    message: "UOM is required",
  }), // You can replace z.string() with a more specific validation if needed
  productName: z.string().min(2, {
    message: "Product Name is required",
  }),
});
const languages = [
  { label: "Good", value: "good" },
  { label: "Service", value: "service" },
] as const;
const MasterProductSfgPage: React.FC = () => {
  const { toast } = useToast();

  const dispatch = useDispatch<AppDispatch>(); 
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      productType: "good",
      productSku: "",
      productName: "",
      uom: "",
      
    },
  });
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const resultAction = await dispatch(
        createProduct({
          endpoint: "/products/insertSemi",
          payload: {
            p_name: values.productName,
            p_sku: values.productSku,
            units_id: values.uom,
          },
        })
      ).unwrap();

      if (resultAction.success) {
        toast({
          title: "Product created successfully",
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

  return (
    <Wrapper className="h-[calc(100vh-100px)] bg-[#fff] grid grid-cols-[450px_1fr]">
      <div className="">
        <Card className="border-none shadow-none rounded-0">
          <CardHeader className="p-0 bg-hbg h-[49px] border-b border-slate-300 px-[10px] flex justify-center">
            <CardTitle className="text-slate-600 font-[500]">Add New FG</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-[20px] mt-[20px]">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={() => (
                      <FormItem className="flex flex-col w-full">
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
                            onChange={(value: any) => form.setValue("productType", value!.value)}
                            defaultValue={{ label: "Good", value: "good" }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-[10px] items-center">
                    <FormField
                      control={form.control}
                      name="productSku"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} className="border-0 border-b rounded-none shadow-none placeholder:text-neutral-500 text-[15px] border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0" />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uom"
                      render={() => (
                        <FormItem className="flex flex-col">
                          <FormControl>
                            <Select
                              styles={customStyles}
                              placeholder="UOM"
                              className="border-0 basic-single"
                              classNamePrefix="select border-0"
                              components={{ DropdownIndicator }}
                              isDisabled={false}
                              isLoading={true}
                              isClearable={true}
                              isSearchable={true}
                              name="color"
                              options={languages}
                              onChange={(value: any) => form.setValue("uom", value!.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} className="placeholder:text-neutral-500 text-[15px] border-0 border-b rounded-none shadow-none border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Button type="submit" className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="ag-theme-quartz h-[calc(100vh-100px)]">
          <ReusableTable heigth="h-[calc(100vh-100px)]" endpoint="/products/semiProducts" columns={columnDefs} transform={transformProductTable} method="get" />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-cell {
    outline: none;
    border: none;
    padding: 0;
    padding: 0 5px;
    display: flex;
    justify-content: start;
    align-items: center;
  }
`;

export default MasterProductSfgPage;
