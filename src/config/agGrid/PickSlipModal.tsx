import React, { useMemo, useRef, useState } from "react";
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
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import BoxesListSheet from "@/config/agGrid/shipmentModule/BoxesListSheet";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableStock,
  stockOut,
} from "@/features/salesmodule/salesShipmentSlice";
import { toast } from "@/components/ui/use-toast";
import { Circle } from "lucide-react";

interface PickSlipModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: {
    req_id: string;
  };
  loading: boolean;
  setSubmitSuccess: any;
}

const PickSlipModal: React.FC<PickSlipModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  setSubmitSuccess,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [rowItem, setRowItem] = useState<string>(""); // Composite key: item + dueDate
  const [selectedBoxes, setSelectedBoxes] = useState<{
    [rowId: string]: { boxes: string[]; qty: string[] };
  }>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { availableStock } = useSelector(
    (state: RootState) => state.sellShipment
  );

  // Create a composite key for uniqueness
  const getRowId = (item: string, dueDate: string) =>
    `${item}_${dueDate.replace(/[^a-zA-Z0-9]/g, "-")}`; // Sanitize dueDate

  // Handle box selection click
  const handleBoxesClick = (params: any) => {
    setSheetOpen(true);
    const rowId = getRowId(params.data.item, params.data.dueDate);
    setRowItem(rowId);
    const payload = {
      c_center: sellRequestDetails?.header?.costcenter?.code,
      component: params.data?.item,
    };
    dispatch(fetchAvailableStock(payload) as any).then((response: any) => {
      if (response.payload.code === 200) {
        toast({
          title: "Stock fetched successfully",
          className: "bg-green-600 text-white flex items-center gap-2",
          duration: 3000,
        });
      }
    });
  };

  // Handle selected boxes and quantities
  const handleSelectedBoxes = (selectedData: any, rowId: string) => {
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [rowId]: {
        boxes: selectedData.map((item: any) => item.box_name),
        qty: selectedData.map((item: any) => item.stock),
      },
    }));
    setSheetOpen(false);
  };

  // Handle checkbox selection
  const handleRowSelection = (params: any) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedIds = selectedNodes.map((node: any) =>
      getRowId(node.data.item, node.data.dueDate)
    );
    setSelectedRows(selectedIds);
  };

  // Custom cell renderer for Item Name with isMaterialOut indicator and tooltip
  const ItemNameWithMaterialOutRenderer = (params: any) => {
    const { value, data } = params;
    const isMaterialOut = data.isMaterialOut;

    return (
      <div className="flex items-center gap-2">
        <div className="relative group">
          <Circle
            className={`w-4 h-4 ${isMaterialOut ? "text-red-600" : "text-green-600"}`}
            aria-label={isMaterialOut ? "Already Out" : "Ready to Out"}
          />
          <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 z-10">
            {isMaterialOut ? "Already Out" : "Ready to Out"}
          </div>
        </div>
        <TruncateCellRenderer {...params} />
      </div>
    );
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      headerName: "Select",
      field: "select",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 80,
      cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
    },
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      maxWidth: 60,
      cellStyle: { textAlign: "center", fontWeight: "500" },
    },
    {
      headerName: "Item Name",
      field: "itemName",
      width: 200,
      cellRenderer: ItemNameWithMaterialOutRenderer,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Item Description",
      field: "itemSpecification",
      width: 300,
      autoHeight: true,
      wrapText: true,
      cellStyle: { lineHeight: "1.5" },
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      width: 150,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "OUT BOX(es)",
      field: "outBoxQty",
      width: 200,
      cellRenderer: (params: any) => {
        const rowId = getRowId(params.data.item, params.data.dueDate);
        const selectedForRow = selectedBoxes[rowId];

        return (
          <button
            className="w-full text-left py-2 px-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-blue-800 font-medium"
            onClick={() => handleBoxesClick(params)}
            aria-label="Select Out Boxes"
          >
            {selectedForRow && selectedForRow?.boxes?.length > 0
              ? selectedForRow.boxes.join(", ")
              : "Select Out Box(es)"}
          </button>
        );
      },
    },
    {
      headerName: "Item Part Number",
      field: "itemPartNo",
      width: 150,
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Qty",
      field: "qty",
      width: 100,
      cellStyle: { textAlign: "right", fontWeight: "500" },
    },
    {
      headerName: "Remark",
      field: "remark",
      width: 200,
      cellRenderer: (params: any) => {
        const { value, colDef, data, api, column } = params;
        const onRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          data[colDef.field] = newValue;
          api.refreshCells({
            rowNodes: [params.node],
            columns: [column],
          });
          api.applyTransaction({ update: [data] });
        };
        return (
          <input
            type="text"
            value={value || ""}
            onChange={onRemarkChange}
            className="w-full py-1.5 px-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200"
            placeholder="Add remark"
            aria-label="Remark input"
          />
        );
      },
    },
  ];

  // Table data with unique rowId and isMaterialOut
  const tableData = useMemo(
    () => availableStock?.map((item) => ({ ...item })) || [],
    [availableStock]
  );
  const tableData2 = useMemo(
    () =>
      Array.isArray(sellRequestDetails?.items)
        ? sellRequestDetails?.items?.map((item: any) => ({
            ...item,
            rowId: getRowId(item.item, item.dueDate), // Add rowId for uniqueness
            isMaterialOut: item.isMaterialOut || false, // Ensure isMaterialOut is defined
          }))
        : [],
    [sellRequestDetails?.items]
  );

  // Submit handler
  const onSubmit = () => {
    const selectedItems = sellRequestDetails?.items?.filter((item: any) =>
      selectedRows.includes(getRowId(item.item, item.dueDate))
    );

    if (selectedRows.length === 0) {
      toast({
        title: "Please select at least one item to stock out",
        className: "bg-red-600 text-white flex items-center gap-2",
        duration: 3000,
      });
      return;
    }

    const payload = {
      shipment_id: sellRequestDetails?.header?.shipment_id,
      customer: sellRequestDetails?.header?.customer_name?.customer_code,
      component: selectedItems.map((item: any) => item?.item),
      qty: selectedItems.map((item: any) => item?.qty),
      remark: selectedItems.map((item: any) => item?.itemRemark),
      costcenter: sellRequestDetails?.header?.costcenter?.code,
      box: selectedItems.map((item: any) =>
        selectedBoxes[getRowId(item.item, item.dueDate)]?.boxes?.join(",") || ""
      ),
      boxqty: selectedItems.map((item: any) =>
        selectedBoxes[getRowId(item.item, item.dueDate)]?.qty?.join(",") || ""
      ),
      dueDate: selectedItems.map((item: any) => item?.dueDate), // Add dueDate to payload
    };

    dispatch(stockOut(payload) as any).then((res: any) => {
      if (res.payload.code === 200 || res.payload.success) {
        toast({
          title: res.payload.message || "Material Out Successfully",
          className: "bg-green-600 text-white flex items-center gap-2",
          duration: 3000,
        });
        // Update local data to reflect isMaterialOut status
        const updatedItems = sellRequestDetails?.items?.map((item: any) => {
          const rowId = getRowId(item.item, item.dueDate);
          if (selectedRows.includes(rowId)) {
            return { ...item, isMaterialOut: true };
          }
          return item;
        });
        // Assuming sellRequestDetails is managed in Redux, dispatch an action to update it
        // If not, you may need to update the parent component's state
        onClose();
        setSubmitSuccess(true);
      }
    });
  };

  // Update box and quantity
  const updateBoxAndQty = (selectData: any) => {
    const newBoxes = selectData.map((item: any) => item.box_name);
    const newQtys = selectData.map((item: any) => item.stock);

    setSelectedBoxes((prevSelectedBoxes) => {
      const updatedBoxes = { ...prevSelectedBoxes };
      if (updatedBoxes[rowItem]) {
        const existingBoxes = updatedBoxes[rowItem].boxes;
        const existingQtys = updatedBoxes[rowItem].qty;
        newBoxes.forEach((box, index) => {
          if (!existingBoxes.includes(box)) {
            existingBoxes.push(box);
            existingQtys.push(newQtys[index]);
          } else {
            const boxIndex = existingBoxes.indexOf(box);
            if (boxIndex >= 0) {
              existingQtys[boxIndex] = newQtys[index];
            }
          }
        });
        updatedBoxes[rowItem].boxes = existingBoxes;
        updatedBoxes[rowItem].qty = existingQtys;
      } else {
        updatedBoxes[rowItem] = {
          boxes: newBoxes,
          qty: newQtys,
        };
      }
      return updatedBoxes;
    });
    setSheetOpen(false);
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader />
      <SheetContent
        side="bottom"
        className="bg-gradient-to-b from-white to-gray-50 max-h-[92vh] overflow-y-auto rounded-t-2xl shadow-xl"
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        <div className="relative flex justify-between items-start mb-4">
          <div>
            <SheetTitle className="text-xl font-bold text-gray-900">
              Material Out - {sellRequestDetails?.header?.shipment_id}
            </SheetTitle>
            <div className="text-sm text-gray-500 font-medium">
              Customer: {sellRequestDetails?.header?.customer_name?.customer_name} | Cost Center: {sellRequestDetails?.header?.costcenter?.name}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Circle className="w-4 h-4 text-green-600" />
              <span>Ready to Out</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Circle className="w-4 h-4 text-red-600" />
              <span>Already Out</span>
            </div>
          </div>
        </div>

        <div className="relative ag-theme-quartz h-[calc(100vh-220px)] bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-blue-600"></div>
            </div>
          ) : (
            <AgGridReact
              ref={gridRef}
              modules={[CsvExportModule]}
              rowData={tableData2}
              columnDefs={columnDefs}
              suppressCellFocus={true}
              components={{
                truncateCellRenderer: TruncateCellRenderer,
              }}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              rowSelection="multiple"
              onSelectionChanged={handleRowSelection}
              suppressRowClickSelection={true}
              className="text-gray-800"
              gridOptions={{
                rowHeight: 56,
                headerHeight: 48,
                domLayout: "normal",
                defaultColDef: {
                  resizable: true,
                  filter: true,
                  sortable: true,
                  cellStyle: {
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    borderBottom: "1px solid #e5e7eb",
                  },
                  headerClass: "bg-blue-50 text-blue-900 font-semibold",
                },
                rowClass: "hover:bg-blue-50/50 transition-colors duration-150",
                getRowId: (params) => getRowId(params.data.item, params.data.dueDate),
              }}
            />
          )}
        </div>

        <div className="bg-white border-t border-gray-200 shadow-sm h-16 flex items-center justify-end gap-4 px-8 mt-4">
          <Button
            className="rounded-lg border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 px-6"
            onClick={onClose}
            disabled={loading}
            aria-label="Cancel material out"
          >
            Back
          </Button>
          <Button
            className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md px-6 disabled:from-green-400 disabled:to-green-500"
            onClick={onSubmit}
            disabled={loading}
            aria-label="Submit material out"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></span>
                Processing...
              </span>
            ) : (
              "Pick Slip & Material Out"
            )}
          </Button>
        </div>

        <BoxesListSheet
          open={sheetOpen}
          close={() => setSheetOpen(false)}
          data={tableData}
          loading={loading}
          onSelect={(selectedData: any) => {
            handleSelectedBoxes(selectedData, rowItem);
            updateBoxAndQty(selectedData);
          }}
        />
      </SheetContent>
      <SheetFooter />
    </Sheet>
  );
};

export default PickSlipModal;