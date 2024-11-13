import React, { useMemo, useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ColDef, RowSelectionOptions } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Button } from "@/components/ui/button";

const BoxesListSheet = ({ open, close, data }: any) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [totalSum, setTotalSum] = useState(0);

  const rowSelection = useMemo<RowSelectionOptions | "single" | "multiple">(() => {
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
    const sum = selectedRows.reduce((acc, row) => acc + (parseInt(row.stock) || 0), 0);
    setTotalSum(sum);
  }, [selectedRows]);

  // Handle row selection change
  const onSelectionChanged = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedRows(selectedData);
  };

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
              rowSelection={rowSelection}
              rowData={data}
              columnDefs={columnDefs}
              suppressCellFocus={true}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              onSelectionChanged={onSelectionChanged} // Listen for row selection change
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
              // onClick={handleSubmit}
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
