import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";

import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { transformOptionData, transformOptionData2 } from "@/helper/transform";
import { Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { Form, Typography } from "antd";
import { toast } from "@/components/ui/use-toast";

import useApi from "@/hooks/useApi";
import { fetchHSN } from "@/components/shared/Api/masterApi";

import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { CommonModal } from "@/config/agGrid/registerModule/CommonModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import {
  fetchAvailableStockBoxes,
  stockOut,
} from "@/features/client/storeSlice";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  soWise: z.string().optional(),
  compCode: z.string().optional(),
});

const PickSlip = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [rowDataBoxes, setRowDataBoxes] = useState<RowData[]>([
    {
      isNew: true,
      qty: "",
      box_name: "",
    },
  ]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [suomOtions, setSuomOtions] = useState([]);
  const [grpOtions, setGrpOtions] = useState([]);
  const [sheetOpen, setSheetOpen] = useState([]);
  const [callreset, setCallReset] = useState(false);
  const [costCenter, setCostCenter] = useState("");
  const [search, setSearch] = useState("");
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formValues, setFormValues] = useState({ compCode: "" });
  const [totalQty, setTotalQty] = useState(0);
  const [finalrows, setFinalRows] = useState([]);
  const [boxName, setBoxName] = useState([]);
  const [boxQty, setBoxQty] = useState([]);
  const [selectedBox, setSelectedBox] = useState("");
  const [compKey, setCompKey] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  //   const { upda, currency } = useSelector(
  //     (state: RootState) => state.createSalesOrder
  //   );
  const { hsnlist } = useSelector((state: RootState) => state.client);
  const { loading, availableStockBoxes } = useSelector(
    (state: RootState) => state.store
  );
  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);
  const { execFun, loading: loading1 } = useApi();
  const addNewRow = () => {
    const newRow = {
      asinNumber: "B01N1SE4EP",
      id: rowData.length + 1,
      gstRate: 18,
      pickmaterial: "",
      outQty: "",
      selectOutBoxes: "",
      remark: "",

      isNew: true,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };

  const [form] = Form.useForm();
  const isValue = Form.useWatch("partName", form);
  const selectedCC = Form.useWatch("costCenter", form);
  const selectedCustomer = Form.useWatch("customerName", form);

  const gridRef = useRef<AgGridReact<RowData>>(null);
  const typeOption = [
    {
      label: "Component",
      value: "Component",
    },
    {
      text: "Other",
      value: "Other",
    },
  ];
  const smtOption = [
    {
      label: "Yes",
      value: "yes",
    },
    {
      label: "No",
      value: "no",
    },
  ];
  // Handle cell value changes

  const getTheListHSN = async (value) => {
    const response = await execFun(() => fetchHSN(value), "fetch");
    const { data } = response;
    if (data.success) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          //   ...r,
          gstRate: r.hsntax,
          hsnSearch: { text: r.hsnlabel, value: r.hsncode },
          isNew: true,
        };
      });
      setRowData(arr);
    }
  };
  const handleSearch = (searchKey: string) => {
    if (searchKey) {
      dispatch(fetchComponentDetail({ search: searchKey }));
    }
    dispatch(fetchAvailableStockBoxes({ search: searchKey }));
  };
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowData}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          componentDetails={hsnlist}
          costCenter={costCenter}
          form={form}
          setSheetOpen={setSheetOpen}
          sheetOpen={sheetOpen}
          selectedRows={selectedRows}
          finalrows={finalrows.length}
          boxName={boxName}
          onCellValueChanged={onCellValueChanged}
          openDrawer={openDrawer}
          totalQty={selectedRows.reduce((a, b) => a + Number(b?.qty), 0)}
          selectedBox={selectedRows.map((item) => item?.box_name).join(",")}
          setCompKey={setCompKey}
        />
      ),
    }),
    [finalrows]
  );

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
  useEffect(() => {
    if (isValue?.value) {
      getTheListHSN(isValue?.value);
    }
  }, [isValue]);
  useEffect(() => {
    if (availableStockBoxes?.data?.length > 0) {
      let a = availableStockBoxes?.data?.map((r) => {
        return {
          ...r,
          qty: r.stock,
          checked: false,
          isNew: true,
        };
      });
      setRowDataBoxes(a);
    }
  }, [availableStockBoxes]);

  const handleSubmit = async () => {
    setShowConfirmation(false);
    // const value = form.getFieldsValue();
    const values = await form.validateFields();

    let payload = {
      customer: values.customerName?.value,
      component: rowData.map((r) => r.pickmaterial.value),
      qty: rowData.map((r) => r.outQty),
      box: rowData.map((r) => r.selectOutBoxes),
      remark: rowData.map((r) => r.remark),
      costcenter: values.costCenter.value,
      boxqty: rowData.map((r) => r.boxqty),
    };
    dispatch(stockOut(payload)).then((res: any) => {
      if (res.payload.data.success) {
        toast({
          title: res.payload.data.message,
          className: "bg-green-600 text-white items-center",
        });
        form.resetFields();
        setRowData([]);
        setRowDataBoxes([]);
        setSelectedRows([]);
        setShowConfirmation(false);
      } else {
        toast({
          title: res.payload.message,
          className: "bg-red-600 text-white items-center",
        });
      }
      setShowConfirmation(false);
    });
  };
  useEffect(() => {
    const boxNames = finalrows.map((item) => item?.box_name);
    const boxQty = finalrows.map((item) => item?.qty);

    setBoxQty(boxQty);
    setBoxName(boxNames);
  }, [finalrows]);

  const columnDefs: ColDef<rowData>[] = [
    // {
    // {
    //   headerName: "ID",
    //   field: "id",
    //   filter: "agNumberColumnFilter",
    //   width: 90,
    // },
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "Part /Name",
      field: "pickmaterial",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 450,
    },

    {
      headerName: "Out Qty",
      field: "outQty",
      editable: false,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Out Box(es)",
      field: "selectOutBoxes",
      editable: false,

      cellRenderer: "textInputCellRenderer",
      minWidth: 300,
      width: 300,
      cellRenderer: (params: any) => {
        return (
          <div
            className="p-2 border border-gray-300 rounded-md w-[300px] cursor-pointer break-words"
            // style={{ minHeight: "auto" }}
            onClick={() => openDrawer(params.data.pickmaterial.value)}
          >
            {params.value ? params.value : "Select Out Box(es)"}
          </div>
        );
      },
      autoHeight: true,
    },

    {
      headerName: "Remark",
      field: "remark",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];
  const handleCheckboxChange = (e) => {
    setRowDataBoxes((prevState) => ({
      ...prevState,
      checked: e.target.checked, // Update only the checked property
    }));
  };
  const columnBoxesDefs: ColDef<rowData>[] = [
    {
      headerCheckboxSelection: true, // To show a header checkbox
      checkboxSelection: true, // Enable checkbox in the cell
      width: 50,
    },

    {
      headerName: "Select BOX(es)",
      field: "box_name",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Avail Qty",
      field: "qty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];

  // const handleCellValueChange = (params: any) => {
  //   // api.refreshCells({
  //   //   rowNodes: [props.node],
  //   //   columns: [column, "qty"],
  //   // });

  //   const { oldValue, newValue, colDef, data } = params;

  //   if (oldValue !== newValue) {
  //     // Handle additional logic if needed, e.g., API calls, updating local state, etc.
  //     // Here, we log the change.
  //   }
  // };

  const handleReset = () => {
    form.resetFields();
    setRowData([]);
    setCallReset(false);
  };
  useEffect(() => {
    if (selectedCC) {
      setCostCenter(selectedCC.value);
    }
  }, [selectedCC]);
  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    // Add the additional parameter to each selectedData item
    const modifiedSelectedData = selectedData.map((item) => ({
      ...item, // Keep existing properties
      pickmaterialVal: sheetOpen, // Add the new parameter
    }));

    // Set the modified selected rows
    setSelectedRows(modifiedSelectedData);
  };

  useEffect(() => {
    let sum = selectedRows.reduce((a, b) => a + Number(b?.qty), 0);
    setTotalQty(sum);
  }, [selectedRows]);
  const closeDrawer = () => {
    setTotalQty(0);
    setSheetOpen(false);
    setFinalRows(selectedRows);

    setRowData((prevData) =>
      prevData.map((item) => {
        const pickMaterialValue = item.pickmaterial?.value; // Value of the current row's pickmaterial
        const compValue = compKey.component; // Value we're comparing against

        // If the pickmaterial matches the component, update the row with the correct box name and quantity
        if (pickMaterialValue === compValue) {
          let boxNames = selectedRows.map((item) => item?.box_name);
          let boxQtys = selectedRows.map((item) => item?.qty);

          setSelectedBox(boxNames.join(","));
          // Find the matching box name and quantity for the current pickmaterialValue

          // Return the updated row with the correct box data
          return {
            ...item,
            selectOutBoxes: boxNames.join(","), // Updated box name (no duplicates)
            boxqty: boxQtys.join(","), // Updated box quantity (no duplicates)
          };
        }

        // If no match, return the row unchanged
        return item;
      })
    );
  };

  const openDrawer = (params) => {
    // dispatch(fetchAvailableStockBoxes({ search: params.data.pickmaterial }));
    setSheetOpen(params);
    let payload = {
      c_center: form.getFieldValue("costCenter").value,
      component: params,
    };
    dispatch(fetchAvailableStockBoxes(payload)).then((res) => {
      setCompKey(payload);
      // if (res?.payload.code == 500) {
      //   toast({
      //     title: "Out Boxes not available!",
      //     // title: res.payload.message.msg,
      //     className: "bg-red-700 text-white text-center",
      //   });
      // }

      if (res.payload?.success == false) {
        toast({
          title: res.payload?.message,
          className: "bg-red-700 text-white text-center",
        });
      }
    });
    // setFinalRows(selectedRows);
  };
  const onCellValueChanged = (event: any) => {
    // When a cell value changes (e.g., stock quantity), we need to update the selected rows and recalculate the sum
    const updatedRow = event.data;
    const updatedRows = [...selectedRows];
    const rowIndex = updatedRows.findIndex(
      (row) => row.box_name === updatedRow.box_name
    );

    if (rowIndex >= 0) {
      updatedRows[rowIndex] = updatedRow; // Update the modified row
    }

    setSelectedRows(updatedRows); // Update the selectedRows state with the new value
  };
  useEffect(() => {
    if (rowData) {
      setRowData(rowData);
    }
  }, [rowData]);
  useEffect(() => {
    if (sheetOpen) {
      setTotalQty(0);
    }
  }, [sheetOpen]);


  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] overflow-hidden bg-white">
      <div className="bg-[#fff]">
        {loading && <FullPageLoading />}{" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form
          form={form}
          layout="vertical"
          className="space-y-6 overflow-hidden p-[10px] h-[550px]"
        >
          <div className="grid grid-cols-3 gap-[40px] ">
            <div className="col-span-3 ">
              <Form.Item name="costCenter" label="Cost Center">
                <ReusableAsyncSelect
                  placeholder="Cost Center"
                  endpoint="/backend/costCenter"
                  transform={transformOptionData2}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="query2"
                />
              </Form.Item>
              <Form.Item name="customerName" label="Customer Name">
                <ReusableAsyncSelect
                  placeholder="Customer Name"
                  endpoint="/backend/customer"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="query2"
                />
              </Form.Item>
            </div>{" "}
          </div>
          {/* <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
          >
            Submit
          </Button> */}
          {/* </form> */}
        </Form>{" "}
      </div>{" "}
      {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
      
      </div> */}
      {callreset == true && (
        <CommonModal
          isDialogVisible={callreset}
          handleOk={handleReset}
          handleCancel={() => setCallReset(false)}
          title="Reset Details"
          description={"Are you sure you want to remove this entry?"}
        />
      )}
      <div className="h-[calc(100vh-80px)]  ">
        <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
          <Button
            onClick={() => {
              addNewRow();
            }}
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
          >
            <Plus className="font-[600]" /> Add Item
          </Button>{" "}
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-200px)] w-full">
          {" "}
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
            suppressCellFocus={true}
            rowSelection={rowSelection}
            checkboxSelection={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
            onSelectionChanged={onSelectionChanged} // Listen for row selection change
            onCellValueChanged={onCellValueChanged} // Listen for cell value change
          />
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setCallReset(true)}
            >
              Reset
            </Button>
            {/* <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              //   onClick={() => setTab("create")}
            >
              Back */}
            {/* </Button> */}
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={() => setShowConfirmation(true)}
              disabled={rowData.length == 0}
            >
              Submit
            </Button>
          </div>
        </div>{" "}
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onOkay={handleSubmit}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Submit!"
        description="Are you sure you want to initiate the Outward ?
"
      />
      <Sheet
        open={sheetOpen && availableStockBoxes?.data?.length > 0}
        onOpenChange={setSheetOpen}
      >
        <SheetContent
          className="min-w-[70%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">
              Storable Box(es) List
            </SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full relative">
            {loading && <FullPageLoading />}
            <AgGridReact
              ref={gridRef}
              rowData={rowDataBoxes}
              columnDefs={columnBoxesDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={defaultColDef}
              statusBar={statusBar}
              components={components}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              gridOptions={commonAgGridConfig}
              //   suppressCellFocus={false}
              suppressRowClickSelection={false}
              // onCellEditingStarted={(params) =>
              // // }
              // onCellEditingStopped={handleCellValueChange}
              // onCellValueChanged={handleCellValueChange} // Your existing change handler
              rowSelection="multiple"
              // checkboxSelection={true}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Typography.Text>
              Total:
              {sheetOpen
                ? selectedRows.reduce((a, b) => a + Number(b?.qty), 0)
                : 0}
            </Typography.Text>
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={closeDrawer}
            >
              Confirm
            </Button>
          </div>
          <div></div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default PickSlip;
