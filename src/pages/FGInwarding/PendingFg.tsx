import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { ICellRendererParams } from "ag-grid-community";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Check, Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Checkbox, DatePicker, Divider, Form, Space, Typography } from "antd";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import { fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import { RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ActionCellRenderer from "./ActionCellRenderer";
import {
  fetchListOfPendingFg,
  getListFgIn,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import { FaCheckCircle } from "react-icons/fa";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { saveFGs } from "@/features/client/storeSlice";
import { IoMdDownload, IoMdPrint } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";

const PendingFg = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [sheetOpenView, setSheetOpenView] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fgForm] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.store);
  const fetchFGList = async () => {
    // const { wise } = formData;
    const values = fgForm.validateFields();
    const response = await execFun(
      () => fetchListOfPendingFg({ search: values.wise }),
      "fetch"
    );
    let { data } = response;
    if (data.success) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: response?.data.message,
        className: "bg-red-700 text-white",
      });
    }
  };

  const type = [
    {
      label: "Pending",
      value: "p",
    },
    ,
  ];

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Req Id",
      field: "mfg_transaction",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 120,
    },
    {
      headerName: "Type",
      field: "typeOfPPR",
      filter: "agTextColumnFilter",
      width: 100,
    },
    {
      headerName: "Req Date/Time",
      field: "mfg_full_date",
      filter: "agTextColumnFilter",

      width: 190,
    },
    {
      headerName: "SKU",
      field: "mfg_sku",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 110,
    },
    {
      headerName: "Product",
      field: "p_name",
      filter: "agTextColumnFilter",
      width: 190,
      flex: 1,
    },
    {
      headerName: "MFG /Stin Qty",
      field: "mfg_prod_planing_qty",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Actions",
      cellRendererFramework: "ActionCellRenderer",
      width: 100,
      suppressMenu: true, // Optionally, hide the menu icon in this column
      cellRenderer: (e) => {
        return (
          <Check
            className="h-[15px] w-[15px] text-green-500 hover:text-green-700"
            onClick={() => {
              setSheetOpenView(e?.data);
            }}
            //   onClick={() => setSheetOpenEdit(e?.data?.product_key)}
          />
          // <div className="flex gap-[5px] items-center justify-center h-full">
          //   <Checkbox onClick={(e) => rowData(e.target.checked)} />
          // </div>
        );
      },
    },
  ];
  const getinwardingDetails = async (sheetOpenView) => {
    let payload = {
      pprrequest2: sheetOpenView.mfg_transaction,
      pprrequest1: sheetOpenView.mfg_ref_transid_1,
      pprsku: sheetOpenView.mfg_sku,
    };
    const response = await execFun(() => getListFgIn(payload), "fetch");
    let { data } = response;
    if (response.success || data.success) {
      let val = {
        pprName: data.data.pprName,
        pprSku: data.data.pprSku,
        pprTransaction: data.data.pprTransaction,
        mfgTransaction: data.data.mfgTransaction,
        qty: data.data.pendingQty + "/" + data.data.completedQty,
        inqty: data.data.pendingQty,
      };

      fgForm.setFieldValue("pprName", val.pprName);
      fgForm.setFieldValue("combination", val.pprName + "/" + val.pprSku);
      fgForm.setFieldValue("pprSku", val.pprSku);
      fgForm.setFieldValue("pprTransaction", val.pprTransaction);
      fgForm.setFieldValue("mfgTransaction", val.mfgTransaction);
      fgForm.setFieldValue("qty", val.qty);
      fgForm.setFieldValue("inqty", val.inqty);
    }
  };
  const handleSubmit = async () => {
    const values = await fgForm.validateFields();
    let payload = {
      pprqty: values.inqty,
      pprrequest1: fgForm.getFieldValue("pprTransaction"),
      pprrequest2: fgForm.getFieldValue("mfgTransaction"),
      pprsku: fgForm.getFieldValue("pprSku"),
    };

    dispatch(saveFGs(payload)).then((res: any) => {
      if (res.payload.success) {
        toast({
          title: res.payload?.message,
          className: "bg-green-600 text-white items-center",
        });
        setShowConfirmation(false);
      }
      setShowConfirmation(false);
    });
  };

  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "FG Pending");
  };

  useEffect(() => {
    if (sheetOpenView) {
      getinwardingDetails(sheetOpenView);
    }
  }, [sheetOpenView]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[300px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form form={fgForm}>
          <form
            // onSubmit={form.handleSubmit(fetchFGList)}
            className="space-y-6 overflow-hidden p-[10px] h-[170px]"
          >
            <Form.Item className="w-full" name="wise">
              <Select
                styles={customStyles}
                components={{ DropdownIndicator }}
                placeholder="Select Type"
                className="border-0 basic-single"
                classNamePrefix="select border-0"
                isDisabled={false}
                isClearable={true}
                isSearchable={true}
                options={type}
                onChange={(e: any) => form.setValue("wise", e.value)}
              />
            </Form.Item>
            {/* )}
            /> */}
            {/* )} */}
            <div className="flex gap-[10px] justify-end">
              <Button
                // type="submit"
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
                // onClick={() => {}}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleDownloadExcel();
                }}
              >
                <IoMdDownload size={20} />
              </Button>

              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                // onClick={() => {}}
                onClick={(e: any) => {
                  e.preventDefault();
                  fetchFGList();
                }}
              >
                Search
              </Button>
            </div>
          </form>
        </Form>{" "}
        <Sheet open={sheetOpenView} onOpenChange={setSheetOpenView}>
          <SheetTrigger></SheetTrigger>
          <SheetContent
            className="min-w-[80%] p-0"
            onInteractOutside={(e: any) => {
              e.preventDefault();
            }}
          >
            <SheetHeader className={modelFixHeaderStyle}>
              <SheetTitle className="text-slate-600">FG Inwarding</SheetTitle>
            </SheetHeader>
            <div>
              {loading && <FullPageLoading />}
              <Form form={fgForm}>
                <form
                  //   onSubmit={form.handleSubmit(onSubmit)}
                  className=""
                >
                  <div className="space-y-8 p-[20px] h-[calc(100vh-100px)] overflow-y-auto">
                    {" "}
                    <div className="grid grid-cols-4">
                      <Typography.Text
                        className="text-slate-600 font-[600]"
                        level={5}
                      >
                        #
                      </Typography.Text>
                      <Typography.Text
                        className="text-slate-600 font-[600]"
                        level={5}
                      >
                        Name /SKU
                      </Typography.Text>
                      <Typography.Text className="text-slate-600 font-[600]">
                        Mfg/Stin Qty
                      </Typography.Text>
                      <Typography.Text className="text-slate-600 font-[600]">
                        In Qty
                      </Typography.Text>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-4 gap-[20px]">
                      <Form.Item name="sku">
                        <Typography.Text placeholder="Enter NAME / SKU">
                          1
                        </Typography.Text>
                      </Form.Item>
                      <Form.Item name="combination">
                        <Typography.Text placeholder="Enter NAME / SKU">
                          {fgForm.getFieldValue("combination")}
                        </Typography.Text>
                      </Form.Item>

                      <Form.Item name="qty">
                        <Input
                          className={InputStyle}
                          placeholder="Enter MFG / StIn QTY."
                        />
                      </Form.Item>

                      <Form.Item name="inqty">
                        <Input
                          className={InputStyle}
                          placeholder="Enter IN QTY."
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className={modelFixFooterStyle}>
                    <Button
                      variant={"outline"}
                      className="shadow-slate-300 mr-[10px] border-slate-400 border"
                      onClick={(e: any) => {
                        setOpen(true);
                        e.preventDefault();
                      }}
                    >
                      Back
                    </Button>
                    <Button
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
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {(loading || loading1("fetch")) && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          enableCellTextSelection = {true}
        />
      </div>
    </Wrapper>
  );
};

export default PendingFg;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
