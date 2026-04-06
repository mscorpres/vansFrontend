// import { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { AgGridReact } from "ag-grid-react";
// import { Button } from "@/components/ui/button";
// import { customStyles } from "@/config/reactSelect/SelectColorConfig";
// import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { LableStyle } from "@/constants/themeContants";
// import { Edit2, Filter } from "lucide-react";
// import styled from "styled-components";
// import { DatePicker, Divider, Space } from "antd";

// import Select from "react-select";
// import useApi from "@/hooks/useApi";

// import { fetchBomForProduct, fetchR3 } from "@/components/shared/Api/masterApi";
// import FullPageLoading from "@/components/shared/FullPageLoading";
// import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
// import {
//   transformOptionBomData,
//   transformOptionData,
// } from "@/helper/transform";
// import { exportDateRangespace } from "@/components/shared/Options";
// import { toast } from "@/components/ui/use-toast";
// import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
// import { downloadCSV } from "@/components/shared/ExportToCSV";
// import { IoMdDownload } from "react-icons/io";
// import { rangePresets } from "@/General";
// import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

// const FormSchema = z.object({
//   date: z
//     .array(z.date())
//     .length(2)
//     .optional()
//     .refine((data) => data === undefined || data.length === 2, {
//       message: "Please select a valid date range.",
//     }),
//   types: z.string().optional(),
//   bom: z.string().optional(),
//   part: z.string().optional(),
// });

// const R3 = () => {
//   const [rowData, setRowData] = useState<RowData[]>([]);
//   const [asyncOptions, setAsyncOptions] = useState([]);
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   });
//   const { execFun, loading: loading1 } = useApi();
//   const { RangePicker } = DatePicker;

//   const dateFormat = "YYYY/MM/DD";

//   const thebranch = form.watch("part");
//   const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
//     setRowData([]);
//     let { date } = formData;
//     let dataString = exportDateRangespace(date);

//     let payload = {
//       product: formData.part,
//       subject: formData.bom,
//       date: dataString,
//     };
//     const response = await execFun(() => fetchR3(payload), "fetch");
//     let { data } = response;
//     if (data.success) {
//       let arr = data.data.map((r, index) => {
//         return {
//           id: index + 1,
//           status1: r.status == "A" ? "Active" : "I" ? "Inactive" : "Alternate",
//           category1: r.category == "P" ? "Part" : "Packaging",
//           ...r,
//         };
//       });

//       setRowData(arr);
//     } else {
//       toast({
//         title: response.data.message,
//         className: "bg-red-700 text-white",
//       });
//     }
//   };
//   const fetchBom = async (payload) => {
//     const response = await execFun(() => fetchBomForProduct(payload), "fetch");
//     if (response.data.success) {
//       let { data } = response;
//       let arr = data.data.map((r) => {
//         return {
//           ...r,
//         };
//       });
//       setAsyncOptions(transformOptionBomData(arr));
//     }
//   };
//   useEffect(() => {
//     if (thebranch) {
//       fetchBom(thebranch);
//     }
//   }, [thebranch]);

//   const columnDefs: ColDef<rowData>[] = [
//     {
//       headerName: "ID",
//       field: "id",
//       filter: "agNumberColumnFilter",
//       width: 90,
//     },
//     {
//       headerName: "SKU",
//       field: "sku",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//     {
//       headerName: "Part Code",
//       field: "part_code",
//       filter: "agTextColumnFilter",
//       cellRenderer: CopyCellRenderer,
//       width: 190,
//     },
//     {
//       headerName: "Component",
//       field: "part_name",
//       filter: "agTextColumnFilter",
//       cellRenderer: CopyCellRenderer,
//       width: 220,
//     },
//     {
//       headerName: "Category",
//       field: "category1",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//     {
//       headerName: "Status",
//       field: "status1",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//     {
//       headerName: "Alternate of",
//       field: "alternat_of",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//     {
//       headerName: "BOM Qty",
//       field: "bom_qty",
//       filter: "agTextColumnFilter",
//       width: 220,
//     },
//     {
//       headerName: "UOM",
//       field: "uom",
//       filter: "agTextColumnFilter",
//       width: 220,
//     },
//     {
//       headerName: "Opening",
//       field: "opening",
//       cellRenderer: CopyCellRenderer,
//       filter: "agTextColumnFilter",
//       width: 220,
//     },
//     {
//       headerName: "Inward",
//       field: "inward",
//       filter: "agTextColumnFilter",
//       cellRenderer: CopyCellRenderer,
//       width: 190,
//     },
//     {
//       headerName: "Outward",
//       field: "outward",
//       filter: "agTextColumnFilter",
//       cellRenderer: CopyCellRenderer,
//       width: 190,
//     },
//     {
//       headerName: "Closing",
//       field: "closing",
//       filter: "agTextColumnFilter",
//       cellRenderer: CopyCellRenderer,
//       width: 190,
//     },
//     {
//       headerName: "Order In Transit",
//       field: "ord_in_transit",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//     {
//       headerName: "Last Purchase Price",
//       field: "last_purch_price",
//       filter: "agTextColumnFilter",
//       width: 190,
//     },
//   ];
//   const type = [
//     {
//       label: "Pending",
//       value: "P",
//     },
//     {
//       label: "All",
//       value: "A",
//     },
//     {
//       label: "Project",
//       value: "PROJECT",
//     },
//   ];
//   const handleDownloadExcel = () => {
//     downloadCSV(rowData, columnDefs, "R3 BOM Wise Report");
//   };
//   return (
//     <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
//       {/* Filter Section */}
//       <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(fetchQueryResults)}
//               className="flex items-center gap-4"
//             >
//               <FormField
//                 control={form.control}
//                 name="part"
//                 render={({ field }) => (
//                   <FormItem className="w-[300px] m-0">
//                     <FormControl>
//                       <ReusableAsyncSelect
//                         placeholder="Part Name"
//                         endpoint="/backend/fetchProduct"
//                         transform={transformOptionData}
//                         onChange={(e) => form.setValue("part", e?.value)}
//                         fetchOptionWith="querySearchTerm"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="bom"
//                 render={({ field }) => (
//                   <FormItem className="w-[300px] m-0">
//                     <FormControl>
//                       <Select
//                         styles={customStyles}
//                         components={{ DropdownIndicator }}
//                         placeholder="BOM"
//                         className="border-0 basic-single"
//                         classNamePrefix="select border-0"
//                         isDisabled={false}
//                         isClearable={true}
//                         isSearchable={true}
//                         options={asyncOptions}
//                         onChange={(e) => form.setValue("bom", e?.value)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <FormItem className="w-[300px] m-0">
//                     <FormControl>
//                       <Space direction="vertical" size={12} className="w-full">
//                         <RangePicker
//                           className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
//                           onChange={(value) =>
//                             field.onChange(
//                               value ? value.map((date) => date!.toDate()) : []
//                             )
//                           }
//                           format={dateFormat}
//                           presets={rangePresets}
//                         />
//                       </Space>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <div className="flex gap-2">
//                 <Button
//                   type="submit"
//                   className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
//                 >
//                   Search
//                 </Button>
//                 <Button
//                   className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
//                   disabled={rowData.length === 0}
//                   onClick={(e: any) => {
//                     e.preventDefault();
//                     handleDownloadExcel();
//                   }}
//                 >
//                   <IoMdDownload size={20} />
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//       </div>

//       {/* Grid Section */}
//       <div className="ag-theme-quartz flex-1">
//         {loading1("fetch") && <FullPageLoading />}
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={{ filter: true, sortable: true }}
//           pagination={true}
//           paginationPageSize={10}
//           paginationAutoPageSize={true}
//           suppressCellFocus={true}
//           overlayNoRowsTemplate={OverlayNoRowsTemplate}
//           enableCellTextSelection={true}
//         />
//       </div>
//     </Wrapper>
//   );
// };

// export default R3;

// const Wrapper = styled.div`
//   .ag-theme-quartz .ag-root-wrapper {
//     border-top: 0;
//     border-bottom: 0;
//   }
// `;

//########################(MATERIAL INWARD REPORT)########################

import React, { useMemo } from "react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Input } from "@/components/ui/input";
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
import moment from "moment";

import useApi from "@/hooks/useApi";

import { fetchR3 } from "@/components/shared/Api/masterApi";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";

const FormSchema = z.object({
  date: z
    .date()
    .optional(),
  types: z.string().optional(),
  search: z.string().optional(),
});

const R3 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { execFun, loading: loading1 } = useApi();

  const dateFormat = "DD/MM/YYYY";
  const theType = form.watch("types");

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    setRowData([]);
    let { date, search } = formData;
    let dataString = "";

    if (date) {
      // Format single date as DD-MM-YYYY for the backend
      dataString = moment(date).format("DD-MM-YYYY");
    } else {
      dataString = search;
    }
    let payload = {
      wise: formData.types,
      data: dataString,
    };

    const response = await execFun(() => fetchR3(payload), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = data.response.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(arr);
    } else {
    }
  };

  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R3 MIN Report");
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
      headerName: "Date & Time",
      field: "datetime",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Transaction ID",
      field: "transaction",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 200,
    },
    {
      headerName: "Print ID",
      field: "print_id",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 200,
    },
    {
      headerName: "Part Code",
      field: "partcode",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 180,
    },
    {
      headerName: "Vendor Name",
      field: "vendorname",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Inward Qty",
      field: "inqty",
      filter: "agNumberColumnFilter",
      width: 130,
    },
    {
      headerName: "Invoice No",
      field: "invoice",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 150,
    },
    {
      headerName: "Inward By",
      field: "inby",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Cost Center",
      field: "c_center",
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "Mode",
      field: "mode",
      filter: "agTextColumnFilter",
      width: 100,
    },
  ];

  const type = [
    {
      label: "Date Wise",
      value: "datewise",
    },
    {
      label: "MIN Wise",
      value: "minwise",
    },
  ];

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {/* Filter Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(fetchQueryResults)}
              className="flex items-center gap-4"
            >
              <FormField
                control={form.control}
                name="types"
                render={({ field }) => (
                  <FormItem className="w-[300px] m-0">
                    <FormControl>
                      <Select
                        styles={customStyles}
                        components={{ DropdownIndicator }}
                        placeholder="Select Search Type"
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
              />
              {theType === "minwise" ? (
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="w-[300px] m-0">
                      <FormControl>
                        <Input
                          className={InputStyle}
                          placeholder="Search MIN Transaction ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="w-[300px] m-0">
                      <FormControl>
                        <Space direction="vertical" size={12} className="w-full">
                          <DatePicker
                            className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                            placeholder="Select Date (Up to this date)"
                            onChange={(value) =>
                              field.onChange(value ? value.toDate() : null)
                            }
                            format={dateFormat}
                          />
                        </Space>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                >
                  Search
                </Button>
                <Button
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
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
      </div>

      {/* Grid Section */}
      <div className="ag-theme-quartz flex-1">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          suppressCellFocus={true}
          enableCellTextSelection={true}
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