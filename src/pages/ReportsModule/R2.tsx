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
import { ICellRendererParams } from "ag-grid-community";
import MyAsyncSelect from "@/components/shared/MyAsyncSelect";
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
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import Select from "react-select";

import useApi from "@/hooks/useApi";

import { fetchR2 } from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import FullPageLoading from "@/components/shared/FullPageLoading";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string().optional(),
});

const R2 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    console.log("formData", formData);
    let { date } = formData;
    let dataString = "";
    if (date) {
      dataString = exportDateRangespace(date);
    }
    let payload = {
      wise: formData.types,
      data: dataString,
    };
    console.log("payload", payload);

    const response = await execFun(() => fetchR2(payload), "fetch");
    console.log("response", response);
    let { data } = response;
    if (data.code == 200) {
      let arr = data.response.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });
      console.log("arr", arr);

      setRowData(arr);
    } else {
    }
  };
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R2 Po Report");
  };
  useEffect(() => {
    // fetchComponentList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Po Date",
      field: "reg_date",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Created By",
      field: "reg_by",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "PO Order Id",
      field: "po_order_id",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Part",
      field: "part_no",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Compenent",
      field: "component_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Compenent Code/Description",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "UoM",
      field: "unit_name",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Qty",
      field: "ordered_qty",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: " Pending Qty",
      field: "ordered_pending",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Rate",
      field: "po_rate",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Currency",
      field: "currency_lable",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Currency Sym",
      field: "currency_symbol",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Vendor Code",
      field: "vendor_code",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Due Date",
      field: "due_date",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "po_cost_center",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Project Name",
      field: "po_project",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Branch In",
      field: "branch",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const type = [
    {
      label: "Pending",
      value: "P",
    },
    {
      label: "All",
      value: "A",
    },
    {
      label: "Project",
      value: "PROJECT",
    },
  ];

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
            onSubmit={form.handleSubmit(fetchQueryResults)}
            className="space-y-6 overflow-hidden p-[10px] h-[370px]"
          >
            <FormField
              control={form.control}
              name="types"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder=" Enter Type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={type}
                      onChange={(e: any) => form.setValue("types", e.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Space direction="vertical" size={12} className="w-full">
                      <RangePicker
                        className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                        onChange={(value) =>
                          field.onChange(
                            value ? value.map((date) => date!.toDate()) : []
                          )
                        }
                        format={"DD/MM/YYYY"}
                      />
                    </Space>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-[10px] justify-end  px-[5px]">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={() => {
                //     fetchBOMList();
                //   }}
              >
                Search
              </Button>{" "}
              <Button
                // type="submit"
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
                // onClick={() => {}}
                disabled={rowData.length === 0}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleDownloadExcel();
                }}
              >
                <IoMdDownload size={20} />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
        />
      </div>
    </Wrapper>
  );
};

export default R2;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
