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
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { rangePresets } from "@/General";
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
    setRowData([]);
    let { date } = formData;
    let dataString = "";
    if (date) {
      dataString = exportDateRangespace(date);
    }
    let payload = {
      wise: formData.types,
      data: dataString,
    };

    const response = await execFun(() => fetchR2(payload), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = data.response.data.map((r, index) => {
        return {
          id: index + 1,
          vendorDes: r.vendor_part_code + "/" + r.vendor_part_desc,
          ...r,
        };
      });

      setRowData(arr);
    } else {
    }
  };
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R2 PO Report");
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
      headerName: "PO Date",
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
      cellRenderer: CopyCellRenderer,
      width: 220,
    },

    {
      headerName: "Part No.",
      field: "part_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },

    {
      headerName: "Compenent",
      field: "component_name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      minWidth: 190,
      flex: 1,
    },
    {
      headerName: "Vendor Compenent Code/Description",
      field: "vendorDes",
      filter: "agTextColumnFilter",
      minWidth: 320,
      cellRenderer: CopyCellRenderer,
      flex: 2,
    },

    {
      headerName: "UoM",
      field: "unit_name",
      filter: "agTextColumnFilter",
      width: 120,
    },

    {
      headerName: "Qty",
      field: "ordered_qty",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: " Pending Qty",
      field: "ordered_pending",
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "Rate",
      field: "po_rate",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Currency",
      field: "currency_lable",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "Currency Sym",
      field: "currency_symbol",
      filter: "agTextColumnFilter",
      width: 150,
    },

    {
      headerName: "Vendor Code",
      field: "vendor_code",
      cellRenderer: CopyCellRenderer,
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Vendor Name",
      field: "vendor_name",
      cellRenderer: CopyCellRenderer,
      filter: "agTextColumnFilter",
      minWidth: 210,
      flex: 1,
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
      width: 150,
    },
    {
      headerName: "Project Name",
      field: "po_project",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Branch In",
      field: "branch",
      filter: "agTextColumnFilter",
      width: 150,
    },
    // {
    //   headerName: "Make",
    //   field: "make",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    // },
    // {
    //   headerName: "Description",
    //   field: "description",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    // },
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
                        presets={rangePresets}
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
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
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
