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
import { OverlayNoRowsTemplate } from "@/components/shared/OverlayNoRowsTemplate";

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
      headerName: "Item",
      field: "so_type",
      cellRenderer: (params:any) => {
        return params.value.charAt(0).toUpperCase() + params.value.slice(1);
      },
    },
    {
      headerName: "Material",
      field: "item_name",
      width: 500,
      cellRenderer: TruncateCellRenderer,
    },
    { headerName: "Material Description", field: "item_details" },
    { headerName: "SKU Code", field: "item_code" },
    { headerName: "Qty", field: "qty" },
    { headerName: "UoM", field: "unit" },
    { headerName: "GST Rate", field: "gst_rate" },
    { headerName: "Price", field: "price" },
    { headerName: "HSN/SAC", field: "hsn_sac" },
    { headerName: "Remark", field: "remark" },
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
          <SheetTitle>Material List of {row?.req_id}</SheetTitle>
          <div className="flex-grow flex justify-center">
            {" "}
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

export const TruncateCellRenderer = (props: any) => {
  const style = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    display: "block",
  };

  return <div style={style}>{props.value}</div>;
};
