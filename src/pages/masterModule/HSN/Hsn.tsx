import React from "react";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import TextInputCellRenderer from "@/config/agGrid/TextInputCellRenderer";
import { transformOptionData } from "@/helper/transform";
import { Edit2, Filter, Plus, Trash2 } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Space } from "antd";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import { fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import { RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import {
  componentList,
  fetchHSN,
  getdetailsOfUpdateComponent,
  listOfUom,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import {
  modelFixFooterStyle,
  modelFixHeaderStyle,
} from "@/constants/themeContants";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FullPageLoading from "@/components/shared/FullPageLoading";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { FaFileExcel } from "react-icons/fa";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
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

const Hsn = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [suomOtions, setSuomOtions] = useState([]);
  const [grpOtions, setGrpOtions] = useState([]);
  const [sheetOpenEdit, setSheetOpenEdit] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({ compCode: "" });
  const { execFun, loading: loading1 } = useApi();
  const addNewRow = () => {
    const newRow: RowData = {
      asinNumber: "B01N1SE4EP",

      gstRate: 18,

      hsnCode: "",
      isNew: true,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };

  const [form] = Form.useForm();
  const isValue = Form.useWatch("partName", form);
  console.log("isValue", isValue);

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
          //   ...r,
          gstRate: r.hsntax,
          hsnCode: { label: r.hsnlabel, value: r.hsncode },
        };
      });
      console.log("arr---", arr);
      setRowData((prevData) => [...prevData, newRow]);
    }
  };
  console.log("here in api", rowData);
  const getTheListHSN = async (value) => {
    const response = await execFun(() => fetchHSN(value), "fetch");
    const { data } = response;
    console.log("here in api", response);
    if (data.code == 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          //   ...r,
          gstRate: r.hsntax,
          hsnCodeselect: r.hsncode,
          isNew: true,
        };
      });
      console.log("arr", arr);
      setRowData(arr);
    }
  };
  const components = useMemo(
    () => ({
      textInputCellRenderer: TextInputCellRenderer,
    }),
    []
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
  const removeRows = () => {
    console.log("removing rows", rowData);
  };

  const fetchComponentList = async (search) => {
    const response = await execFun(
      () => getComponentsByNameAndNo(search),
      "fetch"
    );
    console.log("response---", response);
    if (response.status === "sucess") {
      let arr = response.data.map((r) => {
        return {
          label: r.id,
          value: r.text,
        };
      });
      setAsyncOptions(arr);
      console.log("arr", arr);
    }
  };
  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "HSN/SAC Code",
      field: "hsnCodeselect",
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

    {
      field: "action",
      headerName: "",
      flex: 1,
      cellRenderer: (e) => {
        return (
          <div className="flex gap-[5px] items-center justify-center h-full">
            <Button className=" bg-red-700 hover:bg-red-600 rounded h-[25px] w-[25px] felx justify-center items-center p-0 hover:bg-red-600">
              <Trash2
                className="h-[15px] w-[15px] text-white"
                onClick={() => setSheetOpenEdit(e?.data?.product_key)}
              />
            </Button>{" "}
          </div>
        );
      },
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[450px_1fr] overflow-hidden">
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
          className="space-y-6 overflow-hidden p-[10px] h-[400px]"
        >
          <div className="grid grid-cols-3 gap-[40px] ">
            <div className="col-span-3 ">
              <Form.Item name="partName" label="Part Name">
                <ReusableAsyncSelect
                  placeholder="Part Name"
                  endpoint="/backend/getComponentByNameAndNo"
                  transform={transformOptionData}
                  // onChange={(e) => log}
                  // value={selectedCustomer}
                  fetchOptionWith="payload"
                />
              </Form.Item>
            </div>{" "}
          </div>
          <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
          >
            Submit
          </Button>
          {/* </form> */}
        </Form>{" "}
      </div>{" "}
      {/* <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
      
      </div> */}
      <div className="max-h-[calc(100vh-100px)]  bg-white">
        <div className="flex items-center w-full gap-[20px] h-[60px] px-[10px] justify-between">
          <Button
            onClick={() => {
              addNewRow();
            }}
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max"
          >
            <Plus className="font-[600]" /> Add Item
          </Button>{" "}
        </div>
        <div className="ag-theme-quartz h-[calc(100vh-220px)] w-full">
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
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <Button className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]">
              Reset
            </Button>
            <Button
              className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
              //   onClick={() => setTab("create")}
            >
              Back
            </Button>
            <Button
              className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
              //   onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>{" "}
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default Hsn;
