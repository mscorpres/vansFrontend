import AddSalesOrder from "@/components/shared/AddSalesOrder";
import CreateSalesOrder from "@/components/shared/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSalesFormSchema } from "@/schema/salesorder/createsalesordeschema";
import { fetchBillAddress, fetchBillAddressList, fetchBillingAddress, fetchBranchDetail, fetchCustomerBranches, fetchDataForUpdate } from "@/features/salesmodule/createSalesOrderSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useParams } from "react-router-dom";
import { RowData } from "@/data";

const CreateSalesOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const pathname = window.location.pathname;
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [branches, setBranches] = useState([]);
  const [payloadData, setPayloadData] = useState<any>(null);
  const [rowData , setRowData] = useState();
  const [derivedType,setDerivedType] = useState<any>(null);
  const { updateData,loading } = useSelector((state: RootState) => state.client);
  const form = useForm<z.infer<typeof createSalesFormSchema>>({
    resolver: zodResolver(createSalesFormSchema),
    mode: "onBlur",
  });

  
  useEffect(() => {
    if (pathname?.includes("update") && params?.id) {
      const soId = (params.id as string).replace(/_/g, "/");
      dispatch(fetchDataForUpdate({ so_id: soId }));
    }
  }, [pathname, params]);

  useEffect(() => {
    if (updateData) {
      const header: any = updateData.header;
      

    
        // if (ship?.state?.value == "09") {
        //   setDerivedType("L");
        // } else {
        //   setDerivedType("I");
        // }
      

      const updatedData: RowData[] = updateData?.items?.map((material: any) => ({
        type: material.so_type?.value || "product",
        items: material.item_code || "",
        material: material.selectedItem[0] || "",
        materialDescription: material.item_details || "",
        rate: parseFloat(material.rate) || 0,
        orderQty: material.orderqty || 1,
        assAmount:
          (
            material.rate * material.orderqty -
            material.rate * material.orderqty * (material.discount / 100)
          ).toString() || "0",
        discount: parseFloat(material.discount) || 0,
        currency: material.currency || "364907247",
        gstType: material.gsttype?.[0]?.id || "I",
        localValue: material.exchangetaxablevalue,
        foreignValue: parseFloat(material.exchangerate) || 0,
        cgst: parseFloat(material.cgst) || 0,
        sgst: parseFloat(material.sgst) || 0,
        igst: parseFloat(material.igst) || 0,
        dueDate: material.due_date || "",
        hsnCode: material.hsncode || "",
        remark: material.remark || "",
        gstRate: material?.gst_rate || 0,
        updateid: material?.updateid || 0,
        isNew: true,
      }));
      setRowData(updatedData);
    }
  }, [updateData, form]);

const handleCustomerSelection = (e: any) => {
  console.log("handleCustomerSelection", e);
  form.setValue("customer_code", e.value);
  dispatch(fetchCustomerBranches({client:e.value})).then((response: any) => {
    if (response.meta.requestStatus === "fulfilled") {
      const transformedBranches = response.payload.map((branch: any) => ({
        label: branch.name,
        value: branch.id,
      }));
      setBranches(transformedBranches);
      console.log(transformedBranches)
    }
  })
 
};

const handleBranchSelection = (e: any) => {
  console.log("handleBranchSelection", e);
  form.setValue("billTo.branch", e.value);
  dispatch(fetchBranchDetail({ client: e.value })).then((response: any) => {
    console.log(response)
    if (response.meta.requestStatus === "fulfilled") {
      const billingAddress = response.payload.billingAddress;
      const ShippingAddress = response.payload.shippingAddress;
      form.setValue("billTo.address1", billingAddress.addressLine1);
      form.setValue("billTo.address2", billingAddress.addressLine2);
      form.setValue("billTo.state", billingAddress.state);
      form.setValue("billTo.pincode", billingAddress.pinCode);
      form.setValue("billTo.gst", billingAddress.gst);

      form.setValue("shipTo.address1", ShippingAddress.addressLine1);
      form.setValue("shipTo.address2", ShippingAddress.addressLine2);
      form.setValue("shipTo.state", ShippingAddress.state);
      form.setValue("shipTo.pincode", ShippingAddress.pinCode);
      form.setValue("shipTo.gst", ShippingAddress.gst);
      form.setValue("shipTo.company", ShippingAddress.company);
      form.setValue("shipTo.panno", ShippingAddress.panno);
 
    }
  })
};

const handleCostCenterChange = (e: any) => {
  console.log(e)
  form.setValue("costcenter", e.value);
  const payload = {
    cost_center: e.value
  }
  console.log(payload)
  dispatch(fetchBillAddressList(e.value));
  // dispatch(fetchBillAddress("USLSDFSS2"));
}

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        {loading && <FullPageLoading />}
        <TabsContent value="create" className="p-0 m-0">
          <CreateSalesOrder
            setTab={setTabvalue}
            setPayloadData={setPayloadData}
            handleCustomerSelection={handleCustomerSelection}
            form={form}
            branches={branches}
            handleBranchSelection={handleBranchSelection}
            handleCostCenterChange={handleCostCenterChange}
          />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddSalesOrder setTab={setTabvalue} payloadData={payloadData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalesOrderPage;
