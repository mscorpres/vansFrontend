// src/components/ActionCellRenderer.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash } from "lucide-react";
import { IoMdSave } from "react-icons/io";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,  } from "@/components/ui/alert-dialog";

interface ActionCellRendererProps {
  onView: (data: any) => void;
  onEdit: (data: any) => void;
  onDelete: (data: any) => void;
  onSave: (data: any) => void;
  data: any;
}

const ActionCellRenderer: React.FC<ActionCellRendererProps> = ({ onEdit, onDelete, onSave, data }) => {
  const [openAlert,setOpenAlert] = useState<boolean>(false)
  return (
    <div className="flex gap-[5px] items-center justify-center h-full">
      {/* dialogs =========================*/}

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure want to logout.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(data)} className="bg-red-600 hover:bg-red-500">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* disalogs =========================*/}
      <Button className="rounded h-[25px] w-[25px] flex justify-center items-center p-0 bg-cyan-700 hover:bg-cyan-600 shadow shadow-slate-500" onClick={() => onSave(data)}>
        <IoMdSave className="h-[15px] w-[15px] text-white" />
      </Button>
      <Button className="bg-green-700 rounded h-[25px] w-[25px] flex justify-center items-center p-0 hover:bg-green-600 shadow shadow-slate-500" onClick={() => onEdit(data)}>
        <Edit2 className="h-[15px] w-[15px] text-white" />
      </Button>
      <Button className="bg-red-700 rounded h-[25px] w-[25px] flex justify-center items-center p-0 hover:bg-red-600 shadow shadow-slate-500" onClick={() =>setOpenAlert(true)}>
        <Trash className="h-[15px] w-[15px] text-white" />
      </Button>
    </div>
  );
};

export default ActionCellRenderer;
