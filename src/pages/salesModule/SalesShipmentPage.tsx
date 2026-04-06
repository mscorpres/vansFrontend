import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import styled from "styled-components";
import { DatePicker, Form, Input, Space } from "antd";
import Select from "react-select";
import { columnDefs } from "@/config/agGrid/SalesOrderShippingTableColumn";
import ShipMentsActionCellRender from "@/config/agGrid/cellRenders.tsx/ShipMentsActionCellRender";
import CustomLoadingCellRenderer from "@/config/agGrid/CustomLoadingCellRenderer";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { RootState } from "@/store";
import { setDateRange } from "@/features/salesmodule/SalesSlice";
import { useDispatch, useSelector } from "react-redux";
import { rangePresets, TruncateCellRenderer } from "@/General";
import dayjs from "dayjs";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import { fetchSalesOrderShipmentList } from "@/features/salesmodule/salesShipmentSlice";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { useToast } from "@/components/ui/use-toast";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const wises = [
  { label: "Date Wise", value: "date_wise" },
  { label: "Shipment Id Wise", value: "shipid_wise" },
];

const defaultDateRange = [
  dayjs().subtract(3, "month").toDate(),
  dayjs().toDate(),
];

const SalesShipmentPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<any>>(null);
  const { toast } = useToast();
  const [type, setType] = useState<{ label: string; value: string }>({
    label: "Date Wise",
    value: "date_wise",
  });
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState<any[]>([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState<boolean>(false);
  const { data, loading } = useSelector((state: RootState) => state.sellShipment);
  const { loading: loading1 } = useSelector((state: RootState) => state.sellRequest);
  const [form] = Form.useForm();

  const onSubmit = async () => {
    try {
      const fields = type.value === "date_wise" ? ["type", "dateRange"] : ["type", "shipid_wise"];
      const values = await form.validateFields(fields);
      let dataString = "";
      if (type.value === "date_wise" && values.dateRange) {
        const startDate = dayjs(values.dateRange[0]).format("DD-MM-YYYY");
        const endDate = dayjs(values.dateRange[1]).format("DD-MM-YYYY");
        dataString = `${startDate}-${endDate}`;
        dispatch(setDateRange(dataString as any));
      } else if (type.value === "shipid_wise" && values.shipid_wise) {
        dataString = values.shipid_wise;
        dispatch(setDateRange(dataString as any));
      } else {
        toast({
          title: "Please provide a valid date range or shipment ID",
          className: "bg-red-600 text-white items-center",
        });
        return;
      }

      const resultAction = await dispatch(
        fetchSalesOrderShipmentList({ type: type.value, data: dataString }) as any
      ).unwrap();
      if (resultAction.code === 200) {
        setRowData(resultAction.data);
        setIsSearchPerformed(true);
        toast({
          title: "Shipment list fetched successfully",
          className: "bg-green-600 text-white items-center",
        });
      }
    } catch (error: any) {
      if (error?.errorFields) return;
      toast({
        title: error?.message || "Failed to fetch shipment list",
        className: "bg-red-600 text-white items-center",
      });
    }
  };

  const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);

  const components = useMemo(
    () => ({
      shipmentsActionRenderer: ShipMentsActionCellRender,
      CopyCellRenderer: CopyCellRenderer,
      truncateCellRenderer: TruncateCellRenderer,
    }),
    []
  );

  const onBtExport = useCallback(() => {
    if (gridRef.current) gridRef.current.api.exportDataAsCsv();
  }, []);

  useEffect(() => {
    setRowData(data as any);
  }, [data]);

  useEffect(() => {
    setRowData([]);
    setIsSearchPerformed(false);
    if (type.value === "shipid_wise") {
      form.setFieldsValue({ dateRange: undefined, shipid_wise: "" });
    } else if (type.value === "date_wise") {
      form.setFieldsValue({ dateRange: defaultDateRange, shipid_wise: undefined });
    } else {
      form.setFieldsValue({ dateRange: undefined, shipid_wise: undefined });
    }
  }, [type, form]);

  useEffect(() => {
    form.setFieldsValue({
      type: { label: "Date Wise", value: "date_wise" },
      dateRange: defaultDateRange,
    });
  }, [form]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {(loading || loading1) && <FullPageLoading />}
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
                    className="border shadow-sm border-slate-300 py-[7px] hover:border-slate-400 w-full rounded-md"
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
            {type.value === "shipid_wise" && (
              <Form.Item
                className="w-[300px] m-0"
                name="shipid_wise"
                label="Shipment ID"
                rules={[{ required: type.value === "shipid_wise", message: "Shipment ID is required" }]}
              >
                <Input placeholder="Shipment number" />
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
          </div>
        </Form>
      </div>

      {/* Grid Section - scrollable, no pagination */}
      <div className="ag-theme-quartz flex-1">
        <AgGridReact
          ref={gridRef}
          loadingCellRenderer={loadingCellRenderer}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          components={components}
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
  .ag-theme-quartz .ag-cell {
    overflow: hidden;
    min-width: 0;
  }
  .ag-theme-quartz .ag-cell-wrapper {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
  }
`;

export default SalesShipmentPage;
