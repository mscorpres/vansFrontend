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
import {
  fetchBillAddress,
  fetchBillAddressList,
  fetchBranchDetail,
  fetchCurrency,
  fetchCustomerBranches,
  fetchCustomerDetail,
  fetchDataForUpdate,
} from "@/features/salesmodule/createSalesOrderSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useParams } from "react-router-dom";
import { RowData } from "@/config/agGrid/SalseOrderCreateTableColumns";

const CreateSalesOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const pathname = window.location.pathname;
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [branches, setBranches] = useState([]);
  const [payloadData, setPayloadData] = useState<any>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [derivedType, setDerivedType] = useState<any>(null);
  const { updateData, loading, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
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
    dispatch(fetchCurrency());
  }, []);

  useEffect(() => {
    if (updateData) {
      const header: any = updateData.header;
      form.setValue("customer_code", header?.customer?.code);
      form.setValue("customer_type", header?.customer_type);
      searchCustomerList(header?.customer?.code)
      dispatch(fetchCustomerBranches({ client: header?.customer?.code })).then(
        (response: any) => {
          if (response.meta.requestStatus === "fulfilled") {
            const transformedBranches = response.payload.map((branch: any) => ({
              label: branch.name,
              value: branch.id,
            }));
            setBranches(transformedBranches);
          }
        }
      );
      form.setValue("billTo.branch", header?.customer?.branch);
      form.setValue("billTo.pincode", header?.customer?.pincode);
      form.setValue("billTo.gst", header?.customer?.gstin);
      form.setValue("billTo.state", header?.customer?.state?.code);
      form.setValue("billTo.address1", header?.customer?.address1);
      form.setValue("billTo.address2", header?.customer?.address2);
      form.setValue("shipTo.company", header?.ship_to?.company);
      form.setValue("shipTo.pincode", header?.ship_to?.pincode);
      form.setValue("shipTo.gst", header?.ship_to?.gstin);
      form.setValue("shipTo.panno", header?.ship_to?.panno);
      form.setValue("shipTo.state", header?.ship_to?.state?.code);
      form.setValue("shipTo.address1", header?.ship_to?.address1);
      form.setValue("shipTo.address2", header?.ship_to?.address2);
      form.setValue("billFrom.pan", header?.bill_from?.pan);
      form.setValue("billFrom.gstin", header?.bill_from?.gstin);
      form.setValue("billFrom.state", header?.bill_from?.state?.code);
      form.setValue("billFrom.address1", header?.bill_from?.address1);
      form.setValue("billFrom.address2", header?.bill_from?.address2);
      form.setValue("po_number", header?.po_number);
      form.setValue("po_date", header?.po_date);
      form.setValue("reference_no", header?.reference_no);
      form.setValue("reference_date", header?.reference_date);
      form.setValue("currency.currency", header?.currency);
      form.setValue("currency.exchange_rate", header?.exchange_rate);
      form.setValue("paymentterms", header.paymentterms);
      form.setValue("quotationdetail", header.quotationdetail);
      form.setValue("termscondition", header.termscondition);
      form.setValue("due_date", header.due_date);
      form.setValue("project_name", header.project_name);
      form.setValue("so_comment", header.so_comment);

      if (header?.ship_to?.state?.code == header?.bill_from?.state?.code) {
        setDerivedType("L");
      } else {
        setDerivedType("I");
      }

      const data: RowData[] = updateData?.items?.map((material: any) => ({
        partno: material?.item?.partNo || "",
        orderQty: material.qty || 1,
        material: material?.item || "",
        rate: parseFloat(material.rate) || 0,
        localValue: material?.taxableValue,
        foreignValue: material?.exchangeTaxableValue,
        gstRate: material?.gstRate || 0,
        cgst: parseFloat(material.cgstRate) || 0,
        sgst: parseFloat(material.sgstRate) || 0,
        igst: parseFloat(material.igstRate) || 0,
        currency: material.currency || "364907247",
        gstType: material.gsttype?.[0]?.id || "I",
        dueDate: material.due_date || "",
        hsnCode: material.hsnCode || "",
        remark: material.itemRemark || "",
        updateid: material?.updateid || 0,
        isNew: true,
      }));
      setRowData(data);
    }
  }, [updateData, form]);

  const handleCustomerSelection = (e: any) => {
    form.setValue("customer_code", e.value);
    dispatch(fetchCustomerBranches({ client: e.value })).then(
      (response: any) => {
        if (response.meta.requestStatus === "fulfilled") {
          const transformedBranches = response.payload.map((branch: any) => ({
            label: branch.name,
            value: branch.id,
          }));
          setBranches(transformedBranches);
        }
      }
    );
  };

  const handleBranchSelection = (e: any) => {
    form.setValue("billTo.branch", e.value);
    dispatch(fetchBranchDetail({ client: e.value })).then((response: any) => {
      if (response.meta.requestStatus === "fulfilled") {
        const billingAddress = response.payload.billingAddress;
        const ShippingAddress = response.payload.shippingAddress;
        form.setValue("billTo.address1", billingAddress.addressLine1);
        form.setValue("billTo.address2", billingAddress.addressLine2);
        form.setValue("billTo.state", billingAddress.state?.stateCode);
        form.setValue("billTo.pincode", billingAddress.pinCode);
        form.setValue("billTo.gst", billingAddress.gst);

        form.setValue("shipTo.address1", ShippingAddress.addressLine1);
        form.setValue("shipTo.address2", ShippingAddress.addressLine2);
        form.setValue("shipTo.state", ShippingAddress.state?.stateCode);
        form.setValue("shipTo.pincode", ShippingAddress.pinCode);
        form.setValue("shipTo.gst", ShippingAddress.gst);
        form.setValue("shipTo.company", ShippingAddress.company);
        form.setValue("shipTo.panno", ShippingAddress.panno);

        if (
          form.getValues("billTo.state") == form.getValues("billFrom.state")
        ) {
          setDerivedType("L");
        } else {
          setDerivedType("I");
        }
      }
    });
  };

  const handleCostCenterChange = (e: any) => {
    console.log(e);
    form.setValue("costcenter", e.value);
    const payload = {
      cost_center: e.value,
    };
    console.log(payload);
    dispatch(fetchBillAddressList(e.value));
    // dispatch(fetchBillAddress("USLSDFSS2"));
  };

  const handleBillIdChange = (e: any) => {
    form.setValue("billFrom.billFromId", e.value);
    dispatch(fetchBillAddress(e.value)).then((response: any) => {
      const data = response.payload.data;
      form.setValue("billFrom.address1", data.addressLine1);
      form.setValue("billFrom.address2", data.addressLine2);
      form.setValue("billFrom.gstin", data.gstin);
      form.setValue("billFrom.pan", data.pan);
      form.setValue("billFrom.state", data.statecode);
      if (form.getValues("billTo.state") == form.getValues("billFrom.state")) {
        setDerivedType("L");
      } else {
        setDerivedType("I");
      }
    });
  };

  const searchCustomerList = (e: any) => {
    const response = dispatch(fetchCustomerDetail({ search: e }));
      console.log(response);
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
            handleBillIdChange={handleBillIdChange}
            currencyList={currency}
            searchCustomerList={searchCustomerList}
          />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddSalesOrder
            setTab={setTabvalue}
            payloadData={payloadData}
            derivedType={derivedType}
            rowData={rowData}
            setRowData={setRowData}
            form={form}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalesOrderPage;
