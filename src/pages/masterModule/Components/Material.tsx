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

import useApi from "@/hooks/useApi";
import { componentList, listOfUom } from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";

import EditMaterial from "./EditMaterial";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Form } from "antd";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { searchingHsn } from "@/features/client/clientSlice";
import { useDispatch } from "react-redux";
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
  partCode: z.string().optional(),
  uom: z.string().optional(),
  suom: z.string().optional(),
  soq: z.string().optional(),
  moq: z.string().optional(),
  maker: z.string().optional(),
  specifiction: z.string().optional(),
  group: z.string().optional(),
  type: z.string().optional(),
  smt: z.string().optional(),
});

const Material = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [hsnrowData, setHsnRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [suomOtions, setSuomOtions] = useState([]);
  const [grpOtions, setGrpOtions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [formValues, setFormValues] = useState({ compCode: "" });
  const { execFun, loading: loading1 } = useApi();
  const gridRef = useRef<AgGridReact<RowData>>(null);

  const dispatch = useDispatch<AppDispatch>();
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();
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
      value: "Component",
    },
    {
      label: "Other",
      value: "Other",
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
      console.log("comp", comp);

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
      console.log("arr", arr);
      setAsyncOptions(arr);
    }
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
      console.log("arr ssssss", arr);

      setGrpOtions(arr);
    }
  };
  useEffect(() => {
    listUom();
    listOfGroups();
    listSUom();
    listOfComponentList();
  }, []);
  const columnDefs: ColDef<rowData>[] = [
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
      filter: "agTextColumnFilter",
    },
    {
      headerName: "UoM",
      field: "units_name",
      filter: "agTextColumnFilter",
    },
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
  ];
  const onSubmit = async () => {
    const values = await form.validateFields();

    let payload = {
      part: values.compName,
      uom: values.uom.value,
      soq: values.suom,
      soqqty: values.soq,
      moqqty: values.moq,
      component: values.compName,

      c_category: values.type,
      notes: values.specifiction,
      hsns: hsnrowData.map((r) => r.hsnSearch),
      taxs: hsnrowData.map((r) => r.gstRate),
      group: values.group.value,
      isSmt: values.smt.value,
      c_make: values.maker,
      //  doubtfull
      // c_group: "GRP100220210910171321",
      // comp_type: values.type,
    };
    // try {
    //   const resultAction = await dispatch(
    //     createBranch({
    //       endpoint: "/client/addBranch",
    //       payload: {
    //         ...values,
    //         clientCode: clientId,
    //       },
    //     })
    //   ).unwrap();
    //   if (resultAction.message) {
    //     toast({
    //       title: "Branch created successfully",
    //       className: "bg-green-600 text-white items-center",
    //     });
    //   } else {
    //     toast({
    //       title: resultAction.message || "Failed to Create Branch",
    //       className: "bg-red-600 text-white items-center",
    //     });
    //   }
    // } catch (error) {
    //   console.error("An error occurred:", error);
    // }
  };
  const handleSearch = (searchKey: string, type: any) => {
    console.log("searchKey", searchKey);
    if (searchKey) {
      let p = { searchTerm: searchKey };
      dispatch(searchingHsn(p));
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
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Tax (%) Percentage",
      field: "gstRate",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
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
  return (
    <>
      <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[630px_1fr] overflow-hidden">
        <div className="bg-[#fff]">
          {" "}
          <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
            <Filter className="h-[20px] w-[20px]" />
            Add
          </div>
          <Form form={form} layout="vertical">
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 overflow-y-scroll p-[10px] h-[calc(100vh-150px)]"
            >
              <div className="grid grid-cols-3 gap-[40px] py-[-10px] ">
                <div className="">
                  <Form.Item name="partCode" label="Part Code">
                    <Input
                      className={InputStyle}
                      placeholder="Part Code"
                      // {...field}
                    />
                  </Form.Item>
                </div>
                <div className="">
                  {" "}
                  <Form.Item name="uom" label="UOM">
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
                  <Form.Item name="suom" label="S UoM">
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
                <div className="col-span-2">
                  {" "}
                  <Form.Item name="compName" label="Component Name">
                    <Input
                      className={InputStyle}
                      placeholder="Component Name"
                      // {...field}
                    />
                  </Form.Item>
                </div>
                <div className="">
                  {" "}
                  <Form.Item name="soq" label="SOQ">
                    <Input
                      className={InputStyle}
                      placeholder="SOQ Qty"
                      // {...field}
                    />
                  </Form.Item>
                </div>
                <div className="">
                  {" "}
                  <Form.Item name="moq" label="MOQ">
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
                  <Form.Item name="group" label="Group">
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
                  <Form.Item name="type" label="Type">
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
                  <Form.Item name="smt" label="SMT">
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
                  <Form.Item name="maker" label="Maker">
                    <Input
                      className={InputStyle}
                      placeholder="Maker"
                      // {...field}
                    />
                  </Form.Item>
                </div>{" "}
                <div className="">
                  {" "}
                  <Form.Item name="specifiction" label="Specifiction">
                    <Input
                      className={InputStyle}
                      placeholder="Specifiction"
                      // {...field}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="h-[calc(100vh-400px)]  ">
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
                </div>
                <div className="ag-theme-quartz h-[320px] w-full">
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
              </div>{" "}
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
            </form>
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
