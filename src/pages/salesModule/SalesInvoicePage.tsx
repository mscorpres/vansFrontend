import React, { useCallback, useEffect, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Input, Space } from "antd";
import Select from "react-select";
import { columnDefs } from "@/config/agGrid/SalesInvoiceTableColumns";
import { RootState } from "@/store";
import { downloadEInvoiceList, fetchSalesOrderInvoiceList } from "@/features/salesmodule/salesInvoiceSlice";
import { setDateRange } from "@/features/salesmodule/SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import moment from "moment";
import dayjs from "dayjs";
import { rangePresets } from "@/General";
import { useToast } from "@/components/ui/use-toast";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "Invoice Number Wise", value: "soinvid_wise" },
];

const defaultDateRange = [
  dayjs().subtract(3, "month").toDate(),
  dayjs().toDate(),
];

const SalesInvoicePage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { toast } = useToast();
  const [type, setType] = useState<{ label: string; value: string }>({
    label: "Date Wise",
    value: "date_wise",
  });
  const dispatch = useDispatch();
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const { data, loading } = useSelector((state: RootState) => state.sellInvoice);
  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const fields = type.value === "date_wise" ? ["type", "dateRange"] : ["type", "soinvid_wise"];
      const values = await form.validateFields(fields);
      let dataString = "";
      if (type.value === "date_wise" && values.dateRange) {
        const startDate = dayjs(values.dateRange[0]).format("DD-MM-YYYY");
        const endDate = dayjs(values.dateRange[1]).format("DD-MM-YYYY");
        dataString = `${startDate}-${endDate}`;
        dispatch(setDateRange(dataString as any));
      } else if (type.value === "soinvid_wise" && values.soinvid_wise) {
        dataString = values.soinvid_wise;
        dispatch(setDateRange(dataString as any));
      } else {
        toast({
          title: "Please provide a valid date range or invoice number",
          className: "bg-red-600 text-white items-center",
        });
        return;
      }

      const resultAction = await dispatch(
        fetchSalesOrderInvoiceList({ type: type.value, data: dataString }) as any
      ).unwrap();
      if (resultAction.code === "200") {
        setRowData(resultAction.data);
        setIsSearchPerformed(true);
        toast({
          title: "Invoice fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      }
    } catch (error: any) {
      if (error?.errorFields) return;
      toast({
        title: error?.message || "Failed to fetch Invoice",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const onGenerateReport = async () => {
    try {
      const fields = type.value === "date_wise" ? ["type", "reportDateRange"] : ["type", "soinvid_wise"];
      const values = await form.validateFields(fields);
      let dataString = "";
      if (type.value === "date_wise" && values.reportDateRange) {
        const startDate = dayjs(values.reportDateRange[0]).format("DD-MM-YYYY");
        const endDate = dayjs(values.reportDateRange[1]).format("DD-MM-YYYY");
        dataString = `${startDate}-${endDate}`;
      } else if (type.value === "soinvid_wise" && values.soinvid_wise) {
        dataString = values.soinvid_wise;
      } else {
        toast({
          title: "Please provide a valid date range or invoice number for the report",
          className: "bg-red-600 text-white items-center",
        });
        return;
      }

      const resultAction = await dispatch(
        downloadEInvoiceList({ type: type.value, data: dataString }) as any
      ).unwrap();
      if (resultAction.success) {
        const filePath = resultAction.data?.filePath || resultAction.data?.file_path;
        if (!filePath) throw new Error("No file path returned in response");
        const link = document.createElement("a");
        link.href = filePath;
        link.download = `tax_invoice_${moment().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Report downloaded successfully",
          className: "bg-green-600 text-white items-center",
        });
      } else {
        throw new Error(resultAction.message || "Failed to download report");
      }
    } catch (error: any) {
      if (error?.errorFields) return;
      toast({
        title: error?.message || "Failed to download report",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  const onBtExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsCsv();
  }, []);

  useEffect(() => {
    setRowData(data as any);
  }, [data]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
    if (type.value === "soinvid_wise") {
      form.setFieldsValue({ dateRange: undefined, reportDateRange: undefined, soinvid_wise: "" });
    } else if (type.value === "date_wise") {
      form.setFieldsValue({ dateRange: defaultDateRange, reportDateRange: defaultDateRange, soinvid_wise: undefined });
    } else {
      form.setFieldsValue({ dateRange: undefined, reportDateRange: undefined, soinvid_wise: undefined });
    }
  }, [type, form]);

  useEffect(() => {
    form.setFieldsValue({
      type: { label: "Date Wise", value: "date_wise" },
      dateRange: defaultDateRange,
      reportDateRange: defaultDateRange,
    });
  }, [form]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {loading && <FullPageLoading />}
      {/* Filter Section */}
      <div className="bg-white px-5 py-4 border-b border-slate-200/80 shadow-sm">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="flex flex-wrap items-end gap-5">
            <Form.Item
              className="w-[300px] m-0"
              name="type"
              label="Filter Type"
              rules={[{ required: true, message: "Filter type is required" }]}
            >
              <Select
                styles={customStyles}
                components={{ DropdownIndicator }}
                placeholder="Select Type"
                className="border-0 basic-single"
                classNamePrefix="select border-0"
                isClearable={true}
                isSearchable={true}
                options={wises}
                value={type}
                onChange={(selected) => {
                  const newType = selected || { label: "Date Wise", value: "date_wise" };
                  setType(newType);
                  form.setFieldsValue({ type: newType });
                }}
              />
            </Form.Item>

            {type.value === "date_wise" && (
              <Form.Item
                className="w-[300px] m-0"
                name="dateRange"
                label="Date Range"
                rules={[{ required: type.value === "date_wise", message: "Date range is required" }]}
              >
                <Space direction="vertical" size={12} className="w-full">
                  <RangePicker
                    className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                    value={
                      form.getFieldValue("dateRange") &&
                      Array.isArray(form.getFieldValue("dateRange"))
                        ? [
                            dayjs(form.getFieldValue("dateRange")[0]),
                            dayjs(form.getFieldValue("dateRange")[1]),
                          ]
                        : undefined
                    }
                    onChange={(value) =>
                      form.setFieldsValue({
                        dateRange: value ? value.map((d) => d!.toDate()) : [],
                      })
                    }
                    format={dateFormat}
                    presets={rangePresets}
                  />
                </Space>
              </Form.Item>
            )}
            {type.value === "soinvid_wise" && (
              <Form.Item
                className="w-[300px] m-0"
                name="soinvid_wise"
                label="Invoice Number"
                rules={[{ required: type.value === "soinvid_wise", message: "Invoice number is required" }]}
              >
                <Input placeholder="Invoice number" />
              </Form.Item>
            )}

            <div className="flex gap-2 items-center">
              {isSearchPerformed && (
                <Button
                  type="button"
                  onClick={onBtExport}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg shadow-sm"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg shadow-sm"
              >
                Search
              </Button>
            </div>

            {type.value === "date_wise" && (
              <>
                <Form.Item
                  className="w-[300px] m-0"
                  name="reportDateRange"
                  label="Report Date Range"
                  rules={[{ required: type.value === "date_wise", message: "Report date range is required" }]}
                >
                  <Space direction="vertical" size={12} className="w-full">
                    <RangePicker
                      className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                      value={
                        form.getFieldValue("reportDateRange") &&
                        Array.isArray(form.getFieldValue("reportDateRange"))
                          ? [
                              dayjs(form.getFieldValue("reportDateRange")[0]),
                              dayjs(form.getFieldValue("reportDateRange")[1]),
                            ]
                          : undefined
                      }
                      onChange={(value) =>
                        form.setFieldsValue({
                          reportDateRange: value ? value.map((d) => d!.toDate()) : [],
                        })
                      }
                      format={dateFormat}
                      presets={rangePresets}
                    />
                  </Space>
                </Form.Item>
                <Button
                  type="button"
                  onClick={onGenerateReport}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg h-9 shadow-sm"
                >
                  Download Report
                </Button>
              </>
            )}
            {type.value === "soinvid_wise" && (
              <Button
                type="button"
                onClick={onGenerateReport}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg h-9 shadow-sm"
              >
                Download Report
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* Grid Section - same options as RegisterSalesOrderPage */}
      <div className="ag-theme-quartz flex-1">
        <AgGridReact
          ref={gridRef}
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{ filter: true, sortable: true }}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default SalesInvoicePage;
