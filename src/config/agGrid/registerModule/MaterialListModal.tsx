import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, CsvExportModule } from "ag-grid-community";
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

interface MaterialListModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: {
    req_id: string;
  };
  loading: boolean;
}

const MaterialListModal: React.FC<MaterialListModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  row,
  loading,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);

  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    {
      headerName: "Item",
      field: "item",
    },
    {
      headerName: "Item Name",
      field: "itemName",
      width: 200,
      cellRenderer: TruncateCellRenderer,
    },
    {
      headerName: "Item Description",
      field: "itemSpecification",
      autoHeight: true,
      width: 300,
    },
    { headerName: "Item Part Number", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Rate", field: "rate" },
    { headerName: "GST Rate", field: "gstRate" },
    { headerName: "UOM", field: "uom" },
    { headerName: "Hsn Code", field: "hsnCode" },
    { headerName: "CGST Rate", field: "cgstRate" },
    { headerName: "SGST Rate", field: "sgstRate" },
    { headerName: "IGST Rate", field: "igstRate" },
    { headerName: "Remark", field: "itemRemark" },
  ];

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
            <SheetTitle>
              Material Out of {sellRequestDetails?.header?.shipment_id} for{" "}
              {row?.req_id}
            </SheetTitle>
            <SheetTitle>
              Customer Name:{" "}
              {sellRequestDetails?.header?.customer_name?.customer_name}
            </SheetTitle>
          </div>
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
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-170px)]">
          <AgGridReact
            ref={gridRef}
            modules={[CsvExportModule]}
            rowData={sellRequestDetails?.items}
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
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={onClose}
          >
            Submit
          </Button>
        </div>
      </SheetContent>

      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default MaterialListModal;
