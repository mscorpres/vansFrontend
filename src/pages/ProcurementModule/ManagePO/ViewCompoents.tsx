import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { modelFixHeaderStyle } from "@/constants/themeContants";

import { AgGridReact } from "ag-grid-react";
import { fetchViewComponentsOfManage } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
const ViewCompoents: React.FC<Props> = ({ view, setView }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { execFun} = useApi();

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "id",
      headerName: "Id",
      width: 90,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    // {
    //   field: "componentPartID",
    //   headerName: "PO Id",
    //   flex: 1,
    //   filterParams: {
    //     floatingFilterComponentParams: {
    //       suppressFilterButton: true,
    //       placeholder: "Filter PO ID...",
    //     },
    //   },
    // },
    // {
    //   field: "po_component",
    //   headerName: "Component Name/Part No.",
    //   cellRenderer: CopyCellRenderer,
    //   minWidth: 350,
    //   flex: 1,
    //   filterParams: {
    //     floatingFilterComponentParams: {
    //       suppressFilterButton: true,
    //       placeholder: "Filter Cost Center...",
    //     },
    //   },
    // },
    {
      field:"componentPartID",
      headerName: "Part No",
      flex: 1,
    },
    {
      field:"po_components",
      headerName: "PO Component",
      flex: 1,
    },
    {
      field:"componentDesc",
      headerName: "Description",
      flex: 1,
      width: 400,
    },

    // {
    //   field: "vendor_part_codes",
    //   headerName: "	Vendor Component Name / Part No.",
    //   cellRenderer: CopyCellRenderer,
    //   flex: 2,
    //   minWidth: 250,
    //   filterParams: {
    //     floatingFilterComponentParams: {
    //       suppressFilterButton: true,
    //       placeholder: "Filter Vendor & Narration...",
    //     },
    //   },
    // },
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
    {
      field: "po_order_rate",
      headerName: "Rate",
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
      field: "po_remark",
      headerName: "Remark",
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
    // {
    //   field: "componentPartID",
    //   headerName: "PO Id",
    //   flex: 1,
    //   filterParams: {
    //     floatingFilterComponentParams: {
    //       suppressFilterButton: true,
    //       placeholder: "Filter PO ID...",
    //     },
    //   },
    // },
    {
      field: "po_component",
      headerName: "Component Name/Part No.",
      cellRenderer: CopyCellRenderer,
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendor_part_codes",
      headerName: "	Vendor Component Name / Part No.",
      cellRenderer: CopyCellRenderer,
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
    {
      field: "po_order_rate",
      headerName: "Rate",
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

    setLoading(true);
    let response = await execFun(
      () =>
        fetchViewComponentsOfManage(
          view.po_transaction ? view?.po_transaction : view?.po_transaction_code
        ),
      "fetch"
    );
    let { data } = response;
    if (data.success) {
      let arr = data?.data.data.map((r, id) => {
        return {
          id: id + 1,
          vendor_part_codes: r.vendor_part_code + " /" + r.vendor_part_desc,
          description:r.componentDesc,

          po_component:
            r.po_components + "/" + r.componentPartID + " /" + r.componentDesc,
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
      <SheetContent className="min-w-[100%] p-0">
        <SheetHeader className={modelFixHeaderStyle}>
          <SheetTitle className="text-slate-600">
            View Components {view.po_transaction || view.po_transaction_code}
          </SheetTitle>
        </SheetHeader>{" "}
        {loading && <FullPageLoading />}
        <div className="ag-theme-quartz h-[calc(100vh-100px)] px-[10px]">
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={view.po_transaction ? columnDefs : columnDefsCompleted}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            suppressCellFocus={true}
            enableCellTextSelection = {true}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ViewCompoents;
