import { useEffect, useState } from "react";
import { z } from "zod";
import { AgGridReact } from "ag-grid-react";

import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Space } from "antd";
import { toast } from "@/components/ui/use-toast";
import useApi from "@/hooks/useApi";
import { fetchListOfCompletedFgOut } from "@/components/shared/Api/masterApi";
import { exportDatepace } from "@/components/shared/Options";
import { downloadCSV } from "@/components/shared/ExportToCSV";
import { IoMdDownload } from "react-icons/io";
import { Button } from "@/components/ui/button";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useSelector } from "react-redux";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
const FormSchema = z.object({
  searchValue: z.string().optional(),
  datainp: z.string().optional(),
  dateRange: z
    .array(z.date())
    .length(2)
    .optional()
    .refine((data) => data === undefined || data.length === 2, {
      message: "Please select a valid date range.",
    }),
});

const ViewFgOut = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [form] = Form.useForm();
  const { execFun, loading: loading1 } = useApi();
  const { loading } = useSelector((state: RootState) => state.store);
  const fetchFGList = async () => {
    const values = await form.validateFields();
    let dataString = exportDatepace(values.dateRange);

    // return;
    let payload = { date: dataString, method: "O" };
    setRowData([]);
    const response = await execFun(
      () => fetchListOfCompletedFgOut(payload),
      "fetch"
    );
    // return;
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
      toast({
        title: response.data.message,
        className: "bg-red-700 text-center text-white",
      });
      setRowData([]);
    }
  };

  const type = [
    {
      label: "Date Wise",
      value: "datewise",
    },
    {
      label: "SKU Wise",
      value: "skuwise",
    },
    ,
  ];
  useEffect(() => {
    fetchFGList();
  }, []);

  const columnDefs: ColDef<rowData>[] = [
    {
      headerName: "ID",
      field: "id",
      filter: "agNumberColumnFilter",
      flex: 1,
    },
    {
      headerName: "SKU",
      field: "sku",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      flex: 1,
    },
    {
      headerName: "Product",
      field: "name",
      filter: "agTextColumnFilter",
      cellRenderer: CopyCellRenderer,
      flex: 1,
    },
    {
      headerName: "Out Qty",
      field: "approveqty",
      filter: "agTextColumnFilter",
      flex: 1,
    },
    {
      headerName: "Out By",
      field: "approveby",
      filter: "agTextColumnFilter",
      flex: 1,
    },
  ];
  const handleDownloadExcel = () => {
    downloadCSV(rowData, columnDefs, "FG Out");
  };
  const handleDateChange = (date: moment.Moment | null) => {
    data = date ? date.format("DD-MM-YYYY") : ""; // Format the date for storage
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
        <Form form={form}>
          <Form.Item className="w-full px-[5px]" name="dateRange">
            <Space direction="vertical" size={12} className="w-full">
              <DatePicker
                format="DD-MM-YYYY" // Set the format to dd-mm-yyyy
                onChange={(date, dateString) => {
                  // Use `date` to get the Date object, or `dateString` for formatted value
                  form.setFieldValue("dateRange", date ? date.toDate() : null);
                }}
                className="w-[100%] border-slate-400 shadow-none mt-[2px]"
              />
            </Space>
          </Form.Item>

          <div className="flex gap-[10px] justify-end  px-[5px]">
            {" "}
            <Button
              // type="submit"
              className="shadow bg-grey-700 hover:bg-grey-600 shadow-slate-500 text-grey"
              // onClick={() => {}}
              disabled={rowData.length === 0}
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadExcel();
              }}
              disabled={rowData.length == 0}
            >
              <IoMdDownload size={20} />
            </Button>
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              onClick={fetchFGList}
            >
              Search
            </Button>
          </div>
        </Form>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        {(loading || loading1("fetch")) && <FullPageLoading />}
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

export default ViewFgOut;
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;
