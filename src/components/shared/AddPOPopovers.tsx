import { Dialog, DialogContent } from "@/components/ui/dialog";
import ExcelImportButton from "@/config/agGrid/ExcelImportButton";
import { Props } from "@/types/AddPOTypes";
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

const AddPOPopovers: React.FC<Props> = ({
  uiState,
  derivedState,
  getCostCenter,
}) => {
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

  const handleImport = (data: any) => {
    console.log("Imported Excel Data:", data.data);

    const mappedData = data.data.map((item: any) => {
      console.log("Processing item:", item);

      const localValue = parseFloat(item.rate) * parseFloat(item.qty) || 0;
      const gstRate = parseFloat(item.gst) || 0;
      const gstType = derivedState || "I";

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      const calculation = (localValue * gstRate) / 100;
      if (gstType === "L") {
        cgst = calculation / 2;
        sgst = calculation / 2;
        igst = 0;
      } else if (gstType === "I") {
        igst = calculation;
        cgst = 0;
        sgst = 0;
      }

      // Extract material code and name from the item object
      const materialCode = item?.item?.code || item?.code || "";
      const materialName = item?.item?.name || item?.name || "";

      if (!materialCode) {
        console.warn("Material code missing for item:", item);
      }

      return {
        partno: item?.item?.partNo || item?.partNo || "",
        orderQty: parseFloat(item.qty) || 1,
        material: materialCode, // Store the ID/code (e.g., "1677663509568")
        materialName: materialName, // Store the display name (e.g., "TG0002 - ...")
        rate: parseFloat(item.rate) || 0,
        localValue: localValue,
        gstRate: item.gst,
        cgst: cgst.toFixed(2),
        sgst: sgst.toFixed(2),
        igst: igst.toFixed(2),
        currency: item.currency || "364907247",
        gstType: gstType,
        hsnCode: item.hsn || "",
        remark: item.remark || "",
        stock: item?.closingQty || 0,
        isNew: true,
      };
    });

    setRowData((prevRowData) => {
      if (prevRowData.length === 1 && prevRowData[0].material === "") {
        return mappedData;
      } else {
        return [...prevRowData, ...mappedData];
      }
    });

    setExcelModel(false);
  };

  return (
    <div>
      {/* Excel upload model */}
      <Dialog open={excelModel} onOpenChange={setExcelModel}>
        <DialogContent className="grid grid-cols-2 min-w-[1000px] px-[50px] py-[100px]">
          <div>
            <ExcelImportButton
              onImport={handleImport}
              uploadFunction={(file) =>
                dispatch(
                  uploadSOExcel({ file: file, getCostCenter: getCostCenter })
                )
              }
            />
          </div>
          <div>
            <h2 className="text-[16px] font-[600] text-slate-600">Instructions</h2>
            <ol className="text-slate-500 text-[14px] ml-[10px] list-decimal">
              <li>Don't Edit columns colored as red.</li>
              <li>Don't change order of columns.</li>
              <li>Custom Fields columns with bold headers are mandatory.</li>
              <li>
                In unit column, just enter unit name, and that should exactly
                match with the product units. (e.g., for Litre, 'litre' is incorrect).
              </li>
              <li>
                To apply absolute discount in document currency, keep 'Discount Type'
                column blank, whereas to apply percentage discount enter '%' in
                'Discount Type' column.
              </li>
              <li className="p-1">
                Download{" "}
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

      {/* Go back model */}
      <AlertDialog open={backModel} onOpenChange={setBackModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>Are you want to go back?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="shadow-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="shadow bg-cyan-700 hover:bg-cyan-800 shadow-slate-500"
              onClick={() => navigate("/create-po")}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset confirmation model */}
      <AlertDialog open={resetModel} onOpenChange={setResetModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">
              Are you absolutely sure?
            </AlertDialogTitle>
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
    </div>
  );
};

export default AddPOPopovers;