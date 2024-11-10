import React, { useState, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { CreateInvoiceDialog } from "@/config/agGrid/registerModule/CreateInvoiceDialog";
import { Form } from "antd";
import { toast } from "@/components/ui/use-toast";

interface MaterialListModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: any[];
  row: {
    req_id: string;
  };
  loading: boolean;
  onCreateShipment: (payload: any) => void; // Callback to trigger shipment creation
}

const MaterialListModal: React.FC<MaterialListModalProps> = ({
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

  // This function is called whenever the selection changes
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
      currency: selectedItems.map((item) => item.currency || "USD"), // Assuming USD as default
      exchange_rate: selectedItems.map((item) => item.exchange_rate || 1.0),
      due_date: selectedItems.map((item) => item.due_date || "2024-12-31"),
      hsn_code: selectedItems.map((item) => item.hsnCode),
      gst_type: selectedItems.map((item) => item.gstType),
      gst_rate: selectedItems.map((item) => item.gstRate),
      cgst_rate: selectedItems.map((item) => item.cgstRate),
      sgst_rate: selectedItems.map((item) => item.sgstRate),
      igst_rate: selectedItems.map((item) => item.igstRate),
      comp_remark: form.getFieldValue("remark"), // You can make this dynamic if needed
      item_remark: selectedItems.map((item) => item.itemRemark),
    };
    console.log(itemDetails, "item", selectedItems);
    // Call the callback function to create shipment
    onCreateShipment({ ...itemDetails, so_id: row.req_id });
    form.resetFields();
  };

  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    {
      headerName: "Select All",
      checkboxSelection: true,
      width: 150,
      headerCheckboxSelection: true, // Adds header checkbox for "Select All"
      headerCheckboxSelectionFilteredOnly: true, // Only select visible rows (if filtering is applied)
      maxWidth: 150,
    },
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
      cellRenderer: "truncateCellRenderer",
    },
    {
      headerName: "Material Specification",
      field: "itemSpecification",
      cellRenderer: "truncateCellRenderer",
    },
    { headerName: "SKU Code", field: "itemPartNo" },
    { headerName: "Qty", field: "qty" },
    { headerName: "UoM", field: "uom" },
    { headerName: "GST Rate", field: "gstRate" },
    { headerName: "Price", field: "rate" },
    { headerName: "HSN/SAC", field: "hsnCode" },
    { headerName: "Remark", field: "itemRemark" },
  ];

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
            <SheetTitle>Material List of {row?.req_id}</SheetTitle>
          </div>

          <div className="ag-theme-quartz h-[calc(100vh-140px)]">
            <AgGridReact
              ref={gridRef}
              modules={[CsvExportModule]}
              rowData={sellRequestDetails}
              columnDefs={columnDefs}
              suppressCellFocus={true}
              rowSelection="multiple" // Enable multiple row selection
              components={{
                truncateCellRenderer: TruncateCellRenderer,
              }}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
              loading={loading}
              onSelectionChanged={onSelectionChanged} // Listen to selection changes
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

export default MaterialListModal;
