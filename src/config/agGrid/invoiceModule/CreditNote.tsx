import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  creditNoteColumnDefs,
  RowData,
} from "@/config/agGrid/SalseOrderCreateTableColumns";
import CreditTextInputCellRenderer from "@/config/agGrid/invoiceModule/CreditTextInputCellRenderer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createCreditNote } from "@/features/salesmodule/salesInvoiceSlice";
import { Button, Form } from "antd";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaQuestionCircle } from "react-icons/fa";

interface Item {
  item: string;
  itemName: string;
  itemPartNo?: string;
  customer_part_no?: string | null;
  itemSpecification?: string;
  qty: string;
  rate: string;
  uom: string;
  gstRate: string;
  gstType: { id: string; text: string }[];
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  dueDate: string;
  hsnCode: string;
  // CHANGED: Updated currency to be an object instead of string
  currency: {
    id: string | null;
    symbol: string;
    label: string;
  };
  exchange_rate?: string;
  itemRemark: string;
}

interface ConfirmationModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  onOkay: () => void;
  title: string;
  description: string;
  submitText?: string;
  cancelText?: string;
}

interface CreditNoteProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onOkay,
  title,
  description,
  submitText = "Yes, Proceed",
  cancelText = "No",
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px] rounded-lg"
      >
        <div className="flex gap-4 p-4">
          <div className="flex-shrink-0">
            <FaQuestionCircle className="text-blue-400 text-4xl" />
          </div>
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800">{title}</DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">
                <span className="font-bold">Note:</span> {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end p-4 bg-gray-100 rounded-b-lg">
          <Button
            onClick={() => onClose(false)}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => onOkay()}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CreditNote: React.FC<CreditNoteProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  row,
}) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);
  const [igstTotal, setIgstTotal] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [form] = Form.useForm();

  console.log("sellRequestDetails:", sellRequestDetails);

  const totalValue = sellRequestDetails?.items?.reduce(
    (acc: number, item: Item) => {
      const orderQty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      return acc + orderQty * rate;
    },
    0
  );

  const { currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const { loading }: any = useSelector((state: RootState) => state.sellInvoice);

  useEffect(() => {
    const updatedData: RowData[] = sellRequestDetails?.items?.map(
      (material: Item) => {
        // CHANGED: Calculate initial GST values based on gstType
        const orderQty = parseFloat(material.qty) || 1;
        const rate = parseFloat(material.rate) || 0;
        const localValue = rate * orderQty;
        const gstRate = parseFloat(material.gstRate) || 0;
        const gstCalculation = (localValue * gstRate) / 100;
        
        let cgst = 0, sgst = 0, igst = 0;
        const gstTypeId = material.gstType?.[0]?.id || "";
        
        if (gstTypeId === "L") {
          cgst = gstCalculation / 2;
          sgst = gstCalculation / 2;
        } else if (gstTypeId === "I") {
          igst = gstCalculation;
        }

        const row = {
          material: material.item || "",
          itemName: material.itemName || "",
          partno: material.itemPartNo || "",
          materialDescription: material.itemSpecification || "",
          rate: rate,
          orderQty: orderQty,
          // CHANGED: Store currency as object with proper structure
         
          currency: material.currency?.label,
          currencyLabel: material.currency?.symbol,
          // CHANGED: Store gstType properly with text for display
          gstType: material.gstType?.[0]?.id || "",
          gstTypeText: material.gstType?.[0]?.text || "",
          localValue: localValue,
          foreignValue: rate,
          // CHANGED: Use calculated GST values instead of raw rates
          cgst: parseFloat(cgst.toFixed(2)),
          sgst: parseFloat(sgst.toFixed(2)),
          igst: parseFloat(igst.toFixed(2)),
          dueDate: material.dueDate || "",
          hsnCode: material.hsnCode || "",
          remark: material.itemRemark || "",
          gstRate: gstRate,
          exchange_rate: parseFloat(material.exchange_rate || "1"),
          updateid: material.item || "",
          isNew: true,
        };
        return row;
      }
    ) || [];
    setRowData(updatedData);
    console.log("Initial rowData with GST:", updatedData);
  }, [sellRequestDetails, currency]);

  // CHANGED: Recalculate totals whenever rowData changes (not on interval)
  useEffect(() => {
    if (rowData && rowData.length > 0) {
      const cgstSum = rowData.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.cgst) || 0),
        0
      );
      const sgstSum = rowData.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.sgst) || 0),
        0
      );
      const igstSum = rowData.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.igst) || 0),
        0
      );

      setCgstTotal(cgstSum);
      setSgstTotal(sgstSum);
      setIgstTotal(igstSum);
    }
  }, [rowData]);

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <CreditTextInputCellRenderer
          {...props}
          setRowData={setRowData}
          currency={currency}
        />
      ),
    }),
    [currency]
  );

  console.log("rowData22:", rowData);

  const materials = {
    item: rowData?.map((component: RowData) =>
      typeof component.material === "string" ? component.material : ""
    ),
    qty: rowData?.map((component: RowData) =>
      component?.orderQty === undefined
        ? null
        : Number(Number(component.orderQty).toFixed(2))
    ),
    rate: rowData?.map(
      (component: RowData) => Number(component.rate) || 0
    ),
    gst_rate: rowData?.map(
      (component: RowData) => Number(component.gstRate) || 0
    ),
    // CHANGED: Send currency ID to backend
    currency: rowData?.map((component: RowData) => component.currency || ""),
    exchange_rate: rowData?.map(
      (component: RowData) => Number(component.exchange_rate) || 1
    ),
    // CHANGED: Send gstType ID (L or I) to backend
    gst_type: rowData?.map((component: RowData) => component.gstType || ""),
    hsn_code: rowData?.map((component: RowData) => component.hsnCode || ""),
    due_date: rowData?.map((component: RowData) => component.dueDate || ""),
    cgst_rate: rowData?.map((component: RowData) => component.cgst || 0),
    sgst_rate: rowData?.map((component: RowData) => component.sgst || 0),
    igst_rate: rowData?.map((component: RowData) => component.igst || 0),
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: any = {
        invoice_id: row?.req_id,
        costcenter: sellRequestDetails?.header?.costcenter?.code,
        po_date: sellRequestDetails?.header?.po_date,
        po_number: sellRequestDetails?.header?.po_number,
        other_ref: values.otherRef,
        itemDetails: materials,
      };

      console.log("Submit payload:", payload);
      setIsDialogVisible(false);
      await dispatch(createCreditNote(payload)).unwrap();
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation or submission error:", error);
    }
  };

  const filteredColumnDefs = creditNoteColumnDefs;

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader></SheetHeader>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        {loading && <FullPageLoading />}
        <SheetTitle>
          Create Credit Note of {sellRequestDetails?.header?.invoiceNumber || sellRequestDetails?.header?.shipment_id || "--"}
        </SheetTitle>
        <div className="ag-theme-quartz h-[calc(100vh-140px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill To Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Client:</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.header?.customer_name?.customer_name || "--"}
                </p>
                <h3 className="font-[600]">Branch:</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.header?.customer?.branch?.branchname || "--"}
                </p>
                <h3 className="font-[600]">Address:</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.header?.customer?.address1 || "--"}
                </p>
                 <p className="text-[14px]">
                  {sellRequestDetails?.header?.customer?.address2 || "--"}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-600">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Dispatch From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-500">
                <h3 className="font-[600]">Name:</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.header?.bill_from?.billing?.name || "--"}
                </p>
               <h3 className="font-[600]">Gst No:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.bill_from?.gstin || "--"}</p>
                 <h3 className="font-[600]">Pan No:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.bill_from?.pan || "--"}</p>
                <h3 className="font-[600]">Address:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.bill_from?.address1 || "--"}</p>
                <p className="text-[14px]">{sellRequestDetails?.header?.bill_from?.address2 || "--"}</p>
                  
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Ship To
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Name:</h3>
                <p className="text-[14px]">
                  {sellRequestDetails?.header?.ship_to?.company || "--"}
                </p>
               <h3 className="font-[600]">Gst No:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.ship_to?.gstin || "--"}</p>
                 <h3 className="font-[600]">Pan No:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.ship_to?.panno || "--"}</p>
                <h3 className="font-[600]">Address:</h3>
                <p className="text-[14px]">{sellRequestDetails?.header?.ship_to?.address1 || "--"}</p>
                <p className="text-[14px]">{sellRequestDetails?.header?.ship_to?.address2 || "--"}</p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Tax Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <ul>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">
                          Sub-Total value before Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">{totalValue?.toFixed(2)}</p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">CGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){cgstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){sgstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">IGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){igstTotal?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600] text-cyan-600">
                          Sub-Total value after Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {(
                            totalValue +
                            cgstTotal +
                            sgstTotal +
                            igstTotal
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-3">
            <AgGridReact
              rowData={rowData}
              columnDefs={filteredColumnDefs as (ColDef | ColGroupDef)[]}
              suppressCellFocus={true}
              components={components}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
            />
          </div>
          <ConfirmationModal
            open={isDialogVisible}
            onClose={() => setIsDialogVisible(false)}
            onOkay={onSubmit}
            title="Confirm Submission"
            description="Are you sure you want to submit this credit note?"
          />
        </div>
        <div className="bg-white border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px] text-white"
            onClick={() => setIsDialogVisible(true)}
          >
            Submit
          </Button>
        </div>
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default CreditNote;