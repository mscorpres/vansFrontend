import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Space } from "antd";
import Select from "react-select";
import useApi from "@/hooks/useApi";
import { fetchListOfMINRegisterOut } from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { exportDateRangespace } from "@/components/shared/Options";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { rangePresets } from "@/General";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string(),
});

const TransactionOut = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let { date } = formData;
    let dataString = "";
    if (date) {
      dataString = exportDateRangespace(date);
    }
    let payload = {
      min_types: formData.types,
      data: dataString,
    };
    const response = await execFun(
      () => fetchListOfMINRegisterOut(payload),
      "fetch"
    );
    let { data } = response;
    if (data.success) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(arr);
    } else {
    }
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
      headerName: "Pick Slip No.",
      field: "PICKSLIPNNO",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Cost Center",
      field: "COSTCENTER",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Date & Time",
      field: "DATE",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Type",
      field: "TYPE",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Part No",
      field: "PART",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Component",
      field: "COMPONENT",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Box No.",
      field: "FROMLOCATION",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "Qty",
      field: "OUTQTY",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "UoM",
      field: "UNIT",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Vendor Name",
      field: "CUSTOMER",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Approved By",
      field: "ISSUEBY",
      filter: "agTextColumnFilter",
      width: 190,
    },
  ];
  const type = [
    {
      label: "Part Wise",
      value: "part-wise",
    },
    {
      label: "Box Wise",
      value: "box-wise",
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Transaction Out Register");
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
            {/* )} */}{" "}
            <div className="flex gap-[10px] justify-end  px-[5px]">
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                //   onClick={() => {
                //     fetchBOMList();
                //   }}
              >
                Search
              </Button>
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
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
        />
      </div>
    </Wrapper>
  );
};

export default TransactionOut;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
