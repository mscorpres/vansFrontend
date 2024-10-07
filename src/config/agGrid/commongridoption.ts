// commonAgGridConfig.ts

import { GridOptions } from "@ag-grid-community/core";
export const commonAgGridConfig:GridOptions = {
  rowHeight: 50, // Set a fixed row height globally
  // other common configurations...
  headerHeight:50,
  defaultColDef: {
    cellClass: 'centered-cell flex justify-center items-center'
  }
  // other global configurations...
};
