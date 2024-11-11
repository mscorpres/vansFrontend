import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatusPanelDef, ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPoUIStateType } from "@/types/AddPOTypes";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";

import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { createSellRequest } from "@/features/salesmodule/SalesSlice";
import { Form } from "antd";
import { getComponentsByNameAndNo } from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import RejectModal from "@/components/shared/RejectModal";
import {
  fetchCurrency,
  poApprove,
  rejectPo,
  updatePo,
} from "@/features/client/clientSlice";
import { toast } from "@/components/ui/use-toast";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useNavigate } from "react-router-dom";

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
  form,
  selectedVendor,
  formVal,
  rowData,
  setRowData,
  isApprove,
  setIsApprove,
  params,
  codeType,
  setCodeType,
}) => {
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState("");
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState<boolean>(false);
  const [taxDetails, setTaxDetails] = useState([]);
  const [removingList, setRemovingList] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { currencyList, loading } = useSelector(
    (state: RootState) => state.client
  );

  const navigate = useNavigate();

  // const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const selVendor = Form.useWatch("vendorName", form);
  const uiState: AddPoUIStateType = {
    excelModel,
    setExcelModel,
    setRowData,
    backModel,
    setBackModel,
    resetModel,
    setResetModel,
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
      gstType: codeType,
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
          // componentDetails={hsnlist}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );

  const onBtExport = useCallback(() => {
    gridRef.current!.api.exportDataAsExcel();
  }, []);

  useEffect(() => {
    dispatch(fetchComponentDetail({ search: "" }));
    dispatch(fetchCurrency());
  }, []);

  const handleSubmit = async () => {
    let arr = rowData;

    console.log("formVal", formVal);
    let editpayload = {
      vendor_name: "VEN0029",
      vendor_type: "v01",
      vendor_branch: "SIV689805780",
      vendor_address: "PLOT # 431-A, IND.\nAREA PHASE - 2,\n",
      paymentterms: "n",
      quotationterms: "j",
      termsandcondition: "yu",
      costcenter: "2023122105635288",
      projectname: "j",
      pocomment: "h",
      ship_address_id: "YLB8M4JT",
      ship_address:
        "Groud Floor, 43-A, Pocket - D SFS Flats\nKondli Gharoli, Mayur Vihar Phase 3\nNew Delhi 110096",
      component: ["1678607897820"],
      qty: ["400"],
      rate: ["200"],
      currency: ["364907247"],
      exchange_rate: ["1"],
      date: ["25-07-2024"],
      hsn: ["--"],
      gsttype: ["I"],
      gstrate: ["18"],
      sgst: ["0"],
      igst: ["14400"],
      cgst: ["0"],
      remark: ["TDK"],
      updaterow: ["906"],
      poid: "NAVS/PO/24-25/0010",
    };

    let payload = {
      vendorname: formVal.vendorName.value,
      vendortype: "v01",
      vendorbranch: formVal.branch.value,
      //
      vendoraddress: formVal.address,
      billaddressid: formVal.billingId.value,
      billaddress: formVal.billAddress,
      //
      shipaddressid: formVal.shipId.value,
      shipaddress: formVal.shipAddress,
      termscondition: formVal.terms,
      quotationdetail: formVal.quotation,
      paymentterms: formVal.paymentTerms,
      pocostcenter: formVal.costCenter.value,
      poproject_name: formVal.project,
      pocomment: formVal.comment,
      pocreatetype: formVal.pocreatetype,
      // original_po: null,
      currency: formVal.currency,
      exchange: formVal.exchange,
      component: arr.map((r) => r?.procurementMaterial),
      qty: arr.map((r) => r.orderQty),
      rate: arr.map((r) => r.rate),
      duedate: arr.map((r) => formattedDate(r.dueDate)),
      hsncode: arr.map((r) => r.hsnCode),
      gsttype: arr.map((r) => r.gstType),
      gstrate: arr.map((r) => r.gstRate),
      cgst: arr.map((r) => r.cgst),
      sgst: arr.map((r) => r.sgst),
      igst: arr.map((r) => r.igst),
      remark: arr.map((r) => r.remark),
      original_po: formVal.originalPO?.value,
    };
    console.log("payload-------------", payload);
    console.log("isApprove-------------", isApprove);

    // return;
    try {
      if (isApprove == "edit") {
        let payload2 = {
          vendor_name: formVal.vendorName.value,
          vendor_type: "v01",
          vendor_branch: formVal.branch.value,
          vendor_address: formVal.address,
          ship_address_id: formVal.shipId.value,
          ship_address: formVal.shipAddress,
          termsandcondition: formVal.terms,
          quotationterms: formVal.quotation,
          paymentterms: formVal.paymentTerms,
          costcenter: formVal.costCenter.value,
          projectname: formVal.project,
          pocomment: formVal.comment,
          pocreatetype: formVal.pocreatetype,

          // original_po: null,
          currency: formVal.currency,
          exchange: formVal.exchange,
          component: arr.map((r) => r?.procurementMaterial),
          qty: arr.map((r) => r.orderQty),
          rate: arr.map((r) => r.rate),
          duedate: arr.map((r) => formattedDate(r.dueDate)),
          hsncode: arr.map((r) => r.hsnCode),
          gsttype: arr.map((r) => r.gstType),
          gstrate: arr.map((r) => r.gstRate),
          cgst: arr.map((r) => r.cgst),
          sgst: arr.map((r) => r.sgst),
          igst: arr.map((r) => r.igst),
          remark: arr.map((r) => r.remark),
          updaterow: arr.map((r) => r.updateingId),
        };
        dispatch(updatePo(payload2)).then((res) => {
          console.log("this is the response", res);
        });
      } else if (isApprove == "approve") {
        console.log("params", params);
        let a = {
          poid: params,
        };
        dispatch(poApprove(a)).then((response) => {
          if (response.payload.code == 200) {
            setShowConfirmation(false);
            navigate("/approve-po");
            setIsApprove(false);
          } else {
            toast({
              title: response.payload.message.msg,
              className: "bg-red-700 text-white",
            });
          }
        });
      } else {
        dispatch(createSellRequest(payload));
      }
      // setTab("create");
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error, e.g., show a message to the user
    }
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
      headerName: "Ven C. Part / Part",
      field: "vendorName",
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
      headerName: "Due Date",
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
  const handleReject = () => {
    dispatch(
      rejectPo({ poid: params?.id?.replaceAll("_", "/"), remark: rejectText })
    ).then((response: any) => {
      if (response.payload.success == "200") {
        setShowRejectConfirm(true);
      } else {
        toast({
          title: response.payload.message.msg,
          className: "bg-red-700 text-white",
        });
      }
    });
  };
  // const formattedDate = dueDate.map((date) => {});
  const formattedDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
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
        <div className="max-h-[calc(100vh-150px)] overflow-y-auto bg-white">
          <div className="flex items-center w-full gap-[20px] h-[60px] px-[10px] justify-between">
            <Button
              onClick={() => {
                addNewRow();
              }}
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
            >
              <Plus className="font-[600]" /> Add Item
            </Button>{" "}
            {/* <Button
              onClick={() => {
                removeRows();
              }}
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max mr-[150px]"
            >
              <Trash2 />
            </Button> */}
            {/* <div className="flex items-center gap-[20px]">
              <Button
                onClick={onBtExport}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <FaFileExcel className="text-white w-[20px] h-[20px]" /> Export
                to Excel
              </Button>
              <Button
                onClick={() => setExcelModel(true)}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <Upload className="text-white w-[20px] h-[20px]" /> Upload Excel
                Here
              </Button>
            </div> */}
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-210px)] w-full">
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
        submitText={
          isApprove == "approve"
            ? "Approve"
            : isApprove == "edit"
            ? "Update"
            : "Submit"
        }
        title="Confirm Submit!"
        description={`Are you sure to ${
          isApprove == "approve"
            ? "Approve"
            : isApprove == "edit"
            ? "Update"
            : "Submit"
        } details of all components of this Purchase Order?`}
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
          onClick={() =>
            isApprove ? setShowRejectConfirm(true) : setRowData([])
          }
        >
          {isApprove ? "Reject" : "Reset"}
        </Button>
        <Button
          className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
          onClick={() => setShowConfirmation(true)}
        >
          {isApprove == "approve"
            ? "Approve"
            : isApprove == "edit"
            ? "Update"
            : "Submit"}
        </Button>
      </div>
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
