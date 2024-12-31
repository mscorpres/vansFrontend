import { useCallback, useEffect, useState, useMemo, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { InputStyle } from "@/constants/themeContants";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";

import { Edit2, Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";

import useApi from "@/hooks/useApi";
import { listOfUoms } from "@/features/client/clientSlice";
import {
  addComponentInMaterial,
  componentList,
  getGroupList,
  listOfUom,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";

import EditMaterial from "./EditMaterial";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Form } from "antd";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { searchingHsn } from "@/features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { AppDispatch, RootState } from "@/store";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const Material = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [hsnrowData, setHsnRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [suomOtions, setSuomOtions] = useState([]);
  const [grpOtions, setGrpOtions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [sheetOpenHSN, setSheetOpenHSN] = useState<boolean>(false);
  const [fixedVal, setFixedVal] = useState([]);
  const [search, setSearch] = useState("");
  const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const { uomlist } = useSelector((state: RootState) => state.client);
  const { hsnlist } = useSelector((state: RootState) => state.client);
  var values;
  const addNewRow = () => {
    const newRow = {
      asinNumber: "B01N1SE4EP",
      id: "",
      gstRate: 18,
      hsnSearch: "",
      isNew: true,
    };
    setHsnRowData((prevData) => [...prevData, newRow]);
  };
  const typeOption = [
    {
      label: "Component",
      value: "C",
    },
    {
      label: "Other",
      value: "O",
    },
  ];

  const smtOption = [
    {
      label: "Yes",
      value: "Y",
    },
    {
      label: "No",
      value: "N",
    },
  ];

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);
  const listOfComponentList = async () => {
    const response = await execFun(() => componentList(), "fetch");
    let { data } = response;
    if (data.success) {
      let comp = data.data;

      let arr = comp?.map((r: any, index: any) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      toast({
        title: data?.message,
        className: "bg-green-600 text-white items-center",
      });
    } else {
      toast({
        title: data?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (data.success) {
      let arr = data.data.map((r: any, index: any) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setAsyncOptions(arr);
      // toast({
      //   title: data?.message,
      //   className: "bg-green-600 text-white items-center",
      // });
    } else {
      toast({
        title: data?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const callUom = async () => {
    let a;
    if (asyncOptions.length == 0) {
      a = await dispatch(listOfUoms());
    }

    let arr = a.payload.map((r: any, index: any) => {
      return {
        label: r.units_name,
        value: r.units_id,
      };
    });
    setAsyncOptions(arr);
  };
  const listSUom = async () => {
    const response = await spigenAxios.get("/suom");
    const { data } = response;
    if (data.success) {
      let arr = data?.data?.map((r: any, index: any) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setSuomOtions(arr);
      // toast({
      //   title: data?.message,
      //   className: "bg-green-600 text-white items-center",
      // });
    } else {
      toast({
        title: data?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  const listOfGroups = async () => {
    const response = await execFun(() => getGroupList(), "fetch");
    const { data } = response;
    if (data.success) {
      let arr = data?.data.map((r: any, index: any) => {
        return {
          label: r.group_name,
          value: r.group_id,
        };
      });

      setGrpOtions(arr);
    } else {
      toast({
        title: data?.message,
        className: "bg-red-600 text-white items-center",
      });
    }
  };
  useEffect(() => {
    listUom();
    listOfGroups();
    listSUom();
    listOfComponentList();
  }, []);
  useEffect(() => {
    if (uomlist) {
      callUom();
    }
  }, [uomlist]);
  const columnDefs: ColDef<rowData>[] = [
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      cellRenderer: (param: any) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-700 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
            <Edit2
              className="h-[20px] w-[20px] text-cyan-700 "
              onClick={() => setSheetOpenEdit(param?.data)}
            />
            {/* </Button> */}
          </div>
        );
      },
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 70,
    },
    {
      headerName: "Part Code",
      field: "c_part_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Component",
      field: "c_name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 200,
    },
    {
      headerName: "Description",
      field: "c_specification",
      flex: 4,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "UoM",
      field: "units_name",
      filter: "agTextColumnFilter",
    },
  ];
  const onSubmit = async () => {
    setOpen(false);

    let payload: any = {
      part: fixedVal.partCode,
      uom: fixedVal.uom.value,
      soqqty: fixedVal.soq,
      suom: fixedVal.suom.value,
      moqqty: fixedVal?.moq,
      component: fixedVal.compName,

      type: fixedVal.type.value,
      notes: fixedVal.specifiction,
      hsns: hsnrowData.map((r) => r.hsnSearch.value),
      taxs: hsnrowData.map((r) => r.gstRate),
      group: fixedVal.group.value,
      isSmt: fixedVal.smt.value,
      c_make: fixedVal.maker,
      //  doubtfull
      // comp_type: values.type,
    };
    // try {
    // const response = await spigenAxios.post(
    //   "/component/addComponent",
    //   payload
    // );
    const response = await execFun(
      () => addComponentInMaterial(payload),
      "fetch"
    );
    let { data } = response;
    if (data.success) {
      toast({
        title: data.message, // Assuming 'message' is in the response
        className: "bg-green-700 text-center text-white",
      });
      form.resetFields();
      setRowData([]);
      setHsnRowData([]);
      setSheetOpenHSN(false);
      setLoading(false);
      listOfComponentList();
    } else {
      toast({
        title: data.message, // Assuming 'message' is in the response
        className: "bg-red-700 text-center text-white",
      });
    }
    setLoading(false);
    // } catch (error) {
    //   console.error("Error while adding component:", error);
    //   toast({
    //     title: error.message,
    //     className: "bg-red-700 text-center text-white",
    //   });
    //   // You can also display an error toast here if needed
    // }

    setLoading(false);
  };
  const handleSearch = (searchKey: string, type: any) => {
    if (searchKey) {
      let p = { searchTerm: searchKey };
      dispatch(searchingHsn(p)).then((res: any) => {});
    }
  };
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
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setHsnRowData}
          rowData={hsnrowData}
          setSearch={handleSearch}
          search={search}
          onSearch={handleSearch}
          hsnlist={hsnlist}
        />
      ),
    }),
    []
  );

  const HsncolumnDefs: ColDef<rowData>[] = [
    {
      headerName: "Id",
      valueGetter: "node.rowIndex + 1",
      cellRenderer: "textInputCellRenderer",
      maxWidth: 50,
      field: "delete",
    },
    { headerName: "Index", valueGetter: "node.rowIndex + 1", maxWidth: 80 },

    {
      headerName: "HSN/SAC Code",
      field: "hsnSearch",
      // editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 350,
    },

    {
      headerName: "Tax (%)",
      field: "gstRate",
      editable: false,
      // flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 100,
    },
  ];
  const addHsn = async () => {
    values = await form.validateFields();
    setFixedVal(values);
    setSheetOpenHSN(true);
  };
  return (
    <>
      <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[630px_1fr] overflow-hidden">
        <div className="bg-[#fff]">
          {" "}
          <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
            <Filter className="h-[20px] w-[20px]" />
            Add
          </div>
          <Form form={form} layout="vertical" className="p-[10px]">
            {sheetOpenHSN == false ? (
              <>
                <div className="grid grid-cols-3 gap-[40px] ">
                  <div className="">
                    <Form.Item
                      name="partCode"
                      label="Part Code"
                      rules={rules.partCode}
                    >
                      <Input
                        className={InputStyle}
                        placeholder="Part Code"
                        // {...field}
                      />
                    </Form.Item>
                  </div>
                  <div className="">
                    {" "}
                    <Form.Item name="uom" label="UOM" rules={rules.uom}>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="UoM"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={asyncOptions}
                      />
                    </Form.Item>
                  </div>
                  <div className="">
                    {" "}
                    <Form.Item name="suom" label="S UoM" rules={rules.suom}>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="S UoM"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={suomOtions}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-[40px]  py-[-10px]">
                  <div className="col-span-2">
                    {" "}
                    <Form.Item
                      name="compName"
                      label="Component Name"
                      rules={rules.compName}
                    >
                      <Input
                        className={InputStyle}
                        placeholder="Component Name"
                        // {...field}
                      />
                    </Form.Item>
                  </div>

                  <div className="">
                    <Form.Item name="soq" label="SOQ Qty" rules={rules.soq}>
                      <Input
                        className={InputStyle}
                        // type="number"
                        placeholder="SOQ Qty"
                        // {...field}
                      />
                    </Form.Item>
                  </div>
                  <div className="">
                    <Form.Item name="moq" label="MOQ Qty" rules={rules.moq}>
                      <Input
                        className={InputStyle}
                        type="number"
                        placeholder="MOQ Qty"
                        // {...field}
                      />
                    </Form.Item>
                  </div>
                </div>{" "}
                <div className="grid grid-cols-3 gap-[40px] py-[-10px]">
                  <div className="">
                    {" "}
                    <Form.Item name="group" label="Group" rules={rules.group}>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="Group"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={grpOtions}
                      />
                    </Form.Item>
                  </div>

                  <div className="">
                    {" "}
                    <Form.Item name="type" label="Type" rules={rules.type}>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="Type"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={typeOption}
                      />
                    </Form.Item>
                  </div>
                  <div className="">
                    {" "}
                    <Form.Item name="smt" label="SMT" rules={rules.smt}>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="SMT"
                        className="border-0 basic-single"
                        classNamePrefix="select border-0"
                        isDisabled={false}
                        isClearable={true}
                        isSearchable={true}
                        options={smtOption}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[40px] py-[-10px]">
                  <div className="">
                    {" "}
                    <Form.Item name="maker" label="Maker" rules={rules.maker}>
                      <Input
                        className={InputStyle}
                        placeholder="Maker"
                        // {...field}
                      />
                    </Form.Item>
                  </div>{" "}
                  <div className="">
                    {" "}
                    <Form.Item
                      name="specifiction"
                      label="Specifiction"
                      rules={rules.specifiction}
                    >
                      <Input
                        className={InputStyle}
                        placeholder="Specifiction"
                        // {...field}
                      />
                    </Form.Item>
                  </div>
                </div>
                {/* <div className="h-[calc(100vh-400px)]  "> */}
                <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
                  <Button
                    onClick={(e: any) => {
                      e.preventDefault();
                      addHsn();
                    }}
                    className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
                  >
                    <Plus className="font-[600]" /> Add HSN
                  </Button>{" "}
                </div>
              </>
            ) : (
              <>
                <div className="h-[calc(100vh-250px)]">
                  {" "}
                  <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between">
                    <Button
                      onClick={(e: any) => {
                        e.preventDefault();
                        addNewRow();
                      }}
                      className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
                    >
                      <Plus className="font-[600]" /> Add Item
                    </Button>{" "}
                  </div>{" "}
                  {/* {data.loading && <FullPageLoading />} */}
                  <div className="ag-theme-quartz h-[400px] w-full">
                    <AgGridReact
                      ref={gridRef}
                      rowData={hsnrowData}
                      columnDefs={HsncolumnDefs as (ColDef | ColGroupDef)[]}
                      defaultColDef={defaultColDef}
                      statusBar={statusBar}
                      components={components}
                      pagination={true}
                      // paginationPageSize={10}
                      animateRows={true}
                      gridOptions={commonAgGridConfig}
                      suppressCellFocus={true}
                      suppressRowClickSelection={false}
                      rowSelection="multiple"
                      checkboxSelection={true}
                      overlayNoRowsTemplate={OverlayNoRowsTemplate}
                    />
                  </div>
                  <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                    <Button
                      className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
                      onClick={() => setSheetOpenHSN(false)}
                    >
                      Back
                    </Button>

                    <Button
                      type="submit"
                      className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                      // onClick={(e) => e.preventDefault()}
                      onClick={(e: any) => {
                        setOpen(true);
                        e.preventDefault();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </div>{" "}
                <div className="flex items-center w-full gap-[20px] h-[50px] px-[10px] justify-between"></div>
              </>
            )}

            {/* </div>{" "} */}
            {/* </form> */}
          </Form>{" "}
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-100px)]">
          {" "}
          {loading1("fetch") && <FullPageLoading />}
          <AgGridReact
            loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
            suppressCellFocus={true}
            overlayNoRowsTemplate={OverlayNoRowsTemplate}
          />
        </div>{" "}
        <ConfirmationModal
          open={open}
          onClose={setOpen}
          onOkay={() => {
            onSubmit();
          }}
          loading={loading1("fetch")}
          title="Confirm Submit!"
          description="Are you sure to submit the entry?"
        />{" "}
      </Wrapper>{" "}
      {sheetOpenEdit?.c_part_no && (
        <EditMaterial
          sheetOpenEdit={sheetOpenEdit}
          setSheetOpenEdit={setSheetOpenEdit}
        />
      )}
    </>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default Material;
const rules = {
  partCode: [
    {
      required: true,
      message: "Please provide Part Code",
    },
  ],
  uom: [
    {
      required: true,
      message: "Please provide UOM !",
    },
  ],
  suom: [
    {
      required: true,
      message: "Please provide S UOM!",
    },
  ],
  compName: [
    {
      required: true,
      message: "Please provide Component Name!",
    },
  ],
  moq: [
    {
      required: true,
      message: "Please provide MOQ Qty!",
    },
  ],
  soq: [
    {
      required: true,
      message: "Please provide SOQ Qty!",
    },
  ],
  group: [
    {
      required: true,
      message: "Please provide a Group!",
    },
  ],
  type: [
    {
      required: true,
      message: "Please provide a Type!",
    },
  ],
  smt: [
    {
      required: true,
      message: "Please provide SMT!",
    },
  ],
  specifiction: [
    {
      required: true,
      message: "Please provide  Specifiction!",
    },
  ],
  maker: [
    {
      required: true,
      message: "Please provide Maker!",
    },
  ],
};
