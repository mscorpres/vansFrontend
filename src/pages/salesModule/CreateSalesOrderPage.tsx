import AddSalesOrder from "@/components/shared/AddSalesOrder";
import CreateSalesOrder from "@/components/shared/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSalesFormSchema } from "@/schema/salesorder/createsalesordeschema";
import { fetchBillAddress, fetchBillAddressList, fetchBillingAddress, fetchBranchDetail, fetchCustomerBranches } from "@/features/salesmodule/createSalesOrderSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";

const CreateSalesOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [branches, setBranches] = useState([]);
  const [payloadData, setPayloadData] = useState<any>(null);
  const { loading } = useSelector((state: RootState) => state.client);
  const form = useForm<z.infer<typeof createSalesFormSchema>>({
    resolver: zodResolver(createSalesFormSchema),
    mode: "onBlur",
  });

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
