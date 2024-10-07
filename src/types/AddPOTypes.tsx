import { RowData } from "@/config/agGrid/SalseOrderCreateTableColumns";
import { Dispatch, SetStateAction } from "react";
export interface AddPoUIStateType {
  excelModel: boolean;
  setExcelModel: Dispatch<SetStateAction<boolean>>;
  setRowData: Dispatch<SetStateAction<RowData[]>>;
  backModel: boolean;
  setBackModel: Dispatch<SetStateAction<boolean>>;
  resetModel: boolean;
  setResetModel: Dispatch<SetStateAction<boolean>>;
}

export interface Props {
  uiState: AddPoUIStateType;
}
