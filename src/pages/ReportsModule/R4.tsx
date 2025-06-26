import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { Form, Tooltip } from "antd";
import { debounce } from "lodash";
import useApi from "@/hooks/useApi";
import { fetchCloseStock, fetchR4, fetchR4refreshed } from "@/components/shared/Api/masterApi";
import { IoMdDownload, IoIosRefresh, IoMdClose } from "react-icons/io"; // Added IoMdClose
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";

// Define the form schema
const FormSchema = z.object({
  searchQuery: z.string().optional(),
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
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh loading
  const [isResetAnimating, setIsResetAnimating] = useState(false); // New state for reset animation
  const gridRef = useRef<AgGridReact>(null);

  // Debounced filter update
  const debouncedFilter = debounce((formValues: z.infer<typeof FormSchema>) => {
    const { searchQuery } = formValues;
    if (!searchQuery) {
      setRowData(originalRowData);
      setShowList(false);
    } else {
      const filteredData = searchData(searchQuery || "");
      setRowData(filteredData);
      setShowList(true);
      scrollToFirstMatch(filteredData);
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = () => {
    form.validateFields().then((values) => {
      debouncedFilter(values);
    });
  };

  // Simplified search function
  const searchData = (query: string): RowData[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      return originalRowData;
    }

    return originalRowData.filter((item) => {
      const searchableFields = [
        item.part_no?.toLowerCase() || "",
        item.name?.toLowerCase() || "",
        item.c_specification?.toLowerCase() || "",
        item.make?.toLowerCase() || "",
        item.soq?.toLowerCase() || "",
        item.moq?.toLowerCase() || "",
      ];
      return searchableFields.some((field) => field.includes(lowerQuery));
    });
  };

  // Scroll to the first matching row
  const scrollToFirstMatch = (filteredData: RowData[]) => {
    if (gridRef.current && filteredData.length > 0) {
      const firstMatchIndex = rowData.findIndex(
        (row) =>
          row.c_specification.toLowerCase().includes(filteredData[0].c_specification.toLowerCase())
      );
      if (firstMatchIndex !== -1) {
        gridRef.current.api.ensureIndexVisible(firstMatchIndex, "top");
      }
    }
  };

  // Reset search with animation
  const handleResetSearch = () => {
    setIsResetAnimating(true);
    form.resetFields();
    setRowData(originalRowData);
    setShowList(false);
    setTimeout(() => setIsResetAnimating(false), 300); // Animation duration
  };

  const fetchQueryResults = async () => {
    const value = await form.validateFields();
    if (value.searchQuery) {
      setShowList(true);
      const filteredData = searchData(value.searchQuery || "");
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

  const getRefreshed = async () => {
    setIsRefreshing(true); // Start loading animation
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
      form.resetFields();
    } else {
      toast({
        title: response?.data.message,
        className: "bg-red-700 text-white",
      });
    }
    setIsRefreshing(false); // Stop loading animation
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
                navStock: response.data.data.navStock,
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
      width: 140,
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: 190,
    },
    {
      headerName: "Description",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 320,
      cellStyle: (params: any) => {
        const searchQuery = form.getFieldValue("searchQuery")?.toLowerCase();
        if (searchQuery && params.value?.toLowerCase().includes(searchQuery)) {
          return { backgroundColor: "#FFFF99" };
        }
        return null;
      },
    },
    {
      headerName: "Total Stock",
      field: "stock",
      filter: "agNumberColumnFilter",
      width: 150,
      cellStyle: { backgroundColor: "#E9D8FD", color: "#4C1D95" }, // Purple theme
    },
    {
      headerName: "Navs Stock",
      field: "navStock",
      filter: "agNumberColumnFilter",
      width: 150,
      cellStyle: { backgroundColor: "#E9D8FD", color: "#4C1D95" },
    },
    {
      headerName: "Vans Stock",
      field: "vansStock",
      filter: "agNumberColumnFilter",
      width: 150,
      cellStyle: { backgroundColor: "#E9D8FD", color: "#4C1D95" },
    },
    {
      headerName: "Silicon Stock",
      field: "siliconStock",
      filter: "agNumberColumnFilter",
      width: 150,
      cellStyle: { backgroundColor: "#E9D8FD", color: "#4C1D95" },
    },
    {
      headerName: "Stock Time",
      field: "closing_stock_time",
      filter: "agTextColumnFilter",
      width: 150,
    },
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
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col bg-gray-50">
      <Header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between gap-4 shadow-sm">
        <Form form={form} layout="inline" onValuesChange={handleSearchChange}>
          <Form.Item name="searchQuery" className="mb-0">
            <StyledInput
              className={InputStyle}
              placeholder="Search part code, name, description, etc."
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <StyledButton
              variant="outline"
              onClick={handleResetSearch}
              className={isResetAnimating ? "animate-reset" : ""}
            >
              <IoMdClose size={20} />
            </StyledButton>
          </Form.Item>
        </Form>
        <div className="flex items-center gap-2">
          <Tooltip title="Refresh Stock Data">
            <StyledButton
              variant="outline"
              className="bg-white text-purple-800 hover:bg-purple-50"
              onClick={getRefreshed}
            >
              <IoIosRefresh size={20} className={isRefreshing ? "animate-spin" : ""} />
            </StyledButton>
          </Tooltip>
          <Tooltip title="Download as CSV">
            <StyledButton
              variant="outline"
              className="bg-white text-purple-800 hover:bg-purple-50"
              disabled={rowData.length === 0}
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadExcel();
              }}
            >
              <IoMdDownload size={20} />
            </StyledButton>
          </Tooltip>
        </div>
      </Header>

      <TableWrapper className="ag-theme-quartz flex-1">
        {loading1("fetch") && "fetch" in loading1 && (
          <FullPageLoading className="bg-purple-100/50" />
        )}
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            filter: true,
            sortable: true,
            floatingFilter: false,
            headerClass: "bg-purple-100 text-purple-800 font-semibold",
            cellClass: "text-gray-700",
          }}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
          rowBuffer={20}
          ensureDomOrder={true}
          animateRows={true}
        />
      </TableWrapper>
    </Wrapper>
  );
};

export default R4;

// Styled components for enhanced UI
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .ag-theme-quartz .ag-header {
    background-color: #f7fafc;
    border-bottom: 2px solid #6B46C1; /* Purple accent */
  }
  .ag-theme-quartz .ag-body-viewport {
    overflow-y: auto !important;
  }
  .ag-theme-quartz .ag-row {
    transition: background-color 0.2s ease;
  }
  .ag-theme-quartz .ag-row:hover {
    background-color: #f1f5f9;
  }
`;

const Header = styled.div`
  background-color: #ffffff;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const StyledInput = styled(Input)`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  &:focus {
    border-color: #6B46C1;
    box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
  }
`;

const StyledButton = styled(Button)`
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  &:hover {
    background-color: #f1f5f9;
    border-color: #6B46C1;
    color: #4C1D95;
    transform: scale(1.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.animate-reset {
    animation: resetAnimation 0.3s ease;
  }
  @keyframes resetAnimation {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(90deg) scale(1.2); }
    100% { transform: rotate(0deg) scale(1); }
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  .ag-theme-quartz {
    --ag-grid-size: 6px;
    --ag-header-background-color: #f7fafc;
    --ag-header-foreground-color: #4C1D95;
    --ag-row-hover-background-color: #f1f5f9;
    border-radius: 8px;
    overflow: hidden;
  }
`;