import { TruncateCellRenderer } from "@/General";
// import { MaterialListModal } from "./registerModule/MaterialListModal";
import React, { useCallback, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { CsvExportModule } from "ag-grid-community";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Save, Pencil, X } from "lucide-react";
// import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";
// import { useDispatch } from "react-redux";
import { updatePendingQty } from "@/features/salesmodule/createSalesOrderSlice";
import { toast } from "@/components/ui/use-toast";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useDispatch } from "react-redux";

// Define props for the custom cell renderer
interface PendingQtyCellRendererProps {
  value: number; // pending_qty
  data: {
    ID: number;
    qty: number;
    so_id: string;
  }; // Row data
}

// Custom cell renderer for pending_qty
const PendingQtyCellRenderer: React.FC<PendingQtyCellRendererProps> = ({ value, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pendingQty, setPendingQty] = useState(value);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0); // Auto-focus input
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setPendingQty(value); // Reset to original value
  };

  const handleSaveClick = async () => {
    const newQty = Number(pendingQty);
    if (isNaN(newQty) || newQty < 0) {
      toast({ variant: "destructive", title: "Invalid quantity", description: "Pending quantity must be a non-negative number." });
      return;
    }
    if (newQty > data.qty) {
      toast({ variant: "destructive", title: "Invalid quantity", description: `Pending quantity cannot exceed ordered quantity (${data.qty}).` });
      return;
    }

    try {
      const result = await dispatch(
        updatePendingQty({
          so_id: data.so_id,
          items: [{ ID: data.ID, pending_qty: newQty }],
        })
      ).unwrap();
      if (result.success) {
        setIsEditing(false);
        toast({ title: "Success", description: "Pending quantity updated successfully." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error as string });
    }
  };

  return (
    <div className="flex items-center h-full gap-2.5">
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            type="number"
            value={pendingQty}
            onChange={(e) => setPendingQty(Number(e.target.value))}
            className="w-20 h-8 text-sm border-gray-200 focus:border-blue-600 focus:ring-blue-600 rounded-sm transition-all"
          />
          <button onClick={handleSaveClick} className="text-green-600 hover:text-green-700 transition-colors" title="Save">
            <Save className="h-4 w-4" />
          </button>
          <button onClick={handleCancelClick} className="text-red-600 hover:text-red-700 transition-colors" title="Cancel">
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <>
          <span className="text-gray-700 text-sm">{value}</span>
          <button onClick={handleEditClick} className="text-blue-600 hover:text-blue-700 transition-colors" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

interface MaterialListModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: {
    req_id: string;
  };
  loading: boolean;
  columnDefs: any;
  title: string;
  title2?: string;
  submitText: string;
  handleSubmit: () => void;
  handleReject?: () => void;
  disableStatus?: boolean;
}
const MaterialListModal: React.FC<MaterialListModalProps> = ({ visible, onClose, sellRequestDetails, loading, columnDefs, title, title2, submitText, handleSubmit, handleReject, disableStatus }) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const dispatch = useDispatch();

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  // Update columnDefs to use PendingQtyCellRenderer for pending_qty
  const updatedColumnDefs = columnDefs.map((col: any) => (col.field === "pending_qty" ? { ...col, cellRenderer: "pendingQtyCellRenderer" } : col));

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <SheetTitle>{title}</SheetTitle>
            <SheetTitle>{title2}</SheetTitle>
          </div>
          <div className="flex-grow text-right mr-4 ">
            <Button type="button" onClick={onBtExport} className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500">
              <Download size={16} />
            </Button>
          </div>
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-180px)]">
          {loading && <FullPageLoading />}
          <AgGridReact
            ref={gridRef}
            modules={[CsvExportModule]}
            rowData={sellRequestDetails}
            columnDefs={updatedColumnDefs}
            suppressCellFocus={true}
            components={{
              truncateCellRenderer: TruncateCellRenderer,
              pendingQtyCellRenderer: PendingQtyCellRenderer,
            }}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            loading={loading}
            enableCellTextSelection={true}
            className="border border-gray-200 rounded-lg shadow-sm"
          />
        </div>
        <div className="bg-white border-t border-gray-100 shadow-sm h-16 flex items-center justify-end gap-3 px-6 sticky bottom-0">
          <Button className="rounded-md bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all" onClick={onClose}>
            Back
          </Button>
          {title.includes("Sales Order") && (
            <Button className="rounded-md bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all" onClick={handleReject} disabled={disableStatus}>
              Reject
            </Button>
          )}
          <Button className="rounded-md bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all" onClick={handleSubmit} disabled={disableStatus}>
            {submitText}
          </Button>
        </div>
      </SheetContent>
      <SheetFooter />
    </Sheet>
  );
};

export default MaterialListModal;
