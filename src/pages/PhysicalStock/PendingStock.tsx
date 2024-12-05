import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { DatePicker } from "antd";
import useApi from "@/hooks/useApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  approveStockItem,
  pendingPhysical,
  rejectStockItem,
} from "@/features/client/storeSlice";
import { toast } from "@/components/ui/use-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
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
  const [confirmReject, setConfirmReject] = useState([]);
  const [confirmApprove, setConfirmApprove] = useState(false);

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    dispatch(pendingPhysical()).then((r) => {
      if (r.payload.success) {
        let arr = r.payload.data.map((r, index) => {
          return {
            id: index + 1,
            c_name: r.c_name == null ? "--" : r.c_name,
            ...r,
          };
        });
        toast({
          title: r.payload?.message,
          className: "bg-green-700 text-white text-center",
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
  const rejectItem = async (e) => {
    setConfirmReject(false);

    // return;
    let payload = {
      data: e.data.ID,
    };
    dispatch(rejectStockItem(payload)).then((res) => {
      if (res.payload.success) {
        toast({
          title: res.payload.message,
          className: "bg-green-600 text-white items-center",
        });
        fetchQueryResults();
        setRowData([]);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };
  const aproveItem = async (e) => {
    setConfirmApprove(false);

    // return;
    let payload = {
      data: e.data.ID,
    };
    dispatch(approveStockItem(payload)).then((res) => {
      if (res.payload.success) {
        toast({
          title: res.payload.message,
          className: "bg-green-600 text-white items-center",
        });
        setRowData([]);
        fetchQueryResults();
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };

  const columnDefs: ColDef<rowData>[] = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      cellRenderer: (params) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className=" bg-green-700 hover:bg-green-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
            <FaCheckCircle
              className="h-[15px] w-[15px] text-green-700"
              onClick={(e) => setConfirmApprove(params)}
            />
            {/* </Button>{" "} */}
            {/* <Button className=" bg-red-700 hover:bg-red-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600"> */}
            <FaTimesCircle
              className="h-[15px] w-[15px] text-red-700 pointer-cursor  "
              // onClick={() => console.log(params)}
              onClick={(e) => setConfirmReject(params)}
            />
            {/* </Button>{" "} */}
          </div>
        );
      },
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Box Number",
      field: "box_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 140,
    },
    {
      headerName: "Part Code",
      field: "part_name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Part Name",
      field: "c_name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 320,
    },

    {
      headerName: "IMS Stock",
      field: "ims_closing_stock",
      filter: "agTextColumnFilter",
      width: 150,
    },

    {
      headerName: "Physical Stock",
      field: "physical_stock",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    // {
    //   headerName: "ClosingStock",
    //   field: "closing_stock_time",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    // },
    {
      headerName: "Cost Center",
      field: "cost_center_name",
      cellRenderer: CopyCellRenderer,
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "Verified By",
      field: "user_name",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Date & Time",
      field: "insert_date",
      filter: "agTextColumnFilter",
      width: 180,
    },
    // {
    //   headerName: "Remark",
    //   field: "remark",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    // },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Pending Stock");
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
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>{" "}
      <ConfirmationModal
        open={confirmReject.data}
        onClose={() => setConfirmReject(false)}
        onOkay={() => rejectItem(confirmReject)}
        title="Confirm Submit!"
        description="Are you sure to Reject this Pending Stock?"
        submitText="Reject"
      />
      <ConfirmationModal
        open={confirmApprove.data}
        onClose={() => setConfirmApprove(false)}
        onOkay={() => aproveItem(confirmApprove)}
        title="Confirm Submit!"
        description="Are you sure to Approve this Pending Stock?"
        submitText="Approve"
      />
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
