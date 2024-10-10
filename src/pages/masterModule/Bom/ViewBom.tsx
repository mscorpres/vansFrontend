import { fetchbomComponents } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FullPageLoading from "@/components/shared/FullPageLoading";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { AgGridReact } from "ag-grid-react";
const ViewBom = ({ openView, setSheetOpenView }) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { execFun, loading: loading1 } = useApi();
  const getData = async () => {
    const response = await execFun(() => fetchbomComponents(openView), "fetch");
    console.log("response", response);
    if (response.data.code == 200) {
      let { data } = response;
      let arr = data?.data.map((r, id) => {
        return { id: id + 1, ...r };
      });
      console.log("arrq", arr);
      setRowData(arr);
    }
  };
  useEffect(() => {
    if (openView) {
      getData(openView);
    }
  }, [openView]);
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <Sheet open={openView.length} onOpenChange={setSheetOpenView}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[100%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">View BOM</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)]">
            <AgGridReact
              //   loadingCellRenderer={loadingCellRenderer}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default ViewBom;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
const columnDefs: ColDef<rowData>[] = [
  { headerName: "ID", field: "id", filter: "agNumberColumnFilter", width: 90 },
  {
    headerName: "Part Code",
    field: "c_part_no",
    filter: "agTextColumnFilter",
    width: 120,
  },
  {
    headerName: "Component Name",
    field: "c_name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Customer Part No.",
    field: "vendor",
    filter: "agTextColumnFilter",
    width: 150,
  },
  {
    headerName: "Vendor Part Name",
    field: "vendor_name",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Vendor Component Name",
    field: "vendor_part_no",
    filter: "agTextColumnFilter",
    width: 150,
  },
  {
    headerName: "UOM",
    field: "units_name",
    filter: "agTextColumnFilter",
    width: 100,
  },
  {
    headerName: "Is SMT",
    field: "c_is_smt",
    filter: "agTextColumnFilter",
    width: 100,
  },
  {
    headerName: "Req Qty",
    field: "qty",
    filter: "agTextColumnFilter",
    width: 100,
  },
];
