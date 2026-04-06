import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { StatusPanelDef, NavigateToNextCellParams } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";

import { useEffect, useMemo, useRef, useState } from "react";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import styled from "styled-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPoUIStateType } from "@/types/AddPOTypes";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { createSellRequest } from "@/features/salesmodule/SalesSlice";
import { Form } from "antd";
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
import { RowData } from "@/data";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { ColGroupDef } from "ag-grid-community";
import dayjs from "dayjs";
import { exportDatepace } from "@/components/shared/Options";

interface Props {
  setTab: string;
  payloadData: string;
  form: any;
  selectedVendor: string;
  setFormVal: [];
  formVal: any;
  rowData: [];
  setRowData: [];
  isApprove: [];
  setIsApprove: [];
  params: string;
  roeIs: string;
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
  roeIs,
  resetTheValues,
}) => {
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [rejectText, setRejectText] = useState("");
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [taxDetails, setTaxDetails] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  //tax card
  
  const [isTaxCardCollapsed, setIsTaxCardCollapsed] = useState(true);
  useEffect(() => {
    // Show the tax card after a slight delay on component mount
    const timer = setTimeout(() => {
      setIsTaxCardCollapsed(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total taxes and net amount
  const totalTaxes = taxDetails.reduce((sum, item) => {
    if (item.title === "CGST" || item.title === "SGST" || item.title === "IGST") {
      return sum + item.description;
    }
    return sum;
  }, 0);

  const subTotalBeforeTaxes = taxDetails.find(item => item.title === "Sub-Total (Before Taxes)")?.description || 0;
  const netAmount = subTotalBeforeTaxes + totalTaxes;


  const { currencyList, loading } = useSelector(
    (state: RootState) => state.client
  );
  const { loading: loading1 } = useSelector(
    (state: RootState) => state.sellRequest
  );
  const { loading: loading2 } = useSelector((state: RootState) => state.client);
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
      orderQty: "",
      currentStock: 0,
      rate: 0,
      prevrate: "",
      // currency: "28567096",
      gstRate: 18,
      gstTypeForPO: codeType,
      localValue: 0,
      foreignValue: 0,
      cgst: 9,
      sgst: 9,
      igst: 0,
      dueDate: "",
      hsnCode: "",
      isNew: true,
    };
    // setRowData((prevData) => [...prevData, newRow]);
    setRowData((prevData) => [
      ...(Array.isArray(prevData) ? prevData : []),
      newRow,
    ]);
  };

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
          params={params}
          // componentDetails={hsnlist}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );
  const navigateToNextCell = (params: NavigateToNextCellParams) => {
    const { key, previousCellPosition, nextCellPosition, event } = params;
    const gridApi = gridRef.current?.api;

    if (!gridApi || !previousCellPosition) return previousCellPosition;

    const editableColumns = columnDefs
      .filter((col: ColDef) => col.editable && col.field && (col.cellRenderer === "textInputCellRenderer" || col.cellRenderer === "datePickerCellRenderer"))
      .map((col: ColDef) => col.field!);

    const currentRowIndex = previousCellPosition.rowIndex;
    const currentColId = previousCellPosition.column.getColId();
    const currentColIndex = editableColumns.indexOf(currentColId);

    if (key === "Tab" || key === "Enter") {
      let nextColIndex = currentColIndex + 1;
      let nextRowIndex = currentRowIndex;
      let nextColId = editableColumns[nextColIndex];

      if (nextColIndex >= editableColumns.length) {
        nextColIndex = 0;
        nextRowIndex = currentRowIndex + 1;
        nextColId = editableColumns[0];

        if (nextRowIndex >= gridApi.getDisplayedRowCount()) {
          addNewRow();
          nextRowIndex = gridApi.getDisplayedRowCount();
        }
      }

      if (!nextColId) {
        console.error("No next editable column found");
        return previousCellPosition;
      }

      const nextCellPosition = {
        rowIndex: nextRowIndex,
        rowPinned: null,
        column: gridApi.getColumn(nextColId),
      };

      gridApi.ensureIndexVisible(nextRowIndex);
      gridApi.ensureColumnVisible(nextColId);
      gridApi.setFocusedCell(nextRowIndex, nextColId);
      gridApi.startEditingCell({
        rowIndex: nextRowIndex,
        colKey: nextColId,
      });

      return nextCellPosition;
    }

    if (key === "ShiftTab" || (event as KeyboardEvent).key === "Enter" && (event as KeyboardEvent).shiftKey) {
      let prevColIndex = currentColIndex - 1;
      let prevRowIndex = currentRowIndex;
      let prevColId = editableColumns[prevColIndex];

      if (prevColIndex < 0) {
        prevColIndex = editableColumns.length - 1;
        prevRowIndex = currentRowIndex - 1;
        prevColId = editableColumns[prevColIndex];

        if (prevRowIndex < 0) {
          return previousCellPosition;
        }
      }

      if (!prevColId) {
        console.error("No previous editable column found");
        return previousCellPosition;
      }

      const prevCellPosition = {
        rowIndex: prevRowIndex,
        rowPinned: null,
        column: gridApi.getColumn(prevColId),
      };

      gridApi.ensureIndexVisible(prevRowIndex);
      gridApi.ensureColumnVisible(prevColId);
      gridApi.setFocusedCell(prevRowIndex, prevColId);
      gridApi.startEditingCell({
        rowIndex: prevRowIndex,
        colKey: prevColId,
      });

      return prevCellPosition;
    }

    return nextCellPosition || previousCellPosition;
  };

  useEffect(() => {
    dispatch(fetchComponentDetail({ search: "" }));
    dispatch(fetchCurrency());
  }, []);

  const handleSubmit = async () => {
    setShowConfirmation(false);
    let arr = rowData;

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
      pocreatetype: "N",
      currency: formVal?.currency.value,
      exchange:
        formVal?.currency.value == "364907247" ? "1" : formVal?.exchange_rate,
      // exchange:
      //   formVal?.currency.value == "364907247" ? "1" : formVal?.exchange_rate,
      // duedate: exportDatepace(formVal?.duedate),
      // original_po: null,
      // currency: arr.map((r: any) => r.currency),
      // exchange: arr.map((r: any) => r.exchange),
      component: arr.map(
        (r: any) => r?.procurementMaterial.value ?? r?.procurementMaterial
      ),
      qty: arr.map((r: any) => r.orderQty),
      rate: arr.map((r: any) => r.rate),
      duedate: arr.map((r: any) => r.dueDate),
      // date: arr.map((r: any) => exportDatepace(r.dueDate)),
      hsncode: arr.map((r: any) => r.hsnCode),
      gsttype: arr.map((r: any) => r.gstTypeForPO),
      gstrate: arr.map((r: any) => r.gstRate),
      cgst: arr.map((r: any) => r.cgst),
      sgst: arr.map((r: any) => r.sgst),
      igst: arr.map((r: any) => r.igst),
      remark: arr.map((r: any) => r.remark),
      original_po: formVal.originalPO?.value,
    };

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
          pocreatetype: "N",
          poid: params.id.replaceAll("_", "/"),
          // date: exportDatepace(formVal?.duedate),
          // currency: arr.map((r: any) => r.currency),
          // exchange_rate: arr.map((r: any) => r.exchange),
          currency: formVal?.currency.value,
          exchange: formVal?.exchange_rate,
          // exchange: formVal?.exchange_rate,
          // original_po: null,

          component: arr.map(
            (r: any) => r?.procurementMaterial.value ?? r?.componentKey
          ),
          qty: arr.map((r: any) => r.orderQty),
          rate: arr.map((r: any) => r.rate),
          duedate: arr.map((r: any) => r.dueDate),
          hsn: arr.map((r: any) => r.hsnCode),
          gsttype: arr.map((r: any) => r.gstTypeForPO),
          gstrate: arr.map((r: any) => r.gstRate),
          cgst: arr.map((r: any) => r.cgst),
          sgst: arr.map((r: any) => r.sgst),
          igst: arr.map((r: any) => r.igst),
          remark: arr.map((r: any) => r.remark),
          updaterow: arr.map((r: any) => r.updateingId),
        };

        dispatch(updatePo(payload2)).then((response: any) => {
          if (response?.payload.success) {
            setShowConfirmation(false);
            toast({
              title: response.payload.message,
              className: "bg-green-700 text-white",
            });
            resetTheValues();
            // form.resetFields();
            // setRowData([]);
            // setIsApprove(false);
            // navigate("/manage-po");
          } else {
            toast({
              title: response.payload.message,
              className: "bg-red-700 text-white",
            });
          }
        });
      } else if (isApprove == "approve") {
        let a = {
          poid: params.id?.replaceAll("_", "/"),
        };
        dispatch(poApprove(a)).then((response: any) => {
          if (response?.payload.success) {
            setShowConfirmation(false);
            toast({
              title: response.payload.message,
              className: "bg-green-700 text-white",
            });
            resetTheValues();
            // setRowData([]);
            // navigate("/approve-po");
            // setIsApprove(false);
          } else {
            toast({
              title: response.payload.data.message,
              className: "bg-red-700 text-white",
            });
          }
        });
      } else {
        dispatch(createSellRequest(payload)).then((response: any) => {
          if (response?.payload.success) {
            setShowConfirmation(false);
            toast({
              title: response.payload.message,
              className: "bg-green-700 text-white",
            });
            resetTheValues();
            // form.resetFields();
            // setRowData([]);
            // setTab("create");
            // form.setFieldValue("address", "");
            // form.setFieldValue("pan", "");
            // form.setFieldValue("billgst", "");
            // form.setFieldValue("billAddress", "");
            // form.setFieldValue("shippan", "");
            // form.setFieldValue("shipAddress", "");
            // form.setFieldValue("GSTIN", "");

            // navigate("/manage-po");
          } else {
            toast({
              title: response.payload.message,
              className: "bg-red-700 text-white",
            });
          }
        });
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
      field: "deletePo",
    },
    { headerName: "Index", valueGetter: "node.rowIndex + 1", maxWidth: 100 },

    {
      headerName: "Component/Part",
      field: "procurementMaterial",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
    },
    {
      headerName: "Make",
      field: "vendorName",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 250,
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
      headerName: "Stock Qty",
      field: "currentStock",
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
    {
      headerName: "Previous Rate",
      field: "prevrate",
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
      minWidth: 150,
    },
    {
      headerName: "GST Type",
      field: "gstTypeForPO",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      // headerName: "Local Value",
      headerName: "Foreign Value",
      field: "localValue",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Local Value",
      // headerName: "Foreign Value",
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
      headerName: "Mode",
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
      if (response?.payload.success) {
        setShowRejectConfirm(false);
        toast({
          title: response.payload.message,
          className: "bg-green-700 text-white",
        });
        setRowData([]);
        navigate("/approve-po");
        setIsApprove(false);
      } else {
        toast({
          title: response.payload.message,
          className: "bg-red-700 text-white",
        });
      }
    });
  };
  // const formattedDate = dueDate.map((date) => {});

  const formattedDate = (date) => {
    if (!date) {
      // Handle the case where the date is undefined or null
      console.error("Date is undefined or null");
      return ""; // You can return an empty string or any fallback value
    }

    // If it's a dayjs object
    if (dayjs.isDayjs(date)) {
      return date.format("DD-MM-YYYY"); // Format the date as "DD-MM-YYYY"
    }

    // If it's a string, make sure it's in a valid format before splitting
    if (typeof date === "string" && date.includes("-")) {
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    }

    // If the date doesn't match expected formats, return a fallback value
    console.error("Invalid date format:", date);
    return ""; // You can return an empty string or any fallback value
  };

  useEffect(() => {
    const calculateTaxDetails = () => {
      let singleArr: any = rowData;
      const values = singleArr?.reduce(
        (partialSum: any, a: any) =>
          partialSum + +Number(a?.localValue).toFixed(2),
        0
      );
      const value = +Number(values).toFixed(2);
  
      const cgsts = singleArr?.reduce(
        (partialSum: any, a: any) => partialSum + +Number(a?.cgst).toFixed(2),
        0
      );
      const cgst = +Number(cgsts).toFixed(2);
      const sgsts = singleArr?.reduce(
        (partialSum: any, a: any) => partialSum + +Number(a?.sgst).toFixed(2),
        0
      );
      const sgst = +Number(sgsts).toFixed(2);
      const igsts = singleArr?.reduce(
        (partialSum: any, a: any) => partialSum + +Number(a?.igst).toFixed(2),
        0
      );
  
      const igst = +Number(igsts).toFixed(2);
  
      const arr = [
        {
          title: "Sub-Total (Before Taxes)", 
          description: value,
        },
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
      {(loading || loading1) && <FullPageLoading />}
      <AddPOPopovers uiState={uiState} />
      <div className="h-[calc(100vh-150px)] relative">
      <TaxCard isCollapsed={isTaxCardCollapsed}>
        <Card className="card rounded-lg shadow-lg shadow-slate-500 bg-gradient-to-br from-cyan-50 to-teal-100 border border-cyan-200">
          <CardHeader className="p-3 bg-cyan-700 text-white rounded-t-lg flex justify-between items-center">
            <CardTitle className="font-semibold text-base">Taxes Detail</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTaxCardCollapsed(!isTaxCardCollapsed)}
              className="text-white hover:text-cyan-200"
            >
              {isTaxCardCollapsed ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </CardHeader>
          <CardContent className="card-content p-3 text-slate-700">
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between items-center">
                <span className="font-bold">SUB-TOTAL value before Taxes</span>
                <span className="font-medium">
                  ₹{subTotalBeforeTaxes.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold">CGST</span>
                <span className="font-medium">
                  (+) ₹{taxDetails.find(item => item.title === "CGST")?.description.toFixed(2) || "0.00"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold">SGST</span>
                <span className="font-medium">
                  (+) ₹{taxDetails.find(item => item.title === "SGST")?.description.toFixed(2) || "0.00"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-bold">IGST</span>
                <span className="font-medium">
                  (+) ₹{taxDetails.find(item => item.title === "IGST")?.description.toFixed(2) || "0.00"}
                </span>
              </li>
              <li className="flex justify-between items-center border-t border-slate-300 pt-1 mt-1">
                <span className="font-bold">Total Taxes (CGST+SGST+IGST)</span>
                <span className="font-medium">
                  ₹{totalTaxes.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between items-center border-t border-slate-300 pt-1 mt-1">
                <span className="font-bold">Net Amount</span>
                <span className="font-medium">
                  ₹{netAmount.toFixed(2)}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TaxCard>
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
          </div>
          <div className="ag-theme-quartz h-[calc(100vh-210px)] w-full">
            {(loading || loading1 || loading2) && <FullPageLoading />}
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
              statusBar={statusBar}
              components={components}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              gridOptions={{
                ...commonAgGridConfig,
                navigateToNextCell,
                tabToNextCell: true,
                suppressRowClickSelection: false,
                suppressCellFocus: false,
                singleClickEdit: true,
              }}
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
            isApprove == "approve" ? setShowRejectConfirm(true) : setRowData([])
          }
        >
          {isApprove == "approve" ? "Reject" : "Reset"}
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

const TaxCard = styled.div<{ isCollapsed: boolean }>`
  position: fixed;
  bottom: 0px;
  left: 100px;
  width: 300px;
  z-index: 1000;
  animation: slideUp 0.6s ease-out forwards;
  .card-content {
    max-height: ${({ isCollapsed }) => (isCollapsed ? '0' : '300px')};
    opacity: ${({ isCollapsed }) => (isCollapsed ? '0' : '1')};
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.3s ease;
  }
  .card {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${({ isCollapsed }) => (isCollapsed ? 'scaleY(0.4)' : 'scaleY(1)')};
    transform-origin: bottom;
  }

  @keyframes slideUp {
    0% {
      transform: translateY(100px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export default AddPO;
