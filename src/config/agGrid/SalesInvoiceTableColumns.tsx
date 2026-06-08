import { RowData } from "@/types/SalesInvoiceTypes";
import { ColDef } from "ag-grid-community";
import { Button, Dropdown, Form } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  addfreight,
  cancelInvoice,
  fetchDataNotes,
  fetchInvoiceDetail,
  fetchSalesOrderInvoiceList,
  printExportInvoice,
  printPackingList,
  printSellInvoice,
} from "@/features/salesmodule/salesInvoiceSlice";
import { AppDispatch, RootState } from "@/store";
import { useState } from "react";
import { ConfirmCancellationDialog } from "@/config/agGrid/registerModule/ConfirmCancellationDialog";
import ViewInvoiceModal from "@/config/agGrid/salesmodule/ViewInvoiceModal";
import { downloadFunction, printFunction } from "@/components/shared/PrintFunctions";
import AddFreightModal from "./salesmodule/AddFreightModal"; 
import AddDocketNumberModal from "./salesmodule/AddDocketNumberModal";
import CreditNote from "./invoiceModule/CreditNote";

// Round status indicator for Invoice Status (elive/inventory style)
const InvoiceStatusBadge: React.FC<{ value: string }> = ({ value }) => {
  const status = (value || "").trim();
  const lower = status.toLowerCase();
  const config: Record<string, { pill: string; dot: string; label: string }> = {
    approved: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", label: "Approved" },
    active: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", label: "Active" },
    cancelled: { pill: "bg-red-50 text-red-700", dot: "bg-red-500", label: "Cancelled" },
    cancel: { pill: "bg-red-50 text-red-700", dot: "bg-red-500", label: "Cancelled" },
    pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500", label: "Pending" },
    rejected: { pill: "bg-red-50 text-red-700", dot: "bg-red-500", label: "Rejected" },
  };
  const key = Object.keys(config).find((k) => lower.includes(k)) || "pending";
  const { pill, dot, label } = config[key] || config.pending;
  const displayLabel = config[key]?.label ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        pill
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
      {displayLabel}
    </span>
  );
};

// Small round dot + text for Yes/No (e-wayBill, e-Invoice)
const YesNoIndicator: React.FC<{ value: string; yesLabel?: string; noLabel?: string }> = ({
  value,
  yesLabel = "Yes",
  noLabel = "No",
}) => {
  const isYes = (value || "").toString().toLowerCase() === "yes" || value === "Y";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          isYes ? "bg-emerald-500" : "bg-slate-300"
        )}
      />
      <span className={isYes ? "text-emerald-700 font-medium" : "text-slate-500"}>
        {isYes ? yesLabel : noLabel}
      </span>
    </span>
  );
};

const ActionMenu: React.FC<any> = ({ row }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewInvoice, setViewInvoice] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [addFreightModalVisible, setAddFreightModalVisible] = useState(false); // New state for freight modal
  const [addDocketModalVisible, setAddDocketModalVisible] = useState(false);

const [viewCreditNote, setViewCreditNote] = useState(false);
  const [form] = Form.useForm();
  const { challanDetails,dataNotes, loading }: any = useSelector(
    (state: RootState) => state.sellInvoice
  );

  
  const dateRange = useSelector(
    (state: RootState) => state.sellRequest.dateRange
  );

  const handleViewInvoice = (row: any) => {
    setViewInvoice(true);
    dispatch(fetchInvoiceDetail({ invoiceNo: row.invoiceNo }));
  };
    const handleViewCreditNote = (row: any) => {
    if (!row?.shipmentId) {
      return;
    }
    dispatch(fetchDataNotes({ shipment_id: row.shipmentId })).then((res: any) => {
      if (res?.payload?.success) {
        setViewCreditNote(true);
      }
    });
  };

  const handleAddFreight = (so_inv_id: string, freight: string) => {
    dispatch(addfreight({ so_inv_id, freight }));
  };

  const handlePrintInvoice = async (orderId: string, printInvType: string) => {
    dispatch(
      printSellInvoice({ invoiceNo: orderId, printType: printInvType })
    ).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data,
          response?.payload?.data.filename);
      }
    });
  };
    const handleExportInvoice = async (orderId: string, printInvType: string) => {
    dispatch(
      printExportInvoice({ invoiceNo: orderId, printType: printInvType })
    ).then((response: any) => {
      if (response?.payload?.success) {
        printFunction(response?.payload?.data.buffer.data,
          response?.payload?.data.filename);
      }
    });
  };
  const handlePrintClick = () => {
    if (row?.approveStatus !== "PENDING") {
      handleViewCreditNote(row);
    }
  };

  const handleDownloadPackingList = () => {
    dispatch(printPackingList({ invoiceNo: row.invoiceNo }));
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          cancelReason: values.remark,
          invoice_no: row.invoiceNo,
        };
        dispatch(cancelInvoice(payload)).then((response: any) => {
          if (response?.payload?.success) {
            form.resetFields();
            dispatch(
              fetchSalesOrderInvoiceList({
                type: "date_wise",
                data: dateRange,
              }) as any
            );
          }
        });
        setCancelModalVisible(false);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const isDisabled = row.invStatus === "Cancelled";

  const menuItems = [
    {
      key: "AddFreight",
      label: (
        <div onClick={() => setAddFreightModalVisible(true)}>Add Freight</div>
      ), 
    },
    {
      key: "addDocketNumber",
      label: (
        <div onClick={() => setAddDocketModalVisible(true)}>Add Docket Number</div>
      ),
    },
    {
      key: "view",
      label: <div onClick={() => handleViewInvoice(row)}>View</div>,
    },
    {
      key: "packingList",
      label: (
        <div onClick={handleDownloadPackingList}>Package List</div>
      ),
    },
    {
      key: "materialList",
      label: (
        <div
          onClick={() => !isDisabled && setCancelModalVisible(true)}
          style={{
            color:
              isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y"
                ? "gray"
                : "inherit",
            cursor:
              isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y"
                ? "not-allowed"
                : "pointer",
          }}
        >
          Cancel
        </div>
      ),
      disabled: isDisabled || row?.ewaybill === "Y" || row?.eInvoice === "Y",
    },
    {
      key: "createCreditNote",
      label: (
        <div
          onClick={handlePrintClick} // Separate function to handle print click
          style={{
            cursor: row?.approveStatus === "PENDING" ? "not-allowed" : "pointer",
            color: row?.approveStatus === "PENDING" ? "gray" : "inherit",
          }}
        >
          Credit Note
        </div>
      ),
      disabled: row?.approveStatus === "PENDING",
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <Button icon={<MoreOutlined />} />
      </Dropdown>
      <ViewInvoiceModal
        visible={viewInvoice}
        onClose={() => setViewInvoice(false)}
        sellRequestDetails={challanDetails}
        handlePrintInvoice={handlePrintInvoice}
        handleExportInvoice={handleExportInvoice}
        loading={loading}
      />
      <ConfirmCancellationDialog
        isDialogVisible={cancelModalVisible}
        handleOk={handleOk}
        handleCancel={() => setCancelModalVisible(false)}
        row={{ req_id: row.so_ship_invoice_id }}
        form={form}
        module="Invoice"
        loading={loading}
      />
      
      <AddFreightModal
        visible={addFreightModalVisible}
        onClose={() => setAddFreightModalVisible(false)}
        invoiceNo={row.invoiceNo}
      />
      <AddDocketNumberModal
        visible={addDocketModalVisible}
        onClose={() => setAddDocketModalVisible(false)}
        invoiceNo={row.invoiceNo}
      />

      <CreditNote
        visible={viewCreditNote}
        onClose={() => setViewCreditNote(false)}
        sellRequestDetails={dataNotes || {}}
        row={{ req_id: row.invoiceNo }}
       
      />
    </>
  );
};

export default ActionMenu;

export const columnDefs: ColDef<RowData>[] = [
  {
    headerName: "Actions",
    maxWidth: 100,
    cellRenderer: (params: any) => {
      return <ActionMenu row={params.data} />;
    },
  },
  {
    headerName: "#",
    valueGetter: "node.rowIndex + 1",
    maxWidth: 50,
    filter: false,
  },
  {
    headerName: "SO Invoice ID",
    field: "invoiceNo",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Shipment ID",
    field: "shipmentId",
    filter: "agTextColumnFilter",
  },
  {
    headerName:"SO ID",
    field: "soId",
    filter: "agTextColumnFilter",
  },
  {
    headerName:"Po Number",
    field: "po_number",
    filter: "agTextColumnFilter",
  },
  {
    headerName:"Po Date", 
    field: "po_date",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Invoice Status",
    field: "invStatus",
    filter: "agTextColumnFilter",
    cellRenderer: (params: any) => <InvoiceStatusBadge value={params?.data?.invStatus ?? ""} />,
  },
  {
    headerName: "Customer Name",
    field: "custName",
    filter: "agTextColumnFilter",
    width: 300,
  },
  {
    headerName: "Supplier Name",
    field: "supplier",
    filter: "agTextColumnFilter",
    width: 280,
  },
  {
    headerName: "e-wayBill",
    field: "ewaybill",
    filter: "agTextColumnFilter",
    cellRenderer: (params: any) => (
      <YesNoIndicator value={params?.data?.ewaybill === "N" ? "No" : "Yes"} />
    ),
  },
  {
    headerName: "e-Invoice",
    field: "eInvoice",
    filter: "agTextColumnFilter",
    cellRenderer: (params: any) => (
      <YesNoIndicator value={params?.data?.eInvoice === "N" ? "No" : "Yes"} />
    ),
  },
  {
    headerName: "Create Date",
    field: "createDate",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Create By",
    field: "createBy",
    filter: "agTextColumnFilter",
    width: 200,
  },
];