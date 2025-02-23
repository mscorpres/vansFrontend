import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InputStyle, modelFixHeaderStyle } from "@/constants/themeContants";
import { Form, Input, Menu, Select } from "antd";

import { Button } from "@/components/ui/button";
import { Download, Filter, Plus, Trash2, Upload } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import "ag-grid-enterprise";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import {
  addNewAltComponent,
  fetchBomDocsFiles,
  fetchEdditBomStage2,
  fetchProductInBom,
  getAllAlternativeComponents,
  getAlternativeComponents,
  removeAltComponent,
  updateselectedBomComponent,
} from "@/components/shared/Api/masterApi";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/shared/FileUpload";
import useApi from "@/hooks/useApi";
import { FiRefreshCcw } from "react-icons/fi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import AddPOPopovers from "@/components/shared/AddPOPopovers";
import { useDispatch, useSelector } from "react-redux";
import { fetchComponentDetail } from "@/features/salesmodule/createSalesOrderSlice";
import { AppDispatch, RootState } from "@/store";
import { updateBomComponent } from "@/features/masterModule/ProductFg&Sfg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { RowData } from "@/data";
import { toast } from "@/components/ui/use-toast";
import { FaCheckCircle } from "react-icons/fa";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { IoCloudUpload } from "react-icons/io5";
import { spigenAxios } from "@/axiosIntercepter";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { ColDef, StatusPanelDef } from "@ag-grid-community/core";
const EditBom = () => {
  const [form] = Form.useForm();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [rowDataAlter, setRowDataAlter] = useState<RowData[]>([]);
  const [materialList, setMaterialList] = useState([]);
  const [stage1, setStage1] = useState("1");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [excelModel, setExcelModel] = useState<boolean>(false);
  const [backModel, setBackModel] = useState<boolean>(false);
  const [resetModel, setResetModel] = useState<boolean>(false);
  const [alternatemodal, setAlternateModal] = useState(false);
  const [sheetOpenEdit, setSheetOpenEdit] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [docList, setDocList] = useState([]);
  const [type, setType] = useState({});
  const [captions, setCaptions] = useState("");
  const [files, setFiles] = useState<File[] | null>(null);
  const { execFun, loading: loading1 } = useApi();
  const dispatch = useDispatch<AppDispatch>();
  const { componentDetails } = useSelector(
    (state: RootState) => state.createSalesOrder
  );
  const { loading } = useSelector((state: RootState) => state.prod);
  const params = useParams();

  const addNewRow = () => {
    const newRow = {
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

  const getdetails = async (sheetOpenEdit: any) => {
    const response = await execFun(
      () => fetchProductInBom(sheetOpenEdit),
      "fetch"
    );

    let { data } = response;
    if (data?.success) {
      form.setFieldValue("bom", data.data.subject);
      form.setFieldValue("name", data.data.product);
      form.setFieldValue("sku", data.data.sku);
      form.setFieldValue("subjectId", data.data.subjectid);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const handleNext = async () => {
    setStage1("2");
    const response = await execFun(
      () => fetchEdditBomStage2(params.id),
      "fetch"
    );
    let { data } = response;
    if (data?.success) {
      let arr = data?.data.map((r: any) => {
        return {
          orderQty: r.requiredQty,
          material: { text: r.component, value: r.compKey },
          bomCategory:
            r.category == "P"
              ? "Part"
              : r.category == "PCK"
              ? "Packaging"
              : r.category == "PCB"
              ? "PCB"
              : "other",
          bomStatus:
            r.bomstatus == "I"
              ? "Inactive"
              : r.bomstatus == "A"
              ? "Active"
              : "Alternate",
          isNew: true,
        };
      });

      setRowData(arr);
    } else {
      toast({
        title: data.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const components = useMemo(() => {
    return {
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          materialList={materialList}
          {...props}
          componentDetails={componentDetails}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          setRowData={setRowData}
          setAlternateModal={setAlternateModal}
          alternatemodal={alternatemodal}
        />
      ),
    };
  }, []);

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
  const callAPi = async (params: any) => {
    let payload = {
      subject_id: form.getFieldValue("subjectId"),
      qty: params?.data.orderQty,
      category: params?.data.bomCategory,
      status: "A",
      component_id: params?.data.material,
      sku: form.getFieldValue("sku"),
    };
    dispatch(updateBomComponent(payload)).then((response: any) => {
      if (response?.payload.data.success) {
        toast({
          title: response.payload.data.message,
          className: "bg-green-700 text-white",
        });
        setRowData([]);
      } else {
        toast({
          title: response.payload.data.message,
          className: "bg-red-700 text-white",
        });
      }
    });

    // );?
  };

  const columnDefs: ColDef<rowData>[] = [
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
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 220,
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
      cellRenderer: (params: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full cursor-pointer">
            {stage1 == "1" ? (
              <div className="flex gap-[120px] items-center justify-center h-full">
                <div className="flex gap-[5px] items-center justify-center h-full">
                  {/* <Button className=" bg-green-700 hover:bg-green-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
                  <FaCheckCircle
                    className="h-[15px] w-[15px] text-green-700 cursor-pointer"
                    onClick={() => callAPi(params)}
                    //   onClick={() => setSheetOpenEdit(e?.data?.product_key)}
                  />
                </div>
              </div>
            ) : (
              <Button className=" rounded-full bg-white  hover:bg-white-600 h-[25px] w-[25px] flex justify-center items-center p-0">
                <FiRefreshCcw
                  className="h-[15px] w-[15px] text-blue-500 hover:text-blue-700"
                  onClick={() => updateRow(params)}
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

  const columnDefsAlter: ColDef<rowData>[] = [
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "Component Name",
      field: "component_name",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 150,
    },
    {
      field: "action",
      headerName: "",
      width: 150,
      cellRenderer: (params: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className=" rounded-full bg-white  hover:bg-white-600 h-[25px] w-[25px] flex justify-center items-center p-0"> */}
            <Trash2
              className="h-[15px] w-[15px] text-red-500 hover:text-red-700"
              onClick={() => deleteSelected(params)}
            />
            {/* </Button> */}
          </div>
        );
      },
    },
  ];
  const columnDefsDoc: ColDef<rowData>[] = [
    {
      headerName: "Id",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 100,
      field: "delete",
    },
    {
      headerName: "Uploaded By",
      field: "uploaded_by",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Uploaded Date",
      field: "uploaded_date",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      field: "action",
      headerName: "",
      width: 50,
      cellRenderer: (params: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className=" rounded-full bg-white  hover:bg-white-600 h-[25px] w-[25px] flex justify-center items-center p-0"> */}
            {/* <Trash2
              className="h-[15px] w-[15px] text-red-500 hover:text-red-700"
              onClick={() => deleteSelected(params)}
            /> */}
            <a href={params?.data?.doc_url} target="_blank">
              <Download className="h-[15px] w-[15px] text-blue-500 hover:text-blue-700" />
            </a>
            {/* </Button> */}
          </div>
        );
      },
    },
  ];

  const handleReset = () => {};
  // const handleBack = () => {
  //   setStage1("1");
  // };
  const handleToBackEdit = () => {
    setAlternateModal(false);
    setStage1("2");
    // handleNext();
  };
  const deleteSelected = async (params: any) => {
    let payload = {
      child_component: params.data.child_component,
      refid: params.data.refid,
      parent_component: params.data.parent_component,
      product: form.getFieldValue("sku"),
      subject: params.data.subject,
    };
    // return;
    const response = await execFun(() => removeAltComponent(payload), "fetch");
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-700 text-white",
      });
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-white",
      });
      // setRowDataAlter({})
    }
    getdetailsOfAlternate();
  };
  const updateRow = async (params: any) => {
    let payload = {
      component_id: params.data.material.value,
      qty: params.data.orderQty,
      category:
        params.data.bomCategory == "Part"
          ? "P"
          : params.data.bomCategory == "Packaging"
          ? "PCK"
          : "PCB",
      status:
        params.data.bomStatus == "Alternate"
          ? "ALT"
          : params.data.bomStatus == "Active"
          ? "A"
          : "I",
      subject_id: sheetOpenEdit,
      sku: form.getFieldValue("sku"),
    };

    // return;
    const response = await execFun(
      () => updateselectedBomComponent(payload),
      "fetch"
    );
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message,
        className: "bg-green-700 text-white",
      });
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-white",
      });
      // setRowDataAlter({})
    }
  };
  const getdetailsOfAlternate = async () => {
    let payload = {
      parent_component: alternatemodal.material?.value,
      product_id: form.getFieldValue("sku"),
      subjectid: params?.id,
    };

    // return;
    const response = await execFun(
      () => getAllAlternativeComponents(payload),
      "fetch"
    );
    let { data } = response;
    if (data?.success) {
      let arr = data.data.map((r) => {
        return {
          ...r,
        };
      });
      setRowDataAlter(arr);
    } else {
      setRowDataAlter([]);
      toast({
        title: data.message,
        className: "bg-red-700 text-white",
      });
    }
  };
  const getdetailsOfComp = async () => {
    let payload = {
      current_component: alternatemodal.material.value,
      product_id: form.getFieldValue("sku"),
      subject: params?.id,
    };

    // return;
    const response = await execFun(
      () => getAlternativeComponents(payload),
      "fetch"
    );
    let { data } = response;
    if (data?.success) {
      let arr = data.data.map((r: any) => {
        return {
          label: r.text,
          value: r.id,
        };
      });
      setType(arr);
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-white",
      });
    }
  };
  const addNewAlternateComponent = async () => {
    let values = await form.validateFields();
    // return;

    let payload = {
      child_component: values.wise,
      parent_component: alternatemodal.material.value,
      product_id: form.getFieldValue("sku"),
      subject_id: params?.id,
    };

    // return;
    const response = await execFun(() => addNewAltComponent(payload), "fetch");
    let { data } = response;
    if (data?.success) {
      toast({
        title: data.message,
        className: "bg-green-700 text-white",
      });
      getdetailsOfAlternate();
    } else {
      toast({
        title: data.message,
        className: "bg-red-700 text-white",
      });
    }
  };
  const handleFileChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
  };

  const uploadDocs = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("caption", captions);
    formData.append("subject", sheetOpenEdit);
    formData.append("sku", form.getFieldValue("sku"));
    formData.append("doc_name", captions);
    files.map((comp) => {
      formData.append("files", comp);
    });
    const response = await spigenAxios.post("/bom/uploadDocs", formData);
    let { data } = response;
    if (data?.success) {
      // toast
      toast({
        title: "Doc Uploaded successfully",
        className: "bg-green-600 text-white items-center",
      });
      setCaptions("");
      setFiles([]);
      // setLoading(false);
      setSheetOpen(false);
      setIsLoading(false);
      // setAttachmentFile(response.data.data);
    } else {
      toast({
        title: data?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
    setIsLoading(false);
  };
  const getUploadedDoc = async (sheetOpen) => {
    let payload = {
      subject_id: sheetOpenEdit,
      sku: form.getFieldValue("sku"),
    };
    const response = await execFun(() => fetchBomDocsFiles(payload), "fetch");
    let { data } = response;
    if (data?.success) {
      // toast
      let arr = response.data.data.map((r: any) => {
        return {
          ...r,
        };
      });
      setDocList(arr);
      toast({
        title: "Docs fetched successfully",
        className: "bg-green-600 text-white items-center",
      });
    } else {
      toast({
        title: data.success,
        className: "bg-green-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    if (params?.id) {
      getdetails(params?.id);
    }
  }, [params]);
  useEffect(() => {
    if (sheetOpen) {
      getUploadedDoc(sheetOpen);
    }
  }, [sheetOpen]);
  useEffect(() => {}, [search]);
  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      dispatch(fetchComponentDetail({ search: searchKey, type }));
    }
  };
  useEffect(() => {
    if (params) {
      setSheetOpenEdit(params?.id);
    }
  }, [params]);
  useEffect(() => {
    if (alternatemodal) {
      getdetailsOfAlternate(alternatemodal);
      getdetailsOfComp(alternatemodal);
    }
  }, [alternatemodal]);

  return (
    <Wrapper className="h-[calc(100vh-60px)] overflow-hidden">
      <AddPOPopovers uiState={uiState} />
      {loading1("fetch") && <FullPageLoading />}
      {alternatemodal == false ? (
        <div className="h-[calc(100vh-50px)] grid grid-cols-[350px_1fr] flex ">
          <div className="bg-[#fff] ">
            <div className="p-[10px]">
              <Card className="rounded-sm shadow-sm shadow-slate-500">
                <CardHeader className="flex flex-row items-center justify-between p-[10px] font-weight-[800] bg-[#e0f2f1]">
                  Bom Detail
                </CardHeader>
                <CardContent className="mt-[20px] flex flex-col gap-[10px] text-slate-600">
                  <h3 className="font-[500]">BOM</h3>
                  <p className="text-[14px]">{form.getFieldValue("bom")}</p>
                  <h3 className="font-[500]">Product Name</h3>
                  <p className="text-[14px]">{form.getFieldValue("name")}</p>
                  <h3 className="font-[500]">SKU</h3>
                  <p className="text-[14px]">{form.getFieldValue("sku")}</p>
                </CardContent>
              </Card>
            </div>
          </div>{" "}
          <div className="h-[calc(100vh-120px)]  ">
            <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between bg-white">
              {stage1 == "1" && (
                <Button
                  onClick={() => {
                    addNewRow();
                  }}
                  className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
                >
                  <Plus className="font-[600]" /> Add Item
                </Button>
              )}

              <Button
                onClick={() => setSheetOpen(true)}
                className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md"
              >
                <Upload className="text-white w-[20px] h-[20px]" /> Upload Docs
                Here
              </Button>
            </div>
            <div className="ag-theme-quartz h-[calc(100vh-160px)] w-full">
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
                suppressCellFocus={false}
                suppressRowClickSelection={false}
                rowSelection="multiple"
                checkboxSelection={true}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
              />
              <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                {/* <Button
                  className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={handleReset}
                >
                  Reset
                </Button> */}
                {/* <Button
                  className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={handleBack}
                >
                  Back
                </Button> */}
                {/* <Button
                  className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
                  onClick={handleNext}
                >
                  {stage1 === "1" ? "Next" : "Submit"}
                </Button> */}
                {stage1 === "1" && (
                  <Button
                    className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="h-[calc(100vh-110px)] grid grid-cols-[350px_1fr] flex ">
            <div className="bg-[#fff]">
              {loading1("fetch") && <FullPageLoading />}
              <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
                <Filter className="h-[20px] w-[20px]" />
                Filter
              </div>
              <div className="p-[10px]"></div>
              <Form form={form} layout="vertical">
                <form
                  // onSubmit={form.handleSubmit(fetchBOMList)}
                  className="space-y-6 overflow-hidden p-[10px] h-[170px]"
                >
                  <Form.Item className="w-full" name="wise" label="Component">
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Select Component"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={type}
                      // onChange={(e: any) => form.setFieldValue("wise", e)}
                    />
                  </Form.Item>

                  <Button
                    type="submit"
                    className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                    onClick={(e) => {
                      e.preventDefault();
                      addNewAlternateComponent();
                    }}
                  >
                    Add Component
                  </Button>
                </form>
              </Form>
            </div>
            <div className="ag-theme-quartz h-[calc(100vh-110px)]">
              <AgGridReact
                //   loadingCellRenderer={loadingCellRenderer}
                rowData={rowDataAlter}
                columnDefs={columnDefsAlter}
                defaultColDef={{ filter: true, sortable: true }}
                pagination={true}
                suppressCellFocus={true}
                paginationPageSize={10}
                paginationAutoPageSize={true}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                enableCellTextSelection = {true}
              />
            </div>
          </div>
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button
              className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              onClick={handleToBackEdit}
            >
              Back To Edit
            </Button>
          </div>
        </>
      )}
      <Sheet open={sheetOpen == true} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[55%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          {/* {loading == true && <FullPageLoading />} */}
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Upload Docs here</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full">
            {isLoading && <FullPageLoading />}
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
            <div className="w-full flex justify-center">
              <div className="w-[80%] flex justify-center">
                <Input
                  placeholder="Enter Image Captions"
                  className={InputStyle}
                  onChange={(e) => setCaptions(e.target.value)}
                />
              </div>
            </div>{" "}
            <div className="ag-theme-quartz h-[calc(100vh-400px)] mt-5">
              <AgGridReact
                //   loadingCellRenderer={loadingCellRenderer}
                rowData={docList}
                columnDefs={columnDefsDoc}
                defaultColDef={{ filter: true, sortable: true }}
                pagination={true}
                paginationPageSize={10}
                paginationAutoPageSize={true}
                suppressCellFocus={true}
                overlayNoRowsTemplate={OverlayNoRowsTemplate}
                enableCellTextSelection = {true}
              />
            </div>
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
      </Sheet>{" "}
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
