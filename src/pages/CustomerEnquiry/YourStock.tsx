import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { DatePicker, Form, Typography } from "antd";
import useApi from "@/hooks/useApi";
import { modelFixHeaderStyle } from "@/constants/themeContants";
import {
  fetchCloseStock,
  fetchR4,
  fetchR4refreshed,
  getallItemClosingStock,
  getCustomerStock,
  refreshStock,
  saveCustStockremark,
} from "@/components/shared/Api/masterApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { commonAgGridConfig } from "@/config/agGrid/commongridoption";
import { IoIosRefresh } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { InputStyle } from "@/constants/themeContants";

import { CheckBox } from "@mui/icons-material";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TextInputCellRenderer from "@/shared/TextInputCellRenderer";
import { set } from "lodash";
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

const YourStock = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [showList, setShowList] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [isAnimating, setIsAnimating] = useState(false);
  const gridRef = useRef<AgGridReact<RowData>>(null);
  const [rowDataBoxes, setRowDataBoxes] = useState<RowData[]>([
    {
      isNew: true,
      part_no: "",
      name: "",
      cust_part_code: "",
      qty: "",
      dueDate: "",
      remark: "",
    },
  ]);
  //   const { addToast } = useToastContainer()
  const { RangePicker } = DatePicker;

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData: z.infer<typeof FormSchema>) => {
    const value = await form.validateFields();
    if (value.search && rowData) {
      setShowList(true);
      let a = rowData.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(value?.search?.toLowerCase())
      );
      setRowData(a);
    } else {
      const response = await execFun(() => getCustomerStock(), "fetch");

      setRowData([]);
      let { data } = response;
      if (data.success || data.status == "success") {
        let arr = data.data.map((r, index) => {
          return {
            id: index + 1,
            ...r,
          };
        });

        setRowData(arr);
        setShowList(false);
      } else {
        toast({
          title: response?.data.message?.msg,
          className: "bg-red-700 text-white",
        });
      }
    }
  };
  const submitEnq = async () => {
    setLoading(true);
    let payload = {
      component_key: rowDataBoxes.map((rowData) => rowData.component_key),
      reqQty: rowDataBoxes.map((rowData) => rowData.stock),
      deliveryDate: rowDataBoxes.map((rowData) => rowData.dueDate),
      remark: rowDataBoxes.map((rowData) => rowData.remark),
      partCode: rowDataBoxes.map((rowData) => rowData.part_no),
    };

    const response = await execFun(() => saveCustStockremark(payload), "fetch");
    if (response?.data?.success || response?.data?.status == "success") {
      toast({
        title: response?.data.message,
        className: "bg-green-700 text-white",
      });
      setSheetOpen(false);
      setRowDataBoxes([]);
      fetchQueryResults();
      setLoading(false);
    } else {
      toast({
        title: response?.data.message,
        className: "bg-red-700 text-white",
      });
      setLoading(false);
    }
    setLoading(false);
  };
  const getRefreshed = async () => {
    const response = await execFun(() => refreshStock(), "fetch");
    let { data } = response;
    if (data.success) {
      setShowList(false);
      fetchQueryResults();
      toast({
        title: data.message,
        className: "bg-green-700 text-white",
      });
    } else {
      toast({
        title: response?.data.message,
        className: "bg-red-700 text-white",
      });
    }
  };
  const searchData = (query: string) =>
    rowData.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())
    );
  const handleClick = async (id, params) => {
    setIsAnimating(id);

    // Reset the animation after 500ms (or the duration of the animation)
    setTimeout(() => {
      setIsAnimating(null);
    }, 500);

    const response = await execFun(
      () => fetchCloseStock(params.data.component_key),
      "fetch"
    );
    if (response.data.success) {
      setRowData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                navsStock: response.data.data.navsStock,
                stock: response.data.data.stock,
                closing_stock_time: response.data.data.closing_stock_time,
              }
            : item
        )
      );
    }
  };
  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);

    setSelectedRows(selectedData);
    let a = selectedData.map((item) => ({
      ...item,
      isNew: true,
    }));
    setRowDataBoxes(a);
    // Set the modified selected rows
    // setSelectedRows(modifiedSelectedData);
  };
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
  const columnDefs: ColDef<rowData>[] = [
    {
      headerCheckboxSelection: true, // To show a header checkbox
      checkboxSelection: true, // Enable checkbox in the cell
      width: 50,
    },
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part Code",
      field: "part_no",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 140,
      editable: false,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 250,
      editable: false,
    },
    {
      headerName: "Customer Part Code",
      field: "cust_part_code",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
      editable: false,
    },
    {
      headerName: "Customer Part Name",
      field: "cust_comp",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 210,
      editable: false,
    },

    {
      headerName: "Stock",
      field: "stock",
      filter: "agTextColumnFilter",
      width: 150,
      editable: false,
    },

    // {
    //   headerName: "Stock Time",
    //   field: "closing_stock_time",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    //   editable: false,
    // },
    {
      headerName: "SOQ",
      field: "soq",
      filter: "agTextColumnFilter",
      width: 150,
      editable: false,
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
  const columnBoxesDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      width: 90,
    },
    {
      headerName: "Part No.",
      field: "name",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Part Name",
      field: "part_no",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Customer Part No.",
      field: "cust_part_code",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Required Qty",
      field: "stock",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Delivery Date",
      field: "dueDate",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
    {
      headerName: "Remark",
      field: "remark",
      //   editable: false,
      flex: 1,
      cellRenderer: "textInputCellRenderer",
      minWidth: 200,
    },
  ];

  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "Your Stock Report");
  };

  useEffect(() => {
    fetchQueryResults();
  }, []);
  const components = useMemo(
    () => ({
      textInputCellRenderer: (props: any) => (
        <TextInputCellRenderer
          {...props}
          setRowData={setRowDataBoxes}
          rowData={rowDataBoxes}
        />
      ),
    }),
    []
  );

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff] ">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px] justify-center">
          <Form form={form} layout="vertical">
            <Form.Item name="search" label="Search">
              <Input
                className={InputStyle}
                placeholder="Enter Search"
                // {...field}
              />
            </Form.Item>
          </Form>
          <div className="flex gap-[10px] w-full justify-space-between">
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={() => {
                fetchQueryResults();
              }}
            >
              Search
            </Button>
            <Button
              className=" bg-white text-black hover:bg-slate-200"
              onClick={() => {
                setSheetOpen(true);
              }}
            >
              Enquiry
            </Button>{" "}
            <Button
              className=" bg-white text-black hover:bg-slate-200"
              onClick={getRefreshed}
            >
              <IoIosRefresh />
            </Button>{" "}
            <Button
              // type="submit"
              className=" bg-white text-black hover:bg-slate-200"
              disabled={rowData.length === 0}
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadExcel();
              }}
              disabled={rowData.length == 0}
            >
              <IoMdDownload size={20} />
            </Button>
            {/* <div>
              {showList && (
                <a className="cursor-pointer p-[40px] mt-[50px]">Show List</a>
              )}
            </div> */}
          </div>
        </div>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {" "}
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          //   loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          //   defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          suppressCellFocus={false}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          checkboxSelection={true}
          rowSelection={"multiple"}
          onSelectionChanged={onSelectionChanged}
        />
      </div>{" "}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          className="min-w-[90%] p-0"
          onInteractOutside={(e: any) => {
            e.preventDefault();
          }}
        >
          <SheetHeader className={modelFixHeaderStyle}>
            <SheetTitle className="text-slate-600">Add to Enquire</SheetTitle>
          </SheetHeader>{" "}
          <div className="ag-theme-quartz h-[calc(100vh-100px)] w-full relative">
            {loading && <FullPageLoading />}
            <AgGridReact
              ref={gridRef}
              rowData={rowDataBoxes}
              columnDefs={columnBoxesDefs as (ColDef | ColGroupDef)[]}
              defaultColDef={{ filter: true, sortable: true }}
              pagination={true}
              paginationPageSize={10}
              paginationAutoPageSize={true}
              components={components}
              suppressCellFocus={true}
              overlayNoRowsTemplate={OverlayNoRowsTemplate}
            />{" "}
          </div>{" "}
          <div className="bg-white border-t shadow border-slate-300 h-[50px] flex items-center justify-end gap-[20px] px-[20px]">
            <div style={{ justifyContent: "flex-end" }}>
              <Button onClick={submitEnq}>Save</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Wrapper>
  );
};

export default YourStock;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
