import React, { useMemo, useCallback, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from "@ag-grid-community/core";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchTableData } from "@/features/agGrid/aggridSlice";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";

interface Payload {
  wise: string;
  data: string;
}

interface GridTableProps {
  endpoint: string;
  columns: ColDef[];
  payload?: Payload;
  transform: any;
  method?: string;
  heigth: string;
  option?: any;
  components?: any;
  query?: any;
}

const ReusableTable: React.FC<GridTableProps> = ({ endpoint, columns, payload, transform, method, heigth, components }) => {
  const [rowData, setRowData] = useState<any[] | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector((state: RootState) => state.aggrid.loading);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 200,
      filter: true,
    }),
    []
  );

  const onGridReady = useCallback(() => {
    dispatch(fetchTableData({ endpoint, payload, method })).then((response: any) => {
      console.log("response", response);
      if (loading) {
        setRowData(null);
      } else if (response.payload?.code === 200 || response.payload.success === true) {
        setRowData(transform(response.payload?.data));
      } else {
        setRowData([]);
      }
    });
  }, [dispatch, endpoint, payload, loading]);

  return (
    <div>
      <div className={`w-ful ag-theme-quartz ${heigth}`}>
        <AgGridReact
          components={{ ...components, customLoadingCellRenderer: CustomLoadingCellRenderer }}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          rowData={rowData}
          loadingCellRenderer="customLoadingCellRenderer" // Use the name registered for custom renderer
          loadingCellRendererParams={CustomLoadingCellRenderer}
          rowModelType="clientSide"
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 30, 50, 100]}
          suppressCellFocus={true}
        />
      </div>
    </div>
  );
};

export default ReusableTable;
