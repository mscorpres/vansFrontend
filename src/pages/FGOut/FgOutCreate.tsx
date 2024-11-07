import React, { useMemo, useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { ICellRendererParams } from "ag-grid-community";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
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
import { DatePicker, Divider, Form, Space } from "antd";
import { StatusPanelDef, ColDef, ColGroupDef } from "@ag-grid-community/core";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Select from "react-select";
import { fetchSellRequestList } from "@/features/salesmodule/SalesSlice";
import { AppDispatch, RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
// import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { toast, useToast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import ActionCellRenderer from "./ActionCellRenderer";
import {
  componentList,
  componentMapList,
  fetchBomTypeWise,
  fetchListOfCompletedFg,
  fetchListOfCompletedFgOut,
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";

import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { spigenAxios } from "@/axiosIntercepter";
import { AgGridReact } from "@ag-grid-community/react";
import { createFgOut, fetchFGProduct } from "@/features/client/storeSlice";
import TextInputCellRenderer from "./TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
const dateFormat = "YYYY/MM/DD";
const FormSchema = z.object({
  wise: z.string().optional(),
  date: z.array(z.date()),
  // .length(1)
  // .optional()
  // .refine((data) => data === undefined || data.length === 1, {
  //   message: "Please select a valid date range.",
  // }),
});

const FgOutCreate = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [wise, setWise] = useState();
  const [search, setSearch] = useState("");
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });
  const [form] = Form.useForm();

  const dispatch = useDispatch<AppDispatch>();
  // const { product } = useAppSelector((state) => state.store);
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const { execFun, loading: loading1 } = useApi();

  const addNewRow = () => {
    const newRow = {
      checked: false,
      // type: "products",
      product: "",
      remark: "",
      // asinNumber: "B01N1SE4EP",
      qty: 0,
      orderQty: 0,
      // rate: 50,
      // currency: "USD",
      // gstRate: 18,
      // gstType: "local",
      // localValue: 0,
      // foreignValue: 0,
      // cgst: 9,
      // sgst: 9,
      // igst: 0,
      // dueDate: "2024-07-25",
      // hsnCode: "",
      isNew: true,
    };
    // setRowData((prevData) => [...prevData, newRow]);
    setRowData((prevData) => [
      ...(Array.isArray(prevData) ? prevData : []),
      newRow,
    ]);
  };

  const fetchFgOutList = async (formData: z.infer<typeof FormSchema>) => {
    const { date } = formData;
    let dataString = "";
    const startDate = dateRange[0]
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");
    const endDate = dateRange[1]
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");
    dataString = `${startDate}-${endDate}`;
   const response = await execFun(
      () => fetchListOfCompletedFgOut(dataString),
      "fetch"
    );
     let { data } = response;
    if (response.status === 200) {
      let arr = data.response.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      setRowData(arr);
      //   addToast(response.message, {
      //     appearance: "success",
      //     autoDismiss: true,
      //   });
    } else {
      //   addToast(response.message, {
      //     appearance: "error",
      //     autoDismiss: true,
      //   });
    }
  };

  const type = [
    {
      label: "Sale",
      value: "sale",
    },
  ];

  const handleSubmit = async () => {
    const values = await form.validateFields();
    let payload = {
      fg_out_type: "SL001",
      product: rowData.map((r) => r.product),
      qty: rowData.map((r) => r.qty),
      remark: rowData.map((r) => r.remark),
      comment: values.remark,
    };
    dispatch(createFgOut(payload)).then((res) => {
       if (res.payload.code) {
        toast({
          title: "FG OUT Completed",
          className: "bg-green-600 text-white items-center",
        });
        setShowConfirmation(false);
        form.resetFields();
      } else {
        toast({
          title: "erro",
          className: "bg-red-600 text-white items-center",
        });
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
      headerName: "Product/ SKU",
      field: "product",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },

    {
      headerName: "Issue Qty/ UOM",
      field: "orderQty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Stock In Hand",
      field: "qty",
      editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
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
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      floatingFilter: false,
      editable: false,
    };
  }, []);
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
          // vendorCode={selectedVendor}
          // currencyList={currencyList}
          // componentDetails={hsnlist}
        />
      ),
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );
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
      dispatch(fetchFGProduct(p));
    }
  };

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Add
        </div>
        <div className="p-[10px]"></div>
        <Form form={form} className="px-[10px]">
          <Form.Item className="w-full" name="wise">
            {/* <FormControl> */}
            <Select
              styles={customStyles}
              components={{ DropdownIndicator }}
              placeholder="Select Type"
              className="border-0 basic-single"
              classNamePrefix="select border-0"
              isDisabled={false}
              isClearable={true}
              isSearchable={true}
              options={type}
              onChange={(e: any) => setWise(e.value)}
            />
          </Form.Item>
          <Form.Item className="w-full" name="remark">
            <Input
              // value={value}
              // type="text"
              // placeholder={colDef.headerName}
              className="w-[100%]  text-slate-600  border-slate-400 shadow-none mt-[2px]"
            />
          </Form.Item>

          <Button
            type="submit"
            className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
            //   onClick={() => {
            //     fetchBOMList();
            //   }}
          >
            Search
          </Button>
          {/* </form> */}
        </Form>
      </div>
      <div className="max-h-[calc(100vh-100px)] overflow-y-auto bg-white">
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
        </div>{" "}
        <ConfirmationModal
          open={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onOkay={handleSubmit}
          submitText="Submit"
          title="Confirm Submit!"
          description={`Are you sure to submit details of this entry?`}
        />
        <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
          <Button
            className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max px-[30px]"
            // onClick={() => setTab("create")}
          >
            Back
          </Button>{" "}
          <Button
            className="rounded-md shadow bg-red-700 hover:bg-red-600 shadow-slate-500 max-w-max px-[30px]"
            // onClick={() =>
            // isApprove ? setShowRejectConfirm(true) : setRowData([])
            // }
          >
            Reset
          </Button>
          <Button
            className="rounded-md shadow bg-green-700 hover:bg-green-600 shadow-slate-500 max-w-max px-[30px]"
            onClick={() => setShowConfirmation(true)}
          >
            Submit
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default FgOutCreate;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
