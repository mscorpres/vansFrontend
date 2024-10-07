import { Dispatch, SetStateAction } from "react";
export interface ShipmentuiStateType{
    setUpdate:Dispatch<SetStateAction<boolean>>;
    update:boolean;
    setView:Dispatch<SetStateAction<boolean>>;
    view:boolean;
    setCreateInvoivce:Dispatch<SetStateAction<boolean>>;
    createInvoice:boolean;
    setCancelShipment:Dispatch<SetStateAction<boolean>>;
    cancelShipment:boolean;
   

  }
  export interface Props {
    uiState: ShipmentuiStateType;
  }