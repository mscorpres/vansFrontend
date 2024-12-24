import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import styled from "styled-components";
import { DatePicker, Form } from "antd";
import useApi from "@/hooks/useApi";
import {
  fetchCloseStock,
  fetchR4,
  fetchR4refreshed,
} from "@/components/shared/Api/masterApi";
import { IoMdDownload } from "react-icons/io";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { IoIosRefresh } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { InputStyle } from "@/constants/themeContants";
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

const R4 = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [showList, setShowList] = useState(false);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const [isAnimating, setIsAnimating] = useState(false);
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
      const response = await execFun(() => fetchR4(), "fetch");
      setRowData([]);
      let { data } = response;
      if (data.success) {
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
          title: response?.data.message,
          className: "bg-red-700 text-white",
        });
      }
    }
  };
  const getRefreshed = async () => {
    const response = await execFun(() => fetchR4refreshed(), "fetch");
    console.log("response", response);
    let { data } = response;
    if (data.success) {
      let arr = data.data.map((r, index) => {
        return {
          id: index + 1,
          ...r,
        };
      });

      setRowData(arr);
      setShowList(false);
      fetchQueryResults();
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
    // Perform the action
  };

  const columnDefs: ColDef<rowData>[] = [
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
    },
    {
      headerName: "Part Name",
      field: "name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      width: 190,
    },
    {
      headerName: "Description",
      field: "c_specification",
      filter: "agTextColumnFilter",
      width: 320,
    },

    {
      headerName: "Total Stock",
      field: "stock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    // {
    //   headerName: "Refresh Stock",
    //   field: "Refresh",
    //   filter: "agTextColumnFilter",
    //   width: 150,
    //   cellRenderer: (params) => {
    //     // Assume you have a unique row id like params.data.id or params.rowIndex
    //     const uniqueId = params.data.id || params.rowIndex;

    //     return (
    //       <div>
    //         <IoIosRefresh
    //           color="#3b82f6"
    //           onClick={() => handleClick(uniqueId, params)}
    //           className={`transition-transform duration-100 ${
    //             isAnimating === uniqueId ? "rotate-180" : ""
    //           }`}
    //           style={{ cursor: "pointer" }}
    //         />{" "}
    //       </div>
    //     );
    //   },
    // },

    {
      headerName: "Navs Stock",
      field: "navStock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Vans Stock",
      field: "vansStock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Silicon Stock",
      field: "siliconStock",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Stock Time",
      field: "closing_stock_time",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Make",
      field: "make",
      filter: "agTextColumnFilter",
      width: 180,
    },
    {
      headerName: "SOQ",
      field: "soq",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "MOQ",
      field: "moq",
      filter: "agTextColumnFilter",
      width: 150,
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
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "R4 All Item Closing Stock");
  };

  useEffect(() => {
    fetchQueryResults();
  }, []);

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
              onClick={getRefreshed}
            >
              <IoIosRefresh />
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

export default R4;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
