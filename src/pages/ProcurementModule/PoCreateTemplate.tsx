import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import CreatePoPage from "./CreatePoPage";
import AddPO from "./AddPO";
import { Form } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "@/store";
import { fetchDataPOEdit } from "@/features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrency } from "@/features/salesmodule/createSalesOrderSlice";
import { toast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import { removeHtmlTags } from "@/components/shared/Options";
const PoCreateTemplate = () => {
  const [tabvalue, setTabvalue] = useState<string>("create");
  const [payloadData, setPayloadData] = useState<any>(null);
  const [formVal, setFormVal] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [form] = Form.useForm();
  const [paramVal, setParamVal] = useState("");
  const [roeIs, setRoeIs] = useState("");
  const [resetSure, setResetSure] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [bilStateCode, setBillStateCode] = useState("");
  const [shipStateCode, setShipStateCode] = useState("");
  const [codeType, setCodeType] = useState("");
  const currencyval = Form.useWatch("currency", form);
  const selectedVendor = Form.useWatch("vendorName", form);
  const exchangingRate = Form.useWatch("exchange_rate", form);

  const { loading, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const resetTheValues = () => {
    setResetSure(true);
    form.resetFields();
    setRowData([]);
    setTabvalue("create");

    if (isApprove == "edit") {
      navigate("/manage-po");
      setIsApprove(false);
    } else if (isApprove == "approve") {
      navigate("/approve-po");
      setIsApprove(false);
    }
    setIsApprove(false);
  };

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
    if (params && params?.id) {
      setParamVal(params.id?.replaceAll("_", "/"));
      dispatch(fetchDataPOEdit({ pono: params.id?.replaceAll("_", "/") })).then(
        (res) => {
          if (res.payload.success) {
            let arr = res.payload.data;
            let billinid = {
              label: arr.bill?.addrbillname,
              value: arr.bill?.addrbillid,
            };

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
            form.setFieldValue("currency", arr.vendor[0]?.currency);
            form.setFieldValue(
              "duedate",
              dayjs(arr.vendor[0]?.duedate, "DD-MM-YYYY")
            );

            form.setFieldValue("exchange_rate", arr.vendor[0]?.exchangerate);

            form.setFieldValue("vendorType", ventype);
            form.setFieldValue("vendorName", arr.vendor[0]?.vendorcode);
            form.setFieldValue("branch", arr.vendor[0]?.vendorbranch);
            form.setFieldValue("vendorGst", arr.vendor[0]?.vendorgst);
            form.setFieldValue(
              "address",
              removeHtmlTags(arr.vendor[0]?.vendoraddress)
            );
            form.setFieldValue("costCenter", arr.vendor[0]?.costcenter);
            form.setFieldValue("quotation", arr.vendor[0]?.termsofquotation);
            form.setFieldValue("terms", arr.vendor[0]?.termsofcondition);
            form.setFieldValue("paymentTerms", arr.vendor[0]?.paymentterms);
            // form.setFieldValue("project", arr.vendor[0]?.project);
            form.setFieldValue("comment", arr.vendor[0]?.pocomment);
            form.setFieldValue("poType", arr.vendor[0]?.potype);
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
            let materials = res.payload.data?.materials;
            let matLst = materials?.map((r) => {
              return {
                isNew: true,
                procurementMaterial: r?.selectedComponent[0]?.text,

                vendorName: r.make,
                // currency: r.currency,
                // currency: r.exchangerate,
                orderQty: r.orderqty,
                componentKey: r?.componentKey,
                rate: r.rate,
                gstRate: r.gstrate,
                gstTypeForPO: r.gsttype[0].id,
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
          } else {
            toast({
              title: "Something went wrong",
              className: "bg-red-700 text-white",
            });
          }
          // setPayloadData(res.payload);
        }
      );
    }
  }, [params]);
  useEffect(() => {
    if (bilStateCode && shipStateCode) {
      if (Number(shipStateCode) == Number(bilStateCode)) {
        setCodeType("L");
      } else {
        setCodeType("I");
      }
    }
  }, [shipStateCode, bilStateCode]);
  useEffect(() => {
    dispatch(fetchCurrency());
  }, []);
  useEffect(() => {
    if (exchangingRate) {

      setRoeIs(exchangingRate);
    }
  }, [exchangingRate]);
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
            currencyList={currency}
            setResetSure={setResetSure}
            resetSure={resetSure}
            isApprove={isApprove}
            currencyval={currencyval}
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
            roeIs={roeIs}
            resetTheValues={resetTheValues}
            setResetSure={setResetSure}
            resetSure={resetSure}
            currencyval={currencyval}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
  0;
};

export default PoCreateTemplate;
