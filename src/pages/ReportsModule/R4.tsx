import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { DatePicker, Form, Tooltip } from "antd";
import useApi from "@/hooks/useApi";
import { fetchCloseStock, fetchR4, fetchR4refreshed } from "@/components/shared/Api/masterApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { IoIosRefresh } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";

// Define the form schema
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

// Define row data type
interface RowData {
  id: number;
  part_no: string;
  name: string;
  c_specification: string;
  stock: string;
  navStock: string;
  vansStock: string;
  siliconStock: string;
  closing_stock_time: string;
  make: string;
  soq: string;
  moq: string;
  component_key: string;
}

const R4 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [originalRowData, setOriginalRowData] = useState<RowData[]>([]);
  const [showList, setShowList] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [isAnimating, setIsAnimating] = useState<number | null>(null);
  const { RangePicker } = DatePicker;
  const gridRef = useRef<AgGridReact>(null); // Reference to AG Grid

  const dateFormat = "YYYY/MM/DD";

  const fetchQueryResults = async (formData?: z.infer<typeof FormSchema>) => {
    const value = await form.validateFields();
    if (value.search && rowData) {
      setShowList(true);
      const filteredData = searchData(value.search);
      setRowData(filteredData);
      scrollToFirstMatch(filteredData);
    } else {
      const response = await execFun(() => fetchR4(), "fetch");
      let { data } = response;
      if (data.success) {
        let arr = data.data.map((r: any, index: number) => ({
          id: index + 1,
          ...r,
        }));
        setRowData(arr);
        setOriginalRowData(arr);
        setShowList(false);
      } else {
        toast({
          title: response?.data.message,
          className: "bg-red-700 text-white",
        });
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setRowData(originalRowData);
      setShowList(false);
    } else {
      const filteredData = searchData(searchValue);
      setRowData(filteredData);
      setShowList(true);
      scrollToFirstMatch(filteredData);
    }
  };

  // Search function to filter data
  const searchData = (query: string) =>
    originalRowData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );

  // Scroll to the first matching row
  const scrollToFirstMatch = (filteredData: RowData[]) => {
    if (gridRef.current && filteredData.length > 0) {
      const firstMatchIndex = rowData.findIndex(
        (row) =>
          row.c_specification.toLowerCase().includes(filteredData[0].c_specification.toLowerCase())
      );
      gridRef.current.api.ensureIndexVisible(firstMatchIndex, "top");
    }
  };

  const getRefreshed = async () => {
    const response = await execFun(() => fetchR4refreshed(), "fetch");
    let { data } = response;
    if (data.success) {
      let arr = data.data.map((r: any, index: number) => ({
        id: index + 1,
        ...r,
      }));
      setRowData(arr);
      setOriginalRowData(arr);
      setShowList(false);
      fetchQueryResults();
    } else {
      toast({
        title: response?.data.message,
        className: "bg-red-700 text-white",
      });
    }
  };

  const handleClick = async (id: number, params: any) => {
    setIsAnimating(id);
    setTimeout(() => setIsAnimating(null), 500);
    const response = await execFun(() => fetchCloseStock(params.data.component_key), "fetch");
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

  const columnDefs: any[] = [
    { headerName: "ID", field: "id", filter: "agNumberColumnFilter", width: 90 },
    {
      headerName: "Part Code",
      field: "part_no",
      filter: "agTextColumnFilter",
      // cellRenderer: CopyCellRenderer,
      width: 140,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      // cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Description",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 320,
      cellStyle: (params: any) => {
        const searchValue = form.getFieldValue("search")?.toLowerCase();
        if (searchValue && params.value?.toLowerCase().includes(searchValue)) {
          return { backgroundColor: "#FFFF99" }; // Highlight matching description
        }
        return null;
      },
    },
    { headerName: "Total Stock", field: "stock", filter: "agTextColumnFilter", width: 150 },
    { headerName: "Navs Stock", field: "navStock", filter: "agTextColumnFilter", width: 150 },
    { headerName: "Vans Stock", field: "vansStock", filter: "agTextColumnFilter", width: 150 },
    { headerName: "Silicon Stock", field: "siliconStock", filter: "agTextColumnFilter", width: 150 },
    { headerName: "Stock Time", field: "closing_stock_time", filter: "agTextColumnFilter", width: 150 },
    { headerName: "Make", field: "make", filter: "agTextColumnFilter", width: 180 },
    { headerName: "SOQ", field: "soq", filter: "agTextColumnFilter", width: 150 },
    { headerName: "MOQ", field: "moq", filter: "agTextColumnFilter", width: 150 },
  ];

  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R4 All Item Closing Stock");
  };

  useEffect(() => {
    fetchQueryResults();
  }, []);

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-4">
        <Form form={form} layout="vertical">
          <Form.Item name="search" className="mb-0">
            <Input
              className={InputStyle}
              placeholder="Enter Search (e.g., description)"
              onChange={handleSearchChange}
            />
          </Form.Item>
        </Form>
        <div className="flex items-center gap-2">
          <Tooltip title="Stock Refresh">
            <Button className="bg-white text-black hover:bg-slate-200" onClick={getRefreshed}>
              <IoIosRefresh />
            </Button>
          </Tooltip>
          <Button
            className="bg-white text-black hover:bg-slate-200"
            disabled={rowData.length === 0}
            onClick={(e: any) => {
              e.preventDefault();
              handleDownloadExcel();
            }}
          >
            <IoMdDownload size={20} />
          </Button>
        </div>
      </div>

      <div className="ag-theme-quartz flex-1">
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
          // Enable virtualized scrolling with a reasonable row buffer
          rowBuffer={20} // Adjust based on performance needs
          ensureDomOrder={true} // Ensures DOM order matches row order for scrolling
        />
      </div>
    </Wrapper>
  );
};

export default R4;

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
  .ag-theme-quartz .ag-body-viewport {
    overflow-y: auto !important; /* Ensure vertical scrolling */
  }
`;