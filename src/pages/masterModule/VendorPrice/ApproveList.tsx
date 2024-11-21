import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { Filter } from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { DatePicker, Divider, Form, Space } from "antd";
import { RootState } from "@/store";
import {
  approveVendorPrice,
  getVendorPrice,
} from "@/components/shared/Api/masterApi";
import { exportDateRangespace } from "@/components/shared/Options";
import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { toast } from "@/components/ui/use-toast";
import { rangePresets } from "@/General";
import useApi from "@/hooks/useApi";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useSelector } from "react-redux";

const { RangePicker } = DatePicker;
const ApproveList: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.client);

  const [form] = Form.useForm();
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { execFun, loading: loading1 } = useApi();
  const dateFormat = "DD/MM/YYYY";

  const [columnDefs] = useState<ColDef[]>([
    {
      headerCheckboxSelection: true, // To show a header checkbox
      checkboxSelection: true, // Enable checkbox in the cell
      width: 90,
    },
    {
      field: "vendorCode",
      headerName: "Vendor Code ",
      width: "220",
      cellRenderer: CopyCellRenderer,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO ID...",
        },
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Cost Center...",
        },
      },
    },
    {
      field: "partCode",
      headerName: "Part Code",
      cellRenderer: CopyCellRenderer,
      flex: 2,
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter Vendor & Narration...",
        },
      },
    },
    {
      field: "create_dt",
      headerName: "Create Date",
      width: "190",
      filter: "agDateColumnFilter",
      filterParams: {
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          placeholder: "Filter PO Reg. Date...",
        },
      },
    },
  ]);

  const fetchList = async () => {
    // setLoading(true);
    const values = await form.validateFields();
    let payload = {
      data: exportDateRangespace(values.data),
      type: "date_wise",
    };
    const response = await execFun(() => getVendorPrice(payload), "fetch");
    console.log("response", response);
    if (response.data.code == 200) {
      let arr = response.data.data.map((r: any) => {
        return {
          ...r,
        };
      });
      setRowData(arr);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700",
      });
    }
  };
  const onSelectionChanged = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node: any) => node.data);
    setSelectedRows(selectedData);
  };

  const approveTheSelected = async () => {
    let payload = selectedRows.map((r) => r.id);
    const response = await execFun(() => approveVendorPrice(payload), "fetch");
    if (response.data.code == 200) {
      toast({
        title: response.data.message,
        className: "bg-green-500",
      });
      setShowConfirmation(false);
    } else {
      toast({
        title: response.data.message,
        className: "bg-red-700",
      });
      setShowConfirmation(false);
    }
  };
  return (
    <Wrapper className="h-[calc(100vh-100px)] grid grid-cols-[350px_1fr]">
      <div className="bg-[#fff]">
        {" "}
        <div className="h-[49px] border-b border-slate-300 flex items-center gap-[10px] text-slate-600 font-[600] bg-hbg px-[10px] p-[10px]">
          <Filter className="h-[20px] w-[20px]" />
          Filter
        </div>
        <div className="p-[10px]"></div>
        <Form
          form={form}
          className="space-y-6 overflow-hidden p-[10px] h-[370px]  "
        >
          <Form.Item className="w-full" name="data">
            <Space direction="vertical" size={12} className="w-full">
              <RangePicker
                className="border shadow-sm border-slate-400 py-[7px] hover:border-slate-300 w-full"
                // onChange={(e: any) => form.setFieldValue("data", e?.value)}
                onChange={(value) =>
                  form.setFieldValue(
                    "data",
                    value ? value.map((date) => date!.toDate()) : []
                  )
                }
                format={dateFormat}
                presets={rangePresets}
              />
            </Space>
          </Form.Item>
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              className="shadow bg-cyan-700 hover:bg-cyan-600 shadow-slate-500  flex justify-right items-right w-20"
              onClick={fetchList}
            >
              Search
            </Button>{" "}
          </div>{" "}
        </Form>
        <Divider />
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-160px)]">
        <div className="flex items-center gap-[20px] justify-end bg-white ">
          <Button
            onClick={() => setShowConfirmation(true)}
            className="bg-[#217346] text-white hover:bg-[#2fa062] hover:text-white flex items-center gap-[10px] text-[15px] shadow shadow-slate-600 rounded-md m-[10px]"
            disabled={!selectedRows.length}
          >
            Approve
          </Button>
        </div>
        {loading1("fetch") && <FullPageLoading />}
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          rowSelection="multiple"
          // suppressRowClickSelection={false}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
          rowSelection="multiple"
          checkboxSelection={true}
          onSelectionChanged={onSelectionChanged}
          suppressCellFocus={true}
        />
      </div>{" "}
      <ConfirmationModal
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onOkay={approveTheSelected}
        title="Confirm Submit!"
        description="Are you sure you want to approve the selected Items?"
      />{" "}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  .ag-theme-quartz .ag-root-wrapper {
    border-top: 0;
    border-bottom: 0;
  }
`;

export default ApproveList;
