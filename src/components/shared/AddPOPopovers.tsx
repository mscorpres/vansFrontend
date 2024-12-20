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

const AddPOPopovers: React.FC<Props> = ({ uiState, derivedState }) => {
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
      // Calculate localValue (parse rate and qty as floats to ensure they are numbers)
      const localValue = parseFloat(item.rate) * parseFloat(item.qty) || 0;
      const gstRate = parseFloat(item.gst) || 0; // Ensure gstRate is parsed as a float
      const gstType = derivedState || "I"; // Default to "I" (Inter-state) if gsttype is missing

      // Initialize GST values
      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      // Calculate GST based on gstRate and gstType
      const calculation = (localValue * gstRate) / 100;

      if (gstType === "L") {
        // Intra-State GST calculation (CGST = SGST)
        cgst = calculation / 2;
        sgst = calculation / 2;
        igst = 0;
      } else if (gstType === "I") {
        // Inter-State GST calculation (only IGST)
        igst = calculation;
        cgst = 0;
        sgst = 0;
      }

      // Foreign value calculation (if currency is not the default)
      // let foreignValue = localValue; // Default to local value if no exchange rate
      // if (props.exRate?.currency !== "364907247") {
      //   foreignValue = localValue * parseFloat(props.exRate?.exchange_rate || "1");
      // }

      // Prepare the mapped data for the row
      return {
        partno: item?.partcode || "", // Ensure partNo is available
        orderQty: parseFloat(item.qty) || 1, // Default to 1 if qty is missing or invalid
        material: item?.item || "", // Ensure the material data is included
        rate: parseFloat(item.rate) || 0, // Ensure rate is numeric
        localValue: localValue, // Taxable value in the local currency
        // foreignValue: foreignValue, // Exchange taxable value (if applicable)
        gstRate: item.gst, // GST rate applied
        cgst: cgst.toFixed(2), // GST calculation for CGST
        sgst: sgst.toFixed(2), // GST calculation for SGST
        igst: igst.toFixed(2), // GST calculation for IGST
        currency: item.currency || "364907247", // Default to a specific currency code if missing
        gstType: gstType, // "L" for Intra-State, "I" for Inter-State
        hsnCode: item.hsn || "", // Ensure HSN code is included
        remark: item.remark || "", // Ensure remarks are included
        // updateid: item?.updateid || 0, // Include updateid if applicable
        stock: item?.closingQty || 0, // Include stock quantity if available
        isNew: true, // Mark this as a new entry
      };
    });

    // Set the response data in the table
    setRowData((prevRowData) => {
      // If the previous row data is just a placeholder, replace it with mapped data
      if (prevRowData.length === 1 && prevRowData[0].material === "") {
        return mappedData;
      } else {
        return [...prevRowData, ...mappedData];
      }
    });

    // Close the Excel dialog
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
              uploadFunction={(file) => dispatch(uploadSOExcel({ file: file }))}
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
                  href="https://vansapiv2.mscorpres.net/files/salesItems.xlsx"
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
