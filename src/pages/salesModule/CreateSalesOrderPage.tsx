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
  const [backCreate, setBackCreate] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [derivedType, setDerivedType] = useState<any>(null);
  const [codeType, setCodeType] = useState("");
  const [bilStateCode, setBillStateCode] = useState("");
  const [shipStateCode, setShipStateCode] = useState("");
  const [isImport, setIsImport] = useState("");
  const { updateData, loading, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const form = useForm<z.infer<typeof createSalesFormSchema>>({
    resolver: zodResolver(createSalesFormSchema),
    mode: "onBlur",
  });
  const billToStateCode = form.watch("billTo.state");
  const billFromStateCode = form.watch("billFrom.state");
  const getCostCenter = form.watch("customer_code");

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
      form.setValue("customer_code", header?.customer?.code, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("customer_name", header?.customer?.name);
      searchCustomerList(header?.customer?.name);
      form.setValue("customer_type", "c01", {
        shouldValidate: true,
        shouldDirty: true,
      });
      searchCustomerList(header?.customer?.code);
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
      form.setValue("billTo.branch", header?.customer?.branch?.branchid);
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
      form.setValue("other_ref", header?.other_ref);
      form.setValue("terms_of_delivery", header?.terms_of_delivery);
      form.setValue("supply_city", header?.supply_city);
      form.setValue("ref_date", header?.reference_date);
      form.setValue("currency.currency", header?.currency);
      form.setValue("currency.exchange_rate", header?.exchange_rate);
      form.setValue("paymentterms", header.paymentterms);
      form.setValue("quotationdetail", header.quotationdetail);
      form.setValue("termscondition", header.termscondition);
      form.setValue("due_date", header.due_date);
      form.setValue("project_name", header.project_name);
      form.setValue("so_comment", header.so_comment);
      form.setValue("costcenter", header.costcenter?.code);
      form.setValue("costcenter_name", header.costcenter?.name);
      form.setValue("billIdName", header.bill_from?.billing?.name);
      form.setValue("billFrom.billFromId", header?.bill_from?.billing?.code);
      setShipStateCode(header?.bill_from?.state?.code);
      setBillStateCode(header?.customer?.state?.code);
      if (header?.customer?.state?.code == 100) {
        setIsImport("Import");
      } else {
        setIsImport("");
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
        gstType: material.gst_type[0]?.id,
        dueDate: material.due_date || "",
        hsnCode: material.hsnCode || "",
        remark: material.itemRemark || "",
        updateid: material?.updateid || 0,
        stock: material?.closingQty,
        isNew: true,
      }));

      setRowData(data);
    }
  }, [updateData, form]);

  const handleCustomerSelection = (e: any) => {
    form.setValue("customer_code", e.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("customer_name", e.label);
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
    form.setValue("billTo.branch", e.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dispatch(fetchBranchDetail({ client: e.value })).then((response: any) => {
      if (response.meta.requestStatus === "fulfilled") {
        const billingAddress = response.payload.billingAddress;
        const ShippingAddress = response.payload.shippingAddress;
        form.setValue("billTo.address1", billingAddress.addressLine1, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("billTo.address2", billingAddress.addressLine2, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("billTo.state", billingAddress.state?.stateCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setBillStateCode(billingAddress.state?.stateCode);
        if (billingAddress.state?.stateCode == 100) {
          setIsImport("Import");
        } else {
          setIsImport("");
        }
        form.setValue("billTo.pincode", billingAddress.pinCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("billTo.gst", billingAddress.gst, {
          shouldValidate: true,
          shouldDirty: true,
        });

        form.setValue("shipTo.address1", ShippingAddress.addressLine1, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.address2", ShippingAddress.addressLine2, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.state", ShippingAddress.state?.stateCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.pincode", ShippingAddress.pinCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.gst", ShippingAddress.gst, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.company", ShippingAddress.company, {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("shipTo.panno", ShippingAddress.panno, {
          shouldValidate: true,
          shouldDirty: true,
        });
     

        if (
          form.getValues("billTo.state") == form.getValues("billFrom.state") ||
          billToStateCode == billFromStateCode
        ) {
          setDerivedType("L");
        } else {
          setDerivedType("I");
        }
      }
    });
  };

  const handleCostCenterChange = (e: any) => {
    form.setValue("costcenter", e.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("costcenter_name", e.label);
    const payload = {
      cost_center: e.value,
    };
    dispatch(fetchBillAddressList(e.value));
    // dispatch(fetchBillAddress("USLSDFSS2"));
  };

  const handleBillIdChange = (e: any) => {
    form.setValue("billFrom.billFromId", e.value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("billIdName", e.label);
    dispatch(fetchBillAddress(e.value)).then((response: any) => {
      const data = response.payload.data;
      form.setValue("billFrom.address1", data.addressLine1, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billFrom.address2", data.addressLine2, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billFrom.gstin", data.gstin, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billFrom.pan", data.pan, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("billFrom.state", data.statecode, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setShipStateCode(data.statecode);
    });
  };
  useEffect(() => {
    if (bilStateCode && shipStateCode) {
      if (isImport == "Import") {
        setDerivedType("0");
      } else {
        if (Number(shipStateCode) == Number(bilStateCode)) {
          setDerivedType("L");
        } else {
          setDerivedType("I");
        }
      }
    }
  }, [shipStateCode, bilStateCode, isImport]);
  // console.log("ship", shipStateCode, "bill", bilStateCode);

  const searchCustomerList = (e: any) => {
    const response = dispatch(fetchCustomerDetail({ search: e }));
  };

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
            backCreate={backCreate}
            bilStateCode={bilStateCode}
            setBillStateCode={setBillStateCode}
            shipStateCode={shipStateCode}
            setShipStateCode={setShipStateCode}
            isImport={isImport}
            setIsImport={setIsImport}
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
            setBackCreate={setBackCreate}
            getCostCenter={getCostCenter}
            bilStateCode={bilStateCode}
            setBillStateCode={setBillStateCode}
            shipStateCode={shipStateCode}
            setShipStateCode={setShipStateCode}
            isImport={isImport}
            setIsImport={setIsImport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateSalesOrderPage;
