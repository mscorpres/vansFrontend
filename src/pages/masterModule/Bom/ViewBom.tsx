import { fetchbomComponents } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import { AgGridReact } from "ag-grid-react";
import { RowData } from "@/data";
import { ColDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { toast } from "react-toastify";
const ViewBom = ({ openView, setSheetOpenView }) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const { execFun, loading: loading1 } = useApi();
  const getData = async () => {
    const response = await execFun(() => fetchbomComponents(openView), "fetch");
    let { data } = response;
    if (data?.success) {
      let arr = data?.data.map((r: any, id: any) => {
        return {
          id: id + 1,
          map_cust_description:
            r.map_cust_description !== null ? r.map_cust_description : "--", // Replace null or undefined with "--"
          map_cust_part_no:
            r.map_cust_part_no !== null ? r.map_cust_part_no : "--", // Replace null or undefined with "--"
          ven_comp: r.ven_comp !== null ? r.ven_comp : "--", // Handle both null and empty string
          ven_com_desc: r.ven_com_desc !== null ? r.ven_com_desc : "--",
          // Handle both null and empty string
          ...r,
        };
      });

      setRowData(arr);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    if (openView?.length) {
      getData(openView);
    }
  }, [openView]);
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {" "}
      {loading1("fetch") && <FullPageLoading />}
      <Sheet open={openView?.length} onOpenChange={setSheetOpenView}>
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
          <div className="ag-theme-quartz h-[calc(100vh-50px)] p-[10px]">
            {loading1("fetch") && <FullPageLoading />}
            <AgGridReact
              //   loadingCellRenderer={loadingCellRenderer}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
              suppressCellFocus={true}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
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
    field: "map_cust_part_no",
    filter: "agTextColumnFilter",
    width: 200,
  },
  {
    headerName: "Vendor Part Name",
    field: "ven_comp",
    filter: "agTextColumnFilter",
    width: 250,
  },
  {
    headerName: "Vendor Component Name",
    field: "ven_com_desc",
    filter: "agTextColumnFilter",
    width: 250,
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
    width: 150,
  },
];
