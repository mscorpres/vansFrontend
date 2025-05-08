import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/config/reactSelect/SelectColorConfig";
import DropdownIndicator from "@/config/reactSelect/DropdownIndicator";
import { DatePicker, Dropdown, Button as AntdButton, Form, Menu, Space } from "antd";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { AppDispatch, RootState } from "@/store";
import { fetchneededApprovalPO, printPO } from "@/features/client/clientSlice";
import { exportDateRangespace } from "@/components/shared/Options";
import { MoreOutlined } from "@ant-design/icons";
import ViewCompoents from "./ProcurementModule/ManagePO/ViewCompoents";
import POCancel from "./ProcurementModule/ManagePO/POCancel";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import MINPO from "./ProcurementModule/ManagePO/MINPO";
import { useNavigate } from "react-router-dom";
import ReusableAsyncSelect from "@/components/shared/ReusableAsyncSelect";
import { transformOptionData2 } from "@/helper/transform";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { rangePresets } from "@/General";
import { ColGroupDef } from "ag-grid-community";
import { OverlayNoRowsTemplate } from "@/shared/OverlayNoRowsTemplate";
import dayjs from "dayjs";

const ActionMenu: React.FC<ActionMenuProp> = ({ row }) => {
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item
        key=" Components"
        onClick={() =>
          navigate(
            `/create-po/approve/${row?.po_transaction?.replaceAll("/", "_")}`
          )
        }
      >
        View Components
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
       <AntdButton icon={<MoreOutlined />} />
      </Dropdown>
    </>
  );
};

const { RangePicker } = DatePicker;

const ApprovePOPage: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.client);

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState([]);
  const [view, setView] = useState(false);
  const [viewMinPo, setViewMinPo] = useState(false);
  const [remarkDescription, setRemarkDescription] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedwise = Form.useWatch("wise", form);

  // State for default date range
  const [defaultDateRange] = useState<Date[]>([
    dayjs().subtract(3, "month").toDate(),
    dayjs().toDate(),
  ]);

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "action",
      headerName: "",
      width: 40,
      cellRenderer: (params: any) => (
        <ActionMenu
          setViewMinPo={setViewMinPo}
          setView={setView}
          setCancel={setCancel}
          row={params.data}
          cancelTheSelectedPo={cancelTheSelectedPo}
        />
      ),
    },
    {
      field: "po_transaction",
      headerName: "PO ID",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "po_costcenter",
      headerName: "Cost Center",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor",
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "po_reg_date",
      headerName: "PO Reg. Date",
      flex: 1,
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
  ]);

  const type = [
    {
      label: "Date Wise ",
      value: "datewise",
    },
    {
      label: "PO Wise",
      value: "powise",
    },
    {
      label: "Vendor Wise",
      value: "vendorwise",
    },
    {
      label: "Project Wise",
      value: "projectwise",
    },
  ];

  const cancelTheSelectedPo = async (row: any) => {
    let payload: any = {
      poId: row?.po_transaction,
    };
    dispatch(printPO(payload)).then((res: any) => {});
  };

  const dispatch = useDispatch<AppDispatch>();

  const fetchManageList = async () => {
    try {
      setRowData([]);
      const values = await form.validateFields();
      let data;
      if (values.wise.value === "datewise") {
        data = exportDateRangespace(values.data);
      } else if (values.wise.value === "vendorwise") {
        data = values.data.value;
      } else {
        data = values.data;
      }

      let payload = { data: data, wise: values.wise.value };

      dispatch(fetchneededApprovalPO(payload)).then((res: any) => {
        if (res.payload.success) {
          let arr = res.payload.data;
          arr.map((r: any) => {
            return { ...r };
          });
          setRowData(arr);
        } else {
          toast({
            title: "Error",
            description: res.payload.message,
            className: "bg-red-700 text-white",
          });
        }
      });
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  useEffect(() => {
    // Set default form values: "Date Wise" and last 3 months date range
    form.setFieldsValue({
      wise: { label: "Date Wise ", value: "datewise" },
      data: defaultDateRange,
    });
  }, [form, defaultDateRange]);

  useEffect(() => {
    // Set data field based on filter type
    if (selectedwise?.value) {
      if (selectedwise.value === "datewise") {
        form.setFieldsValue({ data: defaultDateRange });
      } else {
        form.setFieldsValue({ data: "" });
      }
    }
  }, [selectedwise, form, defaultDateRange]);

  return (
    <Wrapper className="h-[calc(100vh-100px)] flex flex-col">
      {/* Filter Section */}
      <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Form form={form} className="flex items-center gap-4">
            <Form.Item
              className="w-[300px] m-0"
              name="wise"
              rules={[{ required: true, message: "Filter type is required" }]}
            >
              <Select
                styles={customStyles}
                components={{ DropdownIndicator }}
                placeholder="Select Type"
                className="border-0 basic-single"
                classNamePrefix="select border-0"
                isDisabled={false}
                isClearable={true}
                isSearchable={true}
                options={type}
              />
            </Form.Item>
            {selectedwise?.value === "datewise" ? (
              <Form.Item
                className="w-[300px] m-0"
                name="data"
                rules={[{ required: true, message: "Date range is required" }]}
              >
                <Space direction="vertical" size={12} className="w-full">
                  <RangePicker
                    className="border shadow-sm border-gray-300 py-[7px] hover:border-gray-400 w-full"
                    value={
                      form.getFieldValue("data") &&
                      Array.isArray(form.getFieldValue("data")) &&
                      form.getFieldValue("data").every((date: any) =>
                        dayjs(date).isValid()
                      )
                        ? [
                            dayjs(form.getFieldValue("data")[0]),
                            dayjs(form.getFieldValue("data")[1]),
                          ]
                        : undefined
                    }
                    onChange={(value) =>
                      form.setFieldsValue({
                        data: value ? value.map((date) => date!.toDate()) : [],
                      })
                    }
                    format="DD/MM/YYYY"
                    presets={rangePresets}
                    defaultValue={[
                      dayjs(defaultDateRange[0]),
                      dayjs(defaultDateRange[1]),
                    ]}
                  />
                </Space>
              </Form.Item>
            ) : selectedwise?.value === "vendorwise" ? (
              <Form.Item
                className="w-[300px] m-0"
                name="data"
                rules={[{ required: true, message: "Vendor is required" }]}
              >
                <ReusableAsyncSelect
                  placeholder="Vendor Name"
                  endpoint="/backend/vendorList"
                  transform={transformOptionData2}
                  onChange={(e) => form.setFieldsValue({ data: e })}
                  fetchOptionWith="query2"
                />
              </Form.Item>
            ) : (
              <Form.Item
                className="w-[300px] m-0"
                name="data"
                rules={[{ required: true, message: "Type is required" }]}
              >
                <Input placeholder="Type here" />
              </Form.Item>
            )}
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
              onClick={fetchManageList}
            >
              Search
            </Button>
          </Form>
        </div>
      </div>

      {/* Grid Section */}
      <div className="ag-theme-quartz flex-1">
        {loading && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs as (ColDef | ColGroupDef)[]}
          defaultColDef={{ filter: true, sortable: true }}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          enableCellTextSelection={true}
        />
      </div>

      <ViewCompoents
        view={view}
        setView={setView}
        setShowConfirmation={setShowConfirmation}
        showConfirmation={showConfirmation}
      />
      <POCancel
        cancel={cancel}
        setCancel={setCancel}
        remarkDescription={remarkDescription}
        setRemarkDescription={setRemarkDescription}
      />
      <MINPO viewMinPo={viewMinPo} setViewMinPo={setViewMinPo} />
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Submit!"
        description="Are you sure to submit details of all components of this Purchase Order?"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default ApprovePOPage;