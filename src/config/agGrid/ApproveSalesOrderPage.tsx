import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store";
import { fetchMaterialList, approveSo, rejectSo, fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
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
import { materialListColumnDefs }from "@/config/agGrid/SalesOrderRegisterTableColumns";
import MainLayout from "@/layouts/MainLayout";// Assume your layouts
// import SOLayout from "@/layouts/SOLayout";
import Protected from "@/components/Protected";
import { Star } from "lucide-react";

const ApproveSalesOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectform] = Form.useForm();
  const gridRef = useRef<AgGridReact<any>>(null);

  const {  loading, sellRequestList, dateRange } = useSelector((state: RootState) => state.sellRequest); // Assume materialList is in state

  // Get so_id from query param
  const queryParams = new URLSearchParams(location.search);
  const so_id = queryParams.get("so_id") || "";

  // Fetch material list on page load
  useEffect(() => {
    if (so_id) {
      dispatch(fetchMaterialList({ so_id }));
    } else {
      // Optional: Handle no so_id (e.g., navigate back or show error)
      toast({ className: "bg-red-600 text-white", description: "No SO ID provided" });
      navigate("/sales/order/register");
    }
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

  // Find the row's approveStatus for disabling buttons
  const rowData = sellRequestList.find((item) => item.so_id === so_id);
  const isDisabled = rowData?.approveStatus === "Approved" || rowData?.approveStatus === "Rejected";

  return (
    <Protected authentication>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Approve Sales Order for {so_id}</h1>
            <span
              className="flex items-center gap-1 text-xs font-medium text-white bg-blue-500 rounded-full px-2 py-1"
              title="New Feature"
            >
              <Star size={12} className="text-yellow-300" /> New features
            </span>
          </div>
          <Button onClick={onBtExport} className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500">
            <Download size={16} />
          </Button>
        </div>
            <div className="ag-theme-quartz h-[calc(100vh-180px)]">
              {loading && <FullPageLoading />}
              <AgGridReact
                ref={gridRef}
                modules={[CsvExportModule]}
                rowData={sellRequestList} // Use materialList from Redux
                columnDefs={materialListColumnDefs}
                suppressCellFocus={true}
                components={{
                  truncateCellRenderer: TruncateCellRenderer,
                }}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                
                enableCellTextSelection={true}
                className="border border-gray-200 rounded-lg shadow-sm"
              />
            </div>

            <div className="bg-white border-t border-gray-100 shadow-sm h-16 flex items-center justify-end gap-3 px-6 sticky bottom-0">
              <Button
                className="rounded-md bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
                onClick={() => navigate("/sales/order/register")}
              >
                Back
              </Button>
              <Button
                className="rounded-md bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
                onClick={() => setShowRejectModal(true)}
                disabled={isDisabled}
              >
                Reject
              </Button>
              <Button
                className="rounded-md bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
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
        {/* </SOLayout> */}
      {/* </MainLayout> */}
    </Protected>
  );
};

export default ApproveSalesOrderPage;