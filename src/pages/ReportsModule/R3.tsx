import { useCallback, useEffect, useState } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LableStyle } from "@/constants/themeContants";
import { Edit2, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Divider, Space } from "antd";

import Select from "react-select";
import useApi from "@/hooks/useApi";

import { fetchBomForProduct, fetchR3 } from "@/components/shared/Api/masterApi";
import FullPageLoading from "@/components/shared/FullPageLoading";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import {
  transformOptionBomData,
  transformOptionData,
} from "@/helper/transform";
import { exportDateRangespace } from "@/components/shared/Options";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  date: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
  types: z.string().optional(),
  bom: z.string().optional(),
  part: z.string().optional(),
});

const R3 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [asyncOptions, setAsyncOptions] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const thebranch = form.watch("part");
  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    let { date } = formData;
    let dataString = exportDateRangespace(date);

    let payload = {
      product: formData.part,
      subject: formData.bom,
      date: dataString,
    };
    // return;
    const response = await execFun(() => fetchR3(payload), "fetch");
    let { data } = response;
    if (data.code == 200) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(arr);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700 text-white",
      });
    }
  };
  const fetchBom = async (payload) => {
    const response = await execFun(() => fetchBomForProduct(payload), "fetch");
    if (response.data.code == 200) {
      let { data } = response;
      let arr = data.data.map((r) => {
        return {
          ...r,
        };
      });
      setAsyncOptions(transformOptionBomData(arr));
    }
  };
  useEffect(() => {
    if (thebranch) {
      fetchBom(thebranch);
    }
  }, [thebranch]);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "SKU",
      field: "sku",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Part Code",
      field: "part_code",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Part Name",
      field: "part_name",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Category",
      field: "category",
      filter: "agTextColumnFilter",
      width: 190,
    },

    {
      headerName: "Status",
      field: "status",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Alternate of",
      field: "alternat_of",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "BOM Qty",
      field: "bom_qty",
      filter: "agTextColumnFilter",
      width: 220,
    },
    {
      headerName: "UOM",
      field: "uom",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Opening",
      field: "opening",
      filter: "agTextColumnFilter",
      width: 220,
    },

    {
      headerName: "Inward",
      field: "inward",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Outward",
      field: "outward",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Closing",
      field: "closing",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Order In Transit",
      field: "ord_in_transit",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Last Purchase Price",
      field: "last_purch_price",
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
            className="space-y-6 overflow-hidden p-[10px] h-[470px]"
          >
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <ReusableAsyncSelect
                      placeholder="Part Name"
                      endpoint="/backend/fetchProduct"
                      transform={transformOptionData}
                      onChange={(e) => form.setValue("part", e?.value)}
                      // value={selectedCustomer}
                      fetchOptionWith="payload"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="bom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LableStyle}>BOM</FormLabel>
                  <FormControl>
                    <Select
                      styles={customStyles}
                      components={{ DropdownIndicator }}
                      placeholder="Branch"
                      className="border-0 basic-single"
                      classNamePrefix="select border-0"
                      isDisabled={false}
                      isClearable={true}
                      isSearchable={true}
                      options={asyncOptions}
                      onChange={(e) => form.setValue("bom", e?.value)}
                      // onChange={(e) => console.log(e)}
                      // value={
                      //   data.clientDetails
                      //     ? {
                      //         label: data.clientDetails.city.name,
                      //         value: data.clientDetails.city.name,
                      //       }
                      //     : null
                      // }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        format={dateFormat}
                      />
                    </Space>
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

export default R3;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
