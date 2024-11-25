import { Props } from "@/types/masterModule/masterCustomerTypes";
import React, { useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ReusableTable from "./ReusableTable";
import { editViewColdef } from "@/config/agGrid/mastermodule/CustomerTable";

import { transformEditViewTable } from "@/helper/TableTransformation";
import { Button } from "../ui/button";
import { Edit2 } from "lucide-react";

const MasterEditViewBranch: React.FC<Props> = ({ uiState }) => {
  const { editView, setEditView ,params} = uiState;
  const components = useMemo(
    () => ({
      editViewCellRenderer:()=>{
            return (
                <Button className="bg-transparent text-slate-600  hover:bg-[#f5f5f5]"><Edit2 className="h-[20px] w-[20px]"/></Button>
            )
        }
    }),
    []
  );
  return (
    <Sheet open={editView} onOpenChange={setEditView}>
      <SheetContent className="min-w-[100%]">
        <SheetHeader>
          <SheetTitle>All Branch: {}</SheetTitle>
        </SheetHeader>
          <div className="mt-[15px]">
          <ReusableTable components={components} heigth="h-[calc(100vh-70px)]" endpoint={`client/branches?clientCode=${params?.data?.clientID}`} columns={editViewColdef} transform={transformEditViewTable} method="get" />
          </div>
      </SheetContent>
    </Sheet>
  );
};

export default MasterEditViewBranch;
