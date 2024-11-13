import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { fetchAvailableStockBoxes } from "@/features/client/storeSlice";
import { fetchAvailableStock } from "@/features/salesmodule/salesShipmentSlice";

interface PickSlipModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any;
  row: {
    req_id: string;
  };
  loading: boolean;
  submitText: string;
  handleSubmit: () => void;
}

const PickSlipModal: React.FC<PickSlipModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  submitText,
  handleSubmit,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [sheetOpen , setSheetOpen] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<any>(null);
  const dispatch = useDispatch();
  const { availableStock } = useSelector(
    (state: RootState) => state.sellShipment
  );

  const handleBoxesClick = (params:any)=>{
    setSheetOpen(true);
    console.log(params.data)
    const payload = {
        c_center:sellRequestDetails?.header?.costcenter?.code,
        component:params.data?.item,
    }
    dispatch(fetchAvailableStock(payload)).then((response: any) => {
      if (response.payload.code === 200) {
        console.log(response.payload.data);
      }
    });
  }

  const handleSelectedBoxes = (selectedData: any) => {
    setSelectedBoxes(selectedData);  // Store the selected boxes
    setSheetOpen(false); // Close the sheet/modal after selection
    console.log("Selected Boxes:", selectedData);
  };

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
    {
      headerName: "OUT BOX(es)",
      field: "outBoxQty", // Assuming `outBoxQty` is the field for outbox quantity in your data
      cellRenderer: (params: any) => {
        return (
          <div className="p-2 border border-gray-300 rounded-md" onClick={()=> {handleBoxesClick(params)}}>
            
            {selectedBoxes?.length > 0 ? selectedBoxes?.map((box: any) => box?.box_name).join(', ') : 'Select Out Box(es)'}
            </div>
        );
      },
      autoHeight: true,
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

  const tableData = useMemo(
    () => availableStock?.map((item) => ({ ...item })) || [],
    [availableStock]
  );

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader></SheetHeader>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
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
            onClick={handleSubmit}
          >
            {submitText}
          </Button>
        </div>
        <BoxesListSheet open={sheetOpen} close={setSheetOpen} data ={tableData} onSelect={handleSelectedBoxes}/>
      </SheetContent>

      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default PickSlipModal;


