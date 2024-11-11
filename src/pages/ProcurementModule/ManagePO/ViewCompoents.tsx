import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  modelFixHeaderStyle,
} from "@/constants/themeContants";

import { AgGridReact } from "ag-grid-react";
import SalesShipmentUpadetTextCellrender from "@/config/agGrid/cellRenders.tsx/SalesShipmentUpadetTextCellrender";
import { fetchViewComponentsOfManage } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
const ViewCompoents: React.FC<Props> = ({ view, setView }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { execFun, loading: loading1 } = useApi();
  const components = useMemo(
    () => ({
      salesShipmentTextCellRender: SalesShipmentUpadetTextCellrender,
    }),
    []
  );
  const [columnDefs] = useState<ColDef[]>([
    {
      field: "id",
      headerName: "id",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "componentPartID",
      headerName: "Po Id",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "po_components",
      headerName: "Component Name",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendor_part_code",
      headerName: "	Vendor Component Name / Part No.",
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "c_brand",
      headerName: "Make (Brand)",
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
      field: "ordered_qty",
      headerName: "Ordered Qty",
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
      field: "pending_qty",
      headerName: "Pending Qty",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
  ]);
  const [columnDefsCompleted] = useState<ColDef[]>([
    {
      field: "componentPartID",
      headerName: "Po Id",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "cost_center",
      headerName: "Component Name",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "po_components",
      headerName: "	Vendor Component Name / Part No.",
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "c_brand",
      headerName: "Make (Brand)",
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
      field: "ordered_qty",
      headerName: "Ordered Qty",
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
      field: "pending_qty",
      headerName: "Pending Qty",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
  ]);
  const calltheApi = async () => {
    // dispatch(fetchManagePOVeiwComponentList({ poid: view.po_transaction }));
    // if (managePoViewComponentList) {
    //   setRowData(managePoViewComponentList);
    // }
    let response = await execFun(
      () =>
        fetchViewComponentsOfManage(
          view.po_transaction ? view?.po_transaction : view?.po_transaction_code
        ),
      "fetch"
    );
    setLoading(true);
    let { data } = response;
    if (data.code == 200) {
      let arr = data?.data.data.map((r, id) => {
        return {
          id: id + 1,
          vendor_part_code: r.vendor_part_code + "-" + r.vendor_part_desc,
          ...r,
        };
      });
      setRowData(arr);
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (view?.po_transaction || view?.po_transaction_code) {
      calltheApi();
    }
  }, [view]);

  return (
    <Sheet
      open={view.po_transaction || view.po_transaction_code}
      onOpenChange={setView}
    >
      {" "}
      {loading == true && <FullPageLoading />}
      <SheetContent className="min-w-[100%] p-0">
        <SheetHeader className={modelFixHeaderStyle}>
          <SheetTitle className="text-slate-600">
            View Components {view.po_transaction || view.po_transaction_code}
          </SheetTitle>
        </SheetHeader>{" "}
        <div className="ag-theme-quartz h-[calc(100vh-100px)] px-[10px]">
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={view.po_transaction ? columnDefs : columnDefsCompleted}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewCompoents;
