import { Dialog, DialogContent } from "@/components/ui/dialog";
import ExcelImportButton from "@/config/agGrid/ExcelImportButton";
import { Props } from "@/types/AddPOTypes";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uploadSOExcel } from "@/features/salesmodule/createSalesOrderSlice";

const AddPOPopovers: React.FC<Props> = ({ uiState }) => {
  const {
    excelModel,
    setExcelModel,
    setRowData,
    resetModel,
    setResetModel,
    backModel,
    setBackModel,
  } = uiState;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleImport = (data: any) => {
  //   //map data from excel
  //   const mappedData = data.data.map((item: any) => ({

  //     type: item.item_type,
  //     material: item.item,
  //     materialDescription: item.item_desc,
  //     asinNumber: item.asin === "." ? undefined : item.asin,
  //     orderQty: Number(item.qty),
  //     rate: Number(item.rate),
  //     currency: item.currency,
  //     gstRate: item.gst_rate,
  //     gstType:derivedState,
  //     dueDate: item.due_date,
  //     hsnCode: item.hsn,
  //     remark: item.item_remark,
  //     localValue: item?.rate* item?.qty,
  //     isNew: true,
  //   }));
  //   // Set the response data in the table
  //   setRowData((prevRowData) => {
  //     if (prevRowData.length === 1 && prevRowData[0].material === "") {
  //       return mappedData;
  //     } else {
  //       return [...prevRowData, ...mappedData];
  //     }
  //   });

  //   setExcelModel(false);
  // };

  const handleImport = (data: any) => {
    // Map data from excel
    const mappedData = data.data.map((item: any) => {
      // Calculate localValue
      const localValue = Number(item.rate?.price) * Number(item.qty);

      // Calculate GST values based on derivedState
      let cgst = 0;
      let sgst = 0;
      let igst = 0;
      const gstRate = Number(item.gst_rate);
      const calculation = (localValue * gstRate) / 100;

      // Determine GST type
      const gstType = derivedState; // Assuming derivedState is available in your scope

      if (gstType === "L") {
        // Intra-State
        cgst = calculation / 2;
        sgst = calculation / 2; // Same as CGST
        igst = 0;
      } else if (gstType === "I") {
        // Inter-State
        igst = calculation;
        cgst = 0;
        sgst = 0;
      }

      return {
        type: item.item_type,
        material: item.item,
        materialDescription: item.item_desc,
        asinNumber: item.asin === "." ? undefined : item.asin,
        orderQty: Number(item.qty),
        rate: item.rate?.price,
        currency: item.currency,
        discount: item.discount,
        gstRate: String(Number(item.gst_rate) || 0),
        // localValue:
        //   (
        //     item.rate?.price * item.qty -
        //     item.rate?.price * item.qty * (item.discount / 100)
        //   ).toString() || "0",
        gstType: derivedState, // Use derivedState here
        dueDate: item.due_date,
        hsnCode: item.hsn,
        remark: item.item_remark,
        localValue: localValue,
        cgst: cgst.toFixed(2), // Include calculated values
        sgst: sgst.toFixed(2),
        igst: igst.toFixed(2),
        isNew: true,
      };
    });

    // Set the response data in the table
    setRowData((prevRowData) => {
      if (prevRowData.length === 1 && prevRowData[0].material === "") {
        return mappedData;
      } else {
        return [...prevRowData, ...mappedData];
      }
    });

    setExcelModel(false);
  };

  // const channelValue: string = channel || "";

  return (
    <div>
      {/* excel upload model =============*/}
      <Dialog open={excelModel} onOpenChange={setExcelModel}>
        <DialogContent className="grid grid-cols-2 min-w-[1000px] px-[50px] py-[100px]">
          <div>
            <ExcelImportButton
              onImport={handleImport}
              uploadFunction={(file) =>
              dispatch(uploadSOExcel({ file: file}))
              }
            />
          </div>
          <div>
            <h2 className="text-[16px] font-[600] text-slate-600">
              Instructions
            </h2>
            <ol className="text-slate-500 text-[14px] ml-[10px] list-decimal">
              <li> Don't Edit columns colored as red.</li>
              <li>Don't change order of columns.</li>
              <li>Custom Fields columns with bold headers are mandatory.</li>
              <li>
                In unit column, just enter unit name, and that should exactly
                match with the product units. (eg. for Litre, 'litre' is
                incorrect).
              </li>
              <li>
                In unit column, just enter unit name, and that should exactly
                match with the product units. (eg. for Litre, 'litre' is
                incorrect).
              </li>
              <li>
                To apply absolute discount in document currency, keep 'Discount
                Type' column blank, whereas to apply percentage discount enter
                '%' in 'Discount Type' column.
              </li>{" "}
              <li className="p-1">
                Download<span> </span>
                <a
                  href="https://spigen.mscapi.live/files/excel/Sales%20Order%20Sample.xlsx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 hover:underline"
                >
                  Sample File
                </a>
              </li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
      {/* excel upload model =============*/}

      {/* go back model ======================= */}
      <AlertDialog open={backModel} onOpenChange={setBackModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you want to go back?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="shadow-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="shadow bg-cyan-700 hover:bg-cyan-800 shadow-slate-500"
              onClick={() => navigate("/create-po")}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* go back model ======================= */}

      {/* reset confarmation model ====================*/}
      <AlertDialog open={resetModel} onOpenChange={setResetModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            {/* <AlertDialogDescription>Are you sure want to logout.</AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 shadow hover:bg-red-600 shadow-slate-500"
              onClick={() => setRowData([])}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* reset confarmation model ====================*/}
    </div>
  );
};

export default AddPOPopovers;
