import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@/components/ui/button";

const BoxesListSheet = ({ open, close, data, onSelect, loading }: any) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [totalSum, setTotalSum] = useState(0); // Total sum of selected quantities
  const [rowData, setRowData] = useState<any[]>([]);
  const gridRef = useRef<AgGridReact<any>>(null);

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: "Box Name", field: "box_name" },
    {
      headerName: "Stock Quantity",
      field: "stock",
      cellRenderer: (params: any) => {
        const { value, colDef, data, api, column } = params;

        // Update quantity and refresh the grid
        const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          data[colDef.field] = newValue; // Update only the qty field
          api.refreshCells({
            rowNodes: [params.node],
            columns: [column, "stock"],
          });
        };

        return (
          <input
            type="number"
            value={value}
            onChange={onChangeQty}
            className="p-2 border border-gray-300 rounded-md"
          />
        );
      },
    },
  ];

  // Update the total sum whenever selected rows change or quantities are updated
  useEffect(() => {
    const sum = selectedRows.reduce(
      (acc, row) => acc + (parseInt(row.stock) || 0),
      0
    );
    setTotalSum(sum);
  }, [selectedRows]);

  // Handle row selection change
  const onSelectionChanged = () => {
    const selectedRow = gridRef.current?.api.getSelectedRows();
    setSelectedRows(selectedRow || []);
  };

  // Handle cell value change (when stock quantity is changed)
  const onCellValueChanged = (event: any) => {
    // When a cell value changes (e.g., stock quantity), we need to update the selected rows and recalculate the sum
    const updatedRow = event.data;
    const updatedRows = [...selectedRows];
    const rowIndex = updatedRows.findIndex(
      (row) => row.box_name === updatedRow.box_name
    );

    if (rowIndex >= 0) {
      updatedRows[rowIndex] = updatedRow; // Update the modified row
    }

    setSelectedRows(updatedRows); // Update the selectedRows state with the new value
  };

  const handleOkClose = () => {
    // Send the selected data back to the parent component
    const selectedData = selectedRows; // For simplicity, assuming `data` is what we want to send back
    onSelect(selectedData); // Pass the selected data back to the parent
    setSelectedRows([]);
  };

  useEffect(() => {
    setRowData(data);
  }, [data]);

  return (
    <>
      <Sheet open={open} onOpenChange={close}>
        <SheetHeader></SheetHeader>
        <SheetContent
          side={"right"}
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
          className="min-w-[600px]" // Adjust width here
        >
          <div className="flex justify-between items-center mt-4 ">
            <div>
              <SheetTitle> Storable BOX(es) List</SheetTitle>
            </div>
          </div>

          <div className="ag-theme-quartz h-[calc(100vh-170px)]">
            <AgGridReact
              ref={gridRef}
              rowSelection={rowSelection}
              rowData={rowData}
              columnDefs={columnDefs}
              suppressCellFocus={true}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              onSelectionChanged={onSelectionChanged} // Listen for row selection change
              onCellValueChanged={onCellValueChanged} // Listen for cell value change
              loading={loading}
              enableCellTextSelection = {true}
            />
          </div>

          <div className="mt-2">
            <strong>Total Sum:</strong> {totalSum}
          </div>

          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={close}
            >
              Back
            </Button>
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={handleOkClose}
            >
              OK & Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BoxesListSheet;
