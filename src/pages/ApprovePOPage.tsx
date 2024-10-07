import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { podetail } from "@/data";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Edit2, EyeIcon, Trash } from "lucide-react";
import  { useMemo, useState } from "react";

const ApprovePOPage = () => {
    const rowdata = podetail;

    const [columnDefs] = useState<ColDef[]>([
      {
        field: "poId",
        headerName: "PO ID",
        flex: 1,
        filterParams: {
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            placeholder: "Filter PO ID...",
          },
        },
      },
      {
        field: "costCenter",
        headerName: "COST CENTER",
        flex: 1,
        filterParams: {
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            placeholder: "Filter Cost Center...",
          },
        },
      },
      {
        field: "vendorNarration",
        headerName: "VENDER & NARRATION",
        flex: 2,
        filterParams: {
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            placeholder: "Filter Vendor & Narration...",
          },
        },
      },
      {
        field: "poRegDate",
        headerName: "PO REG. DATE",
        flex: 1,
        filter: "agDateColumnFilter",
        filterParams: {
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            placeholder: "Filter PO Reg. Date...",
          },
        },
      },
      {
        field: "approvedStatus",
        headerName: "APPROVED STATUS",
        flex: 1,
        cellRenderer: (params: any) => {
          const status = params.value;
          return <Badge className={`${status === "Approved" ? "bg-green-600" : status === "Rejected" ? "bg-red-600" : "bg-yellow-600"}`}>{status}</Badge>;
        },
        filterParams: {
          floatingFilterComponentParams: {
            suppressFilterButton: true,
            placeholder: "Filter Approved Status...",
          },
        },
      },
      {
        field: "action",
        headerName: "ACTION",
        flex: 1,
        cellRenderer: () => {
          return (
            <div className="flex gap-[5px] items-center justify-center h-full">
              <Button className="rounded h-[25px] w-[25px] felx justify-center items-center p-0 bg-cyan-500 hover:bg-cyan-600">
                <EyeIcon className="h-[15px] w-[15px] text-white" />
              </Button>
              <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600">
                <Edit2 className="h-[15px] w-[15px] text-white" />
              </Button>
              <Button className="bg-red-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
                <Trash className="h-[15px] w-[15px] text-white" />
              </Button>
            </div>
          );
        },
      },
    ]);
  
    const defaultColDef = useMemo(() => {
      return {
        filter: "agTextColumnFilter",
        floatingFilter: true,
      };
    }, []);
  
  return (
    <div className="bg-white">
      <div className="ag-theme-quartz h-[calc(100vh-120px)]">
        <AgGridReact rowData={rowdata} columnDefs={columnDefs} defaultColDef={defaultColDef} rowSelection="multiple" suppressRowClickSelection={true} pagination={true} paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50]} />
      </div>
    </div>
  )
}

export default ApprovePOPage
