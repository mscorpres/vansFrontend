import { IServerSideDatasource } from "@ag-grid-community/core";

export const getServerSideDatasource: (server: any) => IServerSideDatasource = (
    server: any,
  ) => {
    return {
      getRows: (params) => {
        // adding delay to simulate real server call
        setTimeout(() => {
          const response = server.getResponse(params.request);
          if (response.success) {
            // call the success callback
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } else {
            // inform the grid request failed
            params.fail();
          }
        }, 4000);
      },
    };
  };