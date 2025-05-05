import React, { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, Input, Select } from "antd";
import { FormInstance } from "antd/lib/form";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

interface ViewAndCreateInvModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails?: {
    headerData: {
      soId?: string;
      invoiceNo?: string;
      billTo: {
        custCode?: string;
        custName?: string;
        pincode?: string;
        panno?: string;
        gst?: string;
        address1?: string;
        address2?: string;
      };
      shipTo: {
        company?: string;
        panno?: string;
        gst?: string;
        pincode?: string;
        address1?: string;
        address2?: string;
      };
      billFrom: {
        pan?: string;
        gstin?: string;
        address1?: string;
        address2?: string;
      };
      invStatus?: string;
      createDate?: string;
    };
    materialData: {
      so_id?: string;
      item?: string;
      itemName?: string;
      itemPartNo?: string;
      itemSpecification?: string;
      qty?: string;
      rate?: string;
      uom?: string;
      gstRate?: string;
      cgstRate?: any;
      sgstRate?: any;
      igstRate?: any;
      dueDate?: string;
      hsnCode?: string;
      itemRemark?: string;
    }[];
  };
  loading: boolean;
  form: FormInstance;
  onSave: (values: any) => void;
}

// Define options
const supplyType = [
  { code: "B2B", desc: "Business to Business" },
  { code: "SEZWP", desc: "SEZ with payment" },
  { code: "SEZWOP", desc: "SEZ without payment" },
  { code: "EXPWP", desc: "Export with Payment" },
  { code: "EXPWOP", desc: "Export without payment" },
  { code: "DEXP", desc: "Deemed Export" },
];

const docType = [
  { code: "INV", desc: "Tax Invoice" },
  { code: "BIL", desc: "Bill of Supply" },
  { code: "BOE", desc: "Bill of Entry" },
  { code: "CHL", desc: "Delivery Challan" },
  { code: "OTH", desc: "Others" },
];

const transactionType = [
  { code: "1", desc: "Regular" },
  { code: "2", desc: "Bill To - Ship To" },
  { code: "3", desc: "Bill From - Dispatch From" },
  { code: "4", desc: "Combination of 2 and 3" },
];

// const supplyType = [
//   { code: "O", desc: "Outward" },
//   { code: "I", desc: "Inward" },
// ];

const ViewAndCreateInvModal: React.FC<ViewAndCreateInvModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  loading,
  form,
  onSave,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo(0, 0);
        window.scrollTo(0, 0);
        console.log("Modal opened, scrolled to top");
      }, 0);
    }
  }, [visible]);

  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    { headerName: "Part No.", field: "itemPartNo" },
    { headerName: "Name", field: "itemName" },
    {
      headerName: "Description",
      field: "itemSpecification",
      width: 350,
      cellRenderer: "truncateCellRenderer",
    },
    { headerName: "Customer Part No.", field: "customer_part_no" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Rate", field: "rate" },
    { headerName: "UOM", field: "uom" },
    { headerName: "HSN", field: "hsnCode" },
    { headerName: "Gst Rate", field: "gstRate" },
    { headerName: "Remarks", field: "itemRemark" },
  ];

  const data = sellRequestDetails?.headerData;
  const shipmentIdextracted = data?.soId;

  const itemCGSTs = sellRequestDetails?.materialData?.map(
    (item) => parseFloat(item?.cgstRate) || 0
  );
  const itemSGSTs = sellRequestDetails?.materialData?.map(
    (item) => parseFloat(item.sgstRate) || 0
  );
  const itemIGSTs = sellRequestDetails?.materialData?.map(
    (item) => parseFloat(item.igstRate) || 0
  );

  const totalValue =
    sellRequestDetails?.materialData?.reduce(
      (acc, item) => acc + (parseFloat(item.rate) ?? 0) * (parseFloat(item.qty) ?? 0),
      0
    ) ?? 0;

  const totalCGST = itemCGSTs?.reduce((acc, value) => acc + value, 0);
  const totalSGST = itemSGSTs?.reduce((acc, value) => acc + value, 0);
  const totalIGST = itemIGSTs?.reduce((acc, value) => acc + value, 0);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values); // Call onSave but don't close the dialog here
    }).catch((info) => {
      console.log("Validation Failed:", info); // Log validation errors, dialog stays open
    });
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader />
      <SheetContent side={"bottom"} className="bg-gray-50">
        {loading && <FullPageLoading />}
        <div className="max-h-[calc(100vh-140px)] mx-auto py-6 animate-fade-in flex flex-col h-screen">
          <SheetTitle className="text-2xl font-bold text-gray-800 mb-6">
            {sellRequestDetails
              ? `Invoice: ${sellRequestDetails?.headerData?.invoiceNo} | ${shipmentIdextracted}`
              : "Create New Invoice"}
          </SheetTitle>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200 max-h-[calc(100vh-100px)]"
          >
            <div className="space-y-8 min-h-[1500px]">
              {/* View Details: Header Data */}
              {sellRequestDetails ? (
                <Card className="shadow-sm rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Invoice Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <h3 className="text-md font-semibold text-gray-600 mb-2">Bill To</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><span className="font-medium">Client:</span> {data?.billTo?.custName || "N/A"}</p>
                          <p><span className="font-medium">PAN:</span> {data?.billTo?.panno || "N/A"}</p>
                          <p><span className="font-medium">GSTIN:</span> {data?.billTo?.gst || "N/A"}</p>
                          <p><span className="font-medium">Address:</span> {(data?.billTo?.address1 ?? "") + " " + (data?.billTo?.address2 || "N/A")}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <h3 className="text-md font-semibold text-gray-600 mb-2">Bill From</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><span className="font-medium">PAN:</span> {data?.billFrom?.pan || "N/A"}</p>
                          <p><span className="font-medium">GSTIN:</span> {data?.billFrom?.gstin || "N/A"}</p>
                          <p><span className="font-medium">Address:</span> {(data?.billFrom?.address1 ?? "") + " " + (data?.billFrom?.address2 ?? "N/A")}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <h3 className="text-md font-semibold text-gray-600 mb-2">Ship To</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><span className="font-medium">Company:</span> {data?.shipTo?.company || "N/A"}</p>
                          <p><span className="font-medium">PAN:</span> {data?.shipTo?.panno || "N/A"}</p>
                          <p><span className="font-medium">GSTIN:</span> {data?.shipTo?.gst || "N/A"}</p>
                          <p><span className="font-medium">Address:</span> {(data?.shipTo?.address1 || "") + " " + (data?.shipTo?.address2 || "N/A")}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        <h3 className="text-md font-semibold text-gray-600 mb-2">Tax Details</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><span className="font-medium">Sub-Total Before Taxes:</span> {totalValue?.toFixed(2) || "0.00"}</p>
                          <p><span className="font-medium">CGST:</span> (+){totalCGST?.toFixed(2) || "0.00"}</p>
                          <p><span className="font-medium">SGST:</span> (+){totalSGST?.toFixed(2) || "0.00"}</p>
                          <p><span className="font-medium">IGST:</span> (+){totalIGST?.toFixed(2) || "0.00"}</p>
                          <p><span className="font-medium text-teal-600">Sub-Total After Taxes:</span> {(totalValue + totalCGST + totalSGST + totalIGST)?.toFixed(2) || "0.00"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-sm rounded-lg">
                  <CardContent className="p-4 text-gray-500">
                    No invoice details available. Please fill out the form below to create a new invoice.
                  </CardContent>
                </Card>
              )}

              {/* Material Data */}
              {sellRequestDetails && (
                <Card className="shadow-sm rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-700">Material List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="ag-theme-quartz h-64">
                      <AgGridReact
                        rowData={sellRequestDetails?.materialData}
                        columnDefs={columnDefs}
                        suppressCellFocus={true}
                        components={{ truncateCellRenderer: TruncateCellRenderer }}
                        overlayNoRowsTemplate={OverlayNoRowsTemplate}
                        enableCellTextSelection={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Input Fields */}
              <Card className="shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">
                    {sellRequestDetails ? "Edit Invoice Details" : "Add Invoice Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form form={form} layout="vertical" className="space-y-6">
                    <div className="text-md font-semibold text-gray-600 border-b border-gray-200 pb-2">
                      Basic Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Form.Item
                        name="boxes"
                        label="No of Boxes"
                        rules={[{ required: true, message: "Please enter number of boxes" }]}
                      >
                        <Input
                          type="number"
                          placeholder="Enter number of boxes"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="freightCharges"
                        label="Freight Charges"
                        rules={[{ required: true, message: "Please enter freight charges" }]}
                      >
                        <Input
                          type="number"
                          placeholder="Enter freight charges"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="gstRateFreight"
                        label="GST Rate for Freight (%)"
                        rules={[{ required: true, message: "Please select GST rate" }]}
                      >
                        <Select
                          placeholder="Select GST rate"
                          className="rounded-md"
                          popupClassName="rounded-md"
                        >
                          <Select.Option value="0">0%</Select.Option>
                          <Select.Option value="5">5%</Select.Option>
                          <Select.Option value="12">12%</Select.Option>
                          <Select.Option value="18">18%</Select.Option>
                          <Select.Option value="28">28%</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="documentType"
                        label="Document Type"
                        rules={[{ required: true, message: "Please select document type" }]}
                      >
                        <Select
                          placeholder="Select document type"
                          className="rounded-md"
                          popupClassName="rounded-md"
                        >
                          {docType.map((type) => (
                            <Select.Option key={type.code} value={type.code}>
                              {type.desc}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="supplyType"
                        label="Supply Type"
                        rules={[{ required: true, message: "Please select supply type" }]}
                      >
                        <Select
                          placeholder="Select supply type"
                          className="rounded-md"
                          popupClassName="rounded-md"
                        >
                          {supplyType.map((type) => (
                            <Select.Option key={type.code} value={type.code}>
                              {type.desc}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {/* <Form.Item
                        name="subType"
                        label="Sub Type"
                        rules={[{ required: true, message: "Please select sub type" }]}
                      >
                        <Select
                          placeholder="Select sub type"
                          className="rounded-md"
                          popupClassName="rounded-md"
                        >
                          {subType.map((type) => (
                            <Select.Option key={type.code} value={type.code}>
                              {type.desc}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item> */}
                      <Form.Item
                        name="transactionType"
                        label="Transaction Type"
                        rules={[{ required: true, message: "Please select transaction type" }]}
                      >
                        <Select
                          placeholder="Select transaction type"
                          className="rounded-md"
                          popupClassName="rounded-md"
                        >
                          {transactionType.map((type) => (
                            <Select.Option key={type.code} value={type.code}>
                              {type.desc}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="text-md font-semibold text-gray-600 border-b border-gray-200 pb-2">
                      Location Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        name="billFromLocation"
                        label="Bill From Location"
                        rules={[{ required: true, message: "Please enter bill from location" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Enter bill from location"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          style={{ resize: "none" }}
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="billToLocation"
                        label="Bill To Location"
                        rules={[{ required: true, message: "Please enter bill to location" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Enter bill to location"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          style={{ resize: "none" }}
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="dispatchFromLocation"
                        label="Dispatch From Location"
                        rules={[{ required: true, message: "Please enter dispatch from location" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Enter dispatch from location"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          style={{ resize: "none" }}
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="shipToLocation"
                        label="Ship To Location"
                        rules={[{ required: true, message: "Please enter ship to location" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Enter ship to location"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          style={{ resize: "none" }}
                          autoFocus={false}
                        />
                      </Form.Item>
                    </div>

                    <div className="text-md font-semibold text-gray-600 border-b border-gray-200 pb-2">
                      Dispatch Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Form.Item
                        name="dispatchDocNo"
                        label="Dispatch Doc No"
                        rules={[{ required: true, message: "Please enter dispatch document number" }]}
                      >
                        <Input
                          placeholder="Enter dispatch document number"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="dispatchThrough"
                        label="Dispatch Through"
                        rules={[{ required: true, message: "Please enter dispatch through" }]}
                      >
                        <Input
                          placeholder="Enter dispatch through (e.g., Courier, Truck)"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item name="deliveryNote" label="Delivery Note">
                        <Input
                          placeholder="Enter delivery note"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item
                        name="deliveryDate"
                        label="Delivery Date"
                        rules={[{ required: true, message: "Please enter delivery date" }]}
                      >
                        <Input
                          type="date"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          autoFocus={false}
                        />
                      </Form.Item>
                      <Form.Item name="remark" label="Remark">
                        <Input.TextArea
                          rows={2}
                          placeholder="Enter remarks"
                          className="rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          style={{ resize: "none" }}
                          autoFocus={false}
                        />
                      </Form.Item>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-md px-6 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 rounded-md px-6 py-2"
                      >
                        Create Invoice
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-thin {
            scrollbar-width: thin !important;
            scrollbar-color: #14B8A6 #E5E7EB !important;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #E5E7EB !important;
            border-radius: 4px !important;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #14B8A6 !important;
            border-radius: 4px !important;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #0D9488 !important;
          }
          .ag-theme-quartz {
            --ag-background-color: #fff;
            --ag-header-background-color: #F9FAFB;
            --ag-row-hover-background-color: #E0F2FE;
            --ag-border-color: #E5E7EB;
            --ag-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --ag-font-size: 14px;
          }
          .ag-theme-quartz .ag-header {
            border-bottom: 1px solid #E5E7EB;
          }
          .ag-theme-quartz .ag-row {
            border-bottom: 1px solid #E5E7EB;
          }
          .ag-theme-quartz .ag-row-odd {
            background-color: #F9FAFB;
          }
          .ag-theme-quartz .ag-body-viewport::-webkit-scrollbar,
          .ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
          }
          .ag-theme-quartz .ag-body-viewport::-webkit-scrollbar-track,
          .ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track {
            background: #E5E7EB !important;
            border-radius: 4px !important;
          }
          .ag-theme-quartz .ag-body-viewport::-webkit-scrollbar-thumb,
          .ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb {
            background: #14B8A6 !important;
            border-radius: 4px !important;
          }
          .ag-theme-quartz .ag-body-viewport::-webkit-scrollbar-thumb:hover,
          .ag-theme-quartz .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb:hover {
            background: #0D9488 !important;
          }
          .ag-theme-quartz .ag-body-viewport,
          .ag-theme-quartz .ag-body-horizontal-scroll-viewport {
            scrollbar-width: thin !important;
            scrollbar-color: #14B8A6 #E5E7EB !important;
          }
        `}</style>
      </SheetContent>
      <SheetFooter />
    </Sheet>
  );
};

export default ViewAndCreateInvModal;