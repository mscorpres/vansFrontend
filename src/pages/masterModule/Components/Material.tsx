import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import { Edit2, Filter, Plus } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
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
import useApi from "@/hooks/useApi";
import { listOfUoms } from "@/features/client/clientSlice";
import { componentList, listOfUom } from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";

import EditMaterial from "./EditMaterial";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Form } from "antd";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { searchingHsn } from "@/features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { addComponent } from "@/features/client/storeSlice";

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
  const [formValues, setFormValues] = useState({ compCode: "" });
  const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
  const { uomlist } = useSelector((state: RootState) => state.client);
  const { hsnlist, getComponentData, costCenterList } = useSelector(
    (state: RootState) => state.client
  );
  var values;
  const addNewRow = () => {
    const newRow = {
      asinNumber: "B01N1SE4EP",

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
    console.log("here in api", response);
    let { data } = response;
    if (response.status == 200) {
      let comp = data.data;
      // console.log("comp", comp);

      let arr = comp?.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      console.log("arr", arr);
      setRowData(arr);
    }
  };
  console.log("here in api", rowData);
  const listUom = async () => {
    const response = await execFun(() => listOfUom(), "fetch");
    const { data } = response;

    if (response.status == 200) {
      let arr = data.data.map((r, index) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      // console.log("arr", arr);
      setAsyncOptions(arr);
    }
  };
  const callUom = async () => {
    let a;
    if (asyncOptions.length == 0) {
      a = await dispatch(listOfUoms());
    }

    let arr = a.payload.map((r, index) => {
      return {
        label: r.units_name,
        value: r.units_id,
      };
    });
    setAsyncOptions(arr);
  };
  const listSUom = async () => {
    // const response = await execFun(() => listOfUom(), "submit");
    // console.log("response", response);
    const response = await spigenAxios.get("/suom");
    const { data } = response;
    // addToast("SUom List fetched", {
    //   appearance: "success",
    //   autoDismiss: true,
    // });
    if (response.status == 200) {
      console.log("data", data);

      let arr = data?.data?.map((r, index) => {
        return {
          label: r.units_name,
          value: r.units_id,
        };
      });
      setSuomOtions(arr);
    }
  };
  const listOfGroups = async () => {
    // const response = await execFun(() => listOfUom(), "submit");
    const response = await spigenAxios.get("/groups/allGroups");
    const { data } = response;
    if (response.status == 200) {
      console.log("datadata", data);

      let arr = data?.data.map((r, index) => {
        return {
          label: r.group_name,
          value: r.group_id,
        };
      });
      // console.log("arr ssssss", arr);

      setGrpOtions(arr);
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
      cellRenderer: (param) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            {/* <Button className="bg-green-500 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-green-600"> */}
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
      width: 150,
    },
    {
      headerName: "Component",
      field: "c_name",
      filter: "agTextColumnFilter",
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
    setLoading(true);
    let payload = {
      part: fixedVal.partCode,
      uom: fixedVal.uom.value,
      // soq: fixedVal.soq,
      soq: fixedVal.suom.value,
      moqqty: fixedVal?.moq,
      component: fixedVal.compName,

      type: fixedVal.type.value,
      notes: fixedVal.specifiction,
      hsns: hsnrowData.map((r) => r.hsnSearch),
      taxs: hsnrowData.map((r) => r.gstRate),
      group: fixedVal.group.value,
      isSmt: fixedVal.smt.value,
      c_make: fixedVal.maker,
      //  doubtfull
      // c_group: "GRP100220210910171321",
      // comp_type: values.type,
    };
    console.log("payload", payload);
    try {
      const response = await spigenAxios.post(
        "/component/addComponent",
        payload
      );

      console.log("response", response); // This will log the full response

      if (response.data.code === 200) {
        toast({
          title: response.data.message, // Assuming 'message' is in the response
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
          title: "Failed to add component", // You can show an error message here if the code is not 200
          className: "bg-red-700 text-center text-white",
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error while adding component:", error);
      toast({
        title: error.message.msg || "An unknown error occurred",
        className: "bg-red-700 text-center text-white",
      });
      // You can also display an error toast here if needed
    }

    setLoading(false);
  };
  const handleSearch = (searchKey: string, type: any) => {
    console.log("searchKey", searchKey);
    if (searchKey) {
      let p = { searchTerm: searchKey };
      dispatch(searchingHsn(p)).then((res) => {
        console.log("res", res);
      });
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
          setRowData={hsnrowData}
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
      headerName: "HSN/SAC Code",
      field: "hsnSearch",
      // editable: false,
      // flex: 1,
      cellRenderer: "textInputCellRenderer",
      width: 200,
    },

    {
      headerName: "Tax (%) Percentage",
      field: "gstRate",
      editable: false,
      // flex: 1,
      cellRenderer: "textInputCellRenderer",
      width: 200,
    },

    // {
    //   field: "action",
    //   headerName: "",
    //   flex: 1,
    //   cellRenderer: (e) => {
    //     return (
    //       <div className="flex gap-[5px] items-center justify-center h-full">
    //         <Button className=" bg-red-700 hover:bg-red-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
    //           <Trash2
    //             className="h-[15px] w-[15px] text-white"
    //             onClick={() => setSheetOpenEdit(e?.data?.product_key)}
    //           />
    //         </Button>{" "}
    //       </div>
    //     );
    //   },
    // },
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
            {/* <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 overflow-y-scroll p-[10px] h-[calc(100vh-150px)]"
            > */}
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
                        //   onChange={(e) => console.log(e)}
                        //   value={
                        //     data.clientDetails
                        //       ? {
                        //           label: data.clientDetails.city.name,
                        //           value: data.clientDetails.city.name,
                        //         }
                        //       : null
                        //   }
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
                        //   onChange={(e) => console.log(e)}
                        //   value={
                        //     data.clientDetails
                        //       ? {
                        //           label: data.clientDetails.city.name,
                        //           value: data.clientDetails.city.name,
                        //         }
                        //       : null
                        //   }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-[40px]  py-[-10px]">
                  <div className="col-span-3">
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
                    {" "}
                    <Form.Item name="moq" label="MOQ" rules={rules.moq}>
                      <Input
                        className={InputStyle}
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
                        //   onChange={(e) => console.log(e)}
                        //   value={
                        //     data.clientDetails
                        //       ? {
                        //           label: data.clientDetails.city.name,
                        //           value: data.clientDetails.city.name,
                        //         }
                        //       : null
                        //   }
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
                        //   onChange={(e) => console.log(e)}
                        //   value={
                        //     data.clientDetails
                        //       ? {
                        //           label: data.clientDetails.city.name,
                        //           value: data.clientDetails.city.name,
                        //         }
                        //       : null
                        //   }
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
                        //   onChange={(e) => console.log(e)}
                        //   value={
                        //     data.clientDetails
                        //       ? {
                        //           label: data.clientDetails.city.name,
                        //           value: data.clientDetails.city.name,
                        //         }
                        //       : null
                        //   }
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
                      suppressCellFocus={false}
                      suppressRowClickSelection={false}
                      rowSelection="multiple"
                      checkboxSelection={true}
                    />{" "}
                  </div>{" "}
                  <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
                    <Button
                      className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
                      onClick={() => setSheetOpenHSN(false)}
                    >
                      Back
                    </Button>{" "}
                    {/* <Button
                      className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
                      onClick={() =>
                        isApprove ? setShowRejectConfirm(true) : setRowData([])
                      }
                    >
                      {isApprove ? "Reject" : "Reset"}
                    </Button> */}
                    <Button
                      type="submit"
                      className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                      // onClick={(e) => e.preventDefault()}
                      onClick={(e: any) => {
                        onSubmit();
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
          {(loading1("fetch") || loading) && <FullPageLoading />}
          <AgGridReact
            loadingCellRenderer={loadingCellRenderer}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{ filter: true, sortable: true }}
            pagination={true}
            paginationPageSize={10}
            paginationAutoPageSize={true}
          />
        </div>{" "}
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
