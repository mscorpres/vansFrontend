import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Space } from "antd";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchSellRequestList,
  setDateRange,
} from "@/features/salesmodule/SalesSlice";
import { RootState } from "@/store";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import { columnDefs } from "@/config/agGrid/SalesOrderRegisterTableColumns";
import { useToast } from "@/components/ui/use-toast";
import { rangePresets } from "@/General";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "SO(s)Wise", value: "soid_wise" },
] as const;

const RegisterSalesOrderPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { toast } = useToast();
  const [type, setType] = useState<string>("date_wise");
  const dispatch = useDispatch();
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const { data, loading } = useSelector(
    (state: RootState) => state.sellRequest
  );
  const [form] = Form.useForm();

  // Default date range: last 3 months
  const [defaultDateRange] = useState<Date[]>([
    dayjs().subtract(3, "month").toDate(),
    dayjs().toDate(),
  ]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      let dataString = "";
      if (type === "date_wise" && values.dateRange) {
        const startDate = dayjs(values.dateRange[0]).format("DD-MM-YYYY");
        const endDate = dayjs(values.dateRange[1]).format("DD-MM-YYYY");
        dataString = `${startDate}-${endDate}`;
        dispatch(setDateRange(dataString as any));
      } else if (type === "soid_wise" && values.soWise) {
        dataString = values.soWise;
        dispatch(setDateRange(dataString as any));
      }

      const resultAction = await dispatch(
        fetchSellRequestList({ type, data: dataString }) as any
      ).unwrap();
      if (resultAction.code === 200) {
        setRowData(resultAction.data);
        setIsSearchPerformed(true);
        toast({
          title: "Register fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch sell requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sell requests",
        className: "bg-red-700 text-white",
      });
    }
  };

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  const onBtExport = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.api.exportDataAsCsv();
    }
  }, []);

  useEffect(() => {
    setRowData(data as any);
  }, [data]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
  }, [type]);

  useEffect(() => {
    // Set default form values: "date_wise" and last 3 months date range
    form.setFieldsValue({
      type: "date_wise",
      dateRange: defaultDateRange,
    });
  }, [form, defaultDateRange]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      {loading && <FullPageLoading />}
      <div className="bg-[#fff]">
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]">
          <Form form={form} onFinish={onSubmit}>
            <Form.Item name="type" rules={[{ required: true, message: "Filter type is required" }]}>
              <Select
                onValueChange={(value: string) => {
                  setType(value);
                  if (value === "soid_wise") {
                    form.setFieldsValue({ dateRange: undefined });
                  } else {
                    form.setFieldsValue({ dateRange: defaultDateRange });
                  }
                }}
                value={type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a filter type" />
                </SelectTrigger>
                <SelectContent>
                  {wises.map((data) => (
                    <SelectItem key={data.value} value={data.value}>
                      {data.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Form.Item>

            {type === "date_wise" ? (
              <Form.Item
                name="dateRange"
                rules={[{ required: true, message: "Date range is required" }]}
              >
                <Space direction="vertical" size={12} className="w-full">
                  <RangePicker
                    className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                    value={
                      form.getFieldValue("dateRange") &&
                      Array.isArray(form.getFieldValue("dateRange")) &&
                      form.getFieldValue("dateRange").every((date: any) =>
                        dayjs(date).isValid()
                      )
                        ? [
                            dayjs(form.getFieldValue("dateRange")[0]),
                            dayjs(form.getFieldValue("dateRange")[1]),
                          ]
                        : undefined
                    }
                    onChange={(value) =>
                      form.setFieldsValue({
                        dateRange: value ? value.map((date) => date!.toDate()) : [],
                      })
                    }
                    format={dateFormat}
                    presets={rangePresets}
                    defaultValue={[
                      dayjs(defaultDateRange[0]),
                      dayjs(defaultDateRange[1]),
                    ]}
                  />
                </Space>
              </Form.Item>
            ) : (
              <Form.Item
                name="soWise"
                rules={[{ required: true, message: "SO number is required" }]}
              >
                <Input placeholder="SO number" />
              </Form.Item>
            )}

            <div className="flex space-x-2 float-end pr-2">
              {isSearchPerformed && (
                <Button
                  type="button"
                  onClick={onBtExport}
                  className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
                >
                  <Download />
                </Button>
              )}
              <Button
                type="submit"
                className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500"
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-100px)]">
        <AgGridReact
          ref={gridRef}
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          suppressCellFocus={true}
          paginationAutoPageSize={true}
          loadingOverlayComponent={OverlayNoRowsTemplate}
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

export default RegisterSalesOrderPage;