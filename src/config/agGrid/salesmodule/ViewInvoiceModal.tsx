import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Adjust path as needed
import FullPageLoading from "@/components/shared/FullPageLoading";
import { CgArrowTopRight } from "react-icons/cg";
import { Printer } from "lucide-react";
import { TruncateCellRenderer } from "@/General";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

interface ViewInvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  sellRequestDetails: {
    headerData: {
      soId?: string;
      invoiceNo?: string;
      billTo: {
        custCode?: string;
        custName?: string;
        pincode?: string;
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
      ewaybill?: string;
      eInvoice?: string;
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
  handlePrintInvoice: any;
  loading: boolean;
}

const ViewInvoiceModal: React.FC<ViewInvoiceModalProps> = ({
  visible,
  onClose,
  sellRequestDetails,
  handlePrintInvoice,
  loading,
}) => {
  const columnDefs: ColDef[] = [
    { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 50 },
    // { headerName: "SO ID", field: "soId" },
    // { headerName: "Shipment ID", field: "soId" },
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
  const shipmentIdextracted = data?.shipmentId;

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
      (acc, item) => acc + (item.rate ?? 0) * (item.qty ?? 0),
      0
    ) ?? 0;

  const totalCGST = itemCGSTs?.reduce((acc, value) => acc + value, 0);
  const totalSGST = itemSGSTs?.reduce((acc, value) => acc + value, 0);
  const totalIGST = itemIGSTs?.reduce((acc, value) => acc + value, 0);
  function fnOpenNewWindow(link: string) {
    // Define window dimensions
    var width = 920;
    var height = 500;

    // Calculate the position to center the window on the screen
    var left = window.screen.width / 2 - width / 2;
    var top = window.screen.height / 2 - height / 2;

    // Open the new window centered on the screen
    window.open(
      link,
      "Spigen",
      `width=${width},height=${height},top=${top},left=${left},status=1,scrollbars=1,location=0,resizable=yes`
    );
  }

  const handleEwayClick = (module: string) => {
    const shipmentId = sellRequestDetails?.headerData?.invoiceNo || "";
    const sanitizedShipmentId = shipmentId.replace(/\//g, "_");
    if (module === "Invoice") {
      // window.open(`/salesOrder/e-inv/${sanitizedShipmentId}`, "_blank");
      fnOpenNewWindow(`/salesOrder/e-inv/${sanitizedShipmentId}`);
    } else {
      // window.open(`/salesOrder/e-way/${sanitizedShipmentId}`, "_blank");
      fnOpenNewWindow(`/salesOrder/e-way/${sanitizedShipmentId}`);
    }
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetHeader></SheetHeader>
      <SheetContent
        side={"bottom"}
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        {loading && <FullPageLoading />}
        <SheetTitle>
          View Material List : {sellRequestDetails?.headerData?.invoiceNo} |{""}
          {shipmentIdextracted}
        </SheetTitle>

        <div className="ag-theme-quartz h-[calc(100vh-140px)] grid grid-cols-4 gap-4">
          <div className="col-span-1 max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-4 p-4">
            {/* Cards Section */}
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill To Detail
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Client</h3>
                <p className="text-[14px]">{data?.billTo?.custName}</p>
                <h3 className="font-[600]">PAN</h3>
                <p className="text-[14px]">{data?.billTo?.pincode}</p>
                <h3 className="font-[600]">GSTIN</h3>
                <p className="text-[14px]">{data?.billTo?.gst}</p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {(data?.billTo?.address1 ?? "") +
                    " " +
                    data?.billTo?.address2}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Bill From
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">PAN</h3>
                <p className="text-[14px]">{data?.billFrom?.pan}</p>
                <h3 className="font-[600]">GSTIN</h3>
                <p className="text-[14px]">{data?.billFrom?.gstin}</p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {(data?.billFrom?.address1 ?? "") +
                    " " +
                    (data?.billFrom?.address2 ?? "")}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Ship To
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-4 flex flex-col gap-4 text-slate-600">
                <h3 className="font-[600]">Company</h3>
                <p className="text-[14px]">{data?.shipTo?.company}</p>
                <h3 className="font-[600]">PAN</h3>
                <p className="text-[14px]">{data?.shipTo?.panno}</p>
                <h3 className="font-[600]">GSTIN</h3>
                <p className="text-[14px]">{data?.shipTo?.gst}</p>
                <h3 className="font-[600]">Address</h3>
                <p className="text-[14px]">
                  {data?.shipTo?.address1 || "" + data?.shipTo?.address2}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-sm shadow-slate-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#e0f2f1]">
                <CardTitle className="font-[550] text-slate-600">
                  Tax Detail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-600">
                  <ul>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">
                          Sub-Total value before Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">{totalValue?.toFixed(2)}</p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">CGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){totalCGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">SGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){totalSGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="grid grid-cols-[1fr_150px] mt-4">
                      <div>
                        <h3 className="font-[600]">ISGST :</h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          (+){totalIGST?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <li className="mt-2 border-t border-gray-300 p-2"></li>
                    <li className="grid grid-cols-[1fr_150px]">
                      <div>
                        <h3 className="font-[600] text-cyan-600">
                          Sub-Total values after Taxes :
                        </h3>
                      </div>
                      <div>
                        <p className="text-[14px]">
                          {(
                            totalValue +
                            totalCGST +
                            totalSGST +
                            totalIGST
                          )?.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-3 flex flex-col h-full">
            <div className="flex justify-end mb-4 gap-4">
              <Button
                disabled={
                  data?.eInvoice === "Yes" || data?.invStatus === "PENDING"
                }
                onClick={() => handleEwayClick("Invoice")}
                variant={"outline"}
              >
                Generate e-Invoice
                <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Button>
              <Button
                disabled={
                  data?.ewaybill === "Yes" || data?.invStatus === "Pending"
                }
                onClick={() => handleEwayClick("WayBill")}
                variant={"outline"}
              >
                Generate e-Way Bill{" "}
                <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Button>
              <div className="col-span-3 flex flex-col h-full">
          <div className="flex justify-end mb-4 gap-4">
                  {/* Print Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Print{" "}
                        <Printer className="pl-1 h-[20px] w-[20px] font-[600]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end" // Align dropdown to the right
                      className="z-50 bg-white shadow-lg rounded-md overflow-hidden max-w-[200px]"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handlePrintInvoice(
                            sellRequestDetails?.headerData?.invoiceNo,
                            "Original"
                          )
                        }
                      >
                        Original
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePrintInvoice(
                            sellRequestDetails?.headerData?.invoiceNo,
                            "Duplicate"
                          )
                        }
                      >
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handlePrintInvoice(
                            sellRequestDetails?.headerData?.invoiceNo,
                            "Triplicate"
                          )
                        }
                      >
                        Transporter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="ag-theme-quartz flex-1">
              <AgGridReact
                rowData={sellRequestDetails?.materialData}
                columnDefs={columnDefs}
                // pagination={true}
                suppressCellFocus={true}
                components={{
                  truncateCellRenderer: TruncateCellRenderer,
                }}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                enableCellTextSelection = {true}
              />
            </div>
          </div>
        </div>
      </SheetContent>
      <SheetFooter></SheetFooter>
    </Sheet>
  );
};

export default ViewInvoiceModal;
