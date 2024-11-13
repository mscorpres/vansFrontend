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
//   handleSubmit: () => void;
}

const PickSlipModal: React.FC<PickSlipModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  //   handleSubmit,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState<{ [key: string]: any }>(
    {}
  ); // Changed to store selected boxes per row
  const [box, setBox] = useState([]);
  const [qty, setQty] = useState([]);
  const dispatch = useDispatch();
  const { availableStock } = useSelector(
    (state: RootState) => state.sellShipment
  );

  const handleBoxesClick = (params: any) => {
    setSheetOpen(true);
    console.log(params.data);
    const payload = {
      c_center: sellRequestDetails?.header?.costcenter?.code,
      component: params.data?.item,
    };
    dispatch(fetchAvailableStock(payload) as any).then((response: any) => {
      if (response.payload.code === 200) {
        console.log(response.payload.data);
      }
    });
  };

  const handleSelectedBoxes = (selectedData: any, rowId: string) => {
    console.log(selectedData, rowId);
    setSelectedBoxes((prevSelectedBoxes) => ({
      ...prevSelectedBoxes,
      [rowId]: selectedData, // Store selected boxes only for the specific row
    }));
    setSheetOpen(false); // Close the sheet/modal after selection
    console.log("Selected Boxes:", selectedData);
  };

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
      field: "outBoxQty", // Assuming `outBoxQty` is the field for outbox quantity in your data
      cellRenderer: (params: any) => {
        // Check if the current row has selected boxes
        const rowId = params.data?.item; // Use a unique identifier for the row (e.g., item code)
        const selectedForRow = selectedBoxes[rowId]; // Get the selected boxes for this row
        return (
          <div
            className="p-2 border border-gray-300 rounded-md"
            onClick={() => handleBoxesClick(params)}
          >
            {selectedForRow && selectedForRow.length > 0
              ? selectedForRow.map((box: any) => box?.box_name).join(", ")
              : "Select Out Box(es)"}
          </div>
        );
      },
      autoHeight: true,
    },
    { headerName: "Item Part Number", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },

    { headerName: "Remark", field: "itemRemark" },
  ];

  const tableData = useMemo(
    () => availableStock?.map((item) => ({ ...item })) || [],
    [availableStock]
  );

  const onSubmit = () => {
    // Create the payload for submission
    const payload = {
      shipment_id: sellRequestDetails?.header?.shipment_id,
      customer: sellRequestDetails?.header?.customer_name?.customer_code, // Assuming customer_code is available
      component: sellRequestDetails?.items?.map((item: any) => item?.item), // Assuming item_id is available for components
      qty: sellRequestDetails?.items?.map((item: any) => item?.qty), // Qty from items
      //   box: selectedBoxes.map((box: any) => box?.box_name), // Flatten selected boxes from all rows
      remark: sellRequestDetails?.items?.map((item: any) => item?.itemRemark), // Item remark
      costcenter: sellRequestDetails?.header?.costcenter?.code, // Cost center
      //   boxqty: selectedBoxes.map((box: any) => box?.box_qty), // Flatten and extract box_qty
      box: box,
      boxqty: qty,
    };

    console.log("Payload to submit: ", payload);
    dispatch(stockOut(payload) as any).then((res: any) => {
        if(res.payload.code == 200){
            toast({
                title: res.payload.message||"Material Out Successfully",
                className: "bg-green-600 text-white items-center",
              });
              onClose();
        }
      console.log(res);
    });

    // Call the actual submit function or API request here
    // handleSubmit(payload); // If handleSubmit is supposed to be an API call handler
  };

  const updateBoxAndQty = (selectData) => {
    // Extract the box_name and stock values and push them into the state arrays
    const newBoxes = selectData.map((item) => item.box_name);
    const newQtys = selectData.map((item) => item.stock);

    // Update the state
    setBox((prevBox) => [...prevBox, ...newBoxes]); // Append new boxes to the existing ones
    setQty((prevQty) => [...prevQty, ...newQtys]); // Append new qtys to the existing ones
    setSheetOpen(false);
  };
  console.log(box, qty);
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
            onClick={onSubmit}
          >
            Pick Slip & Material Out
          </Button>
        </div>
        <BoxesListSheet
          open={sheetOpen}
          close={setSheetOpen}
          data={tableData}
          onSelect={(selectedData) => {
            console.log(selectedData);
            // handleSelectedBoxes(selectedData, tableData[0]?.box_name) }//
            updateBoxAndQty(selectedData);
          }}
        />
      </SheetContent>

      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default PickSlipModal;
