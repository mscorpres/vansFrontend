import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { CsvExportModule } from "ag-grid-community";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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

const MaterialListModal: React.FC<MaterialListModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  columnDefs,
  title,
  title2,
  submitText,
  handleSubmit,
  handleReject,
  disableStatus,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

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
            columnDefs={columnDefs}
            suppressCellFocus={true}
            components={{
              truncateCellRenderer: TruncateCellRenderer,
            }}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            loading={loading}
            enableCellTextSelection={true}
            className="border border-gray-200 rounded-lg shadow-sm"
          />
        </div>
        <div className="bg-white border-t border-gray-100 shadow-sm h-16 flex items-center justify-end gap-3 px-6 sticky bottom-0">
          <Button
            className="rounded-md bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
            onClick={onClose}
          >
            Back
          </Button>
          {title.includes("Sales Order") && (
            <Button
              className="rounded-md bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
              onClick={handleReject}
              disabled={disableStatus}
            >
              Reject
            </Button>
          )}
          <Button
            className="rounded-md bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-sm font-medium shadow-sm transition-all"
            onClick={handleSubmit}
            disabled={disableStatus}
          >
            {submitText}
          </Button>
        </div>
      </SheetContent>
      <SheetFooter />
    </Sheet>
  );
};

export default MaterialListModal;