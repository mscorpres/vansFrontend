import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

import { LableStyle } from "@/constants/themeContants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space } from "antd";
import { transformOptionData } from "@/helper/transform";

import Select from "react-select";
import useApi from "@/hooks/useApi";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { fetchR6 } from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { rangePresets } from "@/General";

// Updated Zod Schema with discriminated union
const FormSchema = z.discriminatedUnion("types", [
  z.object({
    types: z.literal("P"),
    date: z.array(z.date()).length(2, { message: "Please select a valid date range." }),
  }),
  z.object({
    types: z.literal("PROJECT"),
    component: z
      .string()
      .refine((val) => val !== undefined && val.length > 0, {
        message: "Please select a valid part name.",
      }),
  }),
]);

const R6 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      types: "",
    },
  });

  const { execFun, loading: loading1 } = useApi();
  const { RangePicker } = DatePicker;
  const theWise = form.watch("types");

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let payload;

    if (formData.types === "P") {
      const { date } = formData;
      const dataString = exportDateRangespace(date);
      payload = {
        searchValues: formData.types,
        searchData: dataString,
      };
    } else if (formData.types === "PROJECT") {
      payload = {
        searchValues: formData.types,
        searchData: formData.component,
      };
    }

    setRowData([]);
    const response = await execFun(() => fetchR6(payload), "fetch");
    const { data } = response;

    if (data.success) {
      const arr = data.data.map((r: any, index: number) => ({
        id: index + 1,
        ...r,
      }));
      setRowData(arr);
    } else {
      // Handle error case if needed
    }
  };

  const handleCompChange = (e: any) => {
    setSelectedCustomer(e);
    form.setValue("component", e?.value || ""); // Sync with form state
  };

  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R6 BOX Rate Report");
  };

  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "PART",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Part Name",
      field: "NAME",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Description",
      field: "DESC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Box Name",
      field: "BOX_NAME",
      cellRenderer: CopyCellRenderer,
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Qty",
      field: "QTY",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Rate",
      field: "RATE",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount LC",
      field: "AMOUNT_LC",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Amount FC",
      field: "AMOUNT_FC",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Cost Center",
      field: "cost_center",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Insert Date",
      field: "insert_date",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Remark",
      field: "remark",
      filter: "agTextColumnFilter",
      width: 220,
    },
  ];

  const type = [
    {
      label: "Date Wise",
      value: "P",
    },
    {
      label: "Part Wise",
      value: "PROJECT",
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[500px_1fr]">
      <div className="bg-[#fff]">
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
                      placeholder="Enter Type"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={type}
                      onChange={(e: any) => field.onChange(e?.value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {theWise === "P" && (
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
                          presets={rangePresets}
                          format={"DD/MM/YYYY"}
                        />
                      </Space>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {theWise === "PROJECT" && (
              <FormField
                control={form.control}
                name="component"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LableStyle}>Part Name</FormLabel>
                    <FormControl>
                      <ReusableAsyncSelect
                        placeholder="Part Name"
                        endpoint="/rate/getcomponents"
                        transform={transformOptionData}
                        onChange={(e: any) => {
                          setSelectedCustomer(e);
                          field.onChange(e?.value || "");
                        }}
                        value={selectedCustomer}
                        fetchOptionWith="payload"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex gap-[10px] justify-end px-[5px]">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                Search
              </Button>
              <Button
                className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
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
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
        />
      </div>
    </Wrapper>
  );
};

export default R6;

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;