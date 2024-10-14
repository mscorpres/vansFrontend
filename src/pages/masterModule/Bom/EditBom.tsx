import React from "react";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
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
import { Checkbox, Form, Input, Menu } from "antd";

import { Button } from "@/components/ui/button";
import { Check, Filter, Plus, Trash2, Upload } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
// import TextInputCellRenderer from "@/config/agGrid/TextInputCellRenderer";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import {
  fetchEdditBomStage2,
  fetchProductInBom,
  getComponentsByNameAndNo,
} from "@/components/shared/Api/masterApi";
import useApi from "@/hooks/useApi";
import { FiRefreshCw } from "react-icons/fi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { AppDispatch, RootState } from "@/store";
import { updateBomComponent } from "@/features/masterModule/ProductFg&Sfg";
const EditBom = ({ sheetOpenEdit, setSheetOpenEdit }) => {
  const [form] = Form.useForm();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [materialList, setMaterialList] = useState([]);
  const [stage1, setStage1] = useState("1");
  const [search, setSearch] = useState("");
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [resetModel, setResetModel] = useState<boolean>(false);
  const { execFun, loading: loading1 } = useApi();
  const dispatch = useDispatch<AppDispatch>();
  const { componentDetails, currency } = useSelector(
    (state: RootState) => state.createSalesOrder
  );

  const addNewRow = () => {
    const newRow: RowData = {
      type: "products",
      id: "",
      checked: false,
      material: "",
      asinNumber: "B01N1SE4EP",
      orderQty: 100,
      rate: 50,
      currency: "USD",
      gstRate: 18,
      gstType: "local",
      localValue: 5000,
      foreignValue: 5000,
      cgst: 9,
      sgst: 9,
      igst: 0,
      dueDate: "2024-07-25",
      hsnCode: "123456",
      bomCategory: "",
      bomStatus: "",
      isNew: true,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };
  const uiState = {
    excelModel,
    setExcelModel,
    setRowData,
    backModel,
    setBackModel,
    resetModel,
    setResetModel,
  };

  const getdetails = async (sheetOpenEdit) => {
    // console.log("sheetOpenEdi    t", sheetOpenEdit);

    // let payload = { subject_id: sheetOpenEdit };
    const response = await execFun(
      () => fetchProductInBom(sheetOpenEdit),
      "fetch"
    );
    // console.log("response", response.data.data.subject);
    let { data } = response;
    if (data.code) {
      form.setFieldValue("bom", data.data.subject);
      form.setFieldValue("name", data.data.product);
      form.setFieldValue("sku", data.data.sku);
      form.setFieldValue("subjectId", data.data.subjectid);
    }
  };
  const handleNext = async () => {
    // console.log("sheetOpenEdi    t", sheetOpenEdit);
    setStage1("2");
    const response = await execFun(
      () => fetchEdditBomStage2(sheetOpenEdit),
      "fetch"
    );
    // console.log("response", response);

    if (response.data.code == 200) {
      let arr = response.data.data.map((r) => {
        return {
          orderQty: r.requiredQty,
          material: { label: " r.component", value: " r.component" },
          bomCategory:
            r.category == "P"
              ? "Part"
              : r.category == "PCK"
              ? "Packaging"
              : r.category == "PCB"
              ? "PCB"
              : "other",
          bomStatus: r.bomstatus,
          isNew: true,
        };
      });
      console.log("arr of fetced", arr);
      //   setRowData((prevData) => [...prevData, arr]);
      setRowData(arr);
    }
  };
  const callapiChange = async (searchKey) => {
    // console.log("search=>", searchKey);
    // if (e.target.value.length >= 3) {
    const response = await execFun(
      () => getComponentsByNameAndNo(searchKey),
      "fetch"
    );
    // console.log("response", response);
    if (response.status == 200) {
      let arr = response.data.map((r) => {
        return {
          label: r.id,
          value: r.text,
        };
      });
      //   console.log("arr==========", arr);
      setMaterialList(arr);
      //   setRowData((prevData) => [...prevData, arr]);
    }
    // }
  };
  //   console.log("val", materialList);

  useEffect(() => {
    // console.log("search inn useeffect", search);
  }, [search]);
  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      // Ensure there's a search key before dispatching
      dispatch(fetchComponentDetail({ search: searchKey, type }));
    }
  };

  const components = useMemo(() => {
    // console.log("materialList is here", materialList);

    return {
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          materialList={materialList}
          {...props}
          componentDetails={componentDetails}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
        />
      ),
    };
  }, []);

  //   console.log("search after the response", search);

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
  const callAPi = async (params) => {
    console.log("params", params);

    let payload = {
      subject_id: form.getFieldValue("subjectId"),
      qty: params?.data.orderQty,
      category: params?.data.bomCategory,
      status: params?.data.bomStatus,
      component_id: params?.data.material,
      sku: form.getFieldValue("sku"),
    };
    dispatch(updateBomComponent(payload));

    // );?
  };
  const columnDefs: ColDef<rowData>[] = [
    // {
    //   field: "checked",
    //   headerName: "",
    //   //   flex: 1,
    //   width: 50,
    //   //   width: 20,
    //   cellRenderer: () => {
    //     return (
    //       <div className="flex gap-[5px] items-center justify-center h-full">
    //         <Checkbox onClick={(e) => rowData(e.target.checked)} />
    //       </div>
    //     );
    //   },
    // },
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
      headerName: "Material",
      field: "material",
      editable: true,
      flex: 4,
      cellRenderer: "textInputCellRenderer",
      minWidth: 500,
    },

    {
      headerName: "Qty/Unit",
      field: "orderQty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 100,
    },

    {
      headerName: "Category",
      field: "bomCategory",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "bomStatus",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 150,
    },

    {
      field: "action",
      headerName: "",
      width: 50,
      cellRenderer: (params) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {stage1 == "1" ? (
              <Button className=" bg-white  hover:bg-white-600 rounded-full h-[25px] w-[25px] flex justify-center items-center p-0 ">
                <Check
                  className="h-[15px] w-[15px] text-green-500 hover:text-green-700"
                  onClick={() => callAPi(params)}
                  //   onClick={() => setSheetOpenEdit(e?.data?.product_key)}
                />
              </Button>
            ) : (
              <Button className=" rounded-full bg-white  hover:bg-white-600 h-[25px] w-[25px] flex justify-center items-center p-0">
                <FiRefreshCw
                  className="h-[15px] w-[15px] text-blue-500 hover:text-blue-700"
                  onClick={() =>
                    console.log("refresh dontn smile to me", params)
                  }
                />
              </Button>
            )}

            {/* <Button className=" bg-red-700 hover:bg-red-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
              <Trash2
                className="h-[15px] w-[15px] text-white"
                onClick={() => setSheetOpenEdit(e?.data?.product_key)}
              />
            </Button>{" "} */}
          </div>
        );
      },
    },
  ];
  const ActionMenu: React.FC<ActionMenuProps> = ({ row }) => {
    const dispatch = useDispatch<AppDispatch>();

    const menu = (
      <Menu>
        {" "}
        {stage1 == "1" ? (
          <Menu.Item
            key="AddBranch"
            onClick={() => setAddBranch(row.name)}
            // disabled={isDisabled}
          >
            Add Branch
          </Menu.Item>
        ) : (
          <Menu.Item
            key="AddBranch"
            onClick={() => setAddBranch(row.name)}
            // disabled={isDisabled}
          >
            Add Branch
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <>
        <Dropdown overlay={menu} trigger={["click"]}>
          {/* <Button icon={<Badge />} /> */}
          <MoreOutlined />
        </Dropdown>
      </>
    );
  };
  const handleReset = () => {};
  const handleBack = () => {
    setStage1("1");
  };
  useEffect(() => {
    if (sheetOpenEdit) {
      getdetails(sheetOpenEdit);
    }
  }, [sheetOpenEdit]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <AddPOPopovers uiState={uiState} />
      {loading1("fetch") && <FullPageLoading />}
      <Sheet open={sheetOpenEdit.length} onOpenChange={setSheetOpenEdit}>
        <SheetTrigger></SheetTrigger>
        <SheetContent
          className="min-w-[100%] p-0"
          onInteractOutside={(e: any) => {
            // e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">{`Edit  ${form.getFieldValue(
              "bom"
            )}`}</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr] ">
            <div className="bg-[#fff]">
              {" "}
              <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
                <Filter className="h-[20px] w-[20px]" />
                Filter
              </div>
              <div className="p-[10px]"></div>
              <Form
                form={form}
                layout="vertical"
                className="space-y-1  p-[10px] h-[400px]"
              >
                <div className="grid grid-cols-3 gap-[10px] ">
                  <div className="col-span-3 ">
                    <Form.Item name="bom" label="BOM">
                      <Input disabled />
                    </Form.Item>
                    <Form.Item name="name" label="Product Name ">
                      <Input disabled />
                    </Form.Item>
                    <Form.Item name="sku" label="SKU ">
                      <Input disabled />
                    </Form.Item>
                  </div>{" "}
                  <div className="col-span-3 "></div>{" "}
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
            <div className="max-h-[calc(100vh-100px)]  bg-white">
              <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
                <Button
                  onClick={() => {
                    addNewRow();
                  }}
                  className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
                >
                  <Plus className="font-[600]" /> Add Item
                </Button>
                {/* <Button className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max"> */}
                {/* <Trash2
                    className="h-[15px] w-[15px] text-white"
                    // onClick={() => setSheetOpenEdit(e?.data?.product_key)}
                  />{" "} */}
                {/* </Button> */}
                <Button
                  onClick={() => setExcelModel(true)}
                  className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
                >
                  <Upload className="text-white w-[20px] h-[20px]" /> Upload
                  Excel
                </Button>
              </div>{" "}
              <div className="ag-theme-quartz h-[calc(100vh-180px)] w-full">
                {/* <AgGridReact
            loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          /> */}
                {/* <AgGridReact
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
          /> */}
                {/* {stage1 === "1" ? ( */}
                {/* <AgGridReact
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
                  suppressCellFocus={false}
                  suppressRowClickSelection={false}
                  rowSelection="multiple"
                  checkboxSelection={true}
                /> */}
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData || []}
                  columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
                  defaultColDef={defaultColDef}
                  statusBar={statusBar}
                  components={components}
                  pagination={false}
                  paginationPageSize={100}
                  //   gridOptions={commonAgGridConfig}
                />
                {/* ) : (
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
                    suppressCellFocus={false}
                    suppressRowClickSelection={false}
                    rowSelection="multiple"
                    checkboxSelection={true}
                  />
                )} */}

                <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                  <Button
                    className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button
                    className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
                    onClick={handleNext}
                  >
                    {stage1 === "1" ? "Next" : "Submit"}
                  </Button>
                </div>
              </div>{" "}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default EditBom;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
