import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { DatePicker } from "antd";
import useApi from "@/hooks/useApi";
import { fetchR4 } from "@/components/shared/Api/masterApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { pendingPhysical } from "@/features/client/storeSlice";
import { toast } from "@/components/ui/use-toast";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string().optional(),
});

const PendingStock = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const { loading } = useSelector((state: RootState) => state.store);
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch<AppDispatch>();
  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {

    dispatch(pendingPhysical()).then((r) => {
      if (r.payload.code == 200) {
        toast({
          title: r.payload?.message,
          className: "bg-green-700 text-white text-center",
        });
        let arr = data.data.map((r, index) => {
          return {
            id: index + 1,
            ...r,
          };
        });
        setRowData(arr);
      } else {
        toast({
          title: r.payload?.message,
          className: "bg-red-700 text-white text-center",
        });
      }
    });

  };

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "part_no",
      filter: "agTextColumnFilter",
      width: 140,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Desc",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 320,
    },

    {
      headerName: "Total Stock",
      field: "stock",
      filter: "agTextColumnFilter",
      width: 150,
    },

    {
      headerName: "Navs Stock",
      field: "navStock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Stock Time",
      field: "closing_stock_time",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Make",
      field: "make",
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "Soq",
      field: "soq",
      filter: "agTextColumnFilter",
      width: 150,
    },
  ];
  const type = [
    {
      label: "Pending",
      value: "P",
    },
    {
      label: "All",
      value: "A",
    },
    {
      label: "Project",
      value: "PROJECT",
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "PendingStock All Item Closing Stock");
  };

  useEffect(() => {
    fetchQueryResults();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-1">
      <div className="flex gap-[10px] justify-end  px-[5px] bg-white h-[50px]">
        <Button
          // type="submit"
          className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey mt-[8px]"
          // onClick={() => {}}
          disabled={rowData.length === 0}
          onClick={(e: any) => {
            e.preventDefault();
            handleDownloadExcel();
          }}
        >
          <IoMdDownload size={20} />
        </Button>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-150px)]">
        {" "}
        {loading && <FullPageLoading />}
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
    </Wrapper>
  );
};

export default PendingStock;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
