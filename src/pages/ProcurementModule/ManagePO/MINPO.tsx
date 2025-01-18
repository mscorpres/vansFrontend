import { Props } from "@/types/salesmodule/salesShipmentTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Save, Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import { IoCloudUpload } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgGridReact } from "ag-grid-react";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { AppDispatch, RootState } from "@/store";
import UploadIcon from "@mui/icons-material/Upload";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataPOforMIN, poMIN } from "@/features/client/clientSlice";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import useApi from "@/hooks/useApi";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { removeHtmlTags } from "@/components/shared/Options";
import { fetchCurrency } from "@/features/salesmodule/createSalesOrderSlice";
import { Button } from "@mui/material";
import { Refresh, UploadFile } from "@mui/icons-material";
import ResetModal from "@/components/ui/ResetModal";
import dayjs from "dayjs";
const MINPO: React.FC<Props> = ({ viewMinPo, setViewMinPo }) => {
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const [taxDetails, setTaxDetails] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [resetModel, setResetModel] = useState(false);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.client);
  const { currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const { execFun, loading: loading1 } = useApi();
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          rowData={rowData}
          search={search}
          currency={currency}
        />
      ),
    }),
    []
  );
  useEffect(() => {
    dispatch(fetchCurrency());
  }, []);
  const columnDefs = [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 50,
      field: "delete",
    },
    { headerName: "Index", valueGetter: "node.rowIndex + 1", maxWidth: 80 },

    {
      headerName: "Component/Part",
      field: "component_fullname",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Part No.",
      field: "c_partno",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Description",
      field: "materialDescription",
      sortable: true,
      filter: true, //
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 350,
    },
    {
      headerName: "Order Qty",
      field: "orderQty",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Rate",
      field: "rate",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Currency",
      field: "currency",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 120,
    },
    {
      headerName: "Exchange Rate",
      field: "exchange_rate",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 180,
    },
    {
      headerName: "Invoice Id",
      field: "invoice",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Invoice Date",
      field: "dueDate",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "HSN Code",
      field: "hsnCode",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Currency",
    //   field: "currency",
    //  sortable: true,
    // filter: true,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 250,
    // },
    {
      headerName: "GST Rate",
      field: "gstRate",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "GST Type",
      field: "gstTypeForPO",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Value",
      field: "value",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Local Value",
      field: "localValue",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Foreign Value",
      field: "foreignValue",
      sortable: true,
      filter: true, //
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Foreign Value",
    //   field: "foreignValue",
    //  sortable: true,
    // filter: true,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 200,
    // },
    {
      headerName: "CGST",
      field: "cgst",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "SGST",
      field: "sgst",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "IGST",
      field: "igst",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Remark",
      field: "remark",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  const handleSubmit = async () => {
    setShowConfirmation(false);
    let arr = rowData;

    let payload = {
      poid: viewMinPo?.po_transaction,
      currency: arr.map((r: any) => r.currency),
      exchange_rate: arr.map((r: any) => r.exchange_rate),
      component: arr.map((r: any) => r?.componentKey),
      access_code: arr.map((r: any) => r.access_code),
      qty: arr.map((r: any) => r.orderQty),
      rate: arr.map((r: any) => r.rate),
      invoiceDate: arr.map((r: any) => dayjs(r.dueDate).format("DD-MM-YYYY")),
      invoice: arr.map((r: any) => r.invoice),
      invoices: attachmentFile,
      hsncode: arr.map((r: any) => r.hsnCode),
      gsttype: arr.map((r: any) => r.gstTypeForPO),
      gstrate: arr.map((r: any) => r.gstRate),
      cgst: arr.map((r: any) => r.cgst),
      sgst: arr.map((r: any) => r.sgst),
      igst: arr.map((r: any) => r.igst),
      remark: arr.map((r: any) => r.remark),
    };

    // return;
    try {
      dispatch(poMIN(payload)).then((resp: any) => {
        if (resp.payload.success) {
          toast({
            title: resp.payload.message,
            className: "bg-green-700 text-white",
          });
          setRowData([]);
          setViewMinPo(false);
          setShowConfirmation(false);
        } else {
          toast({
            title: resp.payload.message.msg,
            className: "bg-red-700 text-white",
          });
        }
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  const formattedDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  const uploadDocs = async () => {
    setShowLoading(true);
    const formData = new FormData();

    files.map((comp) => {
      formData.append("files", comp);
    });
    const response = await spigenAxios.post(
      "/transaction/upload-invoice",
      formData
    );
    if (response.data.success) {
      setShowLoading(false);
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      // setLoading(false);
      setSheetOpen(false);
      setAttachmentFile(response.data.data);
      setFiles([]);
    }
    setShowLoading(false);
  };
  useEffect(() => {
    const calculateTaxDetails = () => {
      let singleArr = rowData;
      const values = singleArr?.reduce(
        (partialSum, a) => partialSum + +Number(a?.localValue).toFixed(2),
        0
      );
      const value = +Number(values).toFixed(2);

      const cgsts = singleArr?.reduce(
        (partialSum, a) => partialSum + +Number(a?.cgst).toFixed(2),
        0
      );
      const cgst = +Number(cgsts).toFixed(2);
      const sgsts = singleArr?.reduce(
        (partialSum, a) => partialSum + +Number(a?.sgst).toFixed(2),
        0
      );
      const sgst = +Number(sgsts).toFixed(2);
      const igsts = singleArr?.reduce(
        (partialSum, a) => partialSum + +Number(a?.igst).toFixed(2),
        0
      );

      const igst = +Number(igsts).toFixed(2);

      const arr = [
        {
          title: "Value",
          description: value,
        },
        // {
        //   title: "Freight",
        //   description: freight,
        // },
        {
          title: "CGST",
          description: cgst,
        },
        {
          title: "SGST",
          description: sgst,
        },
        {
          title: "IGST",
          description: igst,
        },
        // { title: "TDS", description: tds },
        // {
        //   title: "Round Off",
        //   description:
        //     roundOffSign.toString() + [Number(roundOffValue).toFixed(2)],
        // },
        // {
        //   title: "Vendor Amount",
        //   description: vendorAmount,
        // },
      ];
      setTaxDetails(arr);
    };

    // Initial calculation
    calculateTaxDetails();

    // Set interval to recalculate every 5 seconds (5000 ms)
    const intervalId = setInterval(calculateTaxDetails, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [rowData]);

  const calltheApi = async () => {
    dispatch(fetchCurrency());
    dispatch(fetchDataPOforMIN({ poid: viewMinPo.po_transaction })).then(
      (response: any) => {
        if (response.payload.success) {
          let data = response?.payload?.data;
          let arr = data?.materials?.map((r, id) => {
            return {
              id: id + 1,
              isNew: true,
              component_fullname: r.component_fullname,
              c_partno: r.c_partno,
              orderQty: r.orderqty,
              rate: r.orderrate,
              gstRate: r.gstrate,
              gstTypeForPO: r.gsttype,
              localValue: r.usdValue,
              value: r.totalValue,
              materialDescription: r.description,
              hsnCode: r.hsncode,
              dueDate: dayjs(r.orderduedate, "DD-MM-YYYY"),
              currency: r.currency,
              ...r,
            };
          });
          setRowData(arr);
          let arr2 = data?.vendor_type;
          let obj = {
            name: arr2?.vendorname,
            vendorcode: arr2?.vendorcode,
            vendortype: arr2?.vendortype,
            gstin: arr2?.gstin,
            vendoraddress: removeHtmlTags(arr2?.vendoraddress),
          };
          setVendorDetails(obj);
          toast({
            title: response.payload.message,
            className: "bg-green-600 text-white items-center",
          });
        }
      }
    );
  };
  useEffect(() => {
    if (viewMinPo) {
      calltheApi();
    }
  }, [viewMinPo?.po_transaction]);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: true,
      editable: true,
    };
  }, []);

  const statusBar = useMemo<{
    statusPanels: StatusPanelDef[];
  }>(() => {
    return {
      statusPanels: [
        { statusPanel: "agFilteredRowCountComponent", align: "right" },
        { statusPanel: "agSelectedRowCountComponent", align: "right" },
        { statusPanel: "agAggregationComponent", align: "right" },
      ],
    };
  }, []);
  return (
    <>
      <Sheet open={viewMinPo.po_transaction} onOpenChange={setViewMinPo}>
        <SheetContent className="min-w-[100%] p-0 ">
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">
              MIN {viewMinPo.po_transaction}
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-50px)] grid grid-cols-[400px_1fr]">
            <div className="max-h-[calc(100vh-50px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
              <Card className="rounded-sm shadow-sm shadow-slate-500">
                <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                  <CardTitle className="font-[550] text-slate-600">
                    Vendor Detail
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
                  {/* //detais of client */}
                  <h3 className="font-[500]">Name</h3>
                  <p className="text-[14px]">
                    {vendorDetails?.name +
                      "(" +
                      vendorDetails?.vendorcode +
                      ")"}
                  </p>
                  <h3 className="font-[500]">Address</h3>
                  <p className="text-[14px]">{vendorDetails?.vendoraddress}</p>
                  <h3 className="font-[500]">GSTIN</h3>
                  <p className="text-[14px]">{vendorDetails?.gstin}</p>
                </CardContent>
              </Card>
              <Card className="rounded-sm shadow-sm shadow-slate-500">
                <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
                  <CardTitle className="font-[550] text-slate-600">
                    Tax Detail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-slate-600 w-full block break-words text-base ">
                    <ul className="break-words text-base ">
                      <li className="grid grid-cols-[1fr_140px] mt-[20px]">
                        <div className=" w-[180px]">
                          <h3 className="font-[500]">
                            Sub-Total value before Taxes :
                          </h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[0]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_140px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">CGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[1]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_140px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">SGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[2]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_140px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">ISGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[3]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_140px] mt-[20px]">
                        <div className=" w-[180px]">
                          <h3 className="font-[600] text-cyan-600">
                            Sub-Total values after Taxes :
                          </h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails.reduce((a, b) => a + b.description, 0)}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="max-h-[calc(100vh-50px)] overflow-y-auto bg-white">
              <div className="flex flex-row items-end justify-between p-[10px] justify-end w-full">
                <div className="flex items-center gap-[20px] ">
                  <Button
                    sx={{ backgroundColor: "#2fa062", color: "#fff" }}
                    variant="primary"
                    startIcon={<Upload />}
                    onClick={() => setSheetOpen(true)}
                    className=" flex items-center  text-[15px] shadow shadow-slate-600 rounded-md"
                  >
                    Upload Docs Here
                  </Button>
                </div>
              </div>
              <div className="ag-theme-quartz h-[calc(100vh-160px)] w-full">
                {loading && <FullPageLoading />}
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
                  statusBar={statusBar}
                  components={components}
                  animateRows={true}
                  gridOptions={commonAgGridConfig}
                  suppressCellFocus={false}
                  suppressRowClickSelection={false}
                />
              </div>
              <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                <Button
                  startIcon={<Refresh />}
                  className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
                  onClick={() => setRowData([])}
                >
                  Reset
                </Button>
                <Button
                  startIcon={<Save />}
                  variant="contained"
                  className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
                  onClick={() => setShowConfirmation(true)}
                >
                  MIN
                  {/* {isApprove ? "Approve" : "Submit"} */}
                </Button>
              </div>
            </div>
          </div>
          <ConfirmationModal
            open={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onOkay={handleSubmit}
            submitText={"Submit"}
            title="Confirm Submit!"
            description={`Are you sure to ${"submit"} details of all components of this Purchase Order?`}
          />
          <ResetModal
            open={resetModel}
            setOpen={setResetModel}
            form={""}
            message={"row"}
            reset={() => {
              setRowData([]);
              setResetModel(false);
            }}
          />
          {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
          <AgGridReact
            //   loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        </div> */}
        </SheetContent>
      </Sheet>
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[35%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {(loading || showLoading) && <FullPageLoading />}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {/* {loading && <FullPageLoading />} */}
            <FileUploader
              value={files}
              onValueChange={handleFileChange}
              dropzoneOptions={{
                accept: {
                  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
                },
                maxFiles: 1,
                maxSize: 4 * 1024 * 1024, // 4 MB
                multiple: true,
              }}
            >
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg h-[120px] p-[20px] m-[20px]">
                <h2 className="text-xl font-semibold text-center mb-4">
                  <div className=" text-center w-full justify-center flex">
                    <div>Upload Your Files</div>
                    <div>
                      <IoCloudUpload
                        className="text-cyan-700 ml-5 h-[20]"
                        size={"1.5rem"}
                      />
                    </div>
                  </div>
                </h2>
                <FileInput>
                  <span className="text-slate-500 text-sm text-center w-full justify-center flex">
                    Drag and drop files here, or click to select files
                  </span>
                </FileInput>
              </div>
              <div className=" m-[20px]">
                <FileUploaderContent>
                  {files?.map((file, index) => (
                    <FileUploaderItem key={index} index={index}>
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </div>
            </FileUploader>
          </div>
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setSheetOpen(false)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              sx={{
                ml: 1,
                backgroundColor: "#217346",
                ":hover": { backgroundColor: "#2f8254" },
              }}
              onClick={uploadDocs}
              // loading={laoding}
            >
              {/* {isApprove ? "Approve" : "Submit"} */}
              Upload
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MINPO;
