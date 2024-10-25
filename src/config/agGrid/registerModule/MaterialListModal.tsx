import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, CsvExportModule } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { TruncateCellRenderer } from "@/General";

interface MaterialListModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any[];
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
      headerName: "SO ID",
      field: "so_id",
      width: 150,
    },
    {
      headerName: "Item",
      field: "item",
      width: 200,
    },
    {
      headerName: "Material",
      field: "itemName",
      width: 300,
      cellRenderer: TruncateCellRenderer,
    },
    {
      headerName: "Material Specification",
      field: "itemSpecification",
      cellRenderer: TruncateCellRenderer,
    },
    { headerName: "SKU Code", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },
    { headerName: "UoM", field: "uom" },
    { headerName: "GST Rate", field: "gstRate" },
    { headerName: "Price", field: "rate" },
    { headerName: "HSN/SAC", field: "hsnCode" },
    { headerName: "Remark", field: "itemRemark" },
  ];

  // const onBtExport = useCallback(() => {
  //   if (gridRef.current) {
  //     gridRef.current.api.exportDataAsCsv();
  //   }
  // }, []);

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
          <SheetTitle>Material List of {row?.req_id}</SheetTitle>
          {/* <div className="flex-grow flex justify-center">
            <Button
              type="button"
              onClick={onBtExport}
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            >
              <Download />
            </Button>
          </div> */}
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-140px)]">
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
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default MaterialListModal;
