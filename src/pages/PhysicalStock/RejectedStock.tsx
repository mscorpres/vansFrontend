import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import styled from "styled-components";
import { DatePicker, Divider, Form, Input, Typography } from "antd";
import useApi from "@/hooks/useApi";
import { IoMdArrowRoundBack, IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  rejectedPhysical,
  updateRejectphysical,
} from "@/features/client/storeSlice";
import { toast } from "@/components/ui/use-toast";
import { Edit2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { Button } from "@mui/material";
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

const RejectedStock = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [sheetOpenView, setSheetOpenView] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const { loading } = useSelector((state: RootState) => state.store);
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch<AppDispatch>();

  const [fgForm] = Form.useForm();

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    dispatch(rejectedPhysical()).then((r) => {
      if (r.payload?.data.success) {
        // toast({
        //   title: r.payload?.data.message,
        //   className: "bg-green-700 text-white text-center",
        // });
        let arr = r.payload.data.data.map((r, index) => {
          return {
            id: index + 1,
            // cost: r.cost == null ? "--" : r.cost,
            ...r,
          };
        });
        setRowData(arr);
      } else {
        toast({
          title: r.payload?.data.message,
          className: "bg-red-700 text-white text-center",
        });
      }
    });
  };
  const handleSubmit = async () => {
    setShowConfirmation(false);
    let values = await fgForm.validateFields();

    const payload = {
      boxname: sheetOpenView.data.box_no,
      ims_closing_stock: sheetOpenView.data.ims_closing_stock,
      update_physicalStock: values.qty,
      componentname: sheetOpenView.data.part_name,
      auditKey: sheetOpenView.data.ID,
    };
    // return;
    dispatch(updateRejectphysical(payload)).then((r) => {
      if (r.payload?.data?.success) {
        toast({
          title: r.payload?.data?.message,
          className: "bg-green-700 text-white text-center",
        });

        setSheetOpenView(false);
        fetchQueryResults();
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
      field: "action",
      headerName: "Action",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-700 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}

            <Edit2
              onClick={() => {
                setSheetOpenView(e);
              }}
              className="text-cyan-700 h-[20px] w-[20px]"
            />
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
      cellRenderer: CopyCellRenderer,
      width: 150,
    },

    {
      headerName: "Physical Stock",
      field: "physical_stock",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Cost Center",
      field: "cost",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Verified By",
      field: "user_name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 180,
    },
    {
      headerName: "Date & Time",
      field: "insert_date",
      filter: "agTextColumnFilter",
      width: 150,
    },
    // {
    //   headerName: "Remark",
    //   field: "remark",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    // },
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
    downloadCSV(rowData, columnDefs, "Rejected Stock ");
  };

  useEffect(() => {
    fetchQueryResults();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-1">
      <div className="flex gap-[10px] justify-end  px-[5px] bg-white h-[50px] py-[10px]">
        {/* <Button
          // type="submit"
          className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey  w-[10px] h-[30px]"
          // onClick={() => {}}
          disabled={rowData.length === 0}
          onClick={(e: any) => {
            e.preventDefault();
            handleDownloadExcel();
          }}
        >
          <IoMdDownload size={20} />
        </Button>{" "} */}
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
      <div className="ag-theme-quartz h-[calc(100vh-150px)] relative">
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
      </div>
      <Sheet open={sheetOpenView} onOpenChange={setSheetOpenView}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[50%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">
              {` ${sheetOpenView?.data?.box_no} | ${sheetOpenView.data?.part_name}`}
            </SheetTitle>
          </SheetHeader>
          <div>
            <Form form={fgForm}>
              <form
                //   onSubmit={form.handleSubmit(onSubmit)}
                className=""
              >
                {loading && <FullPageLoading />}
                <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto w-full">
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>BOX Number:</Typography.Title>{" "}
                    <Typography.Text type="secondary">
                      {sheetOpenView.data?.box_no}
                    </Typography.Text>
                  </div>
                  <Divider />
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>Part Number:</Typography.Title>
                    <Typography.Text type="secondary">
                      {sheetOpenView.data?.part_name}
                    </Typography.Text>
                  </div>{" "}
                  <Divider />
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>
                      Last Audit Date:
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {sheetOpenView.data?.insert_date}
                    </Typography.Text>
                  </div>{" "}
                  <Divider />
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>
                      Last Audit By:
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {sheetOpenView.data?.user_name}
                    </Typography.Text>
                  </div>{" "}
                  <Divider />
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>IMS Qty:</Typography.Title>
                    <Typography.Text type="secondary">
                      {sheetOpenView.data?.ims_closing_stock}
                    </Typography.Text>
                  </div>{" "}
                  <Divider />
                  <div className="col col-span-1 flex justify-between">
                    <Typography.Title level={5}>Updated Qty:</Typography.Title>
                    <Form.Item name="qty">
                      <Input value={sheetOpenView.data?.log_count} />
                    </Form.Item>
                  </div>
                </div>
                <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto"></div>
                <div className={modelFixFooterStyle}>
                  <Button
                    startIcon={<IoMdArrowRoundBack />}
                    variant="outlined"
                    className="shadow-slate-300 mr-[10px] border-slate-400 border"
                    onClick={(e: any) => {
                      //   setOpen(true);
                      e.preventDefault();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ margin: "10px" }}
                    type="submit"
                    className="bg-cyan-700 hover:bg-cyan-600"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setShowConfirmation(true);
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>{" "}
        <ConfirmationModal
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onOkay={handleSubmit}
          title="Confirm Submit!"
          description="Are you sure to Inward this SKU in store?"
        />
      </Sheet>
    </Wrapper>
  );
};

export default RejectedStock;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
