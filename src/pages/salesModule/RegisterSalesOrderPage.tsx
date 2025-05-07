import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
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
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "SO(s)Wise", value: "soid_wise" },
];

// Default date range: last 3 months
const defaultDateRange = [
  dayjs().subtract(3, "month").toDate(),
  dayjs().toDate(),
];

const RegisterSalesOrderPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { toast } = useToast();
  const [type, setType] = useState<{ label: string; value: string }>({
    label: "Date Wise",
    value: "date_wise",
  });
  const dispatch = useDispatch();
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const { data, loading } = useSelector(
    (state: RootState) => state.sellRequest
  );
  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      let dataString = "";
      if (type.value === "date_wise" && values.dateRange) {
        const startDate = dayjs(values.dateRange[0]).format("DD-MM-YYYY");
        const endDate = dayjs(values.dateRange[1]).format("DD-MM-YYYY");
        dataString = `${startDate}-${endDate}`;
        dispatch(setDateRange(dataString as any));
      } else if (type.value === "soid_wise" && values.soWise) {
        dataString = values.soWise;
        dispatch(setDateRange(dataString as any));
      }

      const resultAction = await dispatch(
        fetchSellRequestList({ type: type.value, data: dataString }) as any
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
    if (type.value === "soid_wise") {
      form.setFieldsValue({ dateRange: undefined, soWise: "" });
    } else {
      form.setFieldsValue({ dateRange: defaultDateRange });
    }
  }, [type, form]);

  useEffect(() => {
    // Set default form values: "date_wise" and last 3 months
    form.setFieldsValue({
      type: { label: "Date Wise", value: "date_wise" },
      dateRange: defaultDateRange,
    });
  }, [form]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {/* Filter Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Form form={form} className="flex items-center gap-4" onFinish={onSubmit}>
            <Form.Item
              className="w-[300px] m-0"
              name="type"
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
                }}
              />
            </Form.Item>

            {type.value === "date_wise" ? (
              <Form.Item
                className="w-[300px] m-0"
                name="dateRange"
                rules={[{ required: true, message: "Date range is required" }]}
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
                        dateRange: value ? value.map((date) => date!.toDate()) : [],
                      })
                    }
                    format={dateFormat}
                    presets={rangePresets}
                  />
                </Space>
              </Form.Item>
            ) : (
              <Form.Item
                className="w-[300px] m-0"
                name="soWise"
                rules={[{ required: true, message: "SO number is required" }]}
              >
                <Input placeholder="SO number" />
              </Form.Item>
            )}

            <div className="flex space-x-2">
              {isSearchPerformed && (
                <Button
                  type="button"
                  onClick={onBtExport}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                >
                  <Download />
                </Button>
              )}
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
              >
                Search
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Grid Section */}
      <div className="ag-theme-quartz flex-1">
        {loading && <FullPageLoading />}
        <AgGridReact
          ref={gridRef}
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
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

export default RegisterSalesOrderPage;