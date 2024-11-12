import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CreatePoPage from "./CreatePoPage";
import AddPO from "./AddPO";
import { Form } from "antd";
import { useParams } from "react-router-dom";
import { AppDispatch } from "@/store";
import { fetchDataPOEdit } from "@/features/client/clientSlice";
import { useDispatch } from "react-redux";
const PoCreateTemplate = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [payloadData, setPayloadData] = useState<any>(null);
  const [formVal, setFormVal] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [form] = Form.useForm();
  const [paramVal, setParamVal] = useState("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [bilStateCode, setBillStateCode] = useState("");
  const [shipStateCode, setShipStateCode] = useState("");
  const [codeType, setCodeType] = useState("");
  const selectedVendor = Form.useWatch("vendorName", form);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  useEffect(() => {
    const currentUrl = window.location.href;
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
            let ventype = {
              label: arr.vendor[0]?.vendortype_label,
              value: arr.vendor[0]?.vendortype_value,
            };
            let shippingid = {
              label: arr.ship?.addrshipname,
              value: arr.ship?.addrshipid,
            };
            //vendor
            // form.setFieldValue("poType", "New");
            form.setFieldValue("project", arr.vendor[0]?.projectname);

            form.setFieldValue("vendorType", ventype);
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
              currency: r.currency,
              // currency: r.exchangerate,
              orderQty: r.orderqty,
              componentKey: r?.componentKey,
              rate: r.rate,
              gstRate: r.gstrate,
              gstType: r.gsttype[0].id,
              materialDescription: r.remark,
              hsnCode: r.hsncode,
              dueDate: r.duedate,
              localValue: r.taxablevalue,
              foreignValue: r.exchangetaxablevalue,
              igst: r.igst,
              sgst: r.sgst,
              cgst: r.cgst,
              updateingId: r?.updateid,
            };
          });

          setRowData(matLst);
          // setPayloadData(res.payload);
        }
      );
    }
  }, [params]);
  useEffect(() => {
    if (bilStateCode && shipStateCode) {
      if (Number(shipStateCode) == Number(bilStateCode)) {
        console.log("same");
        setCodeType("L");
      } else {
        console.log("diffener");
        setCodeType("I");
      }
    }
  }, [shipStateCode, bilStateCode]);

  return (
    <div>
      <Tabs value={tabvalue} onValueChange={setTabvalue}>
        <TabsContent value="create" className="p-0 m-0">
          <CreatePoPage
            setTab={setTabvalue}
            setPayloadData={setPayloadData}
            form={form}
            selectedVendor={selectedVendor}
            formVal={formVal}
            setFormVal={setFormVal}
            bilStateCode={bilStateCode}
            setBillStateCode={setBillStateCode}
            shipStateCode={shipStateCode}
            setShipStateCode={setShipStateCode}
          />
        </TabsContent>
        <TabsContent value="add" className="p-0 m-0">
          <AddPO
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
            bilStateCode={bilStateCode}
            setBillStateCode={setBillStateCode}
            shipStateCode={shipStateCode}
            setShipStateCode={setShipStateCode}
            codeType={codeType}
            setCodeType={setCodeType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
  0;
};

export default PoCreateTemplate;
