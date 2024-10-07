
import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "../components/ui/fullPageSheet";
import { Button } from "@/components/ui/button";

const FullPageSheet = () => {
  const [open,setopen] = useState<boolean>()
  return (
    <div>
      {/* <FullPageLoading/>  */}
      <Sheet open={open} onOpenChange={setopen}>
        <SheetTrigger asChild  className="px-4 py-2 text-white bg-blue-500 rounded">
          <Button onClick={()=>setopen(true)}> Open Full Page Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Full Page Sheet Title</SheetTitle>
            <SheetDescription>
              This is a description for the full page sheet.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1">
            <p className="text-center">This is the main content of the full-page sheet.</p>
          </div>
          <SheetFooter>
            <button className="px-4 py-2 text-white bg-red-500 rounded" onClick={()=>setopen(false)}>
              Close
            </button>
            <button className="px-4 py-2 text-white bg-green-500 rounded" onClick={()=>setopen(false)}>
              Save
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FullPageSheet;
