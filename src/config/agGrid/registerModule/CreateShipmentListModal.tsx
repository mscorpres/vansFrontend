import React, { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  CsvExportModule,
  RowSelectionOptions,
} from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { TruncateCellRenderer } from "@/General";
import { Button } from "@/components/ui/button";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import { Form } from "antd";
import { toast } from "@/components/ui/use-toast";
import ShipmentTextInputCellRendrer from "@/shared/ShipmentTextInputCellRendrer";

interface CreateShipmentListModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any[];
  row: {
    req_id: string;
  };
  loading: boolean;
  onCreateShipment: (payload: any) => void; // Callback to trigger shipment creation
}

const CreateShipmentListModal: React.FC<CreateShipmentListModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  row,
  loading,
  onCreateShipment,
}) => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // State to store selected items
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Handle selection change
  const onSelectionChanged = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows();
    setSelectedItems(selectedRows || []);
  };

  // Create shipment payload from selected items
  const handleCreateShipment = () => {
    const itemDetails = {
      item: selectedItems.map((item) => item.item),
      qty: selectedItems.map((item) => item.qty),
      rate: selectedItems.map((item) => item.rate),
      currency: selectedItems.map((item) => item.currency || "USD"),
      exchange_rate: selectedItems.map((item) => item.exchange_rate || 1.0),
      due_date: selectedItems.map((item) => item.due_date || "2024-12-31"),
      hsn_code: selectedItems.map((item) => item.hsnCode),
      gst_type: selectedItems.map((item) => item.gst_type),
      gst_rate: selectedItems.map((item) => item.gstRate),
      cgst_rate: selectedItems.map((item) => item.cgstRate),
      sgst_rate: selectedItems.map((item) => item.sgstRate),
      igst_rate: selectedItems.map((item) => item.igstRate),
      comp_remark: form.getFieldValue("remark"),
      item_remark: selectedItems.map((item) => item.itemRemark),
    };
    console.log(itemDetails, "item", selectedItems);
    onCreateShipment({ itemDetails: { ...itemDetails }, so_id: row.req_id });
    form.resetFields();
    setOpenConfirmDialog(false);
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: ShipmentTextInputCellRendrer,
      truncateCellRenderer: TruncateCellRenderer,
    }),
    []
  );

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
      headerName: "Item Name",
      field: "itemName",
      width: 300,
      cellRenderer: "truncateCellRenderer",
    },
    {
      headerName: "Item Specification",
      field: "itemSpecification",
      cellRenderer: "truncateCellRenderer",
    },
    { headerName: "SKU Code", field: "itemPartNo" },
    {
      headerName: "Quantity",
      field: "qty",
      // cellRenderer: (params: any) => {
      //   const { value, colDef, data, api, column } = params;

      //   // Make sure we don't touch the `checked` property when editing qty
      //   const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
      //     //   const newValue = e.target.value;
      //     //   data[colDef.field] = newValue; // Update only the qty field
      //     //   api.refreshCells({
      //     //     rowNodes: [params.node],
      //     //     columns: [column, "qty"],
      //     //   });
      //     // };
      //     const newValue = e.target.value;
      //     const localValue = data.qty * data.rate || 0; // Ensure localValue is a number
      //     let cgst = 0;
      //     let sgst = 0;
      //     let igst = 0;
      //     const calculation = (localValue * data.gstRate) / 100;

      //     // Update the qty field in data
      //     data[colDef.field] = newValue;

      //     // GST Calculation
      //     if (data.gst_type === "L") {
      //       // Intra-State
      //       cgst = calculation / 2;
      //       sgst = calculation / 2; // Same as CGST
      //       igst = 0;
      //       data.cgstRate = cgst.toFixed(2);
      //       data.sgstRate = sgst.toFixed(2);
      //       data.igstRate = igst.toFixed(2);
      //     } else if (data.gst_type === "I") {
      //       // Inter-State
      //       igst = calculation;
      //       cgst = 0;
      //       sgst = 0;
      //       data.cgstRate = cgst.toFixed(2);
      //       data.sgstRate = sgst.toFixed(2);
      //       data.igstRate = igst.toFixed(2);
      //     }

      //     // Refresh the cell to show updated value
      //     api.refreshCells({
      //       rowNodes: [params.node],
      //       columns: [column, "qty", "foreignValue", "cgstRate", "sgstRate", "igstRate"],
      //     });

      //     // Apply transaction to update the data grid
      //     api.applyTransaction({ update: [data] });
      //   };
      //   console.log(data, "data");

      //   return (
      //     <input
      //       type="number"
      //       value={value}
      //       onChange={onChangeQty}
      //       className="p-2 border border-gray-300 rounded-md"
      //     />
      //   );
      // },
      cellRenderer: (params: any) => {
        const { value, colDef, data, api, column } = params;
      
        // Function to handle quantity change
        const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
      
          // Parse newValue to a float number
          const qty = parseFloat(newValue);  // Ensure the qty is a number
          if (isNaN(qty) || qty <= 0) {
            return; // If it's not a valid number or less than or equal to 0, don't proceed
          }
      
          const rate = parseFloat(data.rate) || 0; // Ensure rate is also a number
          const localValue = qty * rate; // Now, this will correctly calculate the value
      
          let cgst = 0;
          let sgst = 0;
          let igst = 0;
          const calculation = (localValue * data.gstRate) / 100;
      
          // Update the qty field in data
          data[colDef.field] = newValue; // Update the input value (qty field)
      
          // GST Calculation
          if (data.gst_type === "L") {
            // Intra-State
            cgst = calculation / 2;
            sgst = calculation / 2; // Same as CGST
            igst = 0;
            data.cgstRate = cgst.toFixed(2);
            data.sgstRate = sgst.toFixed(2);
            data.igstRate = igst.toFixed(2);
          } else if (data.gst_type === "I") {
            // Inter-State
            igst = calculation;
            cgst = 0;
            sgst = 0;
            data.cgstRate = cgst.toFixed(2);
            data.sgstRate = sgst.toFixed(2);
            data.igstRate = igst.toFixed(2);
          }
      
          // Refresh the cell to show updated value
          api.refreshCells({
            rowNodes: [params.node],
            columns: [column, "qty", "foreignValue", "cgstRate", "sgstRate", "igstRate"],
          });
      
          // Apply transaction to update the data grid
          api.applyTransaction({ update: [data] });
        };
      
        return (
          <input
            type="number"
            value={value}
            onChange={onChangeQty}
            className="p-2 border border-gray-300 rounded-md"
          />
        );
      }
      
    },
    { headerName: "Pending Quantity", field: "pending_qty" },
    { headerName: "Price", field: "rate" },
    { headerName: "UoM", field: "uom" },
    { headerName: "GST Rate", field: "gstRate" },
    { headerName: "Igst Rate", field: "igstRate" },
    { headerName: "SGST Rate", field: "sgstRate" },
    { headerName: "CGST Rate", field: "cgstRate" },
    { headerName: "HSN/SAC", field: "hsnCode" },
    { headerName: "Remark", field: "itemRemark" },
  ];
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  return (
    <>
      <Sheet open={visible} onOpenChange={onClose}>
        <SheetHeader></SheetHeader>
        <SheetContent
          side={"bottom"}
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <SheetTitle>Create Shipment of {row?.req_id}</SheetTitle>
          </div>

          <div className="ag-theme-quartz h-[calc(100vh-140px)]">
            <AgGridReact
              ref={gridRef}
              modules={[CsvExportModule]}
              rowData={sellRequestDetails}
              columnDefs={columnDefs}
              suppressCellFocus={true}
              components={components}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              loading={loading}
              onSelectionChanged={onSelectionChanged} // Listen to selection changes'
              rowSelection={rowSelection}
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
              onClick={() => {
                if (selectedItems.length === 0) {
                  toast({
                    title:
                      "No items selected! Please select at least one item.",
                    className: "bg-red-600 text-white items-center",
                  });
                } else {
                  setOpenConfirmDialog(true);
                }
              }}
            >
              Submit
            </Button>
          </div>
        </SheetContent>
        <SheetFooter></SheetFooter>
      </Sheet>
      <CreateInvoiceDialog
        isDialogVisible={openConfirmDialog}
        handleCancel={() => setOpenConfirmDialog(false)}
        heading="Create Shipment"
        description="Are you sure you want to create Shipment?"
        form={form}
        loading={loading}
        handleOk={handleCreateShipment}
      />
    </>
  );
};

export default CreateShipmentListModal;
