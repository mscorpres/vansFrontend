import { IServerSideGetRowsRequest } from "@ag-grid-community/core";


export const getFakeServer: (allData: any[]) => any = (allData: any[]) => {
    return {
      getResponse: (request: IServerSideGetRowsRequest) => {
       
        // take a slice of the total rows
        const rowsThisPage = allData.slice(request.startRow, request.endRow);
        // if on or after the last page, work out the last row.
        const lastRow =
          allData.length <= (request.endRow || 0) ? allData.length : -1;
        return {
          success: true,
          rows: rowsThisPage,
          lastRow: lastRow,
        };
      },
    };
  };