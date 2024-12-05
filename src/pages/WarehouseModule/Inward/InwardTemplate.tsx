// import AddSalesOrder from "@/components/shared/AddSalesOrder";
// import CreateSalesOrder from "@/components/shared/CreateSalesOrder";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CreatePoPage from "./CreateInward";
import AddItem from "./AddItem";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { fetchDataPOEdit } from "@/features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateInward from "./CreateInward";
import { fetchCurrency } from "@/features/salesmodule/createSalesOrderSlice";
const InwardTemplate = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  // const [data, setData] = useState<any>();
  const [payloadData, setPayloadData] = useState<any>(null);
  const [formVal, setFormVal] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [form] = Form.useForm();
  const [paramVal, setParamVal] = useState("");
  const [roeIs, setRoeIs] = useState("");
  const [resetSure, setResetSure] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([
    {
      checked: false,
      type: "products",
      procurementMaterial: "",
      materialDescription: "",
      asinNumber: "B01N1SE4EP",
      orderQty: 100,
      rate: 50,
      currency: "USD",
      gstRate: 18,
      gstType: "L",
      localValue: 0,
      foreignValue: 0,
      cgst: 9,
      sgst: 9,
      igst: 0,
      dueDate: "2024-07-25",
      hsnCode: "",
      isNew: true,
    },
  ]);
  const selectedVendor = Form.useWatch("vendorName", form);
  const exchangingRate = Form.useWatch("exchange_rate", form);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { loading, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  useEffect(() => {
    dispatch(fetchCurrency());
  }, []);
  useEffect(() => {
    if (exchangingRate) {
      setRoeIs(exchangingRate);
    }
  }, [exchangingRate]);
  // useEffect(() => {
  //   const currentUrl = window.location.href;
  //   let urlParts = currentUrl.split("/");
  //   const secondLastItem = [urlParts.length - 2];
  //   if (urlParts[secondLastItem] == "approve") {
  //     setIsApprove("approve");
  //   } else if (urlParts[secondLastItem] == "edit") {
  //     setIsApprove("edit");
  //   } else {
  //     setIsApprove(false);
  //   }
  //   if (params) {
  //     setParamVal(params.id?.replaceAll("_", "/"));
  //     dispatch(fetchDataPOEdit({ pono: params.id?.replaceAll("_", "/") })).then(
  //       (res) => {
  //         if (res.payload.success) {
  //           let arr = res.payload.data;
  //           let billinid = {
  //             label: arr.bill[0]?.addrbillname,
  //             value: arr.bill[0]?.addrbillid,
  //           };
  //           let shippingid = {
  //             label: arr.ship?.addrshipname,
  //             value: arr.ship?.addrshipid,
  //           };
  //           //vendor
  //           // form.setFieldValue("poType", "New");
  //           form.setFieldValue("vendorType", {
  //             label: arr.vendor[0]?.vendortype_label,
  //             value: arr.vendor[0]?.vendortype_value,
  //           });
  //           form.setFieldValue("vendorName", arr.vendor[0]?.vendorcode);
  //           form.setFieldValue("branch", arr.vendor[0]?.vendorbranch);
  //           form.setFieldValue("vendorGst", arr.vendor[0]?.vendorgst);
  //           form.setFieldValue("address", arr.vendor[0]?.vendoraddress);
  //           form.setFieldValue("costCenter", arr.vendor[0]?.costcenter);
  //           form.setFieldValue("quotation", arr.vendor[0]?.termsofquotation);
  //           form.setFieldValue("terms", arr.vendor[0]?.termsofcondition);
  //           form.setFieldValue("paymentTerms", arr.vendor[0]?.paymentterms);
  //           form.setFieldValue("project", arr.vendor[0]?.project);
  //           form.setFieldValue("comment", arr.vendor[0]?.pocomment);
  //           //billing
  //           form.setFieldValue("billingId", billinid),
  //             form.setFieldValue("pan", arr.bill?.billpanno);
  //           form.setFieldValue("billgst", arr.bill?.billgstid);
  //           form.setFieldValue("billAddress", arr.bill?.billaddress);
  //           //shipping
  //           form.setFieldValue("shipId", shippingid);
  //           form.setFieldValue("shippan", arr.ship?.shippanno);
  //           form.setFieldValue("shipgst", arr.ship?.shipgstid);
  //           form.setFieldValue("shipAddress", arr.ship?.shipaddress);
  //         }
  //         let materials = res.payload.data?.materials;
  //         let matLst = materials?.map((r) => {
  //           return {
  //             isNew: true,
  //             procurementMaterial: r?.selectedComponent[0]?.text,

  //             vendorName: r.make,
  //             orderQty: r.orderqty,
  //             rate: r.rate,
  //             gstRate: r.gstrate,
  //             gstType: { value: r.gsttype[0].id, label: r.gsttype[0].text },
  //             materialDescription: r.remark,
  //             hsnCode: r.hsncode,
  //             dueDate: r.duedate,
  //             localValue: r.taxablevalue,
  //             foreignValue: r.exchangetaxablevalue,
  //             igst: r.igst,
  //             sgst: r.sgst,
  //             cgst: r.cgst,
  //           };
  //         });

  //         setRowData(matLst);
  //         // setPayloadData(res.payload);
  //       }
  //     );
  //   }
  // }, [params]);

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        <TabsContent value="create" className="p-0 m-0">
          <CreateInward
            setTab={setTabvalue}
            setPayloadData={setPayloadData}
            form={form}
            selectedVendor={selectedVendor}
            formVal={formVal}
            setFormVal={setFormVal}
            currencyList={currency}
            resetSure={resetSure}
            setResetSure={setResetSure}
          />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddItem
            setTab={setTabvalue}
            payloadData={payloadData}
            form={form}
            selectedVendor={selectedVendor}
            formVal={formVal}
            setFormVal={setFormVal}
            rowData={rowData}
            setRowData={setRowData}
            isApprove={isApprove}
            setIsApprove={setIsApprove}
            params={params}
            roeIs={roeIs}
            setResetSure={setResetSure}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
  0;
};

export default InwardTemplate;
