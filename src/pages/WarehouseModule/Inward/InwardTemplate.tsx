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
import { useDispatch } from "react-redux";
import CreateInward from "./CreateInward";
const InwardTemplate = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  // const [data, setData] = useState<any>();
  const [payloadData, setPayloadData] = useState<any>(null);
  const [formVal, setFormVal] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [form] = Form.useForm();
  const [paramVal, setParamVal] = useState("");
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
      gstType: "local",
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
  const dispatch = useDispatch<AppDispatch>();
  console.log("tabvalue", tabvalue);
  const params = useParams();
  console.log("params", params);
  useEffect(() => {
    const currentUrl = window.location.href;
    // console.log("currentUrl---", currentUrl.split("/"));
    let urlParts = currentUrl.split("/");
    const secondLastItem = [urlParts.length - 2];
    if (urlParts[secondLastItem] == "approve") {
      setIsApprove("approve");
    } else if (urlParts[secondLastItem] == "edit") {
      setIsApprove("edit");
    } else {
      setIsApprove(false);
    }
    if (params) {
      setParamVal(params.id?.replaceAll("_", "/"));
      // console.log("secondLastItems", urlParts[secondLastItem]);
      //  && urlParts[secondLastItem]==app
      dispatch(fetchDataPOEdit({ pono: params.id?.replaceAll("_", "/") })).then(
        (res) => {
          // console.log("res", res);
          if (res.payload.status == "success") {
            let arr = res.payload.data;
            let billinid = {
              label: arr.bill[0]?.addrbillname,
              value: arr.bill[0]?.addrbillid,
            };
            // console.log("billingid", billingid);

            let shippingid = {
              label: arr.ship?.addrshipname,
              value: arr.ship?.addrshipid,
            };
            console.log("shippingid", shippingid);
            //vendor
            // form.setFieldValue("poType", "New");
            form.setFieldValue("vendorType", {
              label: arr.vendor[0]?.vendortype_label,
              value: arr.vendor[0]?.vendortype_value,
            });
            form.setFieldValue("vendorName", arr.vendor[0]?.vendorcode);
            form.setFieldValue("branch", arr.vendor[0]?.vendorbranch);
            form.setFieldValue("vendorGst", arr.vendor[0]?.vendorgst);
            form.setFieldValue("address", arr.vendor[0]?.vendoraddress);
            form.setFieldValue("costCenter", arr.vendor[0]?.costcenter);
            form.setFieldValue("quotation", arr.vendor[0]?.termsofquotation);
            form.setFieldValue("terms", arr.vendor[0]?.termsofcondition);
            form.setFieldValue("paymentTerms", arr.vendor[0]?.paymentterms);
            form.setFieldValue("project", arr.vendor[0]?.project);
            form.setFieldValue("comment", arr.vendor[0]?.pocomment);
            //billing
            form.setFieldValue("billingId", billinid),
              form.setFieldValue("pan", arr.bill?.billpanno);
            form.setFieldValue("billgst", arr.bill?.billgstid);
            form.setFieldValue("billAddress", arr.bill?.billaddress);
            //shipping
            form.setFieldValue("shipId", shippingid);
            form.setFieldValue("shippan", arr.ship?.shippanno);
            form.setFieldValue("shipgst", arr.ship?.shipgstid);
            form.setFieldValue("shipAddress", arr.ship?.shipaddress);
          }
          let materials = res.payload.data?.materials;
          let matLst = materials?.map((r) => {
            return {
              isNew: true,
              procurementMaterial: r?.selectedComponent[0]?.text,

              vendorName: r.make,
              orderQty: r.orderqty,
              rate: r.rate,
              gstRate: r.gstrate,
              gstType: { value: r.gsttype[0].id, label: r.gsttype[0].text },
              materialDescription: r.remark,
              hsnCode: r.hsncode,
              dueDate: r.duedate,
              localValue: r.taxablevalue,
              foreignValue: r.exchangetaxablevalue,
              igst: r.igst,
              sgst: r.sgst,
              cgst: r.cgst,
            };
          });
          console.log("matLst", matLst);

          setRowData(matLst);
          // setPayloadData(res.payload);
        }
      );
    }
  }, [params]);

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
          />
        </TabsContent>
      </Tabs>
    </div>
  );
  0;
};

export default InwardTemplate;
