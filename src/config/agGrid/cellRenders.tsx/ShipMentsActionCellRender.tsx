import { BsThreeDotsVertical } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/shared/CustomTooltip";
import { dropdownHoverBg } from "@/constants/themeContants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ShipmentuiStateType } from "@/types/salesmodule/salesShipmentTypes";
import SalesShipmentUpdate from "@/components/shared/SalesShipmentUpdate";
import SalesShipmentView from "@/components/shared/SalesShipmentView";
import SalesShipmentCreateInvoice from "@/components/shared/SalesShipmentCreateInvoice";
import SalesShipmentCancel from "@/components/shared/SalesShipmentCancel";

const ShipMentsActionCellRender = () => {
  const [update, setUpdate] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const [createInvoice, setCreateInvoivce] = useState<boolean>(false);
  const [cancelShipment, setCancelShipment] = useState<boolean>(false);
  const uiState: ShipmentuiStateType = {
    update,
    setUpdate,
    view,
    setView,
    createInvoice,
    setCreateInvoivce,
    cancelShipment,
    setCancelShipment,
   
  };
  return (
    <>
      <SalesShipmentUpdate uiState={uiState} />
      <SalesShipmentView uiState={uiState} />
      <SalesShipmentCreateInvoice uiState={uiState} />
      <SalesShipmentCancel uiState={uiState}/>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <CustomTooltip message="Action" side="right">
            <Button variant={"ghost"} className="p-0 text-slate-600">
              <BsThreeDotsVertical className="h-[20px] w-[20px]" />
            </Button>
          </CustomTooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setUpdate(true)} className={cn(dropdownHoverBg)}>
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setView(true)} className={dropdownHoverBg}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCreateInvoivce(true)} className={dropdownHoverBg}>
            Create Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCancelShipment(true)} className={dropdownHoverBg}>
            Cancel Shipment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ShipMentsActionCellRender;
