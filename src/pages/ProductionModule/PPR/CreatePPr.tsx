import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import TextInputCellRenderer from "@/config/agGrid/TextInputCellRenderer";
import DatePickerCellRenderer from "@/config/agGrid/DatePickerCellRenderer";
import StatusCellRenderer from "@/config/agGrid/StatusCellRenderer";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { ICellRendererParams } from "ag-grid-community";
import {
  InputStyle,
  LableStyle,
  primartButtonStyle,
} from "@/constants/themeContants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter, Plus, Search } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space } from "antd";
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
import ActionCellRenderer from "./ActionCellRenderer";
import { StatusPanelDef, ColDef, ColGroupDef } from "@ag-grid-community/core";
import {
  componentList,
  componentMapList,
  fetchBomTypeWise,
  fetchListOfCompletedFg,
  fetchListOfCompletedFgOut,
  fetchListOfProjectId,
  getComponentsByNameAndNo,
  getProductList,
  listOfUom,
  serviceList,
  servicesaddition,
} from "@/components/shared/Api/masterApi";
import { spigenAxios } from "@/axiosIntercepter";
import { Textarea } from "@/components/ui/textarea";

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

const CreatePPr = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [wise, setWise] = useState();
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const addNewRow = () => {
    const newRow: RowData = {
      checked: false,
      bom_product_sku: "products",
      client_name: "here",
      client_code: "B01N1SE4EP",
      qty: 100,
    };
    setRowData((prevData) => [...prevData, newRow]);
  };
  const { execFun, loading: loading1 } = useApi();
  const fetchFgOutList = async (formData: z.infer<typeof FormSchema>) => {

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
    // return;
    const response = await execFun(
      () => fetchListOfCompletedFgOut(dataString),
      "fetch"
    );
    // return;
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
      textInputCellRenderer: TextInputCellRenderer,
      datePickerCellRenderer: DatePickerCellRenderer,
      statusCellRenderer: StatusCellRenderer,
    }),
    []
  );
  const getProjectID = async (search) => {
    const response = await execFun(() => fetchListOfProjectId(search), "fetch");
  };
  const type = [
    {
      label: "New",
      value: "0",
    },
    {
      label: "Repair",
      value: "0",
    },
    {
      label: "Testing",
      value: "0",
    },
    {
      label: "Packing",
      value: "0",
    },
  ];
  useEffect(() => {
    // fetchFgOutList();
    addNewRow();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
      cellRenderer: () => {
        return (
          //   <Button className="rounded-md shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500 max-w-max">
          <Plus
            onClick={() => {
              addNewRow();
            }}
            className="font-[600]"
          />
          // Add Item
          //   </Button>
        );
      },
    },
    {
      headerName: "Product & SKU",
      field: "bom_product_sku",
      editable: false,
      cellRenderer: "textInputCellRenderer",
      width: 220,
    },
    {
      headerName: "BOM",
      field: "client_name",
      editable: false,
      cellRenderer: "textInputCellRenderer",
      width: 150,
    },
    {
      headerName: "Qty",
      field: "client_code",
      editable: false,
      cellRenderer: "textInputCellRenderer",
      width: 190,
    },
    {
      headerName: "Customer",
      field: "customer",
      editable: false,
      cellRenderer: "textInputCellRenderer",
      width: 150,
    },
    {
      headerName: "Qty",
      field: "qty",
      editable: false, cellRenderer: "textInputCellRenderer",
      width: 190,
    },
  ];
  const handleSelectChange = (selectedOption) => {
    // Ensure selectedOption is not null and has a value
    if (selectedOption) {

      form.setValue("projectId", selectedOption.value);
      getProjectID(selectedOption.value);
    } else {
      form.setValue("projectId", null); // or handle empty selection
      // Optionally handle empty selection scenario
    }
  };
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(fetchFgOutList)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          >
            <FormField
              control={form.control}
              name="wise"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Select Project Id"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      //   options={type}
                      onChange={handleSelectChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      className={InputStyle}
                      placeholder="Add Remarks here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* )} */}
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              //   onClick={() => {
              //     fetchBOMList();
              //   }}
            >
              Search
            </Button>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-210px)] w-full">
        <AgGridReact
          //   ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          statusBar={statusBar}
          components={components}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          gridOptions={commonAgGridConfig}
          suppressCellFocus={true}
          suppressRowClickSelection={false}
        />
      </div>
    </Wrapper>
  );
};

export default CreatePPr;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
