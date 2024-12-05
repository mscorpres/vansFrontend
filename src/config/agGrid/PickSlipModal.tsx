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

interface PickSlipModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: {
    req_id: string;
  };
  loading: boolean;
  setSubmitSuccess: any;
  //   handleSubmit: () => void;
}

const PickSlipModal: React.FC<PickSlipModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  setSubmitSuccess,
  //   handleSubmit,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [rowItem, setRowItem] = useState<string>("");
  const [selectedBoxes, setSelectedBoxes] = useState<{ [rowId: string]: any }>(
    {}
  ); // Changed to store selected boxes per row
  const [box, setBox] = useState<string[]>([]);
  const [qty, setQty] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { availableStock } = useSelector(
    (state: RootState) => state.sellShipment
  );

  // Function to handle when a row's "Select Box" field is clicked
  const handleBoxesClick = (params: any) => {
    setSheetOpen(true);
    const rowId = params.data.item;
    setRowItem(rowId);
    const payload = {
      c_center: sellRequestDetails?.header?.costcenter?.code,
      component: params.data?.item,
    };
    dispatch(fetchAvailableStock(payload) as any).then((response: any) => {
      if (response.payload.code === 200) {
      }
    });
  };

  // Function to handle selected boxes and quantities
  const handleSelectedBoxes = (selectedData: any, rowId: string) => {
    // Update selected boxes and quantities for the specific row (rowId)
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [rowId]: {
        boxes: selectedData.map((item: any) => item.box_name),
        qty: selectedData.map((item: any) => item.stock),
      },
    }));
    setSheetOpen(false); // Close the sheet after selection
  };

  // Column definitions for the grid
  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
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
    {
      headerName: "OUT BOX(es)",
      field: "selectOutBoxes",
      cellRenderer: (params) => {
        return (
          <div
            className="p-2 border border-gray-300 rounded-md w-[200px] cursor-pointer word-break-all"
            onClick={() => console.log("Clicked:", params)}
          >
            {params.value ? params.value : "Select Out Box(es)"}
          </div>
        );
      },
      autoHeight: true, // This will automatically adjust row height based on cell content
    },
    { headerName: "Item Part Number", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },
    {
      headerName: "Remark",
      field: "remark",
      cellRenderer: (params: any) => {
        const { value, colDef, data, api, column } = params;
        const onRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          data[colDef.field] = newValue;
          api.refreshCells({
            rowNodes: [params.node],
            columns: [column],
          });
          api.applyTransaction({ update: [data] }); // refresh cell
        };
        return (
          <input
            type="text"
            value={value || ""}
            onChange={onRemarkChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        );
      },
    },
  ];

  // Table data, mapping the available stock to rows
  const tableData = useMemo(
    () => availableStock?.map((item) => ({ ...item })) || [],
    [availableStock]
  );
  const tableData2 = useMemo(
    () =>
      Array.isArray(sellRequestDetails?.items)
        ? sellRequestDetails?.items?.map((item: any) => ({ ...item }))
        : [],
    [sellRequestDetails?.items]
  );

  // Submit function to gather all the selected boxes and quantities
  const onSubmit = () => {
    // Create payload with selected boxes and quantities for each row
    const payload = {
      shipment_id: sellRequestDetails?.header?.shipment_id,
      customer: sellRequestDetails?.header?.customer_name?.customer_code,
      component: sellRequestDetails?.items?.map((item: any) => item?.item),
      qty: sellRequestDetails?.items?.map((item: any) => item?.qty),
      remark: sellRequestDetails?.items?.map((item: any) => item?.itemRemark),
      costcenter: sellRequestDetails?.header?.costcenter?.code,
      //   boxqty: selectedBoxes.map((box: any) => box?.box_qty),
      box: box,
      boxqty: qty,
    };

    dispatch(stockOut(payload) as any).then((res: any) => {
      if (res.payload.code === 200) {
        toast({
          title: res.payload.message || "Material Out Successfully",
          className: "bg-green-600 text-white items-center",
        });
        onClose();
        setSubmitSuccess(true);
      }
    });
  };

  const updateBoxAndQty = (selectData: any) => {
    // Extract the box_name and stock values and push them into the state arrays
    const newBoxes = selectData.map((item: any) => item.box_name);
    const newQtys = selectData.map((item: any) => item.stock);
    // Update the state
    setBox((prevBox) => [...prevBox, newBoxes.join(",")]);
    setQty((prevQty) => [...prevQty, newQtys.join(",")]);
    setSheetOpen(false);
  };
  const getRowHeight = (params) => {
    if (params.data && params.data.selectOutBoxes) {
      // Adjust row height based on content size
      const textLength = params.data.selectOutBoxes.length;
      return textLength > 100 ? 100 : 50; // Adjust based on content length
    }
    return 50; // Default row height if empty
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader></SheetHeader>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        <div className="flex justify-between items-center mb-2">
          <div>
            <SheetTitle>{`Material Out of ${sellRequestDetails?.header?.shipment_id}`}</SheetTitle>
            <SheetTitle>{`Customer Name : ${sellRequestDetails?.header?.customer_name?.customer_name} Cost Center : ${sellRequestDetails?.header?.costcenter?.name}`}</SheetTitle>
          </div>
        </div>

        <div className="ag-theme-quartz h-[calc(100vh-170px)]">
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
            onClick={onSubmit}
          >
            Pick Slip & Material Out
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

      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default PickSlipModal;
