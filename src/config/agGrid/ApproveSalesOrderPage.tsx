import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { fetchMaterialList, approveSo, rejectSo, fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import dayjs from "dayjs";
import { AgGridReact } from "ag-grid-react";
import { CsvExportModule } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "antd";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import { materialListColumnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import Protected from "@/components/Protected";
import { Star } from "lucide-react";
import styled from "styled-components";
import { cn } from "@/lib/utils";

// Approval status badge for header (Pending, Partially Approved, Approved, Rejected)
const ApprovalStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || "").trim().toLowerCase();
  const isApproved = s === "approved";
  const isRejected = s === "rejected";
  const isPartiallyApproved = s.includes("partially");
  const isPending = s === "pending" || !status;
  const pill = isApproved
    ? "bg-emerald-50 text-emerald-700"
    : isRejected
      ? "bg-red-50 text-red-700"
      : isPartiallyApproved
        ? "bg-sky-50 text-sky-700"
        : "bg-amber-50 text-amber-700";
  const dot = isApproved
    ? "bg-emerald-500"
    : isRejected
      ? "bg-red-500"
      : isPartiallyApproved
        ? "bg-sky-500"
        : "bg-amber-500";
  const label = status || "Pending";
  const displayLabel = isPartiallyApproved ? "Partially Approved" : label;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0",
        pill
      )}
    >
      <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
      {displayLabel}
    </span>
  );
};

const ApproveSalesOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectform] = Form.useForm();
  const gridRef = useRef<AgGridReact<any>>(null);
  const [soRow, setSoRow] = useState<any>(null);

  const { loading, sellRequestList, dateRange } = useSelector((state: RootState) => state.sellRequest);

  const queryParams = new URLSearchParams(location.search);
  const so_id = queryParams.get("so_id") || "";

  // Capture SO row (with approveStatus) from register list before it gets replaced by material list
  useEffect(() => {
    if (!so_id || !sellRequestList?.length) return;
    const row = sellRequestList.find((item: any) => item.so_id === so_id && item.approveStatus != null);
    if (row) setSoRow(row);
  }, [so_id, sellRequestList]);

  // Fetch register list first so we have approveStatus, then fetch material list for grid
  useEffect(() => {
    if (!so_id) {
      toast({ className: "bg-red-600 text-white", description: "No SO ID provided" });
      navigate("/sales/order/register");
      return;
    }
    const range = dateRange || `${dayjs().subtract(3, "month").format("DD-MM-YYYY")}-${dayjs().format("DD-MM-YYYY")}`;
    dispatch(fetchSellRequestList({ type: "date_wise", data: range }) as any).then(() => {
      dispatch(fetchMaterialList({ so_id }));
    });
  }, [dispatch, so_id, navigate, toast]);

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  const confirmApprove = () => {
    dispatch(approveSo({ so_id })).then((response: any) => {
      if (response?.payload?.code == 200 || response?.payload?.success) {
        toast({
          className: "bg-green-600 text-white items-center",
          description: response.payload.message || "Sales Order Approved successfully",
        });
        dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);
        navigate("/sales/order/register"); // Back to register page
      }
    });
  };

  const handleOkReject = () => {
    rejectform
      .validateFields()
      .then((values) => {
        const payload = {
          remark: values.remark || "",
          so_id,
        };
        dispatch(rejectSo(payload) as any).then((response: any) => {
          if (response?.payload?.code == 200 || response?.payload?.success) {
            rejectform.resetFields();
            dispatch(fetchSellRequestList({ type: "date_wise", data: dateRange }) as any);
            navigate("/sales/order/register"); // Back to register page
          }
        });
        setShowRejectModal(false);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const isDisabled = soRow?.approveStatus === "Approved" || soRow?.approveStatus === "Rejected";

  return (
    <Protected authentication>
      <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-50/50">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 px-5 py-4 bg-white border-b border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <h1 className="text-xl font-bold text-slate-800 truncate">Approve Sales Order for {so_id}</h1>
            {soRow?.approveStatus != null && (
              <ApprovalStatusBadge status={soRow.approveStatus} />
            )}
            <span
              className="flex items-center gap-1.5 shrink-0 text-xs font-medium text-white bg-blue-500 rounded-full px-2.5 py-1"
              title="New Feature"
            >
              <Star size={12} className="text-yellow-300" /> New features
            </span>
          </div>
          <Button
            onClick={onBtExport}
            className="shrink-0 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Grid */}
        <GridWrapper className="flex-1 min-h-0 px-5 py-4">
          {loading && <FullPageLoading />}
          <AgGridReact
            ref={gridRef}
            modules={[CsvExportModule]}
            rowData={sellRequestList}
            columnDefs={materialListColumnDefs}
            suppressCellFocus={true}
            components={{
              truncateCellRenderer: TruncateCellRenderer,
            }}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            enableCellTextSelection={true}
            className="ag-theme-quartz border border-slate-200 rounded-xl shadow-sm bg-white h-full"
          />
        </GridWrapper>

        {/* Action bar */}
        <div className="bg-white border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] flex items-center justify-end gap-4 px-6 py-4">
          <Button
            className="rounded-lg bg-slate-500 hover:bg-slate-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
            onClick={() => navigate("/sales/order/register")}
          >
            Back
          </Button>
          <Button
            className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all disabled:opacity-60"
            onClick={() => setShowRejectModal(true)}
            disabled={isDisabled}
          >
            Reject
          </Button>
          <Button
            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all disabled:opacity-60"
            onClick={confirmApprove}
            disabled={isDisabled}
          >
            Approve
          </Button>
        </div>

        <CreateInvoiceDialog
          isDialogVisible={showRejectModal}
          handleOk={handleOkReject}
          handleCancel={() => setShowRejectModal(false)}
          form={rejectform}
          loading={loading}
          heading="Reject"
          description={`Are you sure you want to Reject this SO ${so_id}?`}
        />
      </div>
    </Protected>
  );
};

const GridWrapper = styled.div`
  .ag-theme-quartz .ag-cell {
    overflow: hidden;
    min-width: 0;
  }
  .ag-theme-quartz .ag-cell-wrapper {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
  }
`;

export default ApproveSalesOrderPage;