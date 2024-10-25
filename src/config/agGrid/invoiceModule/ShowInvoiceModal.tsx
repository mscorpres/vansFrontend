import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { printSellInvoice } from "@/features/salesmodule/salesInvoiceSlice";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const DataDialog = ({ open, onClose, orderId, module }: any) => {
  const { invoiceData: data }: { invoiceData: any } = useSelector(
    (state: RootState) => state.sellInvoice
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleDownload = () => {
    dispatch(
      printSellInvoice({ so_invoice: orderId, printInvType: "Original" })
    );
  };

  const handleBack = () => {
    onClose();
  };
console.log(data,data.AckDt,"data.AckDt")
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-fit max-h-[90vh] p-8 bg-white rounded-lg shadow-xl transition-transform transform overflow-y-auto">
        <Card className="rounded shadow bg-[#fff]">
          <CardHeader className="bg-[#e0f2f1] p-0 flex justify-center px-[10px] py-[5px]">
            <h2 className="text-[20px] font-[600] text-slate-600">
              {module} Bill Generation Successful
            </h2>
          </CardHeader>
          <CardContent className="mt-[10px]">
            <div className="bg-[#ffffb72b] ">
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>E-Acknowledgement No:</h3>
                <CopyCellRenderer value={data?.AckNo || "--"} />
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>Acknowledgment Date:</h3>
                <p>{data?.AckDt ? data.AckDt : "--"}</p>
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>IRN No:</h3>
                <CopyCellRenderer value={data?.Irn || "--"} />
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>Status:</h3>
                <p>{data?.Status ? data.Status : "--"}</p>
              </div>
            </div>
            <div className="bg-[#99ffb82b] overflow-x-auto">
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>Info Details</h3>
                <div>
                  {data?.InfoDtls && data?.InfoDtls?.length > 0 ? (
                    <pre>{JSON.stringify(data?.InfoDtls, null, 2)}</pre> // Pretty print the object
                  ) : (
                    <div>--</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>E-Way Bill No:</h3>
                <CopyCellRenderer
                  value={
                    data?.EwbNo
                      ? data?.EwbNo
                      : data?.ewayBillNo
                      ? data?.ewayBillNo
                      : "--"
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>E-Way Date:</h3>
                <p>
                  {data?.EwbDt
                    ? data?.EwbDt
                    : data?.ewayBillDate
                    ? data?.ewayBillDate
                    : "--"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>E-Way Valid Till:</h3>
                <p>
                  {data?.EwbValidTill
                    ? data.EwbValidTill
                    : data?.validUpto
                    ? data?.validUpto
                    : "--"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-[40px] mt-[30px]">
                <h3>Other Ref:</h3>
                <p>
                  {data?.Remarks
                    ? data.Remarks
                    : data?.alert
                    ? data?.alert
                    : "--"}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-20">
              <Button
                onClick={handleDownload}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Download
              </Button>
              <Button
                onClick={handleBack}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Close Window
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DataDialog;
