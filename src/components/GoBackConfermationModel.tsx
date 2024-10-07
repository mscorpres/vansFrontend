import React from "react";
import { Dispatch, SetStateAction } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  goBack: Dispatch<SetStateAction<boolean>>;
}
const GoBackConfermationModel: React.FC<Props> = ({ open, setOpen,goBack }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to go back? Your all changes will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>goBack(false)} className="bg-red-700 hover:bg-red-600">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GoBackConfermationModel;
