import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";
import { FaFileExcel } from "react-icons/fa";
import { AgGridReact } from "@ag-grid-community/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPoUIStateType } from "@/types/AddPOTypes";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
// import columnDefs, {
//   RowData,
// } from "@/config/agGrid/SalseOrderCreateTableColumns";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { createSellRequest } from "@/features/salesmodule/SalesSlice";
import { App, Checkbox, Form } from "antd";
import useApi from "@/hooks/useApi";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import RejectModal from "@/components/shared/RejectModal";
import { StatusPanelDef, ColDef, ColGroupDef } from "@ag-grid-community/core";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  fetchCurrency,
  rejectPo,
} from "@/features/client/clientSlice";
import { minTransaction } from "@/features/client/storeSlice";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import { IoCloudUpload } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";
import { spigenAxios } from "@/axiosIntercepter";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
// interface Props{
//   setTab:Dispatch<SetStateAction<string>>;
// }
interface Props {
  setTab: string;
  payloadData: string;
  form: any;
  selectedVendor: string;
  setFormVal: [];
  formVal: [];
  rowData: [];
  setRowData: [];
  isApprove: [];
  setIsApprove: [];
  params: string;
}

const AddPO: React.FC<Props> = ({
  setTab,
  payloadData,
  form,
  selectedVendor,
  setFormVal,
  formVal,
  rowData,
  setRowData,
  isApprove,
  setIsApprove,
  params,
  roeIs,
  setResetSure,
}) => {
  // const [rowData, setRowData] = useState<RowData[]>([]);
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState("");
  const [callLoading, setCallLoading] = useState(false);
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState<boolean>(false);
  const [taxDetails, setTaxDetails] = useState([]);
  const [removingList, setRemovingList] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState([]);
  const [files, setFiles] = useState<File[] | null>(null);
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { componentDetails } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const { loading, minTransactiondata } = useSelector(
    (state: RootState) => state.store
  );

  const { currencyList } = useSelector((state: RootState) => state.client);
  const { toast } = useToast();
  const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);

  const selVendor = Form.useWatch("vendorName", form);
  // const clientAdd = Form.useWatch("address", form);
  const uiState: AddPoUIStateType = {
    excelModel,
    setExcelModel,
    setRowData,
    backModel,
    setBackModel,
    resetModel,
    setResetModel,
  };

  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };
  let clientAdd = form.getFieldValue("address");
  let clientGst = form.getFieldValue("vendorGst");
  let vendorNameis = form.getFieldValue("vendorName");

  const addNewRow = () => {
    const newRow = {
      checked: false,
      type: "products",
      procurementMaterial: "",
      remark: "",
      asinNumber: "B01N1SE4EP",
      orderQty: 100,
      rate: 50,
      currency: "USD",
      gstRate: 18,
      gstType: "local",
      localValue: 0,
      foreignValue: 0,
      cgst: 9,
      sgst: 9,
      igst: 0,
      dueDate: "2024-07-25",
      hsnCode: "",
      isNew: true,
    };
    // setRowData((prevData) => [...prevData, newRow]);
    setRowData((prevData) => [
      ...(Array.isArray(prevData) ? prevData : []),
      newRow,
    ]);
  };
  const removeRows = () => {};

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
  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      let p = { search: searchKey };
      dispatch(fetchComponentDetail(p));
    }
  };

  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          rowData={rowData}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          vendorCode={selectedVendor}
          currencyList={currencyList}
          roeIs={roeIs}
          // componentDetails={hsnlist}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: false,
      editable: false,
    };
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  // useEffect(() => {
  //   addNewRow();
  // }, []);
  useEffect(() => {
    dispatch(fetchComponentDetail({ search: "" }));
    dispatch(fetchCurrency());
  }, []);

  const handleSubmit = async () => {
    // return;
    let arr = rowData;

    let payload = {
      vendor: formVal.vendorName.value,
      vendortype: formVal.vendorType.value,
      vendorbranch: formVal.branch.value,
      address: formVal.address,
      costcenter: formVal.costCenter.value,
      currency: ["364907247"],
      exchange: ["1"],
      component: arr.map((r) => r?.procurementMaterial),
      qty: arr.map((r) => r.orderQty),
      rate: arr.map((r) => r.rate),
      hsncode: arr.map((r) => r.hsnCode),
      gsttype: arr.map((r) => r.gstType),
      gstrate: arr.map((r) => r.gstRate),
      cgst: arr.map((r) => r.cgst),
      invoice: arr.map((r) => r.invoice),
      sgst: arr.map((r) => r.sgst),
      igst: arr.map((r) => r.igst),
      remark: arr.map((r) => r.remark),
      attachment: attachmentFile,
    };
    dispatch(minTransaction(payload)).then((res) => {
      if (res?.payload?.code == 200) {
        toast({
          title: res.payload?.message,
          className: "bg-green-600 text-white items-center",
        });
        form.setFieldValue("address", "");
        setShowConfirmation(false);
        setRowData([]);
        setTab("create");
        form.resetFields();
        setResetSure(true);
      } else {
        toast({
          title: res.payload.message.msg,
          className: "bg-red-600 text-white items-center",
        });
        setShowConfirmation(false);
      }
    });
  };

  const columnDefs = [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    { headerName: "Index", valueGetter: "node.rowIndex + 1", maxWidth: 100 },

    {
      headerName: "Component/Part",
      field: "procurementMaterial",
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
      headerName: "Local Value",
      field: "localValue",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Foreign Value",
      field: "foreignValue",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
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
      headerName: "Invoice",
      field: "invoice",
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
  const handleReject = () => {
    dispatch(
      rejectPo({ poid: params?.id?.replaceAll("_", "/"), remark: rejectText })
    ).then((response: any) => {
      if (response.payload.success == "200") {
        setShowRejectConfirm(true);
      }
    });
  };
  // const formattedDate = dueDate.map((date) => {});
  const formattedDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  const uploadDocs = async () => {
    setCallLoading(true);
    const formData = new FormData();
    formData.append("action", "uploadTempFile");
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
      setCallLoading(false);
      setSheetOpen(false);
      setAttachmentFile(response.data.data);
    }
    setCallLoading(false);
  };

  useEffect(() => {
    const calculateTaxDetails = () => {
      let singleArr = rowData;
      const values = singleArr?.reduce(
        (partialSum, a) => partialSum + +Number(a?.localValue).toFixed(2),
        0
      );
      const value = +Number(values).toFixed(2);
      // const freights = mainArrs?.reduce(
      //   (partialSum, a) => partialSum + +Number(a?.freightAmount),
      //   0
      // );
      // const freight = +Number(freights).toFixed(2);
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
  return (
    <Wrapper>
      <AddPOPopovers uiState={uiState} />
      <div className="h-[calc(100vh-150px)] grid grid-cols-[400px_1fr]">
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 bg-white border-r flex flex-col gap-[10px] p-[10px]">
          <Card className="rounded-sm shadow-sm shadow-slate-500">
            <CardHeader className="flex flex-row items-center justify-between p-[10px] bg-[#e0f2f1]">
              <CardTitle className="font-[550] text-slate-600">
                Client Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
              {/* //detais of client */}
              <h3 className="font-[500]">Name</h3>
              <p className="text-[14px]">{vendorNameis?.label}</p>
              <h3 className="font-[500]">Address</h3>
              <p className="text-[14px]">{clientAdd}</p>
              <h3 className="font-[500]">GSTIN</h3>
              <p className="text-[14px]">{clientGst}</p>
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
                        {" "}
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
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto bg-white">
          <div className="flex items-center w-full gap-[20px] h-[60px] px-[10px] justify-between">
            <Button
              onClick={() => {
                addNewRow();
              }}
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
            >
              <Plus className="font-[600]" /> Add Item
            </Button>
            <div>
              <Button
                onClick={() => setSheetOpen(true)}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <Upload className="text-white w-[20px] h-[20px]" /> Upload Docs
              </Button>
            </div>{" "}
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-210px)] w-full">
            {loading && <FullPageLoading />}
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={defaultColDef}
              statusBar={statusBar}
              components={components}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              gridOptions={commonAgGridConfig}
              suppressRowClickSelection={false}
              suppressCellFocus={true}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
            />
          </div>
        </div>
      </div>
      {/* <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onOkay={handleSubmit}
        okayText={isApprove ? "Approve" : "Submit"}
        title="Confirm Submit!"
        description={`Are you sure to ${
          isApprove ? "Approve" : "Submit"
        } details of all components of this Purchase Order?`}
        // description="Are you sure to submit details of all components of this Purchase Order?"
      /> */}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onOkay={handleSubmit}
        submitText={"Submit"}
        title="Confirm Submit!"
        description={
          "Are you sure you want to the process the material In request ?"
        }
      />
      <RejectModal
        open={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onOkay={handleReject}
        setRejectText={setRejectText}
        // submitText={isApprove ? "Reject" : "Submit"}
        title="Confirm Submit!"
        description={`Are you sure to ${
          isApprove ? "reject" : "submit"
        } details of all components of this Purchase Order?`}
        // description={`Are you sure to ${
        //   isApprove ? "reject" : "submit"
        // } details of all components of this Purchase Order?`}
      />
      <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
        <Button
          className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => setTab("create")}
        >
          Back
        </Button>{" "}
        <Button
          className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
          // onClick={() =>
          //   isApprove ? setShowRejectConfirm(true) : setRowData([])
          // }
          onClick={() => setRowData([])}
        >
          {/* {isApprove ? "Reject" : "Reset"} */}
          Reset
        </Button>
        <Button
          className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => setShowConfirmation(true)}
        >
          {/* {isApprove ? "Approve" : "Submit"} */}
          Save MIN
        </Button>
      </div>{" "}
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[35%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {/* {loading == true && <FullPageLoading />} */}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>{" "}
          {callLoading && <FullPageLoading />}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {loading && <FullPageLoading />}
            <FileUploader
              value={files}
              onValueChange={handleFileChange}
              dropzoneOptions={{
                accept: {
                  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
                },
                maxFiles: 5,
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
              onClick={() => setSheetOpen(false)}
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
      </Sheet>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-radius: 0;
    border: 0;
  }
  .ag-theme-quartz .ag-cell {
    justify-content: center;
  }
`;

export default AddPO;
