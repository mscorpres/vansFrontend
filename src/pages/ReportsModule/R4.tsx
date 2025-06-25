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
import { IoMdDownload, IoIosRefresh } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { Input } from "@/components/ui/input";
import { InputStyle } from "@/constants/themeContants";

// Define the form schema
const FormSchema = z.object({
  primarySearch: z.string().optional(),
  secondarySearch: z.string().optional(),
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
  const gridRef = useRef<AgGridReact>(null);

  // Debounced filter update
  const debouncedFilter = debounce((formValues: z.infer<typeof FormSchema>) => {
    const { primarySearch, secondarySearch } = formValues;
    if (!primarySearch && !secondarySearch) {
      setRowData(originalRowData);
      setShowList(false);
    } else {
      const filteredData = searchData(primarySearch || "", secondarySearch || "");
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

  // Advanced search function
  const searchData = (primaryQuery: string, secondaryQuery: string): RowData[] => {
    const primaryTerms = primaryQuery
      .toLowerCase()
      .trim()
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);
    const secondaryTerms = secondaryQuery
      .toLowerCase()
      .trim()
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    if (primaryTerms.length === 0 && secondaryTerms.length === 0) {
      return originalRowData;
    }

    return originalRowData.filter((item) => {
      const description = item.c_specification?.toLowerCase() || "";

      // Check primary terms
      const matchesPrimary = primaryTerms.length === 0 || primaryTerms.every((term) => {
        if (term.endsWith("%")) {
          return description.includes(term);
        }
        if (/^\d+$/.test(term)) {
          return description.includes(term);
        }
        const regex = new RegExp(`\\b${term}\\b`, "i");
        return regex.test(description) || description.includes(term);
      });

      // Check secondary terms
      const matchesSecondary = secondaryTerms.length === 0 || secondaryTerms.every((term) => {
        if (term.endsWith("%")) {
          return description.includes(term);
        }
        if (/^\d+$/.test(term)) {
          return description.includes(term);
        }
        const regex = new RegExp(`\\b${term}\\b`, "i");
        return regex.test(description) || description.includes(term);
      });

      return matchesPrimary && matchesSecondary;
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

  // Reset search
  const handleResetSearch = () => {
    form.resetFields();
    setRowData(originalRowData);
    setShowList(false);
  };

  const fetchQueryResults = async () => {
    const value = await form.validateFields();
    if (value.primarySearch || value.secondarySearch) {
      setShowList(true);
      const filteredData = searchData(value.primarySearch || "", value.secondarySearch || "");
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
        const primarySearch = form.getFieldValue("primarySearch")?.toLowerCase();
        const secondarySearch = form.getFieldValue("secondarySearch")?.toLowerCase();
        const searchValue = [primarySearch, secondarySearch].filter(Boolean).join(",");
        if (searchValue && params.value?.toLowerCase().includes(searchValue)) {
          return { backgroundColor: "#FFFF99" };
        }
        return null;
      },
    },
    { headerName: "Total Stock", field: "stock", filter: "agNumberColumnFilter", width: 150 },
    { headerName: "Navs Stock", field: "navStock", filter: "agNumberColumnFilter", width: 150 },
    { headerName: "Vans Stock", field: "vansStock", filter: "agNumberColumnFilter", width: 150 },
    { headerName: "Silicon Stock", field: "siliconStock", filter: "agNumberColumnFilter", width: 150 },
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
        <Form form={form} layout="inline" onValuesChange={handleSearchChange}>
          <Form.Item name="primarySearch" className="mb-0">
            <Input
              className={InputStyle}
              placeholder="Primary terms (e.g., RES,5%)"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="secondarySearch" className="mb-0">
            <Input
              className={InputStyle}
              placeholder="Secondary terms (e.g., 1%,2512)"
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button onClick={handleResetSearch}>Reset Search</Button>
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
        {loading1("fetch") && "fetch" in loading1 && <FullPageLoading />}
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true, floatingFilter: false }}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
          rowBuffer={20}
          ensureDomOrder={true}
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
    overflow-y: auto !important;
  }
`;