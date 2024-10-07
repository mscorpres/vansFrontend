import { Dialog, DialogContent } from "@/components/ui/dialog";
import ExcelImportButton from "@/config/agGrid/ExcelImportButton";
import { toCamelCase } from "@/helper/ConvertObjKey";
import { rowData2Schema } from "@/schema/AddPoSchema";
import { Props } from "@/types/AddPOTypes";
import { ZodError } from "zod";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const AddPOPopovers: React.FC<Props> = ({ uiState }) => {
  const { excelModel, setExcelModel, setRowData, resetModel, setResetModel, backModel, setBackModel } = uiState;
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleImport = (data: any[]) => {
    try {
      // Convert keys to camelCase
      const updatedData = data.map((d) => toCamelCase(d));
      // Validate each row
      updatedData.forEach((row) => {
        rowData2Schema.parse(row);
      });

      // If all rows are valid, update the state

      setRowData(updatedData);
      toast({
        title: "Excel file uploaded successfully",
        className: "bg-green-600 text-white",
        duration: 2000,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "The imported data does not match the required format. Please check your file and try again.",
          action: (
            <ToastAction altText="Try again" onClick={() => setExcelModel(true)}>
              Try again
            </ToastAction>
          ),
          className: "z-[300] w-[800px] right-[700px]",
          duration: 4000,
        });
      } else {
      }
    }
    setExcelModel(false);
  };

  return (
    <div>
      {/* excel upload model =============*/}
      <Dialog open={excelModel} onOpenChange={setExcelModel}>
        <DialogContent className="grid grid-cols-2 min-w-[1000px] px-[50px] py-[100px]">
          <div>
            <ExcelImportButton onImport={handleImport} />
          </div>
          <div>
            <h2 className="text-[16px] font-[600] text-slate-600">Instructions</h2>
            <ol className="text-slate-500 text-[14px] ml-[10px] list-decimal">
              <li> Don't Edit columns colored as red.</li>
              <li>Don't change order of columns.</li>
              <li>Custom Fields columns with bold headers are mandatory.</li>
              <li>In unit column, just enter unit name, and that should exactly match with the product units. (eg. for Litre, 'litre' is incorrect).</li>
              <li>In unit column, just enter unit name, and that should exactly match with the product units. (eg. for Litre, 'litre' is incorrect).</li>
              <li>To apply absolute discount in document currency, keep 'Discount Type' column blank, whereas to apply percentage discount enter '%' in 'Discount Type' column.</li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
      {/* excel upload model =============*/}

      {/* go back model ======================= */}
      <AlertDialog open={backModel} onOpenChange={setBackModel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-600">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="shadow-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction className="shadow bg-cyan-700 hover:bg-cyan-800 shadow-slate-500" onClick={() => navigate("/create-po")}>
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
            <AlertDialogTitle className="text-slate-600">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-700 shadow hover:bg-red-600 shadow-slate-500" onClick={()=>setRowData([])}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* reset confarmation model ====================*/}
    </div>
  );
};

export default AddPOPopovers;
