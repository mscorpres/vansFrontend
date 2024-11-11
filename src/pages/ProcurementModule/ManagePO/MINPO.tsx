import { Props } from "@/types/salesmodule/salesShipmentTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Button } from "@/components/ui/button";
import { IoCloudUpload } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgGridReact } from "ag-grid-react";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataPOforMIN,
  poMIN,
} from "@/features/client/clientSlice";
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
const MINPO: React.FC<Props> = ({ viewMinPo, setViewMinPo }) => {
  console.log("view", viewMinPo);
  const [rowData, setRowData] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState("");
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const [taxDetails, setTaxDetails] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {} = useSelector(
    (state: RootState) => state.client
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
        />
      ),
    
    }),
    []
  );
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
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Order Qty",
      field: "orderQty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Rate",
      field: "rate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Currency",
    //   field: "currency",
    //   editable: false,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 250,
    // },
    {
      headerName: "GST Rate",
      field: "gstRate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "GST Type",
      field: "gstType",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Value",
      field: "value",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Local Value",
      field: "localValue",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    // {
    //   headerName: "Foreign Value",
    //   field: "foreignValue",
    //   editable: false,
    //   flex: 1,
    //   cellRenderer: "textInputCellRenderer",
    //   minWidth: 200,
    // },
    {
      headerName: "CGST",
      field: "cgst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "SGST",
      field: "sgst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "IGST",
      field: "igst",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Invoice Id",
      field: "invoice",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Invoice Date",
      field: "dueDate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "HSN Code",
      field: "hsnCode",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "ITEM DESCRIPTION",
      field: "remark",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  const handleSubmit = async () => {
    let arr = rowData;


    let payload = {
      poid: viewMinPo?.po_transaction,
      currency: arr.map((r) => r.currency),
      exchange: arr.map((r) => r.exchange),
      component: arr.map((r) => r?.componentKey),
      access_code: arr.map((r) => r.access_code),
      qty: arr.map((r) => r.orderQty),
      rate: arr.map((r) => r.rate),
      invoiceDate: arr.map((r) => formattedDate(r.dueDate)),
      invoice: arr.map((r) => r.invoice),
      invoices: attachmentFile,
      hsncode: arr.map((r) => r.hsnCode),
      gsttype: arr.map((r) => r.gstType),
      gstrate: arr.map((r) => r.gstRate),
      cgst: arr.map((r) => r.cgst),
      sgst: arr.map((r) => r.sgst),
      igst: arr.map((r) => r.igst),
      remark: arr.map((r) => r.remark),
    };

    // return;
    try {
      dispatch(poMIN(payload)).then((resp) => {
        if (resp.payload.code == 200) {
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
    const formData = new FormData();

    files.map((comp) => {
      formData.append("files", comp);
    });
    const response = await spigenAxios.post(
      "/transaction/upload-invoice",
      formData
    );
    if (response.data.code == 200) {
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      // setLoading(false);
      setSheetOpen(false);
      setAttachmentFile(response.data.data);
    }
    // setLoading(false);
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
    dispatch(fetchDataPOforMIN({ poid: viewMinPo.po_transaction })).then(
      (response: any) => {
        if (response.payload.status == "success") {
          let data = response?.payload?.data;
          let arr = data?.materials?.map((r, id) => {
            return {
              id: id + 1,
              isNew: true,
              component_fullname: r.c_partno + " -" + r.component_fullname,
              orderQty: r.orderqty,
              rate: r.orderrate,
              gstRate: r.gstrate,
              gstType: r.gsttype,
              localValue: r.usdValue,
              value: r.totalValue,
              remark: r.description,
              hsnCode: r.hsncode,
              dueDate: r.orderduedate,
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
            vendoraddress: arr2?.vendoraddress,
          };
          setVendorDetails(obj);
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
      floatingFilter: false,
      editable: false,
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
          </SheetHeader>{" "}
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
                  <div className="text-slate-600">
                    <ul>
                      <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                        <div>
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
                      <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">CGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {" "}
                            {taxDetails[1]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">SGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[2]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                        <div>
                          <h3 className="font-[500]">ISGST :</h3>
                        </div>
                        <div>
                          <p className="text-[14px]">
                            {taxDetails[3]?.description}
                          </p>
                        </div>
                      </li>
                      <li className="grid grid-cols-[1fr_70px] mt-[20px]">
                        <div>
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
              <div className="flex flex-row items-center justify-between p-[10px]">
                <div className="flex items-center gap-[20px]">
                  <Button
                    onClick={() => setSheetOpen(true)}
                    className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
                  >
                    <Upload className="text-white w-[20px] h-[20px]" /> Upload
                    Docs Here
                  </Button>
                </div>
              </div>
              <div className="ag-theme-quartz h-[calc(100vh-180px)] w-full">
                {" "}
                {loading && <FullPageLoading />}
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  statusBar={statusBar}
                  components={components}
                  pagination={true}
                  paginationPageSize={10}
                  animateRows={true}
                  gridOptions={commonAgGridConfig}
                  suppressCellFocus={false}
                  suppressRowClickSelection={false}
                />
              </div>{" "}
              <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                <Button
                  className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={() => setRowData([])}
                >
                  Reset
                </Button>
                <Button
                  className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={() => setShowConfirmation(true)}
                >
                  MIN
                  {/* {isApprove ? "Approve" : "Submit"} */}
                </Button>
              </div>
            </div>
          </div>{" "}
          <ConfirmationModal
            open={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onOkay={handleSubmit}
            submitText={"Submit"}
            title="Confirm Submit!"
            description={`Are you sure to ${"submit"} details of all components of this Purchase Order?`}
          />{" "}
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
      </Sheet>{" "}
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[35%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {loading && <FullPageLoading />}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>{" "}
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
                    {" "}
                    <div>Upload Your Files</div>
                    <div>
                      {" "}
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
                </FileInput>{" "}
              </div>{" "}
              <div className=" m-[20px]">
                <FileUploaderContent>
                  {files?.map((file, index) => (
                    <FileUploaderItem key={index} index={index}>
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </div>
            </FileUploader>{" "}
          </div>{" "}
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              // onClick={() => setTab("create")}
            >
              Back
            </Button>{" "}
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={uploadDocs}
              // loading={laoding}
            >
              {/* {isApprove ? "Approve" : "Submit"} */}
              Upload
            </Button>
          </div>{" "}
        </SheetContent>
      </Sheet>{" "}
    </>
  );
};

export default MINPO;
