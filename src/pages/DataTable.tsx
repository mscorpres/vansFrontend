
import { initialrowdata, RowData } from "@/data";
import { ColDef, GetContextMenuItemsParams, GridReadyEvent, IServerSideDatasource, MenuItemDef, StatusPanelDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { tablecolumns } from "@/config/agGrid/tableColumns";
import TextInputCellRenderer from "@/config/agGrid/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import { getFakeServer } from "@/config/agGrid/getFakeServer";
import { getServerSideDatasource } from "@/config/agGrid/getServerSideDatasource";
import { menuresult } from "@/config/agGrid/GetContextmenu";



const DataTable = () => {
    const [rowData, setRowData] = useState<RowData[]>(initialrowdata);
    const gridRef = useRef<AgGridReact<RowData>>(null);
      
    // const addNewRow = () => {
    //   const newRow: RowData = {
    //     poId: "",
    //     costCenter: "",
    //     vendorNarration: "",
    //     poRegDate: "",
    //     approvedStatus: "Pending",
    //     action: "View",
    //     isNew: true,
    //   };
    //   setRowData([...rowData, newRow]);
    // };
    const saveRows = (data: RowData) => {
      const updatedData = rowData.map((row) => {
        if (row.poId === data.poId && data.poId !== "") {
          row.isNew = false;
        }
        return row;
      });
      setRowData(updatedData);
    };
  
    const viewRow = () => {
      // Implement your view action here
    };
  
    const editRow = (data: RowData) => {
      const updatedData = rowData.map((row) => (row.poId === data.poId ? { ...row, isNew: true } : row));
      setRowData(updatedData);
    };
  
    const deleteRow = (data: RowData) => {
      setRowData(rowData.filter((row) => row.poId !== data.poId));
    };
    const columnDefs: ColDef[] = useMemo(() => tablecolumns(viewRow, editRow, deleteRow, saveRows), [rowData]);
  
    const defaultColDef = useMemo(() => {
      return {
        filter: "agTextColumnFilter",
        floatingFilter: true,
        editable: true,
        cellEditor: "agTextCellEditor",
      };
    }, []);
    const statusBar = useMemo<{
      statusPanels: StatusPanelDef[];
    }>(() => {
      return {
        statusPanels: [
          { statusPanel: "agFilteredRowCountComponent", align: "right" },
          { statusPanel: "agSelectedRowCountComponent", align: "right" },
          { statusPanel: "agAggregationComponent", align: "right" },
        ],
      };
    }, []);
    const components = useMemo(
      () => ({
        textInputCellRenderer: TextInputCellRenderer,
        datePickerCellRenderer: DatePickerCellRenderer,
        statusCellRenderer: StatusCellRenderer,
      }),
      []
    );
  
    const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);
    const loadingCellRendererParams = useMemo(() => {
      return {
        loadingMessage: "One moment please...",
      };
    }, []);
    const onGridReady = useCallback((params: GridReadyEvent) => {
      const server: any = getFakeServer(rowData);
      const datasource: IServerSideDatasource = getServerSideDatasource(server);
      params.api!.setGridOption("serverSideDatasource", datasource);
    }, []);
    // const onBtExport = useCallback(() => {
    //   gridRef.current!.api.exportDataAsExcel();
    // }, []);
    const getContextMenuItems = useCallback(
      (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
        const menu = menuresult(params);
        return menu;
      },
      [window]
    );
  return (
    <div className="ag-theme-quartz  h-[calc(100vh-210px)] relative  flex flex-col  border-none">
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowSelection="multiple"
      suppressRowClickSelection={true}
      components={components}
      statusBar={statusBar}
      loadingCellRenderer={loadingCellRenderer}
      loadingCellRendererParams={loadingCellRendererParams}
      rowModelType={"serverSide"}
      cacheBlockSize={20}
      maxBlocksInCache={10}
      onGridReady={onGridReady}
      ref={gridRef}
      allowContextMenuWithControlKey={true}
      getContextMenuItems={getContextMenuItems}
      serverSideInitialRowCount={10}
    />
  </div>
  )
}

export default DataTable
