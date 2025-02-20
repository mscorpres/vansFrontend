import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { CsvExportModule } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import FullPageLoading from "@/components/shared/FullPageLoading";

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
  disableStatus?:boolean;
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
      <SheetHeader></SheetHeader>
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
          {
            <div className="flex-grow flex justify-center">
              {/* Centering container */}
              <Button
                type="button"
                onClick={onBtExport}
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                <Download />
              </Button>
            </div>
          }
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-170px)]">
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
          />
        </div>
        <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={onClose}
          >
            Back
          </Button>
          {title.includes("Sales Order") && (
            <Button
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={handleReject}
              disabled={disableStatus}
            >
              Reject
            </Button>
          )}
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={handleSubmit}
            disabled={disableStatus}
          >
            {submitText}
          </Button>
        </div>
      </SheetContent>

      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default MaterialListModal;
